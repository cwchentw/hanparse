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

The primary reason `hanparse` is open-source is that **one person cannot map the entire Korean language alone**. Korean features rich and complex ending particles (Eomi) and postpositions (Josa).

If you want to add new rules (such as handling `예요`, `ㅂ니다`, etc.), you don't even need to touch the core logic. Simply open the `src/rules.json` file, copy an existing rule object, and adapt it to your needs. Pull Requests for new rules or edge cases are highly welcome!

Please note that the **rule scheme is not yet finalized**. Current grammatical rules serve as a working prototype to demonstrate parsing behavior, but the structure and naming conventions may change as the project evolves. Contributors are encouraged to focus on expanding coverage and experimenting with improvements, while keeping in mind that rule definitions may be reorganized in future releases. For smoother collaboration, it is recommended to discuss major changes before submitting a PR.

## Copyright

Copyright (c) 2026 BytBard. Licensed under MIT.
