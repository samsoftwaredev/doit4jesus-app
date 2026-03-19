-- ============================================================================
-- Migration: Global Prayer Map – prayer_locations table & RPC
-- ============================================================================

-- ── Table: prayer_locations ──────────────────────────────────────────────────
-- Stores city-level prayer activity. Country-level data is derived via a view.

CREATE TABLE IF NOT EXISTS prayer_locations (
  id            SERIAL PRIMARY KEY,
  city          TEXT        NOT NULL,
  country_code  TEXT        NOT NULL,
  country_name  TEXT        NOT NULL,
  latitude      NUMERIC     NOT NULL,
  longitude     NUMERIC     NOT NULL,
  prayer_count  INTEGER     NOT NULL DEFAULT 0,
  live_sessions INTEGER     NOT NULL DEFAULT 0,
  active_users  INTEGER     NOT NULL DEFAULT 0,
  last_updated  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (city, country_code)
);

CREATE INDEX IF NOT EXISTS idx_prayer_locations_country
  ON prayer_locations (country_code);

-- ── View: country-level aggregation ──────────────────────────────────────────

CREATE OR REPLACE VIEW prayer_locations_by_country AS
SELECT
  country_code,
  country_name,
  SUM(prayer_count)::INT  AS prayer_count,
  SUM(active_users)::INT  AS active_users,
  SUM(live_sessions)::INT AS live_sessions,
  MAX(last_updated)        AS last_updated
FROM prayer_locations
GROUP BY country_code, country_name;

-- ── RPC: get_prayer_map_cities ───────────────────────────────────────────────
-- Returns all cities ordered by prayer count descending.

CREATE OR REPLACE FUNCTION get_prayer_map_cities()
RETURNS SETOF prayer_locations
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM prayer_locations
  ORDER BY prayer_count DESC;
$$;

-- ── RPC: increment_prayer_count ──────────────────────────────────────────────
-- Bump the count for a given city (upsert).

CREATE OR REPLACE FUNCTION increment_prayer_count(
  p_city         TEXT,
  p_country_code TEXT,
  p_country_name TEXT,
  p_latitude     NUMERIC,
  p_longitude    NUMERIC,
  p_increment    INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO prayer_locations (city, country_code, country_name, latitude, longitude, prayer_count, last_updated)
  VALUES (p_city, p_country_code, p_country_name, p_latitude, p_longitude, p_increment, now())
  ON CONFLICT (city, country_code)
  DO UPDATE SET
    prayer_count = prayer_locations.prayer_count + p_increment,
    last_updated = now();
END;
$$;

-- ── Seed a handful of cities so the map isn't empty on first deploy ──────────

INSERT INTO prayer_locations (city, country_code, country_name, latitude, longitude, prayer_count, live_sessions, active_users)
VALUES
  ('Dallas',          'US', 'United States',  32.78,   -96.80,  1420, 5,  68),
  ('New York',        'US', 'United States',  40.71,   -74.01,  2380, 8,  125),
  ('Los Angeles',     'US', 'United States',  34.05,  -118.24,  1850, 6,  92),
  ('Mexico City',     'MX', 'Mexico',         19.43,   -99.13,  3200, 12, 180),
  ('São Paulo',       'BR', 'Brazil',        -23.55,   -46.63,  4100, 14, 220),
  ('Rio de Janeiro',  'BR', 'Brazil',        -22.91,   -43.17,  2700, 9,  140),
  ('Bogotá',          'CO', 'Colombia',        4.71,   -74.07,  1650, 5,  78),
  ('Lima',            'PE', 'Peru',          -12.05,   -77.04,  1250, 4,  62),
  ('Buenos Aires',    'AR', 'Argentina',     -34.60,   -58.38,  1400, 5,  70),
  ('Rome',            'IT', 'Italy',          41.90,    12.50,  5600, 18, 310),
  ('Madrid',          'ES', 'Spain',          40.42,    -3.70,  2900, 10, 155),
  ('London',          'GB', 'United Kingdom', 51.51,    -0.13,  1800, 7,  95),
  ('Paris',           'FR', 'France',         48.86,     2.35,  2100, 6,  110),
  ('Warsaw',          'PL', 'Poland',         52.23,    21.01,  2400, 8,  130),
  ('Lagos',           'NG', 'Nigeria',         6.52,     3.38,  3800, 13, 200),
  ('Nairobi',         'KE', 'Kenya',          -1.29,    36.82,  2200, 7,  115),
  ('Kinshasa',        'CD', 'DR Congo',       -4.32,    15.31,  2600, 8,  135),
  ('Manila',          'PH', 'Philippines',    14.60,   120.98,  5200, 16, 280),
  ('Seoul',           'KR', 'South Korea',    37.57,   126.98,  2800, 9,  150),
  ('Mumbai',          'IN', 'India',          19.08,    72.88,  1900, 6,  100),
  ('Sydney',          'AU', 'Australia',     -33.87,   151.21,  1050, 3,  55)
ON CONFLICT (city, country_code) DO NOTHING;
