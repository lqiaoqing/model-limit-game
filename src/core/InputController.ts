import * as THREE from 'three';

export type InputFrame = {
  move: THREE.Vector2;
  aim: THREE.Vector2;
  fireHeld: boolean;
  dashPressed: boolean;
  ultPressed: boolean;
  pausePressed: boolean;
  restartPressed: boolean;
  /** 0/1/2 when Digit1/2/3 pressed this frame; -1 otherwise. */
  upgradeChoice: number;
  /** 0/1/2 when Digit1/2/3 pressed this frame for weapon swap (play mode). */
  weaponChoice: number;
};

type PointerState = {
  active: boolean;
  id: number | null;
  centerX: number;
  centerY: number;
  radius: number;
};

export class InputController {
  private readonly keys = new Set<string>();
  private readonly stickVector = new THREE.Vector2();
  private readonly aimVector = new THREE.Vector2(0, -1);
  private readonly pointerState: PointerState = {
    active: false,
    id: null,
    centerX: 0,
    centerY: 0,
    radius: 1,
  };

  private dashQueued = false;
  private ultQueued = false;
  private pauseQueued = false;
  private restartQueued = false;
  private upgradeQueued = -1;
  private weaponQueued = -1;
  private fireHeld = false;
  private pointerAimActive = false;
  private readonly raycaster = new THREE.Raycaster();
  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly ndc = new THREE.Vector2();
  private readonly hitPoint = new THREE.Vector3();

  private readonly onKeyDown = (event: KeyboardEvent) => {
    this.keys.add(event.code);
    if (event.code === 'Space' || event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.dashQueued = true;
    }
    if (event.code === 'KeyQ') this.ultQueued = true;
    if (event.code === 'KeyP' || event.code === 'Escape') this.pauseQueued = true;
    if (event.code === 'KeyR') this.restartQueued = true;
    if (event.code === 'Digit1' || event.code === 'Numpad1') {
      if (!event.repeat) {
        this.upgradeQueued = 0;
        this.weaponQueued = 0;
      }
    }
    if (event.code === 'Digit2' || event.code === 'Numpad2') {
      if (!event.repeat) {
        this.upgradeQueued = 1;
        this.weaponQueued = 1;
      }
    }
    if (event.code === 'Digit3' || event.code === 'Numpad3') {
      if (!event.repeat) {
        this.upgradeQueued = 2;
        this.weaponQueued = 2;
      }
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code);
  };

  private readonly onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) this.fireHeld = true;
    this.updateAimFromPointer(event.clientX, event.clientY);
  };

  private readonly onPointerUp = (event: PointerEvent) => {
    if (event.button === 0) this.fireHeld = false;
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    this.updateAimFromPointer(event.clientX, event.clientY);
  };

  private readonly onStickDown = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = this.stick.getBoundingClientRect();
    this.pointerState.active = true;
    this.pointerState.id = event.pointerId;
    this.pointerState.centerX = rect.left + rect.width / 2;
    this.pointerState.centerY = rect.top + rect.height / 2;
    this.pointerState.radius = rect.width * 0.42;
    try {
      this.stick.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic events may not capture.
    }
    this.updateStick(event.clientX, event.clientY);
  };

  private readonly onStickMove = (event: PointerEvent) => {
    if (!this.pointerState.active || event.pointerId !== this.pointerState.id) return;
    event.preventDefault();
    this.updateStick(event.clientX, event.clientY);
  };

  private readonly onStickUp = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerState.id) return;
    event.preventDefault();
    this.pointerState.active = false;
    this.pointerState.id = null;
    this.stickVector.set(0, 0);
    this.updateKnob();
  };

  private readonly onDashDown = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.dashQueued = true;
  };

  private readonly onUltDown = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.ultQueued = true;
  };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly stick: HTMLElement,
    private readonly knob: HTMLElement,
    private readonly dashButton: HTMLElement,
    private readonly ultButton: HTMLElement,
    private readonly camera: THREE.PerspectiveCamera,
  ) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('pointermove', this.onPointerMove);

    this.stick.addEventListener('pointerdown', this.onStickDown);
    this.stick.addEventListener('pointermove', this.onStickMove);
    this.stick.addEventListener('pointerup', this.onStickUp);
    this.stick.addEventListener('pointercancel', this.onStickUp);

    this.dashButton.addEventListener('pointerdown', this.onDashDown);
    this.ultButton.addEventListener('pointerdown', this.onUltDown);
  }

  read(frame: InputFrame): InputFrame {
    const move = frame.move.set(0, 0);
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) move.x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) move.x += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) move.y -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) move.y += 1;
    move.add(this.stickVector);
    if (move.lengthSq() > 1) move.normalize();

    // Touch: auto-fire when stick is active; desktop: mouse hold.
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    frame.fireHeld = this.fireHeld || (coarse && this.stickVector.lengthSq() > 0.04);
    frame.aim.copy(this.aimVector);
    frame.dashPressed = this.dashQueued;
    frame.ultPressed = this.ultQueued;
    frame.pausePressed = this.pauseQueued;
    frame.restartPressed = this.restartQueued;
    frame.upgradeChoice = this.upgradeQueued;
    frame.weaponChoice = this.weaponQueued;

    this.dashQueued = false;
    this.ultQueued = false;
    this.pauseQueued = false;
    this.restartQueued = false;
    this.upgradeQueued = -1;
    this.weaponQueued = -1;
    return frame;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.stick.removeEventListener('pointerdown', this.onStickDown);
    this.stick.removeEventListener('pointermove', this.onStickMove);
    this.stick.removeEventListener('pointerup', this.onStickUp);
    this.stick.removeEventListener('pointercancel', this.onStickUp);
    this.dashButton.removeEventListener('pointerdown', this.onDashDown);
    this.ultButton.removeEventListener('pointerdown', this.onUltDown);
  }

  private updateStick(clientX: number, clientY: number): void {
    const dx = clientX - this.pointerState.centerX;
    const dy = clientY - this.pointerState.centerY;
    this.stickVector.set(dx / this.pointerState.radius, dy / this.pointerState.radius);
    if (this.stickVector.lengthSq() > 1) this.stickVector.normalize();
    this.updateKnob();
  }

  private updateKnob(): void {
    const distance = 38;
    this.knob.style.transform = `translate(calc(-50% + ${this.stickVector.x * distance}px), calc(-50% + ${this.stickVector.y * distance}px))`;
  }

  private updateAimFromPointer(clientX: number, clientY: number): void {
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
    );
    this.raycaster.setFromCamera(this.ndc, this.camera);
    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.hitPoint)) {
      this.pointerAimActive = true;
    }
  }

  /** Called by Game each frame with player world position. */
  computeAim(playerPos: THREE.Vector3, out: THREE.Vector2): void {
    if (this.pointerAimActive) {
      out.set(this.hitPoint.x - playerPos.x, this.hitPoint.z - playerPos.z);
      if (out.lengthSq() > 0.0004) {
        out.normalize();
        this.aimVector.copy(out);
        return;
      }
    }
    if (this.stickVector.lengthSq() > 0.08) {
      out.copy(this.stickVector).normalize();
      this.aimVector.copy(out);
      return;
    }
    out.copy(this.aimVector);
  }
}
