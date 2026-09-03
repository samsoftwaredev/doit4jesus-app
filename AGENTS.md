# DoIt4Jesus Mobile — Agent Guide

## Platform

- This app uses Expo SDK 57.
- Before changing Expo APIs, Expo Router, native configuration, or adding Expo packages, read the relevant SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/
- Do not rely on unversioned or “latest” Expo documentation.

## Implementation

- Use TypeScript and existing `@/` import aliases.
- Reuse existing components, tokens, API clients, and feature boundaries before creating new patterns.
- Keep API payloads and response parsers aligned with the current backend contracts. Remove obsolete client fields when backend support is removed.
- Preserve unrelated worktree changes.

## Quality checks

For code changes, run the checks relevant to the edited area:

- `npm test -- --runInBand <affected-test-files>`
- `npm run lint -- <affected-files>`
- `npm run check:types`

Run `npm test -- --runInBand` for cross-feature or contract changes.

## Data and safety

- Do not add secrets, tokens, or `.env` values to source control.
- Do not change Supabase schema, migrations, or production data unless explicitly requested.
- Do not delete files or features outside the requested scope.

## Completion

- Summarize user-visible behavior changes.
- State which verification commands passed.
- Mention any assumptions or backend dependencies that still need confirmation.
