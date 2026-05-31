# hanparse

A lightweight, rule-based Korean sentence parser written in TypeScript.

> ⚠️ **Status: Work in Progress (WIP)**  
> This project is currently in active development. It ships with around 25+ core grammatical rules to demonstrate the architecture and handle basic sentence patterns.

## Overview

`hanparse` is designed to parse Korean sentences using a deterministic, rule-driven approach based on a classic **maximum-matching (longest chunk) algorithm**. It runs entirely on the client side or edge environments, with no backend or heavy AI dependencies.

## Features

* **Deterministic Parsing:** Predictable behavior with 100% consistent structural analysis.
* **Ultra-Lightweight & Edge-Ready:** Zero heavy dependencies and **no external dictionary required**. Perfect for frontend browsers or constrained edge runtimes (e.g., Cloudflare Workers, Vercel Edge Functions).
* **Extensible Rule System:** Rules are centralized at the top of the codebase. You can easily add new grammatical patterns without touching the core matching logic.

## System Requirements

### Production

* Any modern browser or edge runtime with ES6 support

### Development

- Bun (for dependency management and tooling)
- Make (for running build, type check, and test tasks)

## Design Goals

* Deterministic behavior
* Zero backend dependency
* Lightweight enough to run anywhere

## Non-Goals

* Morphological (stem/inflection) analysis
* Dictionary lookup or semantic understanding
* Grammar checking or correction

## 🤝 Contributing

The primary reason `hanparse` is open-source is that **one person cannot map the entire Korean language alone**. Korean features rich and complex ending particles (Eomi) and postpositions (Josa). 

If you want to add new rules (such as handling `예요`, `ㅂ니다`, etc.), you don't even need to touch the core logic. Simply open the `src/rules.json` file, copy an existing rule object, and adapt it to your needs. Pull Requests for new rules or edge cases are highly welcome!

## Author

ByteBard

## License

MIT
