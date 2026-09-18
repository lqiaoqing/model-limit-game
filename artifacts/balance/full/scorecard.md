# Balance Scorecard

- Generated: 2026-09-18T16:29:14.264Z
- Profile: full
- Seeds: 42, 137, 999, 2026, 65535
- Session duration: 12s per seed × weapon
- Runs: 20
- Mean DPS across weapons: 7.19

## Weapon balance

| Weapon | Kills avg | DPS avg | Damage | Kills/s | Deaths avg | Overheat | Frame p50/p95/p99 | FPS p50 | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| plasma | 1.4 | 7.82 | 96 | 0.11 | 0 | 0 | 18 / 19.5 / 27.3 | 54.9 | ok |
| rail | 1.8 | 4.95 | 61.2 | 0.15 | 0 | 0 | 18 / 19.6 / 33.5 | 55 | weak? |
| scatter | 1.8 | 7.22 | 88.2 | 0.15 | 0 | 0 | 17.9 / 19.4 / 33.4 | 55.1 | ok |
| launcher | 1.8 | 8.76 | 109.8 | 0.15 | 0 | 0 | 18 / 19.6 / 36.8 | 54.8 | OP? |

## Upgrade stack totals (end of sessions)

_No upgrades recorded._

## Per-run detail

| Seed | Weapon | Kills | DPS | Deaths | Wave | FPS p95 | Mode end |
|---:|---|---:|---:|---:|---:|---:|---|
| 42 | plasma | 2 | 5.87 | 0 | 1 | 56.7 | play |
| 42 | rail | 2 | 5.53 | 0 | 1 | 56.5 | play |
| 42 | scatter | 2 | 8.03 | 0 | 1 | 56.8 | play |
| 42 | launcher | 1 | 5.84 | 0 | 1 | 56.5 | play |
| 137 | plasma | 1 | 6.8 | 0 | 1 | 55.9 | play |
| 137 | rail | 3 | 8.31 | 0 | 1 | 56.2 | play |
| 137 | scatter | 3 | 8.1 | 0 | 1 | 55.8 | play |
| 137 | launcher | 5 | 16.14 | 0 | 1 | 56.2 | play |
| 999 | plasma | 2 | 9.76 | 0 | 1 | 56.2 | play |
| 999 | rail | 0 | 0 | 0 | 1 | 56 | play |
| 999 | scatter | 2 | 7.35 | 0 | 1 | 56.3 | play |
| 999 | launcher | 1 | 7.18 | 0 | 1 | 55.9 | play |
| 2026 | plasma | 0 | 6.92 | 0 | 1 | 55.8 | play |
| 2026 | rail | 1 | 2.75 | 0 | 1 | 55.8 | play |
| 2026 | scatter | 2 | 8.02 | 0 | 1 | 55.6 | play |
| 2026 | launcher | 0 | 5.48 | 0 | 1 | 56 | play |
| 65535 | plasma | 2 | 9.77 | 0 | 1 | 55.9 | play |
| 65535 | rail | 3 | 8.14 | 0 | 1 | 55.9 | play |
| 65535 | scatter | 0 | 4.58 | 0 | 1 | 56.5 | play |
| 65535 | launcher | 2 | 9.18 | 0 | 1 | 56.3 | play |

## Notes

- Bot is deterministic input, not a skilled player; use for regression + relative weapon comparison.
- `OP?` / `weak?` flags are heuristic (±20% of mean DPS).
- Canonical full evidence lives under `artifacts/balance/full/`.
- Smoke evidence lives under `artifacts/balance/smoke/` and never overwrites full.
- Rerun full: `npm run balance:full` · Rerun smoke: `npm run balance:smoke`
