-- Migration: Create Transactions schema
-- Timestamp: 20261023094300

-- 1. Create Status ENUM
DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('Failed', 'Pending', 'Success');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create Target Entity ENUM (defaulting to 'access_keys')
DO $$ BEGIN
    CREATE TYPE public.payment_target_entity AS ENUM (
        'access_keys', 
        'businesses',
        'channel_partners'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Create transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status public.payment_status NOT NULL DEFAULT 'Pending',
    target_entity public.payment_target_entity NOT NULL DEFAULT 'access_keys',
    payload JSONB,
    error_message TEXT,
    retry_count INT DEFAULT 0 NOT NULL,
    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
    ON public.transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_status 
    ON public.transactions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_target_entity 
    ON public.transactions(target_entity);
