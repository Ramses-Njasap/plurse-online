-- Migration: 20260525183703_alter_users_add_auth_verification.sql

-- ========================================================
-- 1. ALTER TABLE TO ADD VERIFICATION & SESSION TRACKING
-- ========================================================
ALTER TABLE public.users 
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS last_otp_sent_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS current_session_id TEXT;

-- ========================================================
-- 2. ENHANCE THE AUTOMATED SIGNUP & VERIFICATION TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_auth_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- CASE A: User row does not exist in public.users yet (Fresh Registration)
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    
        -- Insert core operational defaults
        INSERT INTO public.users (
            id, 
            email, 
            phone, 
            is_company, 
            is_individual, 
            is_active, 
            email_verified, 
            phone_verified
        )
        VALUES (
            NEW.id,
            NEW.email,
            NEW.phone,
            COALESCE((NEW.raw_user_meta_data->>'is_company')::BOOLEAN, false),
            COALESCE((NEW.raw_user_meta_data->>'is_individual')::BOOLEAN, false),
            false, -- is_active stays locked until OTP checks pass
            false,
            false
        );

        -- Initialize basic personal identification card mapping
        INSERT INTO public.user_profiles (id, full_name, date_of_birth, country, region_city)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'),
            COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::DATE, CURRENT_DATE),
            COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown'),
            COALESCE(NEW.raw_user_meta_data->>'region_city', 'Unknown')
        );

    -- CASE B: User exists but is unverified, and is hitting signup again (The Stale Account Override)
    ELSIF (SELECT is_active FROM public.users WHERE id = NEW.id) = false THEN
    
        -- Overwrite the existing unverified public row with the fresh registration parameters
        UPDATE public.users
        SET 
            email = NEW.email,
            phone = NEW.phone,
            is_company = COALESCE((NEW.raw_user_meta_data->>'is_company')::BOOLEAN, false),
            is_individual = COALESCE((NEW.raw_user_meta_data->>'is_individual')::BOOLEAN, false),
            updated_on = TIMEZONE('utc'::text, NOW())
        WHERE id = NEW.id;

        -- Update the companion profile entry with the latest signup details
        UPDATE public.user_profiles
        SET
            full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'),
            date_of_birth = COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::DATE, CURRENT_DATE),
            country = COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown'),
            region_city = COALESCE(NEW.raw_user_meta_data->>'region_city', 'Unknown'),
            updated_on = TIMEZONE('utc'::text, NOW())
        WHERE id = NEW.id;

    -- CASE C: The account is fully verified and confirmed (Real-time synchronization hook)
    ELSIF NEW.email_confirmed_at IS NOT NULL OR NEW.phone_confirmed_at IS NOT NULL THEN
        
        UPDATE public.users
        SET 
            is_active = true,
            email_verified = CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE email_verified END,
            phone_verified = CASE WHEN NEW.phone_confirmed_at IS NOT NULL THEN true ELSE phone_verified END,
            updated_on = TIMEZONE('utc'::text, NOW())
        WHERE id = NEW.id;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- 3. BIND THE SYSTEM SYNCHRONIZATION HOOK TO AUTH UPDATES
-- ========================================================
-- Drop old trigger if it was strictly bound to AFTER INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Bind a robust trigger that catches both new creations AND verification updates
CREATE TRIGGER on_auth_user_state_changed
    AFTER INSERT OR UPDATE OF email_confirmed_at, phone_confirmed_at ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_auth_user_signup();
