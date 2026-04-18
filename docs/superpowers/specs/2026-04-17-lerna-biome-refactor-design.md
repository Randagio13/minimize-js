# Lerna + Biome Refactor Design

**Date:** 2026-04-17  
**Status:** Approved

## Goal

Refactor `minimize-js` from a single-package project into a pnpm + Lerna monorepo with two packages, replacing the build/lint/test/release toolchain with modern alternatives.

## Monorepo Structure

```
minimize-js/
├── packages/
│   ├── core/                    (@minimize-js/core)
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   └── cli/                     (minimize-js)
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts
├── specs/
│   ├── core.spec.ts
│   └── cli.spec.ts
├── biome.json
├── lerna.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json                 (root, private)
```

## Packages

### `@minimize-js/core`

Pure minimization logic with no side effects.

**Exports:**
```ts
minimization(files: string[], opts: Opts): MinificationResult[]
```

**Responsibilities:**
- esbuild JS minification
- dts-minify declaration minification
- Shebang handling (preserve/remove)
- Banner injection

**No:** file I/O, progress bar, console output, CLI deps.

**Dependencies:** esbuild, dts-minify, tslib

---

### `minimize-js` (CLI)

User-facing CLI tool. Depends on `@minimize-js/core`.

**Responsibilities:**
- Glob files from directory (`getFiles`)
- Read/write files to disk
- Render progress bar
- Wire commander CLI options

**Dependencies:** `@minimize-js/core`, commander, glob, pretty-bytes, progress-barjs

## Tooling

| Tool | Role | Replaces |
|------|------|---------|
| Lerna 8 | versioning + publish | semantic-release |
| pnpm workspaces | dep hoisting + linking | — |
| Biome | lint + format | — (fresh addition) |
| tsup | build each package | tsc |
| Vitest | tests | Jest + Babel |

### Lerna Configuration

Fixed versioning (all packages share one version number), conventional commits for automatic bump detection.

```json
{
  "version": "1.4.0",
  "npmClient": "pnpm",
  "useWorkspaces": true,
  "command": {
    "version": { "conventionalCommits": true },
    "publish": { "registry": "https://registry.npmjs.org" }
  }
}
```

### pnpm Workspaces

```yaml
packages:
  - "packages/*"
```

### Biome

Single `biome.json` at root covering all packages. Handles formatting and linting for TypeScript files.

### tsup

Each package has its own `tsup.config.ts`. Outputs CommonJS (`lib/`) with `.d.ts` declarations.

### Vitest

Runs from root, globs `specs/**/*.spec.ts`. No transform config needed — TypeScript supported natively.

## Removed

- `babel.config.js` and all `@babel/*` dependencies
- All `@semantic-release/*` dependencies
- `jest`, `@types/jest`
- Root `tsconfig.json` (replaced by `tsconfig.base.json` + per-package configs)

## Package Naming

- CLI keeps `minimize-js` name — zero breaking change for existing npm users
- Core is new: `@minimize-js/core` — no existing users

## CI/CD

GitHub Actions workflow updated:
- Replace `semantic-release` step with `lerna version --conventional-commits` + `lerna publish`
- Keep Node 20 + pnpm

## Testing Strategy

- `specs/core.spec.ts` — unit tests calling `minimization()` directly
- `specs/cli.spec.ts` — integration tests spawning the `minimize-js` binary

Existing 3 tests migrated: minify JS, minify declarations, add banner.
