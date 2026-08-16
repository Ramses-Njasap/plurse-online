-- Migration: 20260525202230_optimize_manual_auth.sql

-- ========================================================
-- 1. CLEAN UP PAST TRIGGERS (ELIMINATE DUAL-OWNERSHIP LOGIC)
-- ========================================================
DROP TRIGGER IF EXISTS on_auth_user_state_changed ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_auth_user_signup();

-- ========================================================
-- 2. ALTER PUBLIC.USERS TABLE WITH CLEAN ARCHITECTURAL NAMES
-- ========================================================
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS last_otp_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS current_session_id TEXT,
  ADD COLUMN IF NOT EXISTS otp TEXT,
  ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;

-- ========================================================
-- 3. BUILD AN INTERNAL PROFILE ATTACHMENT TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION public.auto_provision_public_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, date_of_birth, country, region_city)
  VALUES (
    NEW.id,
    'Anonymous User',
    CURRENT_DATE,
    'Unknown',
    'Unknown'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_public_user_inserted
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.auto_provision_public_profile();