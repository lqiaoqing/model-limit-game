import * as THREE from 'three';

export class CameraRig {
  private readonly desiredPosition = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();
  private readonly shake = new THREE.Vector3();
  private readonly baseOffset = new THREE.Vector3(0, 13.5, 12);

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  snapTo(target: THREE.Vector3): void {
    this.desiredPosition.copy(target).add(this.baseOffset);
    this.camera.position.copy(this.desiredPosition);
    this.lookTarget.copy(target).add(new THREE.Vector3(0, 0.4, 0));
    this.camera.lookAt(this.lookTarget);
  }

  update(
    delta: number,
    target: THREE.Vector3,
    lag: number,
    shakeOffset: THREE.Vector3,
  ): void {
    this.desiredPosition.copy(target).add(this.baseOffset).add(shakeOffset);
    const factor = 1 - Math.exp(-delta / Math.max(0.001, lag));
    this.camera.position.lerp(this.desiredPosition, factor);
    this.lookTarget.copy(target).add(new THREE.Vector3(0, 0.4, -1.0));
    this.camera.lookAt(this.lookTarget);
    this.shake.copy(shakeOffset);
  }

  applyFovPunch(amount: number, baseFov: number): void {
    this.camera.fov = baseFov + amount;
    this.camera.updateProjectionMatrix();
  }
}
