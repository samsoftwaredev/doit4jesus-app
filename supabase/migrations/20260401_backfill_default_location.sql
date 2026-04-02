-- Backfill: set default city/state for all users with missing location.
-- Default: Dallas, United States (must exist in prayer_locations).
-- Safe to re-run; only updates rows with NULL city or state.

BEGIN;

-- 1. Backfill NULL city
UPDATE profiles
SET city = 'Dallas'
WHERE city IS NULL;

-- 2. Backfill NULL state (country_name)
UPDATE profiles
SET state = 'United States'
WHERE state IS NULL;

-- 3. Reset invalid cities (not found in prayer_locations) to the default
UPDATE profiles
SET city  = 'Dallas',
    state = 'United States'
WHERE city IS NOT NULL
  AND lower(city) NOT IN (
    SELECT DISTINCT lower(city) FROM prayer_locations
  );

COMMIT;
