# Balance Scorecard

- Generated: 2026-09-17T06:34:55.689Z
- Seeds: 42, 137
- Session duration: 8s per seed × weapon
- Runs: 6
- Mean DPS across weapons: 0.33

## Weapon balance

| Weapon | Kills avg | Score avg | DPS avg | Deaths avg | Overheat | FPS p50 | FPS p95 | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| plasma | 2.5 | 282.5 | 0.31 | 0 | 0 | 56.7 / 56.4 | 60 | ok |
| rail | 4 | 437.5 | 0.49 | 0 | 0 | 59.6 / 60 | 60 | OP? |
| scatter | 1.5 | 157.5 | 0.18 | 0 | 0 | 59.5 / 60 | 60 | weak? |

## Upgrade stack totals (end of sessions)

_No upgrades recorded._

## Per-run detail

| Seed | Weapon | Kills | DPS | Deaths | Wave | FPS p95 | Mode end |
|---:|---|---:|---:|---:|---:|---:|---|
| 42 | plasma | 2 | 0.25 | 0 | 1 | 60 | play |
| 42 | rail | 5 | 0.62 | 0 | 1 | 60 | play |
| 42 | scatter | 3 | 0.36 | 0 | 1 | 60 | play |
| 137 | plasma | 3 | 0.37 | 0 | 1 | 60 | play |
| 137 | rail | 3 | 0.37 | 0 | 1 | 60 | play |
| 137 | scatter | 0 | 0 | 0 | 1 | 60 | play |

## Notes

- Bot is deterministic input, not a skilled player; use for regression + relative weapon comparison.
- `OP?` / `weak?` flags are heuristic (±20% of mean DPS).
- Rerun: `npm run balance`
