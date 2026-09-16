import * as THREE from 'three';
import type { Enemy, EnemyKind, EnemyFormTier } from '../entities/Enemy';
import { getEnemyAssets } from './EnemyAssets';

const BATCH_KINDS: EnemyKind[] = ['chaser', 'ranged', 'elite'];
const FORM_TIERS: EnemyFormTier[] = [0, 1, 2, 3];

type Batch = {
  shell: THREE.InstancedMesh;
  glow: THREE.InstancedMesh;
  foot: THREE.InstancedMesh;
  count: number;
};

/**
 * High-count enemies render as InstancedMesh per kind + form tier.
 * Boss stays a unique mesh group (single instance).
 */
export class EnemyBatchRenderer {
  private readonly batches = new Map<string, Batch>();
  private readonly dummy = new THREE.Object3D();
  private readonly color = new THREE.Color();

  constructor(
    private readonly scene: THREE.Scene,
    // Stress mode can push ~240 chasers (55+180 base, ~50% chaser ratio, +120 dump).
    // Anything past capacity is skipped by sync() and would fight invisibly.
    capacity = 400,
  ) {
    const perTier = Math.max(120, Math.ceil(capacity / 2));
    for (const kind of BATCH_KINDS) {
      for (const tier of FORM_TIERS) {
        const assets = getEnemyAssets(kind, tier);
        const shell = new THREE.InstancedMesh(assets.shellGeo, assets.shellMat, perTier);
        const glow = new THREE.InstancedMesh(assets.glowGeo, assets.glowMat, perTier);
        const foot = new THREE.InstancedMesh(assets.footGeo, assets.footMat, perTier);
        shell.castShadow = false;
        shell.receiveShadow = false;
        glow.castShadow = false;
        foot.castShadow = false;
        shell.frustumCulled = false;
        glow.frustumCulled = false;
        foot.frustumCulled = false;
        shell.count = 0;
        glow.count = 0;
        foot.count = 0;
        scene.add(shell, glow, foot);
        this.batches.set(`${kind}:${tier}`, { shell, glow, foot, count: 0 });
      }
    }
  }

  sync(enemies: Enemy[]): void {
    for (const batch of this.batches.values()) batch.count = 0;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (enemy.stats.kind === 'boss') {
        enemy.ensureBossVisual(this.scene);
        enemy.syncBossVisual();
        continue;
      }
      const batch = this.batches.get(`${enemy.stats.kind}:${enemy.formTier}`);
      if (!batch) continue;
      const idx = batch.count;
      if (idx >= batch.shell.instanceMatrix.count) continue;

      const pos = enemy.group.position;
      const yaw = enemy.group.rotation.y;
      const kindScale = enemy.stats.kind === 'elite' ? enemy.stats.scale : 1;
      const formScale = 1 + enemy.formTier * 0.04;
      const scale = kindScale * formScale;

      this.dummy.position.set(pos.x, pos.y, pos.z);
      this.dummy.rotation.set(0, yaw, 0);
      this.dummy.scale.setScalar(scale);
      this.dummy.updateMatrix();
      batch.shell.setMatrixAt(idx, this.dummy.matrix);
      batch.glow.setMatrixAt(idx, this.dummy.matrix);

      this.dummy.position.set(pos.x, 0.02, pos.z);
      this.dummy.rotation.set(-Math.PI / 2, 0, 0);
      this.dummy.scale.setScalar(1 + enemy.formTier * 0.06);
      this.dummy.updateMatrix();
      batch.foot.setMatrixAt(idx, this.dummy.matrix);

      // Telegraph flash via instance color on foot
      const flash = enemy.telegraphTimer > 0 ? 1 : 0.55 + enemy.formTier * 0.08;
      this.color.setRGB(flash, flash * 0.6, flash * 0.6);
      batch.foot.setColorAt(idx, this.color);

      batch.count += 1;
      enemy.hideLegacyVisual();
    }

    for (const batch of this.batches.values()) {
      batch.shell.count = batch.count;
      batch.glow.count = batch.count;
      batch.foot.count = batch.count;
      batch.shell.instanceMatrix.needsUpdate = true;
      batch.glow.instanceMatrix.needsUpdate = true;
      batch.foot.instanceMatrix.needsUpdate = true;
      if (batch.foot.instanceColor) batch.foot.instanceColor.needsUpdate = true;
      batch.shell.visible = batch.count > 0;
      batch.glow.visible = batch.count > 0;
      batch.foot.visible = batch.count > 0;
    }
  }

  dispose(): void {
    for (const batch of this.batches.values()) {
      this.scene.remove(batch.shell, batch.glow, batch.foot);
      batch.shell.dispose();
      batch.glow.dispose();
      batch.foot.dispose();
    }
    this.batches.clear();
  }
}
