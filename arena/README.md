# Model Limit Arena

同一规格，让不同 Coding Agent / 模型独立实现或升级 Neon Siege Arena，再自动评分对比。

## 流程

```text
arena/challenges/<id>/CHALLENGE.md
        │
        ▼
  各模型在独立目录实现
        │
        ▼
npm run arena:eval -- --model gpt-x --root /path/to/impl
        │
        ▼
arena/runs/<model-id>/<challenge-id>/{score.json,SCORECARD.md}
        │
        ▼
npm run arena:compare -- --challenge model-limit-v2
```

## 命令

| 命令 | 作用 |
|---|---|
| `npm run arena:eval` | 对当前仓库（或 `--root`）跑构建/静态探针/bot/balance，写出 scorecard |
| `npm run arena:compare` | 汇总 `arena/runs/**` 生成排行榜 |

常用参数：

```bash
# 评当前工作区
npm run arena:eval -- --model miMo-v2 --challenge model-limit-v2

# 评另一个模型的 checkout
npm run arena:eval -- --model claude-x --root D:/work/other-impl --challenge model-limit-v2

# 跳过重测（只静态 + 已有 artifacts）
npm run arena:eval -- --model fast --skip-bot --skip-balance

# 对比全部 run
npm run arena:compare -- --challenge model-limit-v2
```

## 评分维度（默认权重）

| 维度 | 权重 | 数据来源 |
|---|---:|---|
| Gameplay correctness | 20% | bot-playtest + 静态 AC 探针 |
| Game depth | 15% | 武器/升级/编队/Boss 探针 |
| Visual quality | 15% | 静态视觉系统 +（可选）scorecard 证据 |
| Performance | 15% | balance FPS p95 + stress 容量探针 |
| Architecture | 10% | 模块边界（combat/telemetry/backend） |
| Automated tests | 10% | `npm test` / 配置存在性 |
| Mobile compatibility | 5% | 移动 HUD / touch 输入探针 |
| Bug rate | 5% | 构建失败 / bot 错误 |
| Task completion | 5% | challenge 清单完成率 |

权重与探针定义见 `arena/challenges/model-limit-v2/scoring.json`。

## 约定

- `arena/runs/` 可提交，作为模型对比证据。
- 同一 challenge id 下每个 model 一份 run；重复 eval 覆盖该 model 的 run。
- 评分脚本**不**修改被测仓库源码。
