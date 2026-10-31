/**
 * Boardwalk — PC Hardware Pack 3D Layout & Vectors
 */

import * as THREE from 'three';
import { DataFlowRoute } from '../types.ts';

export type Vector3Tuple = [number, number, number];

export const HARDWARE_EXPLODE_VECTORS: Record<string, Vector3Tuple> = {
  motherboard: [0, -0.5, 0],
  cpu: [0, 1.1, -0.8],
  cooler: [0, 3.6, -0.8],
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

export const HARDWARE_SUBASSEMBLY_LIFTS: Record<string, Vector3Tuple> = {
  coolerFan: [0, 1.1, 0],
  vrmHeatsink: [-0.5, 0.9, -0.5]
};

export const HARDWARE_ANCHORS: Partial<Record<string, Vector3Tuple>> = {
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

export const HARDWARE_HOME = {
  direction: [-0.38, 0.62, 0.8] as Vector3Tuple,
  target: [0, 0.3, 0.1] as Vector3Tuple,
  distance: 13.5,
  fov: 35
};

export function createHardwareDataFlowRoutes(): DataFlowRoute[] {
  return [
    {
      id: 'ssd-cpu',
      label: 'PCIe lanes · file data',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.1, 0.045, 0.4),
        new THREE.Vector3(0.5, 0.045, 0.4),
        new THREE.Vector3(0.5, 0.045, -0.3),
        new THREE.Vector3(0.0, 0.045, -0.6)
      ]),
      pulseCount: 7,
      startIndex: 0
    },
    {
      id: 'cpu-ram',
      label: 'Memory bus · instructions',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.8, 0.045, -0.8),
        new THREE.Vector3(1.5, 0.045, -0.8),
        new THREE.Vector3(2.2, 0.045, -0.8)
      ]),
      pulseCount: 7,
      startIndex: 7
    },
    {
      id: 'cpu-gpu',
      label: 'PCIe x16 bus · frame data',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.3, 0.045, -0.3),
        new THREE.Vector3(-0.8, 0.045, 0.2),
        new THREE.Vector3(-0.8, 0.045, 1.3)
      ]),
      pulseCount: 7,
      startIndex: 14
    },
    {
      id: 'chipset-cpu',
      label: 'DMI link · peripheral signals',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.4, 0.045, 1.4),
        new THREE.Vector3(1.5, 0.045, 0.7),
        new THREE.Vector3(0.5, 0.045, 0.0),
        new THREE.Vector3(0.1, 0.045, -0.4)
      ]),
      pulseCount: 7,
      startIndex: 21
    }
  ];
}
