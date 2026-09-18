# Model Arena Leaderboard — model-limit-v2

Generated: 2026-09-18T16:42:44.114Z

| Rank | Model | Total | Build | Bot | Balance |
|---:|---|---:|:---:|:---:|:---:|
| 1 | miMo-v2-baseline | **100** | SKIPPED | PASS | PASS |
| 2 | current-v2 | **94** | PASS | PASS | SKIPPED |

## Dimension breakdown (%)

| Model | gameplay | depth | visual | performance | architecture | tests | mobile | bugRate | completion |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| miMo-v2-baseline | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| current-v2 | 100 | 100 | 100 | 70 | 83 | 100 | 100 | 100 | 100 |

## How to re-run

```bash
npm run arena:eval -- --model <id> --root <impl>
npm run arena:compare -- --challenge model-limit-v2
```
