---
feature: v25-perf-architecture
status: delivered
updated: 2026-09-12
branch: feat/v2-combat-depth
commits: 51119e7..3d6e567
---

# V2.5 Perf Ceiling + Architecture Split

## Report

**What was built** — Stress ceiling raised toward ~500 live enemies (queue ~80+18·wave + 200 dump, burst 80, forceStartWave +48); `EnemyBatchRenderer` capacity 520 per kind×tier bucket; `ProjectilePool` 2500. `VfxSystem` rewritten as a single dynamic `InstancedMesh` burst pool (4000) with shockwave meshes capped at 24 — no more one-Mesh-per-particle. Architecture: combat fire/hits/modifier side-effects moved to `src/combat/CombatSystem.ts` (with arc-chain depth cap); diagnostics built via `src/telemetry/buildDiagnostics.ts`. Dual renderer skeleton: `src/core/RenderBackend.ts` defaults to WebGL2 (PostFx bloom); `?renderer=webgpu` dynamically imports `three/webgpu` WebGPURenderer when `navigator.gpu` exists (no EffectComposer). Diagnostics expose `backend`, `webgpuSupported`, `particles`.

**Verification** —
- `npx tsc --noEmit` PASS
- `npm run build` PASS (WebGPU chunk split; main path ~501 kB)
- `npx playwright test --project=desktop-chrome` PASS (bot + visual)

**Journey log** —
1. Static `import from 'three/webgpu'` bloated the main bundle to ~1.2 MB; switched to dynamic import so WebGL default stays lean.
2. Per-particle `Mesh` pool cannot reach 10k particles; InstancedMesh burst pool is the ceiling path.
3. CombatSystem extraction required an explicit `onPlayerProjectileHit` callback so hurt/death still owned by Game.
4. Arc-chain kill recursion needed `chainDepth` guard.

## [S1] Problem

V2 combat depth added rule modifiers and 500-target stress ambitions, but V1 still had: per-particle meshes, 200 projectile pool, 400 enemy batch capacity, all combat logic in a ~2k-line `Game.ts`, and WebGL-only rendering with no backend story.

## [S2] Design

### S2.1 Stress ceiling
- Stress queue targets ~450–500 chasers at mid waves.
- Instanced enemy capacity 520 per bucket.
- Projectile pool 2500.
- Flood burst 80 + player-ring dump 48.

### S2.2 Particles
- Dynamic InstancedMesh (capacity 4000) for bursts; color via `instanceColor`.
- Shockwaves remain ring meshes, max 24 concurrent.

### S2.3 Architecture
- `CombatSystem`: fire, pierce/hit-set resolution, EMP, arc (depth-capped), shield nova, dash blasts.
- `buildDiagnostics`: pure telemetry payload builder.
- `Game` remains orchestrator for waves, boss, upgrades, HUD, scene.

### S2.4 Render backend
- Default WebGL2 + PostFx.
- Opt-in WebGPU via query `?renderer=webgpu` + `navigator.gpu`; skips bloom.
- `backend` / `webgpuSupported` in diagnostics.

## [S3] Out of Scope

- Full TSL/compute GPU particles
- 100k particle Apocalypse mode UI
- Progression system file split
- Multi-seed balance harness
- Shipping WebGPU as default

## Tasks

- [x] T1: Stress/capacity/pool ceilings — acceptance: stress wave composition ≥~450 units; batch capacity ≥520; projectile pool ≥2500
- [x] T2: Instanced VfxSystem — acceptance: bursts render via InstancedMesh; shockwaves still readable
- [x] T3: CombatSystem + telemetry split — acceptance: Game delegates combat side-effects; tsc/build pass
- [x] T4: RenderBackend dual skeleton — acceptance: default WebGL2; `?renderer=webgpu` path exists; diagnostics report backend
