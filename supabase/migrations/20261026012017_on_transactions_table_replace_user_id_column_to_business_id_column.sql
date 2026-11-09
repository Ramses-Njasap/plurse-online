-- Migration: Add business_id to transactions and adjust user_id
-- Timestamp: 20261026012017 (Use your current timestamp)

-- 1. Add business_id column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;

-- 2. (Optional) Make user_id nullable if transactions can belong purely to a business 
-- rather than a specific initiating user, or leave it as NOT NULL if every transaction must have a user.
ALTER TABLE public.transactions 
ALTER COLUMN user_id DROP NOT NULL;

-- 3. Create a performance index for the new business_id foreign key
CREATE INDEX IF NOT EXISTS idx_transactions_business_id 
    ON public.transactions(business_id);