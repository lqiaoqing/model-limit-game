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

## Pending
- Optional: player-facing stress toggle polish
- Optional: external 3D/image/audio when API keys exist
- Optional: mobile WebKit regression (`npx playwright install webkit`)

## Next
Play at http://127.0.0.1:5188/ and tune feel/difficulty from real play.
Playwright desktop uses `channel: 'chrome'` (system Chrome) because the CDN Chromium download timed out on this machine.

