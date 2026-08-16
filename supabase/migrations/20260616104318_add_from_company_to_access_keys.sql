-- ========================================================================================
-- Migration: 20260616114500_add_from_company_to_access_keys.sql
-- Description: Appends the 'from_company' indicator attribute flag to the access_keys table.
--              Enforces explicit boolean domains with non-nullable production safety defaults.
-- ========================================================================================

-- 1. Alter the table structure to add the new evaluation vector flag
-- Setting DEFAULT false NOT NULL ensures PostgreSQL backfills all historical table rows with false automatically.
ALTER TABLE public.access_keys
  ADD COLUMN IF NOT EXISTS from_company BOOLEAN DEFAULT false NOT NULL;