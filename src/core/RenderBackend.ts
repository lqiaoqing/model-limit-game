import * as THREE from 'three';

export type RenderBackendKind = 'webgl2' | 'webgpu';

export type RenderBackend = {
  kind: RenderBackendKind;
  /** WebGL path always available; WebGPU path skips EffectComposer bloom. */
  renderer: THREE.WebGLRenderer | THREE.WebGLRenderer;
  webgpuSupported: boolean;
  /** True when this backend can host the WebGL EffectComposer path. */
  supportsWebGlPost: boolean;
};

function webgpuAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && Boolean(navigator.gpu);
}

function createWebGl(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // Composer multi-pass would otherwise reset info every pass.
  renderer.info.autoReset = false;
  return renderer;
}

/**
 * Prefer WebGL2 for PostFx + broad compatibility.
 * Opt into WebGPU with `?renderer=webgpu` when `navigator.gpu` exists.
 * WebGPU path is a skeleton: direct render, no EffectComposer bloom.
 * `three/webgpu` is loaded dynamically so the default WebGL bundle stays small.
 */
export async function createRenderBackendAsync(
  canvas: HTMLCanvasElement,
): Promise<RenderBackend> {
  const webgpuSupported = webgpuAvailable();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('renderer');
  const preferWebGpu = requested === 'webgpu' || requested === 'webgpu-premium';

  if (preferWebGpu && webgpuSupported) {
    try {
      const { WebGPURenderer } = await import('three/webgpu');
      const renderer = new WebGPURenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.info.autoReset = false;
      return {
        kind: 'webgpu',
        renderer: renderer as unknown as THREE.WebGLRenderer,
        webgpuSupported,
        supportsWebGlPost: false,
      };
    } catch {
      // Fall through to WebGL2.
    }
  }

  return {
    kind: 'webgl2',
    renderer: createWebGl(canvas),
    webgpuSupported,
    supportsWebGlPost: true,
  };
}

/** Sync WebGL2 default (no `three/webgpu` import). */
export function createRenderBackend(canvas: HTMLCanvasElement): RenderBackend {
  return {
    kind: 'webgl2',
    renderer: createWebGl(canvas),
    webgpuSupported: webgpuAvailable(),
    supportsWebGlPost: true,
  };
}

/** Kick off async WebGPU device init when that backend was selected. */
export async function initRenderBackend(backend: RenderBackend): Promise<void> {
  if (backend.kind !== 'webgpu') return;
  const gpu = backend.renderer as unknown as { init?: () => Promise<void> };
  if (typeof gpu.init === 'function') {
    await gpu.init();
  }
}

export function resizeBackend(
  backend: RenderBackend,
  camera: THREE.PerspectiveCamera,
  maxDpr = 2,
): boolean {
  const renderer = backend.renderer;
  const canvas = renderer.domElement;
  const width = Math.max(1, Math.floor(canvas.clientWidth));
  const height = Math.max(1, Math.floor(canvas.clientHeight));
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const bufferWidth = Math.floor(width * dpr);
  const bufferHeight = Math.floor(height * dpr);
  const needsResize = canvas.width !== bufferWidth || canvas.height !== bufferHeight;

  if (needsResize) {
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  return needsResize;
}
