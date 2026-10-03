# Agent guide — bootstrap-modernized (repository index)

You are on `main`, which **only mirrors upstream Bootstrap** and hosts this index. Do not modify
code here — the maintained work lives on two branches:

| Branch      | Line                    | npm install                   | Agent guide                |
| ----------- | ----------------------- | ----------------------------- | -------------------------- |
| `v4-modern` | Bootstrap 4.6.2 → 4.7.x | `npm:bootstrap-modernized@^4` | `AGENTS.md` on `v4-modern` |
| `v5-modern` | Bootstrap 5.3.8 → 5.4.x | `npm:bootstrap-modernized@^5` | `AGENTS.md` on `v5-modern` |

## Working on this repository

1. `git checkout v4-modern` or `git checkout v5-modern` depending on the target major.
2. Read that branch's `AGENTS.md` — it contains the full migration playbook for consumers
   and the repository workflow (build, test, golden CSS parity invariants).
3. Never merge the two branches into each other; each keeps its own major version forever.

## Migrating a consumer project

The recommended install is an npm alias that preserves every existing `bootstrap` specifier:

```json
"bootstrap": "npm:bootstrap-modernized@^4"   // or @^5
```

Both branches' `AGENTS.md` files document the Sass `@use` migration path, JS compatibility
(jQuery 4 on v4, vanilla on v5) and verification steps.
