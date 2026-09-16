import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class PostFx {
  private composer: EffectComposer | null = null;
  private bloom: UnrealBloomPass | null = null;
  enabled = true;

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
  ) {
    this.setup();
  }

  private setup(): void {
    try {
      const composer = new EffectComposer(this.renderer);
      composer.addPass(new RenderPass(this.scene, this.camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.5, 0.82);
      composer.addPass(bloom);
      composer.addPass(new OutputPass());
      this.composer = composer;
      this.bloom = bloom;
    } catch {
      this.composer = null;
      this.bloom = null;
      this.enabled = false;
    }
  }

  setSize(width: number, height: number, dpr: number): void {
    this.composer?.setPixelRatio(dpr);
    this.composer?.setSize(width, height);
    this.bloom?.setSize(width, height);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setLowPower(low: boolean): void {
    if (!this.bloom) return;
    this.bloom.strength = low ? 0.18 : 0.38;
    this.bloom.radius = low ? 0.25 : 0.55;
  }

  render(): boolean {
    if (!this.enabled || !this.composer) return false;
    this.composer.render();
    return true;
  }

  dispose(): void {
    this.composer?.dispose();
    this.bloom?.dispose();
    this.composer = null;
    this.bloom = null;
  }
}
