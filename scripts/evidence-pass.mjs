import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const outDir = 'artifacts/evidence-run';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader-webgl'],
});

const results = { errors: [], shots: [], metrics: {} };

async function capture(label, viewport, mobile = false, state = 'active-play', waitMs = 2000) {
  const page = await browser.newPage({
    viewport: { width: viewport.w, height: viewport.h },
    isMobile: mobile,
    hasTouch: mobile,
  });
  page.on('pageerror', (e) => results.errors.push(`${label}: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') results.errors.push(`${label} console: ${m.text()}`);
  });
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 15, null, {
    timeout: 20000,
  });
  await page.evaluate((s) => {
    window.__THREE_GAME_TEST_HOOKS__?.seed(42);
    if (s !== 'stress') window.__THREE_GAME_TEST_HOOKS__?.setReducedMotion(true);
    window.__THREE_GAME_TEST_HOOKS__?.hideDebugUi(true);
    return window.__THREE_GAME_TEST_HOOKS__?.setState(s);
  }, state);
  await page.waitForTimeout(waitMs);
  // Exercise a bit of input
  if (!mobile) {
    await page.mouse.move(viewport.w * 0.7, viewport.h * 0.4);
    await page.mouse.down();
    await page.waitForTimeout(600);
    await page.mouse.up();
  }
  const path = `${outDir}/${label}.png`;
  await page.screenshot({ path });
  const diag = await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__);
  results.shots.push({ label, path, diag });
  results.metrics[label] = diag;
  await page.close();
}

await capture('desktop-active-play', { w: 1280, h: 800 }, false, 'active-play', 2500);
await capture('desktop-stress', { w: 1280, h: 800 }, false, 'stress', 5000);
await capture('mobile-active-play', { w: 390, h: 844 }, true, 'active-play', 2000);

// Bot-ish playtest: hold fire and move
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (e) => results.errors.push(`bot: ${e.message}`));
await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 15, null, {
  timeout: 20000,
});
await page.evaluate(() => {
  window.__THREE_GAME_TEST_HOOKS__?.seed(99);
  window.__THREE_GAME_TEST_HOOKS__?.setState('active-play');
});
const samples = [];
for (let i = 0; i < 8; i += 1) {
  await page.keyboard.down('KeyW');
  await page.mouse.move(640 + (i % 3) * 40, 300);
  await page.mouse.down();
  await page.waitForTimeout(400);
  await page.mouse.up();
  await page.keyboard.up('KeyW');
  await page.keyboard.down('KeyD');
  await page.waitForTimeout(300);
  await page.keyboard.up('KeyD');
  const d = await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__);
  samples.push({
    t: i,
    frame: d?.frame,
    score: d?.score,
    enemies: d?.enemies,
    hp: d?.player.hp,
    x: d?.player.position.x,
    z: d?.player.position.z,
    calls: d?.renderer.calls,
    tris: d?.renderer.triangles,
    fps: d?.fps,
  });
}
results.botSamples = samples;
await page.screenshot({ path: `${outDir}/bot-after-input.png` });
await page.close();

await browser.close();
writeFileSync(`${outDir}/metrics.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ errors: results.errors, bot: results.botSamples, shots: results.shots.map((s) => s.label) }, null, 2));
