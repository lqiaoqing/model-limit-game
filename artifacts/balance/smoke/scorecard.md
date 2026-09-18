# Balance Scorecard

- Generated: 2026-09-18T16:33:20.685Z
- Profile: smoke
- Seeds: 42, 137
- Session duration: 8s per seed × weapon
- Runs: 8
- Mean DPS across weapons: 6.94

## Weapon balance

| Weapon | Kills avg | DPS avg | Damage | Kills/s | Deaths avg | Overheat | Frame p50/p95/p99 | FPS p50 | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| plasma | 0.5 | 8.53 | 72 | 0.06 | 0 | 0 | 17.9 / 19.5 / 29.1 | 55.8 | OP? |
| rail | 1.5 | 5.92 | 51 | 0.18 | 0 | 0 | 17.9 / 19.8 / 28.8 | 54.7 | ok |
| scatter | 1 | 5.86 | 49 | 0.12 | 0 | 0 | 18 / 19.7 / 37 | 55.1 | ok |
| launcher | 1 | 7.44 | 63.98 | 0.12 | 0 | 0 | 18 / 19.6 / 28.6 | 54.2 | ok |

## Upgrade stack totals (end of sessions)

_No upgrades recorded._

## Per-run detail

| Seed | Weapon | Kills | DPS | Deaths | Wave | FPS p95 | Mode end |
|---:|---|---:|---:|---:|---:|---:|---|
| 42 | plasma | 1 | 9.9 | 0 | 1 | 57 | play |
| 42 | rail | 1 | 3.98 | 0 | 1 | 56.5 | play |
| 42 | scatter | 0 | 0 | 0 | 1 | 56.3 | play |
| 42 | launcher | 0 | 0 | 0 | 1 | 55.8 | play |
| 137 | plasma | 0 | 7.15 | 0 | 1 | 56.5 | play |
| 137 | rail | 2 | 7.85 | 0 | 1 | 55.9 | play |
| 137 | scatter | 2 | 11.72 | 0 | 1 | 56.8 | play |
| 137 | launcher | 2 | 14.88 | 0 | 1 | 56 | play |

## Notes

- Bot is deterministic input, not a skilled player; use for regression + relative weapon comparison.
- `OP?` / `weak?` flags are heuristic (±20% of mean DPS).
- Canonical full evidence lives under `artifacts/balance/full/`.
- Smoke evidence lives under `artifacts/balance/smoke/` and never overwrites full.
- Rerun full: `npm run balance:full` · Rerun smoke: `npm run balance:smoke`
