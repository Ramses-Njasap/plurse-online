-- 2026-08-05 09:14:37 UTC
-- provides a business transaction provisioning function with enhanced idempotency, retry tracking, and conflict resolution for user profile merging.

CREATE OR REPLACE FUNCTION public.provision_business_transaction_v2(
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
    p_operator_user_id UUID,
    p_is_self_owned BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER 
AS $$
DECLARE
    v_partner_id UUID := NULL;
    v_business_user_id UUID;
    v_business_profile_id UUID;
    v_access_key_id UUID;
    v_existing_key_id UUID;
    v_existing_business_id UUID;
    v_runtime_date TIMESTAMPTZ := clock_timestamp();
    v_gateway_tx_id TEXT;
    v_payload JSONB;
BEGIN
    -- Synthesize a fallback gateway/client transaction ID for idempotency tracking
    v_gateway_tx_id := 'PROV_BIZ_' || md5(p_key_code || '_' || p_operator_user_id::text);

    -- Build payload snapshot for dead-letter ledger logging in case of failure
    v_payload := jsonb_build_object(
        'email', p_email,
        'key_code', p_key_code,
        'key_type', p_key_type,
        'amount', p_amount,
        'is_self_owned', p_is_self_owned,
        'operator_id', p_operator_user_id,
        'business_name', p_business_name
    );

    -- ── 1. IDEMPOTENCY CHECK ──
    -- Check if an access key with this key_code already exists
    SELECT id INTO v_existing_key_id 
    FROM public.access_keys 
    WHERE key_code = p_key_code;

    IF v_existing_key_id IS NOT NULL THEN
        -- Key already created; resolve the associated business ID if present
        SELECT id INTO v_existing_business_id 
        FROM public.businesses 
        WHERE access_key_id = v_existing_key_id;

        DELETE FROM public.unresolved_payment_ledger WHERE gateway_tx_id = v_gateway_tx_id;

        RETURN jsonb_build_object(
            'success', TRUE,
            'business_id', v_existing_business_id,
            'business_user_id', CASE WHEN p_is_self_owned THEN p_operator_user_id ELSE NULL END,
            'access_key_id', v_existing_key_id,
            'is_duplicate', TRUE,
            'created_on', to_jsonb(v_runtime_date)
        );
    END IF;

    -- ── 2. IDENTITY RESOLUTION & GUARDS ──
    IF p_is_self_owned THEN
        -- Self-owned: The manager is the logged-in operator
        v_business_user_id := p_operator_user_id;
    ELSE
        -- External manager: Operator must be a valid channel partner
        SELECT id INTO v_partner_id 
        FROM public.channel_partners 
        WHERE user_id = p_operator_user_id;

        IF v_partner_id IS NULL THEN
            RAISE EXCEPTION 'Action permitted only for registered channel partners.';
        END IF;

        -- Prevent duplicate email registration for external managers
        IF EXISTS (SELECT 1 FROM public.users WHERE email = LOWER(TRIM(p_email))) THEN
            RAISE EXCEPTION 'The manager email address % is already registered.', p_email;
        END IF;

        v_business_user_id := gen_random_uuid();

        INSERT INTO public.users (
            id, email, phone, is_business, is_individual, is_active, email_verified, phone_verified
        ) VALUES (
            v_business_user_id, LOWER(TRIM(p_email)), TRIM(p_phone), TRUE, FALSE, TRUE, FALSE, FALSE
        );
    END IF;

    -- ── 3. USER PROFILE MERGING (CONFLICT RESOLUTION) ──
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

    -- ── 4. ACCESS KEY PROVISIONING ──
    v_access_key_id := gen_random_uuid();

    INSERT INTO public.access_keys (
        id, key_code, key_type, amount, deduct_trial_fee, 
        is_active, activated_at, expires_at, channel_partner_id, 
        from_company, is_standalone, payment_gateway_tx_id
    ) VALUES (
        v_access_key_id, 
        p_key_code, 
        p_key_type::key_distribution_type, 
        p_amount, 
        p_deduct_trial_fee, 
        TRUE, 
        NULL, 
        p_calculated_expiration, 
        v_partner_id,           -- NULL if self-owned or non-partner
        p_is_self_owned,       -- TRUE if self-owned
        FALSE,                 -- FALSE because it is immediately linked to a business
        v_gateway_tx_id
    );

    -- ── 5. BUSINESS INSTANCE CREATION ──
    v_business_profile_id := gen_random_uuid();

    INSERT INTO public.businesses (
        id, owner_id, name, country, region_city, access_key_id, created_on, updated_on
    ) VALUES (
        v_business_profile_id, v_business_user_id, p_business_name, p_business_country, p_business_city, 
        v_access_key_id, v_runtime_date, v_runtime_date
    );

    -- Clean up any prior failure tracking entry upon success
    DELETE FROM public.unresolved_payment_ledger WHERE gateway_tx_id = v_gateway_tx_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'business_id', v_business_profile_id,
        'business_user_id', v_business_user_id,
        'access_key_id', v_access_key_id,
        'is_duplicate', FALSE,
        'created_on', to_jsonb(v_runtime_date)
    );

EXCEPTION WHEN OTHERS THEN
    -- Capture transaction failure in the audit ledger for recovery background jobs
    INSERT INTO public.unresolved_payment_ledger (
        gateway_tx_id, client_tx_id, user_id, flow_type, payload, error_message, retry_count
    ) VALUES (
        v_gateway_tx_id, v_gateway_tx_id, p_operator_user_id, 'PROVISION_BUSINESS_TX', v_payload, SQLERRM, 1
    )
    ON CONFLICT (gateway_tx_id) DO UPDATE SET
        retry_count = public.unresolved_payment_ledger.retry_count + 1,
        error_message = EXCLUDED.error_message,
        updated_on = clock_timestamp();

    RETURN jsonb_build_object(
        'success', FALSE,
        'message', SQLERRM
    );
END;
$$;