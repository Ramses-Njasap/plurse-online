-- Migration: 20260802_add_payment_gateway_tx_id_to_existing_access_keys_table_for_idempotency_tracking
-- Description: Add payment_gateway_tx_id to existing access_keys table for idempotency tracking

-- 1. Add payment_gateway_tx_id to existing access_keys table for idempotency tracking
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'access_keys' 
          AND column_name = 'payment_gateway_tx_id'
    ) THEN
        ALTER TABLE public.access_keys ADD COLUMN payment_gateway_tx_id TEXT UNIQUE;
    END IF;
END $$;

-- 2. Ensure businesses.access_key_id has a unique constraint (if not already set)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'businesses_access_key_id_key'
    ) THEN
        ALTER TABLE public.businesses ADD CONSTRAINT businesses_access_key_id_key UNIQUE (access_key_id);
    END IF;
END $$;