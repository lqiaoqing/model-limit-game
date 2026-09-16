# Visual Scorecard — P1 Graphics Pass (runId p1-after)

Judged against skill `visual-scorecard.md` + anchors. Evidence: `artifacts/p1-baseline/` vs `artifacts/p1-after/`.
Genre map: Hero = hover mech · Obstacles = enemy family + cover · Interactables = pickups/retrofit · World = neon siege arena · HUD = combat frames.

## Scores

| Category | Before | After | Evidence |
|---|---:|---:|---|
| Art direction | 2.5 | **3** | Perimeter hazard chevrons, center medallion, cyan/amber threat language, wave color-temp |
| Hero/player | 3 | **3** | Form tiers, thruster pulse, dash ghosts (unchanged, still showcase) |
| Obstacles/enemies | 2.5 | **3** | T1 blades/rings/elites readable in stress capture; spawn telegraph flash; typed foot rings |
| Rewards/interactables | 3 | **3** | Retrofit cards, pickup chain, collect beam (unchanged) |
| World/environment | 3 | **3** | Layered props, skyline, decals, medallion focal, hazard trim |
| Materials/textures | 3 | **3** | Panel maps, roughness, scorch/impact decals (unchanged) |
| Lighting/render | 2.5 | **3** | Contrast **54.3 → 71.2**; entropy **1.36 → 3.25**; key/fill/rim/bounce + lighter fog; bloom 0.42/0.82 |
| VFX/motion | 3 | **3** | Typed kills, hitstop, shells, tracers (unchanged) |
| UI/HUD | 3 | **3** | Combat frames, upgrade cards, banners (unchanged) |
| Performance evidence | 3 | **3** | Intel UHD real GPU, 240–252 calls / 300, 29k tris / 750k in stress |

**Average = 3.00** — showcase bar held; the three prior 2.5s lifted with measured evidence.

## Measured (runId p1-after, Intel UHD D3D11, softwareRendered: false)

| Capture | Foes | Calls | Tris | contrast | entropy | edgeDensity |
|---|---:|---:|---:|---:|---:|---:|
| active-play | 0 | 240 | 7.1k | **71.2** | **3.25** | 0.201 |
| stress | **120** | 252 | 29.4k | **167.1** | **5.48** | 0.344 |

Budgets: desktop ≤300 calls / 750k tris — within.

## Baseline (runId p1-baseline)
- contrast 54.3, entropy 1.36, dominantColorShare 0.835 (dark crush — scored Lighting down)

## Changes in this pass
1. Exposure 1.18→1.34, fog 0.028→0.016, hemisphere 0.85→1.15, sun 2.8→3.6, fill/rim/bounce raised
2. Floor albedo lift, vignette softened, bloom threshold 0.88→0.82
3. Arena medallion + 36 instanced hazard chevrons
4. Enemy spawn telegraph 0.45s; foot-ring flash stronger on telegraph/form tier
5. Fix: stress setState now `enemyBatch.sync` before screenshot freeze (120 foes actually drawn)

## Residual
- Mobile draw-call budget still known-over from bloom multi-pass (P2)
- Form-tier mid-wave captures not in this run (stress is T1 family)
