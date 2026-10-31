/**
 * Boardwalk — 3D Scene Layout & Vectors
 *
 * Defines coordinate anchors, explode trajectory vectors, sub-assembly lifts,
 * and initial camera perspectives.
 */

import { PartId } from '../data/parts.ts';

export type Vector3Tuple = [number, number, number];

/**
 * Trajectory vector applied to each part group at 100% explode slider.
 * Tuned so no exploded part obstructs another part or callout disc.
 */
export const EXPLODE_VECTORS: Record<PartId, Vector3Tuple> = {
  motherboard: [0, -0.5, 0],
  cpu: [0, 1.1, -0.8],
  cooler: [0, 3.6, -0.8], // Lifts high above CPU socket to reveal IHS and socket latch
  ram: [2.3, 1.5, -1.2],
  gpu: [-0.6, 1.8, 1.8],
  ssd: [0.8, 1.3, 0.5],
  chipset: [2.3, 1.0, 1.7],
  vrm: [-2.0, 1.5, -2.4],
  power: [3.4, 1.1, -0.5],
  battery: [1.1, 1.0, 2.6],
  io: [-3.4, 1.2, -2.2],
  sata: [3.4, 0.9, 2.3]
};

/**
 * Secondary lifts applied to sub-assemblies inside parts at 100% explode.
 * Allows looking under heatsinks to see underlying chips and power chokes.
 */
export const SUBASSEMBLY_LIFTS = {
  coolerFan: [0, 1.1, 0] as Vector3Tuple,
  vrmHeatsink: [-0.5, 0.9, -0.5] as Vector3Tuple
};

/**
 * Anchor positions for callout pin discs in assembled (0% explode) coordinates.
 * The motherboard is explicitly placed at the front-left corner so its callout
 * does not collide with central socket components.
 */
export const ANCHOR_OVERRIDES: Partial<Record<PartId, Vector3Tuple>> = {
  motherboard: [-3.8, 0.12, 3.1],
  cpu: [-0.1, 0.35, -0.8],
  cooler: [0.1, 2.6, -0.8],
  ram: [2.8, 1.4, -1.2],
  gpu: [-0.8, 1.2, 1.9],
  ssd: [1.0, 0.3, 0.5],
  chipset: [2.7, 0.5, 1.7],
  vrm: [-2.4, 0.9, -2.3],
  power: [4.2, 0.8, -0.5],
  battery: [1.3, 0.35, 2.6],
  io: [-4.2, 1.1, -2.2],
  sata: [4.2, 0.5, 2.3]
};

export const HOME_CAMERA = {
  direction: [-0.38, 0.62, 0.8] as Vector3Tuple,
  target: [0, 0.4, 0.1] as Vector3Tuple,
  distance: 15.5,
  fov: 35
};
