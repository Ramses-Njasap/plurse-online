-- Remove the NOT NULL constraint from expires_at to support LIFETIME plans
ALTER TABLE public.access_keys 
ALTER COLUMN expires_at DROP NOT NULL;