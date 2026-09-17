import * as THREE from 'three';
import { createRenderBackend, resizeBackend, type RenderBackend } from './RenderBackend';

/** Legacy WebGL-only helpers — prefer RenderBackend for dual-path setup. */
export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const backend = createRenderBackend(canvas);
  if (backend.kind !== 'webgl2') {
    throw new Error('createRenderer expects the WebGL2 backend');
  }
  return backend.renderer as THREE.WebGLRenderer;
}

export function resizeRenderer(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  maxDpr = 2,
): boolean {
  const backend: RenderBackend = {
    kind: 'webgl2',
    renderer,
    webgpuSupported: false,
    supportsWebGlPost: true,
  };
  return resizeBackend(backend, camera, maxDpr);
}
