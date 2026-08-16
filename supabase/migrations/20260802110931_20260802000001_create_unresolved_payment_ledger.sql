-- Migration: Create Unresolved Payment Ledger & Idempotency Constraints
-- Timestamp: 20260802000001

-- 1. Add idempotency tracking column to access_keys
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

-- 2. Ensure businesses.access_key_id has a unique constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'businesses_access_key_id_key'
    ) THEN
        ALTER TABLE public.businesses ADD CONSTRAINT businesses_access_key_id_key UNIQUE (access_key_id);
    END IF;
END $$;

-- 3. Create unresolved_payment_ledger
CREATE TABLE IF NOT EXISTS public.unresolved_payment_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_tx_id TEXT UNIQUE NOT NULL,
    client_tx_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    flow_type TEXT NOT NULL, -- 'CREATE_ONLY', 'CREATE_AND_LINK_NEW', 'CREATE_AND_LINK_EXISTING'
    payload JSONB NOT NULL,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_on TIMESTAMPTZ DEFAULT clock_timestamp(),
    updated_on TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_unresolved_gateway_tx_id ON public.unresolved_payment_ledger(gateway_tx_id);
CREATE INDEX IF NOT EXISTS idx_unresolved_client_tx_id ON public.unresolved_payment_ledger(client_tx_id);