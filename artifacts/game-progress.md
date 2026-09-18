# Progress — model-limit-game

## Intent
Premium-ish top-down arena survival shooter to stress-test full AI game delivery.
Procedural-only (no Tripo/Gemini/ElevenLabs keys on this machine).

## Constraints
- TypeScript + Vite + Three.js scaffold
- Seeded RNG only
- Keep test hooks + diagnostics
- Desktop + mobile touch
- `npm run build` must pass

## Decisions
- Genre: Neon Siege Arena (top-down survival)
- Assets: full procedural
- Physics: custom circle collision (no Rapier — not needed)
- Audio: WebAudio procedural SFX

## Completed
- [x] Scaffold + npm install
- [x] Design brief / core loop / level plan
- [x] Combat systems (player/enemies/boss/cover/projectiles/waves)
- [x] UI HUD + pause/death/retry + touch controls
- [x] Procedural visuals + VFX + camera shake
- [x] `npm run build` pass
- [x] Screenshots + diagnostics (`artifacts/screens-final`, `final-evidence.md`)
- [x] Contact-damage fairness pass (soft separation + knockback + batch capacity 400)
- [x] Combat feel pass (enemy-enemy spatial separation, contact DPS cut, stagger, contact sparks)
- [x] Bot playtest under `@playwright/test` (`tests/bot-playtest.spec.ts`: combat, stress death, restart, pause)
- [x] Wave-clear retrofit picker: 3-choice upgrades that scale player stats between waves
- [x] Dual form evolution: player mech tiers by retrofit stacks; enemy tiers only at boss milestones (waves 6/11/16) with one-shot stat steps — no per-wave HP creep
- [x] P1 graphics pass: contrast 54→71, entropy 1.4→3.3; hazard chevrons + medallion; stress capture draws 120 foes; scorecard `artifacts/scorecard-p1.md` avg 3.0
- [x] **V2 Gameplay Beta** (`feat/v2-content-completion`): Ion Launcher, ~30 upgrades (22 rules), 8 archetypes, 7 squads + SquadController, 3 hazards, 3 bosses (BossDirector), Wave 1–15 gates, telemetry breakdowns
- [x] Merge-gate evidence split: `artifacts/balance/smoke/` vs `artifacts/balance/full/`; Arena PASS/FAIL/**SKIPPED** labels; strengthened Ion AoE / rule-damage / hazard regressions
- [x] Final gate: build PASS · desktop Playwright green · balance:full **20 runs** · arena `current-v2` Build PASS / Bot PASS / Balance SKIPPED

## Balance notes (balance:full @ 2026-09-18T16:29:14Z, HEAD ac0dd74+)
- Profile `full`: seeds **42, 137, 999, 2026, 65535** × 4 weapons = **20 runs**, 12s each
- **Mean DPS 7.19** (source of truth: `artifacts/balance/full/latest.json`)
- Weapon DPS avg: plasma **7.82** · rail **4.95** (`weak?`) · scatter **7.22** · launcher **8.76** (`OP?`)
- Damage avg: plasma 96 · rail 61.2 · scatter 88.2 · launcher 109.8
- frameMs p50 ≈ **18**, p95 ≈ **19.5**, p99 ≈ **27–37**; FPS p50 ≈ **55**
- Heuristic `OP?`/`weak?` are bot-DPS flags only — **do not retune gameplay solely for Arena score or these flags**
- Smoke (`artifacts/balance/smoke/`, 8 runs) must never overwrite full evidence

## Pending
- Optional: mobile draw call ≤150 + WebKit gameplay regression polish
- Optional: arena balance check on demand (`npm run arena:eval` without `--skip-balance`)
- Optional: external 3D/image/audio when API keys exist
- Optional: heat-as-resource weapon modes
- V2.5 Apocalypse / V3 Model Arena stay prototype

## Next
Merge `feat/v2-content-completion` → `main` when ready; playtest Wave 1–15 at http://127.0.0.1:5188/
