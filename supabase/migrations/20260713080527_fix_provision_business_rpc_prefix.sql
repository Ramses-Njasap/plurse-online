-- Migration: 20260713080527_fix_provision_business_rpc_prefix.sql
-- This migration fixes the prefix of the provision_business_transaction RPC function to use the correct crypto extension
-- instead of the incorrect crypto.gen_random_uuid() function. The correct function is gen_random_uuid

CREATE OR REPLACE FUNCTION public.provision_business_transaction(
    p_email TEXT,
    p_phone TEXT,
    p_manager_full_name TEXT,
    p_manager_dob DATE,
    p_manager_country TEXT,
    p_manager_city TEXT,
    p_business_name TEXT,
    p_business_country TEXT,
    p_business_city TEXT,
    p_key_code TEXT,
    p_key_type TEXT,
    p_amount NUMERIC,
    p_deduct_trial_fee BOOLEAN,
    p_calculated_expiration TIMESTAMPTZ,
    p_operator_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to safely write across schemas
AS $$
DECLARE
    v_partner_id UUID;
    v_business_user_id UUID := gen_random_uuid();
    v_business_profile_id UUID := gen_random_uuid();
    v_access_key_id UUID := gen_random_uuid();
    v_runtime_date TIMESTAMPTZ := clock_timestamp();
    v_response JSONB;
BEGIN
    -- 1. Look up the channel partner ID matching the operator's user ID
    SELECT id INTO v_partner_id 
    FROM public.channel_partners 
    WHERE user_id = p_operator_user_id;

    IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Action permitted only for registered channel partners.';
    END IF;

    -- 2. Check if user already exists to fail fast
    IF EXISTS (SELECT 1 FROM public.users WHERE email = LOWER(TRIM(p_email))) THEN
        RAISE EXCEPTION 'The manager email address is already registered.';
    END IF;

    -- ── STEP 1: Insert Core Authentication Properties ──
    INSERT INTO public.users (
        id, email, phone, is_business, is_individual, is_active, email_verified, phone_verified
    ) VALUES (
        v_business_user_id, LOWER(TRIM(p_email)), TRIM(p_phone), TRUE, FALSE, TRUE, FALSE, FALSE
    );

    -- ── STEP 2: Create Manager Profile ──
    INSERT INTO public.user_profiles (
        id, full_name, date_of_birth, country, region_city, is_channel_partner
    ) VALUES (
        v_business_user_id, p_manager_full_name, p_manager_dob, p_manager_country, p_manager_city, FALSE
    );

    -- ── STEP 3: Create the Access Key ──
    INSERT INTO public.access_keys (
        id, key_code, key_type, amount, deduct_trial_fee, is_active, activated_at, expires_at, channel_partner_id, from_company
    ) VALUES (
        v_access_key_id, p_key_code, p_key_type, p_amount, p_deduct_trial_fee, FALSE, NULL, p_calculated_expiration, v_partner_id, FALSE
    );

    -- ── STEP 4: Create Business Instance ──
    INSERT INTO public.businesses (
        id, owner_id, name, country, region_city, access_key_id
    ) VALUES (
        v_business_profile_id, v_business_user_id, p_business_name, p_business_country, p_business_city, v_access_key_id
    );

    -- Build the successful response payload matching your application entities
    v_response := jsonb_build_object(
        'success', TRUE,
        'business_id', v_business_profile_id,
        'business_user_id', v_business_user_id,
        'access_key_id', v_access_key_id,
        'created_on', to_jsonb(v_runtime_date)
    );

    RETURN v_response;

EXCEPTION
    WHEN OTHERS THEN
        -- ANY unhandled database or validation error automatically drops into here.
        -- Postgres implicitly triggers a ROLLBACK for everything inside the BEGIN/END block.
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', SQLERRM
        );
END;
$$;