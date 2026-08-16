-- Migration: RPC provision_key_and_link_new_business
-- Timestamp: 20260802000003

CREATE OR REPLACE FUNCTION public.provision_key_and_link_new_business(
    p_client_tx_id TEXT,
    p_gateway_tx_id TEXT,
    p_business_name TEXT,
    p_country TEXT,
    p_region_city TEXT,
    p_owner_user_id UUID,
    p_key_code TEXT,
    p_key_type TEXT,
    p_amount NUMERIC,
    p_deduct_trial_fee BOOLEAN,
    p_calculated_expiration TIMESTAMPTZ,
    p_operator_user_id UUID,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_partner_id UUID := NULL;
    v_access_key_id UUID;
    v_business_id UUID;
    v_existing_key_id UUID;
    v_runtime_date TIMESTAMPTZ := clock_timestamp();
BEGIN
    -- Idempotency Check
    SELECT id INTO v_existing_key_id 
    FROM public.access_keys 
    WHERE payment_gateway_tx_id = p_gateway_tx_id;

    IF v_existing_key_id IS NOT NULL THEN
        SELECT id INTO v_business_id FROM public.businesses WHERE access_key_id = v_existing_key_id;
        DELETE FROM public.unresolved_payment_ledger WHERE gateway_tx_id = p_gateway_tx_id;
        RETURN jsonb_build_object(
            'success', TRUE,
            'access_key_id', v_existing_key_id,
            'business_id', v_business_id,
            'is_duplicate', TRUE,
            'created_on', to_jsonb(v_runtime_date)
        );
    END IF;

    -- Guard: Check Target Owner Exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_owner_user_id) THEN
        RAISE EXCEPTION 'Target owner user ID % does not exist.', p_owner_user_id;
    END IF;

    SELECT id INTO v_partner_id 
    FROM public.channel_partners 
    WHERE user_id = p_operator_user_id;

    v_access_key_id := gen_random_uuid();
    v_business_id := gen_random_uuid();

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
        FALSE, 
        NULL, 
        p_calculated_expiration, 
        v_partner_id,
        (v_partner_id IS NULL),
        FALSE,
        p_gateway_tx_id
    );

    INSERT INTO public.businesses (
        id, owner_id, name, country, region_city, access_key_id, created_on, updated_on
    ) VALUES (
        v_business_id,
        p_owner_user_id,
        p_business_name,
        p_country,
        p_region_city,
        v_access_key_id,
        v_runtime_date,
        v_runtime_date
    );

    DELETE FROM public.unresolved_payment_ledger WHERE gateway_tx_id = p_gateway_tx_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'access_key_id', v_access_key_id,
        'business_id', v_business_id,
        'is_duplicate', FALSE,
        'created_on', to_jsonb(v_runtime_date)
    );

EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.unresolved_payment_ledger (
        gateway_tx_id, client_tx_id, user_id, flow_type, payload, error_message, retry_count
    ) VALUES (
        p_gateway_tx_id, p_client_tx_id, p_operator_user_id, 'CREATE_AND_LINK_NEW', p_payload, SQLERRM, 1
    )
    ON CONFLICT (gateway_tx_id) DO UPDATE SET
        retry_count = public.unresolved_payment_ledger.retry_count + 1,
        error_message = EXCLUDED.error_message,
        updated_on = clock_timestamp();

    RETURN jsonb_build_object('success', FALSE, 'message', SQLERRM);
END;
$$;