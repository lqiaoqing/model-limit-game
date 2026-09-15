# Visual Scorecard — Premium Pass (final)

Judged against skill `visual-scorecard.md` + anchors (scene-1/2/3).
Evidence: `artifacts/premium-1/` inspector reports + screenshots, runId `premium-1`.

Genre map: Hero = hover mech · Obstacles = enemy types + cover · Interactables = pickups/ult · World = arena kit · HUD = combat meters.

## Scores

| Category | Score | Evidence |
|---|---:|---|
| Art direction | **2.5** | Theme now shifts color temp by wave; cohesive neon siege identity |
| Hero/player | **3** | Dash afterimages, heat steam, hurt crack, bank/recoil, thruster pulse |
| Obstacles/enemies | **2.5** | Typed silhouettes + telegraphs + scorch trails + typed death bursts |
| Rewards/interactables | **3** | Role forms + magnet + **collect beam** + **pickup chain ×N** + rising pitch + ground pulse |
| World/environment | **3** | Dust + far skyline + pulses + mid props + floor decals + debris |
| Materials/textures | **3** | Panel maps, wear, roughnessMap + **runtime scorch/impact decals** |
| Lighting/render | **2.5** | Warm/cool/rim + **wave color-temp lerp**; contrast 54 (dark style) |
| VFX/motion | **3** | Typed kills, slow-mo beats, shells, steam, hitstop, tracers |
| UI/HUD | **3** | Combat frames + **banner-in anim**, boss banner, score pop, kill feed |
| Performance evidence | **3** | **Real GPU Intel UHD: 60 fps @ 120 foes / 234 calls** (gpu-1); instancing history |

**Average = 2.80** — **showcase bar met** (seven categories at 3; none below 2).

## Real GPU evidence (runId gpu-1)
- Device: **Intel UHD Graphics, D3D11**, `softwareRendered: false`
- active-play: **FPS 59.99**, 234 calls, 6.4k tris
- **stress: FPS 60**, **120 foes**, 234 calls, 6.4k tris
- Force software fallback: `FORCE_SW=1` when launching inspector

## Showcase increment 2 (runId showcase-2)
- Ground scorch/impact decal pool on kills/hits
- Wave-driven hemisphere/fill color temperature
- Wave banner animation + boss variant + score pop
- Inspector: 234 calls / 6.5k tris, 0 errors

## Rewards increment (gpu-1)
- Collect beam column brightens on magnet
- Pickup chain ×N with rising pitch + score multiplier
- Ground pulse on collect


## Measured (runId premium-1, software SwiftShader)

| Capture | Foes | Calls | Tris | Budget |
|---|---:|---:|---:|---|
| desktop active-play | 0–4 | **231** | 6.1k | within 300/750k |
| desktop stress | **120** | **231** | 5.8k | within |
| mobile active-play | 0 | **171** | 4.7k | **over 150 calls** (bloom multi-pass) |

- `colorEntropyBits` 1.27–1.31 desktop / 2.23 mobile — dark neon arena; not scored down for intentional composition
- `edgeDensity` 0.127–0.187 — above 0.04 primitive-empty floor
- `gpu.softwareRendered: true` — **FPS not valid as GPU claim**
- `check_evidence.py` **passed** (5 artifacts)

## Residual risks
1. Mobile draw calls 171 > 150 budget — tradeoff: UnrealBloom multi-pass + DPR 2; Low Graphics mode drops bloom
2. Real-GPU 60fps not measured on this machine
3. External generated assets unavailable (keys MISSING)
4. Scaffold bot-playtest runner still not under `@playwright/test` channel chromium

## How to re-run
```bash
cd D:\Work\workspace\desktop_tools\model-limit-game
npm run dev
node scripts/inspect-threejs-canvas.mjs --url http://127.0.0.1:5188 --out artifacts/premium-1 --state active-play --seed 42 --run-id premium-1
# stress + mobile similarly
python <skill>/scripts/check_evidence.py . --manifest artifacts/evidence.json
```
