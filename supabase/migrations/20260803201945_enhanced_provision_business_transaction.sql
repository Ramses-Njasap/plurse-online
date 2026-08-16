-- Migration: enhanced_provision_business_transaction.sql
-- This adds retry/ledger support while keeping the original intact

CREATE OR REPLACE FUNCTION public.provision_business_transaction_v2(
    -- Business data
    p_email TEXT,
    p_phone TEXT,
    p_manager_full_name TEXT,
    p_manager_dob DATE,
    p_manager_country TEXT,
    p_manager_city TEXT,
    p_business_name TEXT,
    p_business_country TEXT,
    p_business_city TEXT,
    -- Key data
    p_key_code TEXT,
    p_key_type TEXT,
    p_amount NUMERIC,
    p_deduct_trial_fee BOOLEAN,
    p_calculated_expiration TIMESTAMPTZ,
    -- Context
    p_operator_user_id UUID,
    p_is_self_owned BOOLEAN,
    -- RETRY/IDEMPOTENCY PARAMETERS (NEW)
    p_gateway_tx_id TEXT DEFAULT NULL,
    p_client_tx_id TEXT DEFAULT NULL,
    p_payload JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
DECLARE
    v_partner_id UUID := NULL;
    v_business_user_id UUID;
    v_business_profile_id UUID := gen_random_uuid();
    v_access_key_id UUID := gen_random_uuid();
    v_runtime_date TIMESTAMPTZ := clock_timestamp();
    v_existing_business_id UUID;
    v_response JSONB;
    v_has_gateway_tx BOOLEAN := p_gateway_tx_id IS NOT NULL;
BEGIN
    -- ── IDEMPOTENCY CHECK (only if gateway_tx_id provided) ──
    IF v_has_gateway_tx THEN
        SELECT b.id INTO v_existing_business_id
        FROM public.businesses b
        JOIN public.access_keys ak ON b.access_key_id = ak.id
        WHERE ak.payment_gateway_tx_id = p_gateway_tx_id
        LIMIT 1;

        IF v_existing_business_id IS NOT NULL THEN
            -- Clean up ledger if this was a retry
            IF v_has_gateway_tx THEN
                DELETE FROM public.unresolved_payment_ledger WHERE gateway_tx_id = p_gateway_tx_id;
            END IF;
            
            RETURN jsonb_build_object(
                'success', TRUE,
                'business_id', v_existing_business_id,
                'is_duplicate', TRUE,
                'created_on', to_jsonb(v_runtime_date)
            );
        END IF;
    END IF;

    -- ── STEP 1: Determine Identities and Validation Paths ──
    IF p_is_self_owned THEN
        v_business_user_id := p_operator_user_id;
    ELSE
        -- If provisioning for someone else, the operator must be a registered partner.
        SELECT id INTO v_partner_id 
        FROM public.channel_partners 
        WHERE user_id = p_operator_user_id;

        IF v_partner_id IS NULL THEN
            RAISE EXCEPTION 'Action permitted only for registered channel partners.';
        END IF;

        -- Generate a new distinct ID for the external manager
        v_business_user_id := gen_random_uuid();

        -- Prevent registering a duplicate email if it's an external user
        IF EXISTS (SELECT 1 FROM public.users WHERE email = LOWER(TRIM(p_email))) THEN
            RAISE EXCEPTION 'The manager email address is already registered.';
        END IF;

        -- ── STEP 2: Insert New User Authentication Row (Only for Case 1) ──
        INSERT INTO public.users (
            id, email, phone, is_business, is_individual, is_active, email_verified, phone_verified
        ) VALUES (
            v_business_user_id, LOWER(TRIM(p_email)), TRIM(p_phone), TRUE, FALSE, TRUE, FALSE, FALSE
        );
    END IF;

    -- ── STEP 3: Create or Update User Profile ──
    INSERT INTO public.user_profiles (
        id, full_name, date_of_birth, country, region_city, is_channel_partner
    ) VALUES (
        v_business_user_id, p_manager_full_name, p_manager_dob, p_manager_country, p_manager_city, FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        date_of_birth = EXCLUDED.date_of_birth,
        country = EXCLUDED.country,
        region_city = EXCLUDED.region_city;

    -- ── STEP 4: Create the Access Key ──
    INSERT INTO public.access_keys (
        id, key_code, key_type, amount, deduct_trial_fee, is_active, activated_at, expires_at, 
        channel_partner_id, from_company,
        payment_gateway_tx_id  -- ← NEW: Store for idempotency
    ) VALUES (
        v_access_key_id, 
        p_key_code, 
        p_key_type::key_distribution_type, 
        p_amount, 
        p_deduct_trial_fee, 
        FALSE, 
        NULL, 
        p_calculated_expiration, 
        v_partner_id,
        p_is_self_owned,
        p_gateway_tx_id  -- ← Store for future lookups
    );

    -- ── STEP 5: Create Business Instance ──
    INSERT INTO public.businesses (
        id, owner_id, name, country, region_city, access_key_id
    ) VALUES (
        v_business_profile_id, v_business_user_id, p_business_name, p_business_country, p_business_city, v_access_key_id
    );

    -- ── SUCCESS: Clean up ledger if this was a retry ──
    IF v_has_gateway_tx THEN
        DELETE FROM public.unresolved_payment_ledger WHERE gateway_tx_id = p_gateway_tx_id;
    END IF;

    -- Build transaction response return payload
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
        -- ── FAILURE: Log to unresolved_payment_ledger (only if gateway_tx_id provided) ──
        IF v_has_gateway_tx THEN
            INSERT INTO public.unresolved_payment_ledger (
                gateway_tx_id, 
                client_tx_id, 
                user_id, 
                flow_type, 
                payload, 
                error_message, 
                retry_count
            ) VALUES (
                p_gateway_tx_id, 
                p_client_tx_id, 
                p_operator_user_id, 
                'PROVISION_BUSINESS_V2',
                COALESCE(p_payload, jsonb_build_object(
                    'email', p_email,
                    'business_name', p_business_name,
                    'key_type', p_key_type
                )), 
                SQLERRM, 
                1
            )
            ON CONFLICT (gateway_tx_id) DO UPDATE SET
                retry_count = public.unresolved_payment_ledger.retry_count + 1,
                error_message = EXCLUDED.error_message,
                updated_on = clock_timestamp();
        END IF;

        RETURN jsonb_build_object(
            'success', FALSE, 
            'message', SQLERRM,
            'error_type', 'DATABASE_ERROR'
        );
END;
$$;

-- ── Add index for faster idempotency lookups ──
CREATE INDEX IF NOT EXISTS idx_access_keys_payment_tx 
ON public.access_keys(payment_gateway_tx_id) 
WHERE payment_gateway_tx_id IS NOT NULL;

-- ── Comment on the new function ──
COMMENT ON FUNCTION public.provision_business_transaction_v2 IS 
'Enhanced version with retry/ledger support. Backward compatible with original.';