# Level / Wave Plan

## Spatial format
Fixed sci-fi arena (≈ 28×18 units), top-down-ish chase camera, full arena readable.

## Camera
Offset (0, 12, 11), look slightly ahead of player. Trauma shake on hit/kill/boss.

## First 60 seconds
1. Player center, 3 chasers from edges
2. Pickup shield cell near a corner
3. Wave 2 adds ranged
4. Cover blocks already present for early kiting

## Escalation (per wave)
- +1–2 enemies, mix shifts toward ranged/elite
- Every 5 waves: **Boss** (high HP, burst attacks, summons)
- Cover durability drains over waves (environment gets harsher)

## Telegraphs
- Chaser: speed-up flash before lunge
- Ranged: charge glow 0.4s before shot
- Elite: ground ring warning
- Boss: full-width banner + arena darken

## Recovery beats
- 2.5s inter-wave pause with shield trickle
- Heat decay always on; pickups spawn on elite/boss death

## Modular / parameterized
Wave tables in `WaveDirector`; enemy stats object; stress mode multiplies cap.

## Performance budgets (desktop target 60fps)
| Metric | Budget |
|---|---|
| Draw calls | < 180 typical, < 400 stress |
| Triangles | < 250k typical, < 600k stress |
| Enemies | ≤ 28 active, stress mode ≤ 200 |
| Projectiles | pooled, ≤ 120 live |
| DPR | capped at 2 |
