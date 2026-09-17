---
feature: v2-combat-depth
status: delivered
updated: 2026-09-12
branch: feat/v2-combat-depth
commits: c2a25531141e941f544f71f906852836305dcd6f..418b642
---

# V2 Combat Depth Vertical Slice

## Report

**What was built** — Neon Siege Arena V2 combat-depth slice: three switchable weapons (Plasma Repeater / Railgun / Scattergun) with distinct fire profiles; a hybrid retrofit pool of ~16 modules including 8 rule-changers (Arc Capacitor, Overheat Cascade EMP, Critical Conductor, Rail Bore/Reactor, Scatter Choke, Dash Detonation, Shield Nova) with weapon-affinity weighting; EncounterDirector threat-budget squads layered on WaveDirector for non-Stress waves with longer spawn telegraphs; and TITAN-07 as a three-phase boss (Sweep / Lockdown / Overdrive) with fan densification, radial rings, and summoned adds. Weapon identity uses `weaponBonuses` deltas relative to the active weapon def so switching never corrupts stats. Pierce uses a per-projectile hit set; Rail Bore scales with already-landed hits. Diagnostics expose `weapon`, `modifiers`, `bossPhase`, and live weapon numeric stats.

**Verification** —
- `npx tsc --noEmit` PASS
- `npm run build` PASS
- `npx playwright test --project=desktop-chrome` PASS (bot-playtest + visual)
- mobile-safari: PRE-EXISTING missing WebKit browser on this machine
- `scripts/smoke-v2.mjs` PASS — plasma↔rail↔scatter round-trip preserves plasma 0.11/12/28/4.2

**Journey log** —
1. First `syncWeaponStats` used `DEFAULT_PLAYER_STATS` as baseline; plasma↔rail round-trip permanently applied the rail profile. Fixed with `captureWeaponBonuses` + active-weapon deltas.
2. Pierce nudge of `radius*1.4` still re-hit near-center bodies; replaced with projectile `hitSet` (no nudge).
3. `rail_bore` initially scaled with remaining pierce (first hit strongest). Corrected to `hitsLanded`.
4. Boss phase runtime persisted across bosses (wave 10+ spurious banner). Reset when `waves.boss` identity changes.
5. `Player.takeDamage` return type became `{hit, shieldBroke}` for Shield Nova; both player call sites updated.

## [S1] Problem

V1 Neon Siege Arena is a complete Premium Web 3D demo, but combat identity is still shallow:

- One auto-fire projectile; player never chooses a weapon.
- Retrofit upgrades are mostly stat stacks (`+damage`, `+fire rate`, `+shield`).
- Wave composition is fixed chaser/ranged/elite ratios inside `WaveDirector`.
- Boss is a high-HP enemy with a 3-way spread, not a multi-phase mechanic fight.

As a result, runs do not truly diverge, and the project does not yet stress the coupled systems the `model-limit-game` goal needs (weapons × rule modifiers × encounter pacing × boss phases).

## [S2] Design

Ship one coherent vertical slice: **3 weapons + hybrid rule-modifier upgrade pool + EncounterDirector squads layered on WaveDirector + one multi-phase Titan boss**. Keep Stress flood, seed RNG, bot hooks, and mobile controls working.

### S2.1 Combat state model

Introduce a run-scoped combat build held by `Game`:

```ts
type WeaponId = 'plasma' | 'rail' | 'scatter';

type CombatModifiers = {
  arcChain: number;
  overheatEmp: boolean;
  critConductor: boolean;
  railPierce: number;
  railHeatRefund: boolean;
  scatterCloseBonus: boolean;
  dashDetonation: boolean;
  shieldNova: boolean;
};
```

`PlayerStats` remains the numeric layer. Rule modifiers live in `CombatModifiers` and are consulted by combat resolution. Weapon switching stores retrofit deltas in `weaponBonuses { fireMul, speedMul, dmgBonus }` relative to the **active** `WEAPON_DEFS[id]`, never vs plasma defaults.

### S2.2 Weapons

| Id | Name | Behavior | Notes |
|---|---|---|---|
| `plasma` | Plasma Repeater | Fast single shot | Default; Arc / Overheat Cascade |
| `rail` | Railgun | Slow heavy, base pierce 2 | Bore / Heat Refund |
| `scatter` | Scattergun | 5-pellet spread | Close Bonus / Dash Detonation |

- Keys `1/2/3` select weapons in `play`; same keys pick upgrades in `upgrade` mode only.
- Mobile: tappable HUD chips.
- Projectiles carry `pierce`, `hitsLanded`, `hitSet`, `sourceWeapon`.

### S2.3 Hybrid upgrade pool

~16 offers. Stat comfort modules kept: overclock, thrusters, armor, shield_bank, coolant_loop, capacitor, dash_servos, mag_accel.

Rule modules: `arc_capacitor`, `overheat_cascade`, `critical_conductor`, `rail_bore`, `rail_reactor`, `scatter_choke`, `dash_detonation`, `shield_nova` with weapon affinity ×1.6 weight when matching active weapon.

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
