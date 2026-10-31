/**
 * Boardwalk — Networking Pack 3D Procedural Builder
 *
 * Constructs 6 procedural network devices: Laptop, Switch, Router,
 * DNS Server, Firewall, and Web Server, connected by realistic network cables.
 */

import * as THREE from 'three';
import { BuiltPart, SceneBuildResult } from '../types.ts';

function createMaterial(
  color: THREE.ColorRepresentation,
  roughness = 0.5,
  metalness = 0.1,
  extra?: Partial<THREE.MeshStandardMaterialParameters>
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    ...extra
  });
}

function makeBox(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  castShadow = true,
  receiveShadow = true
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  return mesh;
}

function makeCyl(
  rTop: number,
  rBot: number,
  h: number,
  segs: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  castShadow = true,
  receiveShadow = true
): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(rTop, rBot, h, segs);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  return mesh;
}

function createLaptopScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#17201c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2a342f';
  ctx.fillRect(0, 0, canvas.width, 38);

  ctx.fillStyle = '#d2ded7';
  ctx.fillRect(60, 8, 380, 22);
  ctx.fillStyle = '#17201c';
  ctx.font = '13px monospace';
  ctx.fillText('https://boardwalk.dev', 70, 24);

  ctx.fillStyle = '#3fae66';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Boardwalk Network Lab', 30, 80);

  ctx.fillStyle = '#b9c5bd';
  ctx.font = '15px monospace';
  ctx.fillText('> DNS request dispatched...', 30, 120);
  ctx.fillText('> Routing through local gateway...', 30, 150);
  ctx.fillText('> Waiting for HTTPS response...', 30, 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function buildNetworkingPack(): SceneBuildResult {
  const parts: Record<string, BuiltPart> = {};

  // 1. Laptop (Client) at [-3.2, 0, 1.8]
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_laptop';

    const metalMat = createMaterial('#31383e', 0.4, 0.7);
    const keyMat = createMaterial('#191c1e', 0.6, 0.1);
    mats.push(metalMat, keyMat);

    // Laptop bottom chassis
    const base = makeBox(1.5, 0.08, 1.1, metalMat, -3.2, 0.04, 1.8);
    group.add(base);
    pickables.push(base);

    // Keyboard & trackpad
    const keyboard = makeBox(1.3, 0.02, 0.55, keyMat, -3.2, 0.09, 1.62);
    const trackpad = makeBox(0.48, 0.02, 0.32, metalMat, -3.2, 0.09, 2.15);
    group.add(keyboard, trackpad);

    // Screen lid angled upward
    const screenMat = new THREE.MeshStandardMaterial({
      map: createLaptopScreenTexture(),
      roughness: 0.3,
      metalness: 0.2
    });
    mats.push(screenMat);

    const lid = makeBox(1.5, 1.0, 0.04, metalMat, 0, 0.5, 0);
    const display = makeBox(1.4, 0.9, 0.02, screenMat, 0, 0.5, 0.02);

    const screenGroup = new THREE.Group();
    screenGroup.position.set(-3.2, 0.08, 1.3);
    screenGroup.rotation.x = 0.25;
    screenGroup.add(lid, display);
    group.add(screenGroup);
    pickables.push(lid);

    parts.laptop = { id: 'laptop', group, materials: mats, pickableMeshes: pickables };
  }

  // 2. Network Switch at [-1.2, 0, 1.8]
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_switch';

    const chassisMat = createMaterial('#252b30', 0.5, 0.5);
    const portMat = createMaterial('#111315', 0.7, 0.1);
    const ledMat = createMaterial('#3fae66', 0.2, 0.1, {
      emissive: new THREE.Color(0x3fae66),
      emissiveIntensity: 0.8
    });
    mats.push(chassisMat, portMat, ledMat);

    const chassis = makeBox(1.6, 0.35, 1.0, chassisMat, -1.2, 0.18, 1.8);
    group.add(chassis);
    pickables.push(chassis);

    // 8 front Ethernet RJ-45 ports
    for (let i = 0; i < 8; i++) {
      const px = -1.8 + i * 0.17;
      const port = makeBox(0.12, 0.12, 0.08, portMat, px + 0.6, 0.18, 2.31);
      const led = makeBox(0.04, 0.04, 0.02, ledMat, px + 0.6, 0.28, 2.31);
      group.add(port, led);
    }

    parts.switch = { id: 'switch', group, materials: mats, pickableMeshes: pickables };
  }

  // 3. Wi-Fi Router at [1.2, 0, 1.8]
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_router';

    const routerMat = createMaterial('#1e2327', 0.4, 0.3);
    const antMat = createMaterial('#151719', 0.6, 0.2);
    const ledMat = createMaterial('#f1c232', 0.2, 0.1, {
      emissive: new THREE.Color(0xf1c232),
      emissiveIntensity: 0.9
    });
    mats.push(routerMat, antMat, ledMat);

    // Bevelled router body
    const body = makeBox(1.4, 0.28, 1.1, routerMat, 1.2, 0.14, 1.8);
    group.add(body);
    pickables.push(body);

    // Front activity LED strip
    for (let l = 0; l < 4; l++) {
      const led = makeBox(0.06, 0.04, 0.02, ledMat, 0.9 + l * 0.2, 0.14, 2.36);
      group.add(led);
    }

    // Dual external wireless antennas
    const ant1 = makeCyl(0.035, 0.035, 0.95, 12, antMat, 0.7, 0.6, 1.35);
    const ant2 = makeCyl(0.035, 0.035, 0.95, 12, antMat, 1.7, 0.6, 1.35);
    ant1.rotation.z = -0.08;
    ant2.rotation.z = 0.08;
    group.add(ant1, ant2);

    parts.router = { id: 'router', group, materials: mats, pickableMeshes: pickables };
  }

  // 4. DNS Server at [3.2, 0, -1.5]
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_dns';

    const serverMat = createMaterial('#2b3238', 0.45, 0.6);
    const panelMat = createMaterial('#1d2124', 0.6, 0.2);
    const blueLedMat = createMaterial('#2f80ed', 0.2, 0.1, {
      emissive: new THREE.Color(0x2f80ed),
      emissiveIntensity: 0.9
    });
    mats.push(serverMat, panelMat, blueLedMat);

    // Tower chassis
    const tower = makeBox(1.1, 2.1, 1.6, serverMat, 3.2, 1.05, -1.5);
    group.add(tower);
    pickables.push(tower);

    // Front drive caddy bays and intake grille
    for (let d = 0; d < 4; d++) {
      const caddy = makeBox(0.85, 0.22, 0.05, panelMat, 3.2, 1.45 - d * 0.3, -0.68);
      const led = makeBox(0.05, 0.05, 0.02, blueLedMat, 2.9, 1.45 - d * 0.3, -0.65);
      group.add(caddy, led);
    }

    parts.dns = { id: 'dns', group, materials: mats, pickableMeshes: pickables };
  }

  // 5. Firewall at [0.0, 0, -1.5]
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_firewall';

    const fwMat = createMaterial('#2a2f34', 0.4, 0.6);
    const redAccentMat = createMaterial('#b02f25', 0.3, 0.2);
    const portMat = createMaterial('#121517', 0.7, 0.1);
    mats.push(fwMat, redAccentMat, portMat);

    const chassis = makeBox(1.8, 0.42, 1.2, fwMat, 0.0, 0.21, -1.5);
    group.add(chassis);
    pickables.push(chassis);

    // Distinctive red security emblem strip on front bezel
    const redStripe = makeBox(1.75, 0.08, 0.04, redAccentMat, 0.0, 0.32, -0.88);
    group.add(redStripe);

    // Front status ports
    for (let p = 0; p < 6; p++) {
      const port = makeBox(0.14, 0.12, 0.04, portMat, -0.5 + p * 0.2, 0.16, -0.88);
      group.add(port);
    }

    parts.firewall = { id: 'firewall', group, materials: mats, pickableMeshes: pickables };
  }

  // 6. Web Server at [-3.0, 0, -1.5]
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_webserver';

    const serverMat = createMaterial('#252b31', 0.4, 0.65);
    const bayMat = createMaterial('#161a1d', 0.5, 0.1);
    const ledMat = createMaterial('#3fae66', 0.2, 0.1, {
      emissive: new THREE.Color(0x3fae66),
      emissiveIntensity: 0.85
    });
    mats.push(serverMat, bayMat, ledMat);

    // 2U rack server body
    const body = makeBox(2.2, 0.65, 1.8, serverMat, -3.0, 0.33, -1.5);
    group.add(body);
    pickables.push(body);

    // Front drive bays (2 rows of 6)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        const bx = -3.8 + c * 0.32;
        const by = 0.22 + r * 0.22;
        const bay = makeBox(0.26, 0.16, 0.04, bayMat, bx, by, -0.58);
        const led = makeBox(0.04, 0.04, 0.02, ledMat, bx + 0.09, by, -0.55);
        group.add(bay, led);
      }
    }

    parts.webserver = { id: 'webserver', group, materials: mats, pickableMeshes: pickables };
  }

  return { parts };
}
