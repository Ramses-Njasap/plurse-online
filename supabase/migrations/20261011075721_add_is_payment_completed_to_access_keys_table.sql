-- Migration: Add is_payment_completed column to access_keys table
ALTER TABLE public.access_keys 
ADD COLUMN IF NOT EXISTS is_payment_completed BOOLEAN NOT NULL DEFAULT FALSE;