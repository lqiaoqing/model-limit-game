import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const outDir = process.argv[2] ?? 'artifacts/screens';
const url = process.argv[3] ?? 'http://127.0.0.1:5188';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader-webgl'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
page.on('console', (m) => {
  if (m.type() === 'error') console.error('CONSOLE', m.text());
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 20, null, {
  timeout: 15000,
});

async function shot(name, state) {
  if (state) {
    const ack = await page.evaluate((s) => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__;
      if (!hooks) return null;
      hooks.seed(42);
      hooks.setReducedMotion(true);
      hooks.hideDebugUi(true);
      return hooks.setState(s);
    }, state);
    console.log('state', name, ack);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  const diag = await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__);
  console.log(name, JSON.stringify(diag, null, 2));
}

await shot('01-active-play', 'active-play');
await page.waitForTimeout(2500);
await shot('02-after-combat');
await shot('03-complete', 'complete');
await shot('04-stress', 'stress');
await page.waitForTimeout(3500);
await shot('05-stress-late');

// Mobile
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await mobile.goto(url, { waitUntil: 'networkidle' });
await mobile.waitForFunction(() => (window.__THREE_GAME_DIAGNOSTICS__?.frame ?? 0) > 15, null, {
  timeout: 15000,
});
await mobile.evaluate(() => {
  window.__THREE_GAME_TEST_HOOKS__?.setState('active-play');
  window.__THREE_GAME_TEST_HOOKS__?.setReducedMotion(true);
  window.__THREE_GAME_TEST_HOOKS__?.hideDebugUi(true);
});
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: `${outDir}/06-mobile.png` });
console.log('mobile', await mobile.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__));

await browser.close();
console.log('done');
