/**
 * Boardwalk — 3D Scene Layout & Camera Test Suite
 *
 * Validates:
 * 1. Explode vectors for all hardware and networking components.
 * 2. 3D callout anchor coordinates.
 * 3. Camera home framing presets and field-of-view settings.
 * 4. Subassembly explode offsets (e.g., cooler fans, VRM heatsinks).
 */

import { describe, expect, it } from 'vitest';
import {
  HARDWARE_ANCHORS,
  HARDWARE_EXPLODE_VECTORS,
  HARDWARE_HOME,
  HARDWARE_SUBASSEMBLY_LIFTS,
  Vector3Tuple
} from '../src/packs/hardware/layout.ts';
import {
  NETWORKING_ANCHORS,
  NETWORKING_EXPLODE_VECTORS,
  NETWORKING_HOME
} from '../src/packs/networking/layout.ts';
import { hardwarePack } from '../src/packs/hardware/index.ts';
import { networkingPack } from '../src/packs/networking/index.ts';

function isFiniteTuple(tuple: Vector3Tuple | undefined): boolean {
  if (!tuple || tuple.length !== 3) return false;
  return Number.isFinite(tuple[0]) && Number.isFinite(tuple[1]) && Number.isFinite(tuple[2]);
}

describe('3D Scene Layout & Camera Presets', () => {
  it('defines valid explode vectors for every hardware pack part', () => {
    for (const part of hardwarePack.parts) {
      const vec = HARDWARE_EXPLODE_VECTORS[part.id];
      expect(vec, `Hardware part "${part.id}" missing explode vector`).toBeDefined();
      expect(isFiniteTuple(vec), `Explode vector for "${part.id}" must contain finite coordinates`).toBe(true);
    }
  });

  it('defines valid callout anchors for every hardware pack part', () => {
    for (const part of hardwarePack.parts) {
      const anchor = HARDWARE_ANCHORS[part.id];
      expect(anchor, `Hardware part "${part.id}" missing 3D callout anchor`).toBeDefined();
      expect(isFiniteTuple(anchor), `Anchor for "${part.id}" must contain finite coordinates`).toBe(true);
    }
  });

  it('defines valid explode vectors for every networking pack part', () => {
    for (const part of networkingPack.parts) {
      const vec = NETWORKING_EXPLODE_VECTORS[part.id];
      expect(vec, `Networking part "${part.id}" missing explode vector`).toBeDefined();
      expect(isFiniteTuple(vec), `Explode vector for "${part.id}" must contain finite coordinates`).toBe(true);
    }
  });

  it('defines valid callout anchors for every networking pack part', () => {
    for (const part of networkingPack.parts) {
      const anchor = NETWORKING_ANCHORS[part.id];
      expect(anchor, `Networking part "${part.id}" missing 3D callout anchor`).toBeDefined();
      expect(isFiniteTuple(anchor), `Anchor for "${part.id}" must contain finite coordinates`).toBe(true);
    }
  });

  it('defines valid camera home framing presets for both packs', () => {
    // Hardware home
    expect(isFiniteTuple(HARDWARE_HOME.direction)).toBe(true);
    expect(isFiniteTuple(HARDWARE_HOME.target)).toBe(true);
    expect(HARDWARE_HOME.distance).toBeGreaterThan(5);
    expect(HARDWARE_HOME.fov).toBeGreaterThan(15);
    expect(HARDWARE_HOME.fov).toBeLessThan(90);

    // Networking home
    expect(isFiniteTuple(NETWORKING_HOME.direction)).toBe(true);
    expect(isFiniteTuple(NETWORKING_HOME.target)).toBe(true);
    expect(NETWORKING_HOME.distance).toBeGreaterThan(5);
    expect(NETWORKING_HOME.fov).toBeGreaterThan(15);
    expect(NETWORKING_HOME.fov).toBeLessThan(90);
  });

  it('defines valid subassembly lifts for hardware components', () => {
    expect(isFiniteTuple(HARDWARE_SUBASSEMBLY_LIFTS.coolerFan)).toBe(true);
    expect(isFiniteTuple(HARDWARE_SUBASSEMBLY_LIFTS.vrmHeatsink)).toBe(true);
  });
});
