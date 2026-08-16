-- Migration: Add human-readable business_code identifier and auto-generator trigger
-- Format: PLUR-X89B2K-BIZ (6 variable characters using non-ambiguous base32)

-- ── STEP 1: ADD COLUMN AND UNIQUE CONSTRAINT ──
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS business_code TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_businesses_business_code 
ON public.businesses (business_code);

-- ── STEP 2: CREATE GENERATOR TRIGGER FUNCTION ──
CREATE OR REPLACE FUNCTION public.generate_business_code()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
DECLARE
    v_code TEXT;
    v_exists BOOLEAN := TRUE;
    v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    v_i INT;
BEGIN
    IF NEW.business_code IS NULL THEN
        WHILE v_exists LOOP
            v_code := 'PLUR-';
            
            FOR v_i IN 1..6 LOOP
                v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
            END LOOP;
            
            v_code := v_code || '-BIZ';

            SELECT EXISTS (
                SELECT 1 FROM public.businesses WHERE business_code = v_code
            ) INTO v_exists;
        END LOOP;

        NEW.business_code := v_code;
    END IF;

    RETURN NEW;
END;
$$;

-- ── STEP 3: ATTACH TRIGGER FOR FUTURE INSERTS ──
DROP TRIGGER IF EXISTS trg_set_business_code ON public.businesses;

CREATE TRIGGER trg_set_business_code
BEFORE INSERT ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.generate_business_code();

-- ── STEP 4: BACKFILL EXISTING BUSINESSES ──
DO $$
DECLARE
    r RECORD;
    v_code TEXT;
    v_exists BOOLEAN;
    v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    v_i INT;
BEGIN
    FOR r IN SELECT id FROM public.businesses WHERE business_code IS NULL LOOP
        v_exists := TRUE;
        
        WHILE v_exists LOOP
            v_code := 'PLUR-';
            FOR v_i IN 1..6 LOOP
                v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
            END LOOP;
            v_code := v_code || '-BIZ';

            SELECT EXISTS (
                SELECT 1 FROM public.businesses WHERE business_code = v_code
            ) INTO v_exists;
        END LOOP;

        UPDATE public.businesses 
        SET business_code = v_code 
        WHERE id = r.id;
    END LOOP;
END;
$$;