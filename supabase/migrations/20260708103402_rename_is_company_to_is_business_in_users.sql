-- ========================================================================================
-- Migration: rename_is_company_to_is_business_in_users.sql
-- Description: Renames 'is_company' to 'is_business' on the users table to align perfectly
--              with the platform's core business domain terminology.
-- ========================================================================================

ALTER TABLE public.users 
    RENAME COLUMN is_company TO is_business;