# Core Loop Contract

Player **aims and shoots** to **clear enemy waves** while **heat and incoming fire** create risk;
success grants **score + combo + drops**, failure causes **death and fast retry**.

## Clause proofs

| Clause | How it exists in code |
|---|---|
| verb = aim & shoot | Mouse/pointer aim + hold-to-fire; projectiles + hit feedback |
| objective visible | Wave counter, remaining enemies, boss HP bar |
| pressure in first minute | Chasers spawn immediately; ranged by wave 2 |
| reward changes state | Score, combo multiplier, heat sink / shield / ult charge pickups |
| failure teaches | Death screen with wave, score, peak combo; retry < 1 keypress |
| restart is fast | `R` or button resets run without reload |

## Systems that prove the loop
- WaveDirector: timed spawn, difficulty ramp, boss every 5 waves
- Heat: fire raises heat; overheat locks out until cool
- Dash: i-frames + speed burst, short CD
- Ultimate: charge from kills, Q to clear screen (damage pulse)
- Cover: destructible blocks block projectiles
