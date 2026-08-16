-- ========================================================================================
-- Migration: 20260607164500_lock_down_public_schema_rls.sql
-- Description: Enforces global Row-Level Security (RLS) across all core tables to resolve 
--              critical vulnerabilities regarding public visibility & sensitive columns.
-- ========================================================================================

-- 1. Secure the Core Identity Layer (Clears the sensitive_columns_exposed alert)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Secure the New Workspace Infrastructure Layer
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_keys ENABLE ROW LEVEL SECURITY;

-- 3. Secure the Channel Distribution Management Network
ALTER TABLE public.channel_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_partnership_history ENABLE ROW LEVEL SECURITY;

-- ========================================================================================
-- NOTE ON POLICIES: 
-- Because Plurse utilizes a secure backend architecture via Server Actions and the 
-- SUPABASE_SERVICE_ROLE_KEY, no 'CREATE POLICY' statements are required here. 
-- Leaving these tables with RLS ENABLED and ZERO active policies means:
--   - The public internet / anonymous API layer gets a flat 401/Empty Array (Secure).
--   - Your Next.js Server Actions bypass the barrier completely (Fully Functional).
-- ========================================================================================