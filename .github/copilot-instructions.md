# Project Guidelines

## Scope

- Applies to the whole monorepo.
- Follow these rules for all changes unless a deeper folder introduces a more specific `AGENTS.md`.

## Reducing memory usage

In order to reduce memory usage while running commands, wrap them in `nice`. e.g. instead of `npm ci`, run `nice npm ci`. Similarly, instead of `npm run lint`, use `nice npm run lint` and so on.

## Build And Test

- Use Node version from `.nvmrc` (`v24.14.0`).
- Install dependencies with `npm ci` at the repository root. Don't use `npm install`
- Preferred root scripts:
  - `nice npm run build`
  - `nice npm test`
  - `nice npm run lint`
  - `nice npm run type-check`
  - `nice npm run e2e`
- Before finalizing a change, run this quality gate in order:
  1. `nice npm run format`
  2. `nice npm run lint`
  3. `nice npm run type-check`

## Test

When running single tests, you can ignore possible jest coverage errors.

## Architecture

- This is a monorepo managed by Lerna:
  - `packages/chat-view`: main chat web worker logic and rendering
  - `packages/build`: shared build tooling
  - `packages/server`: server integration package
  - `packages/e2e`: Playwright end-to-end tests
- Main app code is in `packages/chat-view/src/parts`.
- Keep modules small and composable. Existing code follows one-feature-per-folder style (`PartName/PartName.ts`).

## Code Conventions

- Use TypeScript ESM patterns already used in the repo.
- Keep explicit `.ts` import extensions where used by the project configuration.
- Preserve the existing formatting style (Prettier is configured in root `package.json`: no semicolons, single quotes).
- Prefer pure functions and immutable state updates in chat-view logic.
- Keep file and symbol naming consistent with nearby code.

## Testing Conventions

- Add or update Jest tests in `packages/chat-view/test` for behavior changes.
- Follow existing test style:
  - import test APIs from `@jest/globals`
  - use deterministic, pure-function-style assertions
- Keep coverage healthy; the package enforces coverage thresholds.

## Practical Workflow

- For feature work in chat view:
  1. Inspect related module(s) under `packages/chat-view/src/parts`.
  2. Add or update tests in `packages/chat-view/test` first when feasible.
  3. Implement minimal change matching existing patterns.
  4. Run quality gate (`format`, `lint`, `type-check`) and relevant tests.

## References

- Root scripts and formatting: `package.json`
- Monorepo layout: `lerna.json`
- TS project config: `tsconfig.json`, `packages/chat-view/tsconfig.json`
- CI expectations: `.github/workflows/ci.yml`, `.github/workflows/pr.yml`
