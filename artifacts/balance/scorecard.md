# Balance Scorecard

- Generated: 2026-09-18T08:59:50.900Z
- Seeds: 42, 137
- Session duration: 8s per seed × weapon
- Runs: 8
- Mean DPS across weapons: 5.55

## Weapon balance

| Weapon | Kills avg | DPS avg | Kills/s | Deaths avg | Overheat | Frame p50/p99 | FPS p50 | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| plasma | 1 | 7.08 | 0.12 | 0 | 0 | 16.7 / 25.1 | 58.8 | OP? |
| rail | 1.5 | 6.2 | 0.18 | 0 | 0 | 16.7 / 25 | 58.8 | ok |
| scatter | 1 | 6.68 | 0.12 | 0 | 0 | 16.7 / 25.1 | 58.8 | OP? |
| launcher | 0 | 2.26 | 0 | 0 | 0 | 16.7 / 25.1 | 58.8 | weak? |

## Upgrade stack totals (end of sessions)

_No upgrades recorded._

## Per-run detail

| Seed | Weapon | Kills | DPS | Deaths | Wave | FPS p95 | Mode end |
|---:|---|---:|---:|---:|---:|---:|---|
| 42 | plasma | 1 | 9.92 | 0 | 1 | 60 | play |
| 42 | rail | 0 | 0 | 0 | 1 | 60 | play |
| 42 | scatter | 1 | 7.4 | 0 | 1 | 60 | play |
| 42 | launcher | 0 | 0 | 0 | 1 | 60 | play |
| 137 | plasma | 1 | 4.25 | 0 | 1 | 60 | play |
| 137 | rail | 3 | 12.39 | 0 | 1 | 60 | play |
| 137 | scatter | 1 | 5.96 | 0 | 1 | 60 | play |
| 137 | launcher | 0 | 4.52 | 0 | 1 | 60 | play |

## Notes

- Bot is deterministic input, not a skilled player; use for regression + relative weapon comparison.
- `OP?` / `weak?` flags are heuristic (±20% of mean DPS).
- Rerun: `npm run balance`
