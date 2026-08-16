-- Migration: Change Channel Partners -> Access Keys relationship from 1:1 to 1:N
-- Created on: 2026-07-11

BEGIN;

-- 1. Add the foreign key column to access_keys to point to channel_partners
ALTER TABLE public.access_keys 
ADD COLUMN channel_partner_id UUID REFERENCES public.channel_partners(id) ON DELETE SET NULL;

-- 2. Drop the original limiting column from channel_partners
ALTER TABLE public.channel_partners 
DROP COLUMN IF EXISTS access_key_id;


COMMIT;