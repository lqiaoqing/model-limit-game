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

## Pending
- Optional: mobile draw call ≤150 + WebKit regression (P2)
- Optional: external 3D/image/audio when API keys exist
- Optional: heat-as-resource weapon modes

## Next
P2 mobile budget, or playtest tuning at http://127.0.0.1:5188/

