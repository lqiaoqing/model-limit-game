---
feature: v2-combat-depth
status: beta
updated: 2026-09-18
branch: feat/v2-content-completion
commits: 909fb64..HEAD
---

# V2 Combat Depth — Gameplay Beta

## Report

**What was built** — Neon Siege Arena **V2 Gameplay Beta**: 4 weapons (Plasma / Rail / Scatter / **Ion Launcher** with impact AoE); ~30 upgrades (**22 rule-changing**); 8 normal enemy archetypes + **7 tactical squad recipes** with post-spawn SquadController; **3 arena hazards** (laser gate / shock zone / overload core); **3 bosses** (TITAN-07, ORBITAL WARDEN, VOID ENGINE) via BossDirector; Wave **1–15** progression with unlock gates; combat telemetry breakdowns for balance harness.

**Explicit CombatBuild** kept: `global` + `perWeapon` + `modifiers` + pure `resolveWeaponStats`. Rule upgrades cannot leak across weapons (regression-tested).

**Verification** —
- `npm run build` PASS
- Playwright `desktop-chrome` **43/43 PASS** (bot, combat, content, upgrades, enemies, squads, hazards, bosses, progress, telemetry, visual)
- `npm run balance:full` PASS — 20 runs (5 seeds × 4 weapons); mean DPS 7.53; frameMs p50 ≈ 16.7–20
- Arena eval + compare refreshed under `arena/runs/` (evidence only; not used to retune gameplay)

**Journey log** —
1. `captureWeaponBonuses` reverse-engineering leaked weapon-affinity damage; replaced by explicit CombatBuild.
2. Director previously flattened squads to random edge spawns; SpawnTickets carry anchor/formation/delay; SquadController adds role/facetiming after spawn.
3. Boss logic left Game.ts — BossDefinitions + BossDirector own three identities.
4. Wave 1–15 gates audited: locked archetypes never appear early; boss tickets map wave→bossId.
5. Telemetry labels real DPS (damage/combatTime) and keeps kills/s separate.

## Definition checks

| Item | Status |
|---|---|
| 4 weapons + Ion AoE identity | done |
| ~28 upgrades / ≥16 rule-changing | 30 / 22 |
| ≥8 observable synergies | modifiers + telemetry |
| 8 normal archetypes | done |
| ≥7 tactical recipes | 7 |
| 3 hazards / 3 bosses × ≥3 phases | done |
| Wave 1–15 full cycle | audited |
| Core regressions | desktop suite green |
| build / test / balance:full | PASS |

V2.5 and V3 remain **prototype**.

## [S1] Problem

V1 Neon Siege Arena is a complete Premium Web 3D demo, but combat identity is still shallow:

- One auto-fire projectile; player never chooses a weapon.
- Retrofit upgrades are mostly stat stacks (`+damage`, `+fire rate`, `+shield`).
- Wave composition is fixed chaser/ranged/elite ratios inside `WaveDirector`.
- Boss is a high-HP enemy with a 3-way spread, not a multi-phase mechanic fight.

As a result, runs do not truly diverge, and the project does not yet stress the coupled systems the `model-limit-game` goal needs (weapons × rule modifiers × encounter pacing × boss phases).

## [S2] Design

Ship one coherent vertical slice expanded to **beta content depth**: **4 weapons + hybrid rule-modifier upgrade pool + EncounterDirector squads + SquadController + hazards + 3 bosses + Wave 1–15 gates**. Keep Stress flood, seed RNG, bot hooks, and mobile controls working.

### S2.1 Combat state model

Run-scoped combat build held by `Game`:

```ts
type WeaponId = 'plasma' | 'rail' | 'scatter' | 'launcher';
```

`PlayerStats` remains the numeric layer. Rule modifiers live in `CombatModifiers` and are consulted by combat resolution.

### S2.2 Weapons

| Id | Name | Behavior |
|---|---|---|
| `plasma` | Plasma Repeater | Fast single shot |
| `rail` | Railgun | Slow heavy, base pierce 2 |
| `scatter` | Scattergun | 5-pellet spread |
| `launcher` | Ion Launcher | Slow bolt → **radial impact blast** |

### S2.3 Hybrid upgrade pool

30 offers; rule modules cover plasma/rail/scatter/ion/global (expansion, aftershock, heat sink, emergency protocol, momentum core, hazard conductor, …).

### S2.4–S2.8 Content systems

Enemy archetypes, squad recipes, hazards, bosses, and wave gates are implemented under `src/systems/` (EnemyArchetypes, SquadController, ArenaHazardSystem, BossDefinitions/BossDirector, WaveProgression) rather than packed into `Game.ts`.

### S2.4 EncounterDirector

Threat budget `8 + wave * 3`; squads: Hunter Pack, Artillery Nest, Shield Wall, Assassin Strike, Suppression. Non-stress telegraph 0.55s. Stress flood path unchanged.

### S2.5 Multi-phase Boss — TITAN-07

Phases at HP ≤70% and ≤40%: Sweep (3-way fan + summons) → Lockdown (5-way + rings) → Overdrive (7-way + denser rings). Visible banners, kill-feed, emissive shift. Runtime resets when a new boss entity appears.

### S2.6 Input / HUD / feel

Weapon chips on HUD; diagnostics `weapon` / `modifiers` / `bossPhase` / weapon numeric stats.

### S2.7 Architecture boundary

New modules only: `src/combat/Weapons.ts`, `src/combat/CombatModifiers.ts`, `src/systems/EncounterDirector.ts`, `src/systems/BossPhases.ts`. `Game.ts` remains orchestrator.

## [S3] Out of Scope

- WebGPU / dual renderer backends
- 500+ enemies, Apocalypse mode
- 4th weapon, 8 enemy archetypes, 3 bosses, arena hazards
- Full automated balance harness / multi-seed win-rate report
- Deterministic replay, model-vs-model leaderboard
- Online multiplayer, accounts, narrative content

## Tasks

- [x] T1: Add `Weapons.ts` + `CombatModifiers.ts` and wire weapon switch (keys/HUD/diagnostics) — acceptance: in play mode, `1/2/3` swaps weapons; HUD chip reflects active weapon; diagnostics expose `weapon` (covers: S2.1, S2.2, S2.6)
- [x] T2: Implement per-weapon fire patterns (plasma single, rail pierce, scatter pellets) with projectile pierce/crit fields — acceptance: rail hits multiple lined-up enemies; scatter spawns 5 pellets; plasma remains continuous fire (covers: S2.2)
- [x] T3: Extend upgrade pool with 8 rule modules + affinity weighting; apply modifiers in kill/hit/heat/dash/shield paths — acceptance: at least Arc+Crit and Rail+Bore+Reactor change outcomes observably; offers still roll 3 cards (covers: S2.3)
- [x] T4: Add `EncounterDirector` squads + spawn telegraphs on non-stress waves; Stress flood unchanged — acceptance: wave ≥3 non-stress uses ≥1 squad recipe with visible telegraph; Stress still floods immediately (covers: S2.4)
- [x] T5: Implement TITAN-07 phase machine (3 phases) with visible transitions — acceptance: boss at wave 5 changes phase at 70% and 40% HP; phase banner/emissive change; adds spawn per phase table (covers: S2.5)
- [x] T6: HUD/feel/diagnostics wiring + keep bot playtest green — acceptance: `npm run build` passes; desktop bot playtest passes; mobile controls still function (covers: S2.6; depends: T1, T2, T3, T4, T5)
