-- ============================================================================
--- Function: provision_key_and_link_existing_business
-- ============================================================================
--- This function provisions a new access key and links it to an existing business.
--- It performs the following steps:
--- 1. Validates that the target business exists and checks if it already has an active access key.
--- 2. Calls the base RPC to provision a new access key.
--- 3. If the key is successfully provisioned, it links the new access key to the existing business.
--- 4. Handles idempotency by checking for duplicate keys and returning the existing key if found.
--- 5. In case of any errors, it logs the error in the unresolved_payment_ledger table for future resolution.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.provision_key_and_link_existing_business(
    p_client_tx_id TEXT,
    p_gateway_tx_id TEXT,
    p_business_id UUID,
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
    v_key_res JSONB;
    v_access_key_id UUID;
    v_existing_key_id UUID;
    v_existing_key_expires_at TIMESTAMPTZ;
    v_existing_key_is_active BOOLEAN;
    v_runtime_date TIMESTAMPTZ := clock_timestamp();
BEGIN
    -- Guard: Check Target Business Exists & Fetch Linked Key Status
    SELECT 
        b.access_key_id, 
        k.expires_at,
        k.is_active
    INTO 
        v_existing_key_id, 
        v_existing_key_expires_at,
        v_existing_key_is_active
    FROM public.businesses b
    LEFT JOIN public.access_keys k ON b.access_key_id = k.id
    WHERE b.id = p_business_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target business ID % does not exist.', p_business_id;
    END IF;

    -- Block ONLY if an existing key exists AND is still active & unexpired
    IF v_existing_key_id IS NOT NULL 
       AND COALESCE(v_existing_key_is_active, FALSE) = TRUE 
       AND v_existing_key_expires_at > v_runtime_date THEN
        RAISE EXCEPTION 'Business % is already linked to an active access key % (expires: %).', 
            p_business_id, v_existing_key_id, v_existing_key_expires_at;
    END IF;

    -- Step 1: Provision Key via base RPC (p_is_standalone = FALSE)
    v_key_res := public.create_standalone_access_key(
        p_client_tx_id, p_gateway_tx_id, p_key_code, p_key_type,
        p_amount, p_deduct_trial_fee, p_calculated_expiration,
        p_operator_user_id, p_payload, FALSE
    );

    IF (v_key_res->>'success')::BOOLEAN = FALSE THEN
        RETURN v_key_res;
    END IF;

    v_access_key_id := (v_key_res->>'access_key_id')::UUID;

    -- Step 2: Handle Duplicate / Idempotent Exit
    IF (v_key_res->>'is_duplicate')::BOOLEAN = TRUE THEN
        RETURN jsonb_build_object(
            'success', TRUE,
            'access_key_id', v_access_key_id,
            'business_id', p_business_id,
            'is_duplicate', TRUE,
            'created_on', to_jsonb(v_runtime_date)
        );
    END IF;

    -- Step 3: Attach Key to Existing Business (Overwrites old/expired key)
    UPDATE public.businesses
    SET access_key_id = v_access_key_id,
        updated_on = v_runtime_date
    WHERE id = p_business_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'access_key_id', v_access_key_id,
        'business_id', p_business_id,
        'is_duplicate', FALSE,
        'created_on', to_jsonb(v_runtime_date)
    );

EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.unresolved_payment_ledger (
        gateway_tx_id, client_tx_id, user_id, flow_type, payload, error_message, retry_count
    ) VALUES (
        p_gateway_tx_id, p_client_tx_id, p_operator_user_id, 'CREATE_AND_LINK_EXISTING', p_payload, SQLERRM, 1
    )
    ON CONFLICT (gateway_tx_id) DO UPDATE SET
        retry_count = public.unresolved_payment_ledger.retry_count + 1,
        error_message = EXCLUDED.error_message,
        updated_on = clock_timestamp();

    RETURN jsonb_build_object('success', FALSE, 'message', SQLERRM);
END;
$$;