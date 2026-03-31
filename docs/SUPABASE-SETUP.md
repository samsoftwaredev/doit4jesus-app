# Supabase Setup — World Map Prayer Feature

This document describes how to set up the Supabase backend for the Global Prayer Map feature from scratch.

## Prerequisites

- Supabase project with PostgreSQL
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`)
- Anon/public key (`NEXT_PUBLIC_SUPABASE_PROJECT_KEY`)
- Project URL (`NEXT_PUBLIC_SUPABASE_PROJECT_URL`)

## Tables

### `prayer_locations`

City-level prayer activity. Each row is a unique city+country pair.

| Column        | Type              | Notes              |
| ------------- | ----------------- | ------------------ |
| id            | bigint (identity) | PK                 |
| city          | text              | NOT NULL           |
| country_code  | text              | ISO 3166-1 alpha-2 |
| country_name  | text              | NOT NULL           |
| latitude      | numeric           | NOT NULL           |
| longitude     | numeric           | NOT NULL           |
| prayer_count  | integer           | Default 0          |
| live_sessions | integer           | Default 0          |
| active_users  | integer           | Default 0          |
| last_updated  | timestamptz       | Default now()      |

**Unique constraint**: `(city, country_code)` — prevents duplicate city entries.

### `global_prayer_sessions`

Live sessions users can start and join.

| Column             | Type              | Notes                    |
| ------------------ | ----------------- | ------------------------ |
| id                 | bigint (identity) | PK                       |
| city               | text              | NOT NULL                 |
| country_code       | text              | NOT NULL                 |
| country_name       | text              | nullable                 |
| latitude           | numeric           | NOT NULL                 |
| longitude          | numeric           | NOT NULL                 |
| prayer_type        | text              | e.g. "Rosary", "Chaplet" |
| participants_count | integer           | Default 1                |
| is_active          | boolean           | Default true             |
| created_by         | uuid              | FK → profiles(id)        |
| started_at         | timestamptz       | Default now()            |
| created_at         | timestamptz       | Default now()            |
| updated_at         | timestamptz       | Default now()            |

### `profiles` (additions)

| Column | Type | Notes                                     |
| ------ | ---- | ----------------------------------------- |
| city   | text | User-selected city for prayer attribution |
| state  | text | Optional state/region                     |

## Views

### `prayer_locations_by_country`

Aggregates `prayer_locations` rows into country-level totals for the choropleth map view.

## RPCs (Stored Functions)

### `get_prayer_map_cities()`

Returns all prayer locations ordered by `prayer_count DESC`.

### `increment_prayer_count(p_city, p_country_code, p_country_name, p_latitude, p_longitude, p_increment)`

Upserts a city's prayer count. If the city doesn't exist, creates it. If it does, adds `p_increment` to the existing count and updates `last_updated`.

### `upsert_global_prayer_session(p_city, p_country_code, p_country_name, p_latitude, p_longitude, p_prayer_type, p_created_by)`

Finds an existing active session for the same city+prayer_type and joins it, or creates a new one. Returns the session ID.

### `join_global_prayer_session(p_session_id)`

Increments participant count. Returns the new count. Raises exception if session not found or inactive.

### `expire_stale_prayer_sessions()`

Marks sessions inactive if `updated_at` is more than 2 hours ago. Called by cron or manually.

## RLS Policies

- **prayer_locations**: Public SELECT; INSERT/UPDATE restricted to service role.
- **global_prayer_sessions**: Public SELECT; INSERT for authenticated users; UPDATE for service role.

## Running Migrations

```bash
# Apply all migrations (requires Supabase CLI linked to your project)
supabase db push

# Or apply individually
supabase migration up
```

## Cron (Optional)

Enable `pg_cron` extension in your Supabase dashboard, then uncomment the schedule in migration `20260329000004_cron_expire_sessions.sql` to auto-expire stale sessions every 15 minutes.

## API Routes

The frontend communicates with Supabase through server-side Next.js API routes:

| Route                        | Method | Description                                 |
| ---------------------------- | ------ | ------------------------------------------- |
| `/api/prayer-map`            | GET    | Fetch all prayer locations                  |
| `/api/prayer-sessions`       | GET    | Fetch active prayer sessions                |
| `/api/prayer-sessions/start` | POST   | Start or join a prayer session              |
| `/api/prayer-sessions/join`  | POST   | Join an existing session                    |
| `/api/user/profile`          | PATCH  | Update user profile (city, state, language) |
| `/api/rosary/complete`       | POST   | Record rosary + increment prayer location   |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_PROJECT_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PROJECT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
