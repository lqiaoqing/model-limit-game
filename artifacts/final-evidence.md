# Final Evidence — Showcase + Real GPU (runId gpu-1)

## Result
**Neon Siege Arena** at **showcase 2.80** with **real-GPU 60 FPS** evidence.

- URL: http://127.0.0.1:5188/
- Build: `npm run build` passes
- Scorecard: `artifacts/scorecard-pass1.md` — avg **2.80**, seven ×3

## Real GPU (this machine)
| State | GPU | FPS | Foes | Calls | Tris |
|---|---|---:|---:|---:|---:|
| active-play | Intel UHD D3D11 | **59.99** | 0–4 | 234 | 6.4k |
| **stress** | Intel UHD D3D11 | **60** | **120** | 234 | 6.4k |

`softwareRendered: false`. Reports: `artifacts/gpu-1/*.json`.

## Rewards (→ 3)
- Collect beam (magnet-bright column)
- Pickup chain ×N: rising pitch, score multiplier, HUD tag
- Ground pulse + decal on collect

## How to re-measure GPU
```bash
# Real GPU (default)
node scripts/inspect-threejs-canvas.mjs --url http://127.0.0.1:5188 \
  --out artifacts/gpu-1 --state stress --seed 42 --run-id gpu-1
# Force SwiftShader for comparison
$env:FORCE_SW='1'; node scripts/inspect-threejs-canvas.mjs ...
```
