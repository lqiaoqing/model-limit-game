# Balance artifacts

| Path | Meaning |
|---|---|
| `full/` | Canonical full harness evidence (`npm run balance:full`, 5 seeds × 4 weapons = 20 runs) |
| `smoke/` | Fast smoke harness (`npm run balance:smoke`, 2 seeds × 4 weapons = 8 runs) |

**Rule:** smoke must never overwrite full. Do not write harness output to this directory root.
