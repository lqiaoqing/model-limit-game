# Model Arena Leaderboard — model-limit-v2

Generated: 2026-09-18T09:01:04.476Z

| Rank | Model | Total | Build | Bot | Balance |
|---:|---|---:|:---:|:---:|:---:|
| 1 | miMo-v2-baseline | **100** | FAIL | PASS | PASS |
| 2 | current-v2 | **89** | FAIL | FAIL | FAIL |

## Dimension breakdown (%)

| Model | gameplay | depth | visual | performance | architecture | tests | mobile | bugRate | completion |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| miMo-v2-baseline | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| current-v2 | 100 | 100 | 100 | 70 | 83 | 100 | 100 | 60 | 40 |

## How to re-run

```bash
npm run arena:eval -- --model <id> --root <impl>
npm run arena:compare -- --challenge model-limit-v2
```
