-- ========================================================================================
-- Migration: 20260607153400_pivot_to_businesses_and_access_keys.sql
-- Description: Renames companies to businesses, upgrades activation_keys to access_keys, 
--              aligns constraints, eliminates circular redundancies, and secures tables via RLS.
-- ========================================================================================

-- ========================================================================================
-- 1. CLEANUP PRE-EXISTING HOOKS & CONSTRAINTS (DEPENDENCY UNLINKING)
-- ========================================================================================
-- Drop the update tracking trigger attached to the companies table before mutating its schema name
DROP TRIGGER IF EXISTS update_companies_modtime ON public.companies;


-- ========================================================================================
-- 2. TRANSFORMATION: RE-ARCHITECTING COMPANIES TO BUSINESSES
-- ========================================================================================
-- Rename the core physical table
ALTER TABLE public.companies RENAME TO businesses;

-- Re-bind the precise timezone modification updater trigger back onto the newly named table
CREATE TRIGGER update_businesses_modtime 
    BEFORE UPDATE ON public.businesses 
    FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

-- Force enable Row-Level Security (RLS) to immediately resolve Supabase dashboard health indicators
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;


-- ========================================================================================
-- 3. TRANSFORMATION: RE-ARCHITECTING ACTIVATION_KEYS TO ACCESS_KEYS
-- ========================================================================================
-- Rename the table structure cleanly to match your standardized application terminology
ALTER TABLE public.activation_keys RENAME TO access_keys;

-- Alter existing columns to match the cryptographic token specs without redundant circular user bindings
ALTER TABLE public.access_keys RENAME COLUMN key TO key_code;
ALTER TABLE public.access_keys RENAME COLUMN expiration TO expires_at;

-- Provision the rest of the hybrid operational fields to support trials and lifetime keys
ALTER TABLE public.access_keys 
    ADD COLUMN IF NOT EXISTS key_type VARCHAR(50) NOT NULL DEFAULT 'TRIAL',
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL,
    ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP WITH TIME ZONE;

-- Apply explicit data domain constraints for typing checks
ALTER TABLE public.access_keys 
    ADD CONSTRAINT val_key_type_check CHECK (key_type IN ('TRIAL', 'LIFETIME'));

-- Force enable Row-Level Security (RLS) to ensure public anonymous endpoints are fully locked out
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;


-- ========================================================================================
-- 4. ALIGN REFERENTIAL INTEGRITY & FOREIGN KEY POINTERS ACROSS ALL TABLES
-- ========================================================================================
-- Rename the foreign key column inside channel_partners to point cleanly to access_keys
ALTER TABLE public.channel_partners 
    RENAME COLUMN activation_key_id TO access_key_id;

-- Rename the foreign key column inside businesses to point cleanly to access_keys
ALTER TABLE public.businesses 
    RENAME COLUMN activation_key_id TO access_key_id;