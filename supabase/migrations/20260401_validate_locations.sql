-- Validation: detect profiles with missing or invalid city/state.
-- Run BEFORE and AFTER the backfill migration to verify results.

-- 1. Profiles with NULL city or state
SELECT id, city, state
FROM profiles
WHERE city IS NULL OR state IS NULL
ORDER BY id;

-- 2. Profiles whose city does not match any prayer_locations entry
SELECT p.id, p.city, p.state
FROM profiles p
WHERE p.city IS NOT NULL
  AND lower(p.city) NOT IN (
    SELECT DISTINCT lower(pl.city) FROM prayer_locations pl
  )
ORDER BY p.id;

-- 3. Summary counts
SELECT
  COUNT(*) AS total_profiles,
  COUNT(*) FILTER (WHERE city IS NULL)     AS missing_city,
  COUNT(*) FILTER (WHERE state IS NULL)    AS missing_state,
  COUNT(*) FILTER (WHERE city IS NOT NULL
    AND lower(city) NOT IN (SELECT DISTINCT lower(city) FROM prayer_locations))
    AS invalid_city
FROM profiles;
