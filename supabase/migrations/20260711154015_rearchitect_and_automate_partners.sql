BEGIN;

-- ====================================================================
-- PHASE 2: AUTOMATION VIA TRIGGERS (FOR ATOMIC TRANSACTIONS)
-- ====================================================================

-- 1. Create a function that runs automatically whenever a new partner record is created
CREATE OR REPLACE FUNCTION public.handle_new_channel_partner()
RETURNS TRIGGER AS $$
BEGIN
    -- A. Elevate privilege flag inside user_profiles automatically
    UPDATE public.user_profiles
    SET is_channel_partner = TRUE
    WHERE id = NEW.user_id;

    -- B. Log the partnership lifecycle creation event into history automatically
    INSERT INTO public.channel_partnership_history (channel_partner_id, valid_from, valid_to, amount)
    VALUES (NEW.id, NEW.valid_from, NEW.valid_to, NEW.amount);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the function to the channel_partners table as an active trigger
CREATE OR REPLACE TRIGGER on_channel_partner_created
    AFTER INSERT ON public.channel_partners
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_channel_partner();

COMMIT;