# DoIt4Jesus

This app helps catholics pray the rosary

### Getting Started

First, run the development server:

```bash
npm run dev
```

### Run Tests

To execute all test do:

```bash
npm run test:watch
```

### Get database schema

Generate TS types for supabase DB schema:

```bash
npm run db-ts
```

### Create a PR

Create a PR request to merge to main. If here are all possible brach naming:

- **Feature Branches**: These branches are used for developing new features. Use the prefix `feature/`. For instance, `feature/login-system`
- **Bugfix Branches**: These branches are used to fix bugs in the code. Use the prefix `bugfix/`. For example, `bugfix/header-styling`.
- **Hotfix Branches**: These branches are made directly from the production branch to fix critical bugs in the production environment. Use the prefix `hotfix/`. For instance, `hotfix/critical-security-issue`.
- **Release Branches**: These branches are used to prepare for a new production release. They allow for last-minute dotting of i’s and crossing t’s. Use the prefix `release/`. For example, `release/v1.0.1`.
- **Documentation Branches**: These branches are used to write, update, or fix documentation eg. the README.md file. Use the prefix `docs/`. For instance, `docs/api-endpoints`.

```bash
npm run db-ts
```

### Run database locally

To run database locally you will need docker desktop and supabase CLI.

```
supabase start --ignore-health-check
```

You will need to ignore the health check of the docker supabase database since this is the only way to make it work locally. See https://supabase.com/docs/reference/cli/supabase-start for explanation.
