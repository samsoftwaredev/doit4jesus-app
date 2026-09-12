---
name: organize-components
description: Create, audit, or reorganize React and React Native components into one-component folders with colocated tests and barrel exports. Use for component creation or structural component refactors; do not use for behavior-only edits that leave component organization unchanged.
---

# Organize Components

Apply this repository's component layout without weakening feature boundaries. Follow the nearest `AGENTS.md` and any other applicable quality workflow.

## Required Layout

Give every named React component in scope its own PascalCase folder with exactly three files:

```text
components/
|-- ComponentName/
|   |-- ComponentName.tsx
|   |-- ComponentName.test.tsx
|   `-- index.ts
`-- index.ts
```

- Put the component's props and other component-specific types, logic, JSX, constants, and styles in `ComponentName.tsx`.
- Put meaningful unit tests in `ComponentName.test.tsx`.
- Export the named component and its public types from the component folder's `index.ts`.
- Export every component and public type from the containing `components/index.ts`.
- Do not add component-local `.styles.ts`, `.types.ts`, helper, or secondary component files. Move reusable non-component code to the appropriate feature or shared utility boundary when it does not belong in the component file.

Apply the layout to shared components under `src/components` and feature-local components under `src/features/**/components`. Shared components live directly at `src/components/<ComponentName>`; do not retain category layers such as `ui`, `navigation`, or `identity`. Keep feature components inside their existing feature rather than promoting them to shared code.

Each named component, including a private helper or closely related subcomponent, gets its own folder, test, and barrel entry. Do not treat Expo Router route files or screen entrypoints as component-library files merely because they render React.

## Imports and Exports

- Use named exports; do not introduce default exports for organized components.
- Use `export type` for public TypeScript types.
- Import shared components through `@/components` and feature components through that feature's `components` barrel from outside the component directory.
- Never import a containing barrel from a file that the barrel exports. Use a direct relative sibling import inside the same component boundary to avoid barrel cycles.
- Update all affected imports, Jest mocks, tests, and barrel files together. Check for name collisions before flattening shared category folders.

## New Components

Create a new component in the required layout immediately. Use the repository's test-first workflow and add it to the containing root barrel in the same change.

## Existing Components

Audit before changing existing component organization, even when the request asks for migration. Inspect the full requested boundary and report:

- every component and its current location;
- the proposed destination for each file;
- files that must be consolidated into the primary component file;
- affected imports, mocks, and barrel exports;
- naming or export collisions;
- tests that must move, be added, or be updated.

Make no migration edits during the audit. Stop after presenting the audit and wait for explicit approval. Approval of a specific audit authorizes only the listed moves and related import, test, and barrel updates; audit any newly discovered expansion before proceeding.

After approval, preserve unrelated worktree changes, perform the migration, and run the checks required by the nearest `AGENTS.md`. Verify that no scoped component remains flat, categorized, grouped with another named component, missing its colocated test, or absent from its containing barrel.
