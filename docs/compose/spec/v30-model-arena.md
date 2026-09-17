---
feature: v30-model-arena
status: prototype
updated: 2026-09-12
branch: feat/v2-combat-depth
commits: 760089d..HEAD
---

# V3.0 Model Arena

## Report

**What was built** — `arena/` challenge pack for `model-limit-v2` (CHALLENGE.md + scoring.json weights/probes), `scripts/arena-eval.mjs` (`npm run arena:eval`) scoring one implementation via build + desktop bot + optional short balance + static probes, and `scripts/arena-compare.mjs` (`npm run arena:compare`) leaderboard. Baseline run for this repo: **100/100** with `--skip-balance --skip-build` after bot green (gameplay/depth/visual/perf/architecture/tests/mobile/completion probes full; earlier bot failures were port-5188 contention, fixed via netstat/taskkill freePort).

**Verification** —
- `arena:eval --model miMo-v2-baseline --skip-balance --skip-build` → Total 100/100, bot PASS
- `arena:compare` → `arena/runs/LEADERBOARD-model-limit-v2.md`

**Journey log** —
1. Playwright `reuseExistingServer: false` + leftover Vite on 5188 made bot fail; freePort must LISTEN-kill and wait.
2. Probe walk must exclude `arena/` and `artifacts/` or scoring.json self-matches.
3. Long combined eval (bot+balance) can hit host session limits; split flags allow partial eval.

## [S1] Problem

Need a repeatable way for different coding models to implement the same game spec and be auto-ranked.

## [S2] Design

- Challenge pack + weighted scoring (gameplay/depth/visual/perf/architecture/tests/mobile/bugRate/completion).
- Eval writes `arena/runs/<model>/<challenge>/score.json` + `SCORECARD.md`.
- Compare merges runs into a leaderboard table.

## [S3] Out of Scope

- Actually invoking GPT/Claude/etc. inside this repo
- Visual screenshot ML scoring
- CI-hosted multi-model orchestration

## Tasks

- [x] T1: Challenge pack + scoring.json
- [x] T2: arena-eval script + npm scripts
- [x] T3: arena-compare leaderboard + baseline run
