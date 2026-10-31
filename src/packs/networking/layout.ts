/**
 * Boardwalk — Networking Pack 3D Layout & Cable Routes
 */

import * as THREE from 'three';
import { DataFlowRoute } from '../types.ts';

export type Vector3Tuple = [number, number, number];

export const NETWORKING_EXPLODE_VECTORS: Record<string, Vector3Tuple> = {
  laptop: [-1.2, 0.8, 0.8],
  switch: [-0.4, 0.9, 0.8],
  router: [0.6, 1.0, 0.8],
  dns: [1.4, 1.0, -0.8],
  firewall: [0.0, 1.2, -0.8],
  webserver: [-1.4, 1.1, -0.8]
};

export const NETWORKING_ANCHORS: Partial<Record<string, Vector3Tuple>> = {
  laptop: [-3.2, 0.9, 1.8],
  switch: [-1.2, 0.45, 1.8],
  router: [1.2, 0.65, 1.8],
  dns: [3.2, 1.3, -1.5],
  firewall: [0.0, 0.65, -1.5],
  webserver: [-3.0, 0.9, -1.5]
};

export const NETWORKING_HOME = {
  direction: [0.0, 0.72, 0.88] as Vector3Tuple,
  target: [0, 0.2, 0.1] as Vector3Tuple,
  distance: 14.5,
  fov: 38
};

export function createNetworkingDataFlowRoutes(): DataFlowRoute[] {
  return [
    {
      id: 'laptop-switch',
      label: 'Local frame · 802.3 Ethernet',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.6, 0.04, 1.8),
        new THREE.Vector3(-1.9, 0.04, 1.8),
        new THREE.Vector3(-1.5, 0.04, 1.8)
      ]),
      pulseCount: 5,
      startIndex: 0
    },
    {
      id: 'switch-router',
      label: 'LAN uplink · IP packet',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.9, 0.04, 1.8),
        new THREE.Vector3(0.1, 0.04, 1.8),
        new THREE.Vector3(0.8, 0.04, 1.8)
      ]),
      pulseCount: 5,
      startIndex: 5
    },
    {
      id: 'router-dns',
      label: 'DNS query · UDP 53',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.3, 0.04, 1.5),
        new THREE.Vector3(2.4, 0.04, 0.4),
        new THREE.Vector3(3.0, 0.04, -1.1)
      ]),
      pulseCount: 6,
      startIndex: 10
    },
    {
      id: 'router-firewall',
      label: 'Internet gateway · TCP SYN',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.0, 0.04, 1.5),
        new THREE.Vector3(0.5, 0.04, 0.2),
        new THREE.Vector3(0.1, 0.04, -1.1)
      ]),
      pulseCount: 6,
      startIndex: 16
    },
    {
      id: 'firewall-webserver',
      label: 'HTTPS traffic · TLS 1.3',
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.5, 0.04, -1.5),
        new THREE.Vector3(-1.6, 0.04, -1.5),
        new THREE.Vector3(-2.4, 0.04, -1.5)
      ]),
      pulseCount: 6,
      startIndex: 22
    }
  ];
}
