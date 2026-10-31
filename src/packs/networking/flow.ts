/**
 * Boardwalk — Computer Networking Packet Flow Definitions
 *
 * Implements step-by-step packet journey:
 * 1. Laptop -> Switch
 * 2. Switch -> Router
 * 3. Router -> DNS Server
 * 4. Router -> Firewall -> Web Server
 * 5. Web Server -> Laptop
 */

import * as THREE from 'three';
import { FlowStep } from '../types.ts';

export const NETWORKING_PACKET_FLOW_STEPS: FlowStep[] = [
  {
    stepNumber: 1,
    id: 'net-step-1',
    title: 'Client to Switch',
    caption: '1. Laptop sends local Ethernet frame to the switch.',
    activeParts: ['laptop', 'switch'],
    pulseColor: 0x14b8a6, // Teal
    badgeNumber: 1,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.6, 0.04, 1.8),
      new THREE.Vector3(-1.9, 0.04, 1.8),
      new THREE.Vector3(-1.4, 0.04, 1.8)
    ])
  },
  {
    stepNumber: 2,
    id: 'net-step-2',
    title: 'Switch to Router',
    caption: '2. Switch forwards frame to default gateway router.',
    activeParts: ['switch', 'router'],
    pulseColor: 0x14b8a6,
    badgeNumber: 2,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.04, 1.8),
      new THREE.Vector3(0.1, 0.04, 1.8),
      new THREE.Vector3(0.8, 0.04, 1.8)
    ])
  },
  {
    stepNumber: 3,
    id: 'net-step-3',
    title: 'Router to DNS',
    caption: '3. Router queries DNS resolver to resolve domain name.',
    activeParts: ['router', 'dns'],
    pulseColor: 0x14b8a6,
    badgeNumber: 3,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 0.04, 1.5),
      new THREE.Vector3(2.4, 0.04, 0.4),
      new THREE.Vector3(3.0, 0.04, -1.1)
    ])
  },
  {
    stepNumber: 4,
    id: 'net-step-4',
    title: 'Router to Server',
    caption: '4. Router sends HTTPS GET request through perimeter firewall.',
    activeParts: ['router', 'firewall', 'webserver'],
    pulseColor: 0x14b8a6,
    badgeNumber: 4,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.0, 0.04, 1.5),
      new THREE.Vector3(0.1, 0.04, -1.1),
      new THREE.Vector3(-2.4, 0.04, -1.5)
    ])
  },
  {
    stepNumber: 5,
    id: 'net-step-5',
    title: 'Server Response',
    caption: '5. Web server streams encrypted HTML response back to laptop.',
    activeParts: ['webserver', 'laptop'],
    pulseColor: 0x14b8a6,
    badgeNumber: 5,
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 0.04, -1.5),
      new THREE.Vector3(-2.8, 0.04, 0.2),
      new THREE.Vector3(-2.6, 0.04, 1.8)
    ])
  }
];
