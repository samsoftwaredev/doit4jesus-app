# DoIt4Jesus

This app helps catholics pray the rosary

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Get database schema

Generate TS types for supabase DB schema:

```bash
npm run db-ts
```

## Run database locally

To run database locally you will need docker desktop and supabase CLI.

```
supabase start --ignore-health-check
```

You will need to ignore the health check of the docker supabase database since this is the only way to make it work locally. See https://supabase.com/docs/reference/cli/supabase-start for explanation.
