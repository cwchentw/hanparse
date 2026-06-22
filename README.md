# hanparse

A lightweight, rule-based Korean sentence parser written in TypeScript.

## Overview

`hanparse` is designed to parse Korean sentences using a deterministic, rule-driven approach based on a classic **maximum-matching (longest chunk) algorithm**. It runs entirely on the client side or edge environments, with no backend or heavy AI dependencies.

### Project Status

`hanparse` is in an early but active development stage. The parser currently implements around 30+ core grammatical rules, enabling it to handle basic Korean sentence patterns and demonstrate the underlying architecture.

A preliminary lemmatization system is included, though the tool is not yet ready for practical use. Ongoing work focuses on expanding rule coverage, refining lemmatization accuracy, and improving usability to move toward a production-ready parser.

Contributions are welcome to help extend parsing rules and enhance performance.

## Features

* **Deterministic Parsing:** Predictable behavior with 100% consistent structural analysis.
* **Ultra-Lightweight & Edge-Ready:** Zero heavy dependencies and **no external dictionary required**. Perfect for frontend browsers or constrained edge runtimes (e.g., Cloudflare Workers, Vercel Edge Functions).
* **Extensible Rule System:** Rules are centralized at the top of the codebase. You can easily add new grammatical patterns without touching the core matching logic.

## System Requirements

### Production

* Any modern browser or edge runtime with ES6 support

### Development

- **Bun** (for dependency management and tooling)
- **Make** (for running build, type-check, and test tasks)
- **Perl 5.36+** (for running tool scripts)
- **Carton** (for managing tool script dependencies)
- [ChunkSpec](https://github.com/cwchentw/chunk-spec) (for grammar rules)

## Install

```shell
$ cd path/to/hanparse
$ bun install
$ carton install
```

## Usage

### Library

Run `make release` and locate the compiled artifact in the `dist/` directory.

### Parser

To compile the parser, run:

```shell
$ make release
```

To parse a Korean sentence, run:

```shell
$ ./bin/hanparse "이것은 무엇이에요?"
```

You can also omit the quotation marks:

```shell
$ ./bin/hanparse 이것은 무엇이에요?
```

## Design Goals

* Deterministic behavior
* Zero backend dependency
* Lightweight enough to run anywhere

## Non-Goals

* Dictionary lookup or semantic understanding
* Grammar checking or correction

## 🤝 Contributing

**Why open-source?**  
`hanparse` exists because **no single person can cover the entire Korean language**. Ending particles (Eomi) and postpositions (Josa) are too rich and complex.

**Rules**  
You don’t need to touch the core code. Just edit `data/rules.md`: copy an existing rule object, adapt it, and submit a PR. The rule scheme is still evolving, so focus on expanding coverage and experimenting. Major changes can be discussed before submission.

We migrated the grammar rules from JSON to [ChunkSpec](https://github.com/cwchentw/chunk-spec) embedded in Markdown to eliminate redundant boilerplate.

**Proper nouns**  
We also keep a small dictionary of proper nouns in `data/proper-noun.csv`. It’s minimal, meant as a proof of concept. Contributors are welcome to add common names, places, or brands—especially those found in beginner-level Korean materials.

👉 **No coding required**: If you can read and edit Markdown/CSV, you can already contribute.

## Copyright

Copyright (c) 2026 BytBard. Licensed under MIT.
