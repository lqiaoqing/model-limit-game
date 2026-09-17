---
feature: v30-balance-telemetry
status: prototype
updated: 2026-09-12
branch: feat/v2-combat-depth
commits: 08c95b7..HEAD
---

# V3.0 Multi-Seed Balance Telemetry + Auto Scorecard

## Report

**What was built** — `scripts/balance-harness.mjs` (`npm run balance`) runs a scripted combat bot across seeds **42 / 137 / 999 / 2026 / 65535** × weapons **plasma / rail / scatter** (12s each). Collects kills, score, DPS, deaths, dashes, overheat ratio, upgrade stacks, end modifiers, FPS avg/p50/p95, projectiles/particles. Aggregates per-weapon means and heuristic **OP? / weak?** flags (±20% mean DPS). Writes `artifacts/balance/latest.json`, timestamped JSON, `balance-report.md`, and `scorecard.md`.

**Bug fix** — `restart()` hard-coded `createSeededRandom(1)`, wiping `hooks.seed()`. Game now keeps `rngSeed` so multi-seed runs are actually different.

**Verification** —
- `npx tsc --noEmit` PASS
- Full harness run: 15 sessions, no page errors, FPS p95 ≈ 60 on this machine
- Sample scorecard (desktop): scatter DPS 0.49 vs plasma 0.38 / rail 0.36 (all within heuristic “ok” band for this bot)

**Journey log** —
1. Seed hook was a no-op across restarts until `rngSeed` was stored on Game.
2. Short bot sessions rarely clear wave 1, so upgrade-stack table is often empty — extend `--duration` or future work can force an early intermission.
3. Harness starts its own Vite if port 5188 is free; kills it on exit.

## [S1] Problem

No repeatable multi-seed measurement of combat outcomes or FPS, and no automated scorecard for regression / weapon balance. Model-limit goal needs evidence that survives agent iterations.

## [S2] Design

- Playwright Chrome + existing `__THREE_GAME_TEST_HOOKS__` / `__THREE_GAME_DIAGNOSTICS__`.
- Deterministic orbit-fire-dash bot; upgrade picks rotate 0/1/2; death → R restart.
- CLI: `--seeds`, `--duration`, `--port`.
- Scorecard markdown table + per-run detail.

## [S3] Out of Scope

- Multi-model leaderboard runner
- Skilled AI policy / win-rate simulation
- Stress-mode FPS matrix
- Continuous CI gate (script is local-first)

## Tasks

- [x] T1: Fix seed persistence across restart
- [x] T2: Balance harness script + npm script
- [x] T3: Aggregate scorecard writer + sample run artifacts
