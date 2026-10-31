/**
 * Boardwalk — PC Hardware "How it flows" Definitions
 *
 * Implements:
 * 1. Data flow: Storage -> RAM -> CPU -> GPU -> Display
 *    Numbered badges (1, 2, 3, 4, 5), glowing blue pulses, 1-step-at-a-time animation.
 * 2. Power flow: PSU -> Motherboard, CPU/VRM, GPU, Drives/Fans
 *    Amber pulses, voltage labels (+12V, +5V, +3.3V).
 */

import * as THREE from 'three';
import { FlowStep } from '../types.ts';

export const HARDWARE_DATA_FLOW_STEPS: FlowStep[] = [
  {
    stepNumber: 1,
    id: 'data-step-1',
    title: 'Storage to RAM',
    caption: '1. SSD streams program files into system RAM.',
    activeParts: ['ssd', 'ram'],
    pulseColor: 0x38bdf8, // Cyan / Sky Blue
    badgeNumber: 1,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.1, 0.06, 0.4),
      new THREE.Vector3(1.6, 0.06, 0.0),
      new THREE.Vector3(2.3, 0.06, -0.8)
    ])
  },
  {
    stepNumber: 2,
    id: 'data-step-2',
    title: 'RAM to CPU',
    caption: '2. CPU loads the program and data from RAM into cache.',
    activeParts: ['ram', 'cpu'],
    pulseColor: 0x38bdf8,
    badgeNumber: 2,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.3, 0.06, -0.8),
      new THREE.Vector3(1.4, 0.06, -0.8),
      new THREE.Vector3(0.1, 0.06, -0.8)
    ])
  },
  {
    stepNumber: 3,
    id: 'data-step-3',
    title: 'CPU to GPU',
    caption: '3. CPU dispatches 3D draw commands to GPU over PCIe.',
    activeParts: ['cpu', 'gpu'],
    pulseColor: 0x38bdf8,
    badgeNumber: 3,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.06, -0.5),
      new THREE.Vector3(-0.5, 0.06, 0.3),
      new THREE.Vector3(-0.8, 0.06, 1.4)
    ])
  },
  {
    stepNumber: 4,
    id: 'data-step-4',
    title: 'GPU to Display',
    caption: '4. GPU renders finished framebuffers out to the display.',
    activeParts: ['gpu', 'io'],
    pulseColor: 0x38bdf8,
    badgeNumber: 4,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.8, 0.06, 1.4),
      new THREE.Vector3(-2.2, 0.06, 0.0),
      new THREE.Vector3(-3.4, 0.06, -1.8)
    ])
  }
];

export const HARDWARE_POWER_FLOW_STEPS: FlowStep[] = [
  {
    stepNumber: 1,
    id: 'power-step-1',
    title: 'PSU to Motherboard',
    caption: '1. PSU feeds +12V, +5V, and +3.3V rails to motherboard logic.',
    activeParts: ['power', 'motherboard'],
    pulseColor: 0xf59e0b, // Amber
    voltageLabel: '+12V / +5V / +3.3V',
    badgeNumber: 1,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.8, 0.08, -0.5),
      new THREE.Vector3(2.5, 0.06, 0.0),
      new THREE.Vector3(0.0, 0.06, 0.0)
    ])
  },
  {
    stepNumber: 2,
    id: 'power-step-2',
    title: 'PSU to CPU & VRM',
    caption: '2. EPS 8-pin rail delivers clean +12V power to CPU VRM.',
    activeParts: ['power', 'vrm', 'cpu'],
    pulseColor: 0xf59e0b,
    voltageLabel: '+12V EPS',
    badgeNumber: 2,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.8, 0.08, -0.5),
      new THREE.Vector3(1.2, 0.06, -1.8),
      new THREE.Vector3(-1.8, 0.06, -2.0),
      new THREE.Vector3(-0.1, 0.06, -0.8)
    ])
  },
  {
    stepNumber: 3,
    id: 'power-step-3',
    title: 'PSU to GPU',
    caption: '3. Dedicated PCIe auxiliary cable sends high-current +12V to GPU.',
    activeParts: ['power', 'gpu'],
    pulseColor: 0xf59e0b,
    voltageLabel: '+12V PCIe',
    badgeNumber: 3,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.8, 0.08, -0.5),
      new THREE.Vector3(1.5, 0.06, 1.4),
      new THREE.Vector3(-0.4, 0.08, 1.6)
    ])
  },
  {
    stepNumber: 4,
    id: 'power-step-4',
    title: 'PSU to Drives & Cooling',
    caption: '4. SATA ribbon and fan headers supply +12V & +5V to drives and cooler.',
    activeParts: ['power', 'sata', 'ssd', 'cooler'],
    pulseColor: 0xf59e0b,
    voltageLabel: '+12V & +5V SATA',
    badgeNumber: 4,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.8, 0.08, -0.5),
      new THREE.Vector3(3.2, 0.06, 1.8),
      new THREE.Vector3(1.2, 0.06, 0.8)
    ])
  }
];
