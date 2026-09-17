# Balance Scorecard

- Generated: 2026-09-17T06:11:37.075Z
- Seeds: 42, 137, 999, 2026, 65535
- Session duration: 12s per seed × weapon
- Runs: 15
- Mean DPS across weapons: 0.41

## Weapon balance

| Weapon | Kills avg | Score avg | DPS avg | Deaths avg | Overheat | FPS p50 | FPS p95 | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| plasma | 4.6 | 501 | 0.38 | 0 | 0 | 59.9 / 60 | 60 | ok |
| rail | 4.4 | 468 | 0.36 | 0 | 0 | 59.9 / 60 | 60 | ok |
| scatter | 6 | 647 | 0.49 | 0 | 0 | 59.9 / 60 | 60 | ok |

## Upgrade stack totals (end of sessions)

_No upgrades recorded._

## Per-run detail

| Seed | Weapon | Kills | DPS | Deaths | Wave | FPS p95 | Mode end |
|---:|---|---:|---:|---:|---:|---:|---|
| 42 | plasma | 4 | 0.33 | 0 | 1 | 60 | play |
| 42 | rail | 5 | 0.41 | 0 | 1 | 60 | play |
| 42 | scatter | 6 | 0.49 | 0 | 1 | 60 | play |
| 137 | plasma | 4 | 0.33 | 0 | 1 | 60 | play |
| 137 | rail | 3 | 0.25 | 0 | 1 | 60 | play |
| 137 | scatter | 6 | 0.5 | 0 | 1 | 60 | play |
| 999 | plasma | 4 | 0.33 | 0 | 1 | 60 | play |
| 999 | rail | 5 | 0.41 | 0 | 1 | 60 | play |
| 999 | scatter | 5 | 0.41 | 0 | 1 | 60 | play |
| 2026 | plasma | 6 | 0.5 | 0 | 1 | 60 | play |
| 2026 | rail | 6 | 0.49 | 0 | 1 | 60 | play |
| 2026 | scatter | 8 | 0.66 | 0 | 1 | 60.1 | play |
| 65535 | plasma | 5 | 0.41 | 0 | 1 | 60 | play |
| 65535 | rail | 3 | 0.25 | 0 | 1 | 60 | play |
| 65535 | scatter | 5 | 0.41 | 0 | 1 | 60 | play |

## Notes

- Bot is deterministic input, not a skilled player; use for regression + relative weapon comparison.
- `OP?` / `weak?` flags are heuristic (±20% of mean DPS).
- Rerun: `npm run balance`
