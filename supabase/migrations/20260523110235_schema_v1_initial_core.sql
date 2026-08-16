-- supabase/migrations/20260523110235_schema_v1_initial_core.sql

-- ==========================================
-- 1. BASE CONFIGURATION & EXTENSIONS
-- ==========================================
CREATE SCHEMA IF NOT EXISTS auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CORE ENHANCED USERS DATA (PUBLIC SCHEMA)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY, -- Will map directly to auth.users.id
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  is_deleted BOOLEAN DEFAULT false NOT NULL,
  is_banned BOOLEAN DEFAULT false NOT NULL,
  is_company BOOLEAN DEFAULT false NOT NULL,
  is_individual BOOLEAN DEFAULT false NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Explicit data constraints
  CONSTRAINT val_email_pattern CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'),
  CONSTRAINT val_phone_pattern CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- ==========================================
-- 3. PERSONAL PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  country TEXT NOT NULL,
  region_city TEXT NOT NULL,
  is_channel_partner BOOLEAN DEFAULT false NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 4. CHANNELS, KEYS, AND BUSINESSES
-- ==========================================

-- Activation Keys Storage
CREATE TABLE IF NOT EXISTS public.activation_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  expiration TIMESTAMP WITH TIME ZONE NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Channel Partners Configuration
CREATE TABLE IF NOT EXISTS public.channel_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  -- NUMERIC(12,2) protects precision for currencies/amounts up to 9,999,999,999.99
  amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL, 
  activation_key_id UUID REFERENCES public.activation_keys(id) ON DELETE SET NULL,

  CONSTRAINT val_partner_dates CHECK (valid_to > valid_from),
  CONSTRAINT val_partner_amount CHECK (amount >= 0)
);

-- Channel Partnership History (Log tracking tracking table)
CREATE TABLE IF NOT EXISTS public.channel_partnership_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_partner_id UUID REFERENCES public.channel_partners(id) ON DELETE CASCADE NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  CONSTRAINT val_history_dates CHECK (valid_to > valid_from)
);

-- Companies Configuration
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL, -- REQUIRED OWNER LINK
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region_city TEXT NOT NULL,
  activation_key_id UUID REFERENCES public.activation_keys(id) ON DELETE SET NULL,
  created_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_on TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 5. AUTOMATED SYNC TRIGGERS
-- ==========================================

-- Function to handle atomic syncing during initial signUp
CREATE OR REPLACE FUNCTION public.handle_auth_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Insert core entity metadata flags straight into public.users
  INSERT INTO public.users (id, email, phone, is_company, is_individual)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE((NEW.raw_user_meta_data->>'is_company')::BOOLEAN, false),
    COALESCE((NEW.raw_user_meta_data->>'is_individual')::BOOLEAN, false)
  );

  -- 2. Build the basic target row inside public.user_profiles 
  INSERT INTO public.user_profiles (id, full_name, date_of_birth, country, region_city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::DATE, CURRENT_DATE),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'region_city', 'Unknown')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind authentication sync trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_auth_user_signup();

-- ==========================================
-- 6. DYNAMIC TIMESTAMP UPDATER HOOKS
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_on = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();