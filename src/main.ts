import './styles.css';
import { Game } from './game/Game';
import { createRenderBackendAsync, initRenderBackend } from './core/RenderBackend';
import { applyStaticLocale } from './i18n';

applyStaticLocale();

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');

if (!canvas) {
  throw new Error('Missing #game-canvas element.');
}

const params = new URLSearchParams(window.location.search);
const wantWebGpu = params.get('renderer') === 'webgpu' || params.get('renderer') === 'webgpu-premium';

let game: Game;
if (wantWebGpu && typeof navigator !== 'undefined' && 'gpu' in navigator) {
  const backend = await createRenderBackendAsync(canvas);
  await initRenderBackend(backend);
  game = new Game(canvas, backend);
} else {
  game = new Game(canvas);
}

game.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.dispose();
  });
}
