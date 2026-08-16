-- 1. Add column defaulting to FALSE so all existing active business keys remain marked as non-standalone
ALTER TABLE access_keys 
ADD COLUMN is_standalone BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Backfill check: Ensure any key without a business_id (if any exist) is set to TRUE
UPDATE access_keys
SET is_standalone = TRUE
WHERE id NOT IN (
    SELECT access_key_id 
    FROM businesses 
    WHERE access_key_id IS NOT NULL
);

-- 3. Add index for matrix filtering
CREATE INDEX idx_access_keys_is_standalone 
ON access_keys (is_standalone);