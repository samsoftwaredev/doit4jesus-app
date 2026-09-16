---
name: expo-quality-workflow
description: Build or modify Expo and React Native application code in this repository with mobile-first responsive design, strict red-green-refactor TDD, JSDoc for production functions, accessibility, and English-Spanish localization parity built into implementation and tests. Use for features, UI changes, refactors, and bug fixes; skip read-only analysis and content-only edits.
---

# Expo Quality Workflow

Apply the four quality requirements in this skill together. Follow the user's instructions and the nearest `AGENTS.md` first if they conflict with this workflow.

## Prepare

- Read the nearest `AGENTS.md` and inspect the affected feature, shared components, theme tokens, and existing tests.
- Confirm the installed Expo version. Before changing Expo APIs, Expo Router, native configuration, or Expo packages, consult the exact Expo SDK 57 documentation at <https://docs.expo.dev/versions/v57.0.0/>.
- Reuse established components, tokens, hooks, API clients, and feature boundaries.
- Run the narrowest relevant test before editing to distinguish existing failures from regressions.

## Follow Red-Green-Refactor TDD

1. **Red:** Write or update a test before production code. For a bug, first add a regression test that reproduces it. Run the test and confirm that it fails for the intended reason.
2. **Green:** Make the smallest production change that satisfies the test. Do not weaken or remove unrelated assertions.
3. **Refactor:** Improve structure and naming while keeping the test green. Re-run the targeted test after each meaningful change.

Test observable behavior instead of implementation details. Prefer queries by accessible role, name, text, and state; use `testID` only when no user-facing query is appropriate. Keep tests outside `src/app`, because Expo Router treats files there as routes.

If a change has no executable behavior, such as documentation-only work, state why a meaningful failing test cannot be written. Do not use this exception for refactors or configuration that affects runtime or build behavior.

## Design Mobile First

- Make the base styles and component behavior work on the smallest supported phone first. Do not use desktop styles as the default and then override them for smaller screens.
- Add tablet behavior second at `theme.breakpoints.tablet` (`768px`), then desktop behavior at `theme.breakpoints.desktop` (`1024px`). Use the repository's breakpoint tokens rather than duplicating numeric values in feature code.
- Use `useWindowDimensions()` for reactive width, height, and font-scale decisions. Do not branch on device names or capture window dimensions once at module load.
- Prefer fluid layout tools such as flexbox, wrapping, `minWidth: 0`, percentage sizing, `maxWidth`, and scrollable content. Avoid fixed widths or heights that can clip translated or scaled text.
- Respect safe areas and support portrait and landscape layouts when the screen can rotate.
- Keep interactive targets at least `theme.sizes.touchTarget` (`44px`) on every viewport.
- Validate a narrow phone, a typical phone, the `768px` tablet boundary, and the `1024px` desktop boundary. Also check large font scaling and content overflow.

## Document Every Production Function

- Add a `/** ... */` JSDoc comment to every production function created or materially changed, including React components, hooks, helpers, event handlers, and named callbacks.
- Prefer named functions or named callback constants so documentation has a stable attachment point. Extract non-trivial inline callbacks into documented functions.
- Explain the function's purpose and contract. Document parameters, return behavior, side effects, thrown errors, and important invariants when applicable.
- Do not restate TypeScript syntax without adding meaning. Update JSDoc whenever the behavior or contract changes.
- Jest `describe`, `it`, lifecycle callbacks, generated files, and third-party code are excluded.

## Build Accessibility In

- Give each interactive element the correct role, accessible name, state, and value. Add a hint only when the result of the action is not clear from its name.
- Prefer visible text as the accessible name. Prevent decorative icons and images from being announced; give meaningful images an accessible label or alternative text.
- Expose semantic structure for headings, navigation, progress, selections, toggles, tabs, dialogs, and validation errors.
- Never communicate meaning through color alone. Preserve readable contrast in every supported theme and state.
- Support text scaling without clipping, overlap, or loss of controls. Do not disable font scaling to make a layout fit.
- Preserve logical focus and screen-reader order. Make dialogs dismissible and return focus appropriately where the platform supports it.
- Support keyboard interaction and visible focus on web and hardware-keyboard paths.
- Honor reduced-motion preferences for non-essential animation.
- Use `hitSlop` when a control's visual treatment is smaller than the required touch target.
- Test important interactions by role, accessible name, and state with React Native Testing Library. Add regression tests for accessibility behavior that can be automated.

## Keep English and Spanish in Parity

- For every new or changed client-owned user-facing string, update both English (`en`) and neutral Latin American Spanish (`es`) resources in the same change.
- Include visible copy, accessibility labels and hints, validation and error messages, and bundled devotional content. Do not translate backend-provided strings unless the backend contract explicitly requires it.
- Preserve translation-key and interpolation-variable parity between both languages.
- Add or update tests that exercise both English and Spanish whenever localized behavior or meaning changes.

## Completion Gate

Before handing off the change:

- Confirm the new or changed test failed before implementation and passes afterward.
- Run `npm test -- --runInBand <affected-test-path>` for the affected behavior.
- Run lint on affected files and run `npm run check:types`.
- Run the broader test suite when shared contracts or multiple features changed.
- Check phone, tablet, and desktop behavior plus relevant accessibility states. If a manual platform check is unavailable, say exactly what remains unverified.
- Summarize the behavior changed, the tests added or updated, responsive and accessibility checks, and any assumptions.
