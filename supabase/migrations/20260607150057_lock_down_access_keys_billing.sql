-- ========================================================================================
-- Migration: 20260607150057_lock_down_access_keys_billing.sql
-- Description: Creates a strict validation ENUM for key types, adds precise currency columns,
--              and hooks up your upgrade deduction flag logic.
-- ========================================================================================

-- 1. Create an immutable, hardwired database enum type for absolute data integrity
CREATE TYPE public.key_distribution_type AS ENUM ('TRIAL', 'LIFETIME');

-- 2. Drop the old VARCHAR check constraint from earlier structural drafts
ALTER TABLE public.access_keys DROP CONSTRAINT IF EXISTS val_key_type_check;

-- 3. Pivot the column data type securely to the new strict ENUM type
-- A. Clear the existing string default constraint so Postgres allows the structural change
ALTER TABLE public.access_keys ALTER COLUMN key_type DROP DEFAULT;

-- B. Perform the column type alteration using the casting parser rule
ALTER TABLE public.access_keys 
    ALTER COLUMN key_type TYPE public.key_distribution_type 
    USING (key_type::text::public.key_distribution_type);

-- C. Apply the fresh ENUM-compliant default value rule back to the table column
ALTER TABLE public.access_keys ALTER COLUMN key_type SET DEFAULT 'TRIAL'::public.key_distribution_type;

-- 4. Append your precise pricing parameters and upgrade deduction logic
ALTER TABLE public.access_keys
    ADD COLUMN IF NOT EXISTS amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    ADD COLUMN IF NOT EXISTS deduct_trial_fee BOOLEAN DEFAULT false NOT NULL;

-- 5. Force an absolute sanity check rule so currency figures can never be negative
ALTER TABLE public.access_keys
    ADD CONSTRAINT val_access_key_amount CHECK (amount >= 0);