-- Migration: 20261103130410_enabling_row_level_security_on_transactions_and_unresolved_payment_ledger.sql
-- Enable row level security on the transactions and unresolved_payment_ledger tables

-- Secure the transactions and unresolved_payment_ledger tables by enabling row level security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unresolved_payment_ledger ENABLE ROW LEVEL SECURITY;