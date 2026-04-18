<div align="center">

<br />

```
  ███╗   ███╗██╗███╗   ██╗██╗███╗   ███╗██╗███████╗███████╗      ██╗███████╗
  ████╗ ████║██║████╗  ██║██║████╗ ████║██║╚══███╔╝██╔════╝      ██║██╔════╝
  ██╔████╔██║██║██╔██╗ ██║██║██╔████╔██║██║  ███╔╝ █████╗   ████╗██║███████╗
  ██║╚██╔╝██║██║██║╚██╗██║██║██║╚██╔╝██║██║ ███╔╝  ██╔══╝   ╚═══╝██║╚════██║
  ██║ ╚═╝ ██║██║██║ ╚████║██║██║ ╚═╝ ██║██║███████╗███████╗      ██║███████║
  ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚═╝╚══════╝╚══════╝      ╚═╝╚══════╝
```

**Minimize your JS files post-build — without creating a bundle.**

<br />

[![npm version](https://img.shields.io/npm/v/minimize-js?style=flat-square&color=000&labelColor=000&logo=npm&logoColor=fff)](https://www.npmjs.com/package/minimize-js)
[![npm downloads](https://img.shields.io/npm/dt/minimize-js?style=flat-square&color=000&labelColor=000)](https://www.npmjs.com/package/minimize-js)
[![license](https://img.shields.io/npm/l/minimize-js?style=flat-square&color=000&labelColor=000)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/Randagio13/minimize-js/main.yml?style=flat-square&color=000&labelColor=000&label=CI)](https://github.com/Randagio13/minimize-js/actions)

<br />

</div>

---

## Overview

`minimize-js` strips whitespace, rewrites identifiers, and collapses syntax across every file in a directory — powered by [esbuild](https://esbuild.github.io/). No bundling, no module graph, no entry points. Just smaller files.

Perfect as a **post-build step** for libraries that compile TypeScript to CommonJS before publishing.

```bash
# Before
dist/index.js   →   42 kB
# After
dist/index.js   →   18 kB
```

---

## Packages

This project is a monorepo. Two packages, one purpose.

| Package | Description | Install |
|---------|-------------|---------|
| [`minimize-js`](./packages/cli) | CLI tool | `npm i -D minimize-js` |
| [`@minimize-js/core`](./packages/core) | Programmatic API | `npm i @minimize-js/core` |

---

## Installation

```bash
# npm
npm install minimize-js --save-dev

# pnpm
pnpm add minimize-js -D

# yarn
yarn add minimize-js --dev
```

---

## Usage

### CLI

```bash
minimize-js <directory> [options]
```

Run it on your compiled output directory:

```bash
minimize-js lib
minimize-js dist --minifyDeclaration
minimize-js lib --banner "/* Copyright 2024 */"
```

Combine with your build script in `package.json`:

```json
{
  "scripts": {
    "build": "tsc -b && minimize-js lib"
  }
}
```

### Options

| Flag | Alias | Description | Default |
|------|-------|-------------|---------|
| `--minifyWhitespace` | `-w` | Remove all whitespace | `true` |
| `--minifyIdentifiers` | `-i` | Shorten variable names | `true` |
| `--minifySyntax` | `-s` | Collapse syntax patterns | `true` |
| `--minifyDeclaration` | `-d` | Minify `.d.ts` files | `false` |
| `--banner <string>` | `-b` | Prepend a string to each JS file | — |

---

## Programmatic API

Use `@minimize-js/core` directly in your build scripts or tooling:

```typescript
import { minimization } from '@minimize-js/core'

const results = minimization(['dist/index.js', 'dist/utils.js'], {
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyDeclaration: false,
  banner: '/* my lib v1.0.0 */',
})
```

Returns an array of results — no file I/O, no side effects, fully testable.

---

## How It Works

```
your directory
      │
      ▼
  glob *.js
      │
      ├──▶  .js files  ──▶  esbuild transformSync  ──▶  write back
      │
      └──▶  .d.ts files ──▶  dts-minify  ──▶  write back
```

Shebang lines (`#!/usr/bin/env node`) are preserved automatically.

---

## Contributing

Contributions are welcome. Fork → branch → PR.

```bash
git clone https://github.com/Randagio13/minimize-js
cd minimize-js
pnpm install
pnpm build
pnpm test
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) — this drives automatic versioning via Lerna.

```
feat: add new option
fix: handle edge case in shebang detection
chore: update deps
```

---

## License

[MIT](LICENSE) — Alessandro Casazza

---

<div align="center">

[:heart: Sponsor this project](https://github.com/sponsors/Randagio13)

</div>
