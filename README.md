# Neon Siege Arena

Top-down Three.js arena survival shooter. Hover-mech vs infinite waves — dash, heat management, ult, and an optional **Stress** flood (100+ foes) for performance ceiling tests.

**Stack:** TypeScript · Vite · Three.js · fully procedural (no API keys, no paid assets)

---

## Quick start

Requirements: **Node.js 20+** and a modern browser.

```bash
npm install
npm run dev
```

Open **http://127.0.0.1:5188/**

| Action | Input |
|---|---|
| Move | WASD / arrows |
| Aim | Mouse |
| Fire | Hold LMB |
| Dash (i-frames) | Shift / Space |
| Ultimate | Q (when ring is full) |
| Pause | P |
| Restart | R |
| Pick retrofit | 1 / 2 / 3 (or click) after clearing a wave |
| Mobile | Left stick + DASH / ULT (auto-fire when stick moves) |

### Stress / Low Graphics

Press **P** to pause, then toggle:

- **极限压力 Stress** — immediate dense enemy flood (perf ceiling)
- **低画质 Low Graphics** — bloom off, DPR 1, shadows off

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production bundle → `dist/` |
| `npm run preview` | Serve production build |
| `npm run inspect:canvas` | Canvas pixel + render-budget inspection |
| `npm run test` | Playwright tests (desktop uses system Chrome via `channel: 'chrome'`) |

### Canvas inspector (optional)

```bash
# Real GPU (default when system Chrome is found)
node scripts/inspect-threejs-canvas.mjs \
  --url http://127.0.0.1:5188 --out artifacts/run --state active-play --seed 42 --run-id run

# Force software WebGL (for CI without GPU)
$env:FORCE_SW='1'   # PowerShell
FORCE_SW=1          # bash
```

On machines without Playwright Chromium, set `CHROME_PATH` to a local Chrome/Edge binary, or run `npx playwright install chromium`.

---

## What is **not** in git (and why)

| Path | Why ignored |
|---|---|
| `node_modules/` | Installed via `npm install` from `package-lock.json` — platform-specific, huge, regenerable |
| `dist/` | Output of `npm run build` — regenerable |
| `artifacts/screens*`, `artifacts/evidence-run/` | Local capture dumps — regenerate with scripts |

Kept in git: source, lockfile, design docs, scorecard, and key inspector reports (`gpu-1`, `premium-1`, …).

---

## Gameplay loop

Survive waves of chaser / ranged / elite enemies. Every 5th wave is a **boss**. Collect shield / coolant / repair / ult pickups (magnet + chain multiplier). Manage **heat** or lock out your gun. Dash for i-frames; ult clears the screen. Clear a wave to pick one of three **retrofit** modules — stacks both strengthen stats and evolve your mech frame (Scout → Striker → Assault → Siege). Enemies also **evolve** at waves 4 / 7 / 10 with larger silhouettes and tougher packs.

---

## Evidence / scorecard

See `artifacts/`:

- `scorecard-pass1.md` — visual scorecard (showcase ~2.80)
- `final-evidence.md` — latest performance notes
- `gpu-1/` — real-GPU inspector run (Intel UHD, 60 fps @ stress)

---

## License

Project code: use as you like for learning / demos. Three.js and other npm deps follow their own licenses.
