/**
 * Boardwalk — 3D Procedural Hardware Builder
 *
 * Constructs the motherboard and all 12 PC hardware parts using Three.js primitives,
 * procedural canvas textures, and instanced meshes for repetitive components
 * (cooler fins, surface-mount parts).
 *
 * Each part owns its own isolated material instances so selecting or isolating
 * a part never affects any other part.
 */

import * as THREE from 'three';
import { PartId } from '../data/parts.ts';

export interface BuiltPart {
  id: PartId;
  group: THREE.Group;
  materials: THREE.Material[];
  pickableMeshes: THREE.Mesh[];
  subAssemblies?: {
    coolerFan?: THREE.Group;
    vrmHeatsink?: THREE.Group;
  };
}

export interface SceneBuildResult {
  parts: Record<PartId, BuiltPart>;
  surfaceMountMesh: THREE.InstancedMesh;
}

/**
 * Creates an isolated copy of a MeshStandardMaterial for a specific part.
 */
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

/**
 * Helper to construct and place a box mesh.
 */
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

/**
 * Helper to construct and place a cylinder mesh.
 */
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

/**
 * Procedurally draws high-density PCB copper traces, gold test pads,
 * silk-screen labels, and circuit artwork onto an HTML5 canvas.
 */
function createBoardCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1638;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep matte PCB solder-mask green
  ctx.fillStyle = '#183327';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Multi-directional copper trace bus routing
  ctx.strokeStyle = 'rgba(126, 196, 156, 0.28)';
  ctx.lineWidth = 2.5;

  // Horizontal and angled trace bundles
  const yBands = [240, 480, 720, 960, 1200, 1400];
  for (const y of yBands) {
    for (let i = 0; i < 28; i++) {
      const traceY = y + i * 5;
      ctx.beginPath();
      ctx.moveTo(120, traceY);
      ctx.lineTo(600 + (i % 6) * 40, traceY);
      ctx.lineTo(760 + (i % 6) * 40, traceY + ((i % 2 === 0 ? 1 : -1) * 35));
      ctx.lineTo(1900, traceY + ((i % 2 === 0 ? 1 : -1) * 35));
      ctx.stroke();
    }
  }

  // Memory bus trace fanouts (DDR routing)
  ctx.strokeStyle = 'rgba(126, 196, 156, 0.35)';
  for (let i = 0; i < 36; i++) {
    const startX = 1300 + i * 14;
    ctx.beginPath();
    ctx.moveTo(startX, 180);
    ctx.lineTo(startX, 680);
    ctx.lineTo(startX - 90, 800);
    ctx.lineTo(startX - 90, 880);
    ctx.stroke();
  }

  // Gold test points and plated through-hole vias
  const seedRandom = (seed: number) => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  for (let i = 0; i < 600; i++) {
    const rx = seedRandom(i * 3 + 1) * (canvas.width - 200) + 100;
    const ry = seedRandom(i * 3 + 2) * (canvas.height - 200) + 100;
    ctx.fillStyle = i % 5 === 0 ? '#c9a85a' : 'rgba(126, 196, 156, 0.45)';
    ctx.beginPath();
    ctx.arc(rx, ry, i % 7 === 0 ? 3.5 : 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Silk-screen markings (white printed text and component boundaries)
  ctx.fillStyle = 'rgba(238, 244, 240, 0.75)';
  ctx.font = 'bold 24px monospace';

  // Board model and revision
  ctx.fillText('BOARDWALK Z790-WORKBENCH  REV 1.04', 320, 1540);
  ctx.fillText('DESIGNED FOR COMPUTER SCIENCE ARCHITECTURE', 320, 1575);

  // Sockets & headers labels
  ctx.font = 'bold 18px monospace';
  ctx.fillText('LGA1700_CPU_SOCKET', 780, 260);
  ctx.fillText('DIMM_A1 (64-BIT)', 1420, 150);
  ctx.fillText('DIMM_B1 (64-BIT)', 1580, 150);
  ctx.fillText('PCIEX16_GEN5 (PRIMARY GRAPHICS)', 420, 950);
  ctx.fillText('M.2_1 (PCIe 4.0 x4)', 960, 810);
  ctx.fillText('INTEL_Z790_PCH', 1440, 1260);
  ctx.fillText('ATX_PWR_24P', 1880, 520);
  ctx.fillText('SATA_6G 1-4', 1860, 1280);
  ctx.fillText('REAR_IO_INTERFACE', 100, 340);
  ctx.fillText('CLEAR_CMOS_CR2032', 1140, 1380);

  // Component outline frames
  ctx.strokeStyle = 'rgba(238, 244, 240, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(740, 310, 480, 480); // CPU socket border
  ctx.strokeRect(1400, 170, 70, 720); // DIMM 1 border
  ctx.strokeRect(1560, 170, 70, 720); // DIMM 2 border
  ctx.strokeRect(360, 980, 1280, 60); // PCIe slot border

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates the CPU heatspreader laser-etched text texture.
 */
function createCpuLidTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed nickel IHS metal tone
  ctx.fillStyle = '#b4b9bd';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Laser etched markings
  ctx.fillStyle = '#4a5156';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BOARDWALK', 256, 170);
  ctx.font = '600 22px sans-serif';
  ctx.fillText('CORE-X 3.80GHz', 256, 215);
  ctx.font = '16px monospace';
  ctx.fillText('SR-L29Q 16C / 24T', 256, 260);
  ctx.fillText('L249E820 MALAY', 256, 290);
  ctx.fillText('DIFFUSED IN USA', 256, 320);

  // Pin 1 orientation triangle in corner
  ctx.fillStyle = '#c9a85a';
  ctx.beginPath();
  ctx.moveTo(35, 477);
  ctx.lineTo(75, 477);
  ctx.lineTo(35, 437);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Builds the full motherboard and its 12 individual hardware assemblies.
 */
export function buildBoardScene(): SceneBuildResult {
  const parts: Partial<Record<PartId, BuiltPart>> = {};

  // --------------------------------------------------------------------------
  // 1. MOTHERBOARD
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_motherboard';

    const pcbMaterial = createMaterial('#193226', 0.65, 0.05);
    mats.push(pcbMaterial);

    // Main 10-layer PCB substrate (10 x 0.14 x 8 units, top surface at y=0)
    const pcb = makeBox(10, 0.14, 8, pcbMaterial, 0, -0.07, 0);
    group.add(pcb);
    pickables.push(pcb);

    // Decorative copper trace layer with polygonOffset to prevent z-fighting
    const boardTexture = createBoardCanvasTexture();
    const traceMaterial = new THREE.MeshStandardMaterial({
      map: boardTexture,
      roughness: 0.5,
      metalness: 0.2,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    mats.push(traceMaterial);

    const tracePlaneGeo = new THREE.PlaneGeometry(10, 8);
    const tracePlane = new THREE.Mesh(tracePlaneGeo, traceMaterial);
    tracePlane.rotation.x = -Math.PI / 2;
    tracePlane.position.set(0, 0.002, 0);
    tracePlane.receiveShadow = true;
    group.add(tracePlane);
    pickables.push(tracePlane);

    // Gold plated motherboard screw mounting holes in corners and edges
    const goldMat = createMaterial('#c9a85a', 0.25, 0.9);
    mats.push(goldMat);
    const holePositions: [number, number][] = [
      [-4.6, -3.6], [0, -3.6], [4.6, -3.6],
      [-4.6, 0], [4.6, 0],
      [-4.6, 3.6], [0, 3.6], [4.6, 3.6]
    ];
    for (const [hx, hz] of holePositions) {
      const ring = makeCyl(0.2, 0.2, 0.02, 16, goldMat, hx, 0.005, hz, false, true);
      const hole = makeCyl(0.1, 0.1, 0.2, 16, createMaterial('#111111', 0.9, 0), hx, 0, hz, false, false);
      group.add(ring, hole);
    }

    parts.motherboard = { id: 'motherboard', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 2. CENTRAL PROCESSOR (CPU)
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_cpu';

    // Socket frame
    const socketPlasticMat = createMaterial('#232527', 0.7, 0.1);
    mats.push(socketPlasticMat);
    const socketFrame = makeBox(2.2, 0.12, 2.2, socketPlasticMat, 0, 0.06, -0.8);
    group.add(socketFrame);
    pickables.push(socketFrame);

    // Metal retention bracket and lever
    const steelMat = createMaterial('#a2a8af', 0.25, 0.95);
    mats.push(steelMat);
    const bracket = makeBox(2.0, 0.04, 2.0, steelMat, 0, 0.13, -0.8);
    const lever = makeCyl(0.03, 0.03, 1.9, 12, steelMat, 1.15, 0.12, -0.8);
    lever.rotation.x = Math.PI / 2;
    group.add(bracket, lever);
    pickables.push(bracket);

    // CPU substrate PCB
    const cpuPcbMat = createMaterial('#153d2d', 0.5, 0.1);
    mats.push(cpuPcbMat);
    const cpuPcb = makeBox(1.5, 0.06, 1.5, cpuPcbMat, 0, 0.17, -0.8);
    group.add(cpuPcb);

    // CPU Integrated Heat Spreader (IHS) with custom laser etched text
    const cpuLidTexture = createCpuLidTexture();
    const ihsMat = new THREE.MeshStandardMaterial({
      map: cpuLidTexture,
      roughness: 0.28,
      metalness: 0.88
    });
    mats.push(ihsMat);
    const ihs = makeBox(1.3, 0.12, 1.3, ihsMat, 0, 0.24, -0.8);
    group.add(ihs);
    pickables.push(ihs);

    parts.cpu = { id: 'cpu', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 3. CPU COOLER
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_cooler';

    // Heavy copper contact base plate
    const copperMat = createMaterial('#b8703f', 0.22, 0.92);
    mats.push(copperMat);
    const basePlate = makeBox(1.6, 0.18, 1.6, copperMat, 0, 0.38, -0.8);
    group.add(basePlate);
    pickables.push(basePlate);

    // 4 sintered copper heat pipes rising into the fin stack
    const pipeOffset = 0.42;
    const pipePoints = [
      [-pipeOffset, -0.8 - pipeOffset],
      [pipeOffset, -0.8 - pipeOffset],
      [-pipeOffset, -0.8 + pipeOffset],
      [pipeOffset, -0.8 + pipeOffset]
    ];
    for (const [px, pz] of pipePoints) {
      const pipe = makeCyl(0.06, 0.06, 2.3, 12, copperMat, px, 1.5, pz);
      group.add(pipe);
    }

    // 26 stamped aluminium cooling fins as an InstancedMesh
    const finMat = createMaterial('#b7bcc2', 0.35, 0.82);
    mats.push(finMat);
    const finCount = 26;
    const finGeo = new THREE.BoxGeometry(2.3, 0.02, 2.0);
    const finInstMesh = new THREE.InstancedMesh(finGeo, finMat, finCount);
    finInstMesh.castShadow = true;
    finInstMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < finCount; i++) {
      dummy.position.set(0, 0.58 + i * 0.075, -0.8);
      dummy.updateMatrix();
      finInstMesh.setMatrixAt(i, dummy.matrix);
    }
    finInstMesh.instanceMatrix.needsUpdate = true;
    finInstMesh.computeBoundingSphere();
    group.add(finInstMesh);
    pickables.push(finInstMesh as unknown as THREE.Mesh);

    // Sub-assembly: fan with shroud and angled blades (travels further during explode)
    const fanGroup = new THREE.Group();
    fanGroup.name = 'subassembly_cooler_fan';

    const shroudMat = createMaterial('#1f2326', 0.65, 0.1);
    mats.push(shroudMat);
    const shroud = makeBox(2.35, 2.0, 0.35, shroudMat, 0, 1.5, 0.35);
    fanGroup.add(shroud);
    pickables.push(shroud);

    // Fan rotor hub and 7 angled blades
    const rotorMat = createMaterial('#181a1c', 0.5, 0.15);
    mats.push(rotorMat);
    const hub = makeCyl(0.42, 0.42, 0.25, 20, rotorMat, 0, 1.5, 0.42);
    hub.rotation.x = Math.PI / 2;
    fanGroup.add(hub);

    for (let b = 0; b < 7; b++) {
      const angle = (b / 7) * Math.PI * 2;
      const blade = makeBox(0.18, 0.52, 0.03, rotorMat, 0, 0, 0);
      blade.position.set(
        Math.cos(angle) * 0.55,
        1.5 + Math.sin(angle) * 0.55,
        0.44
      );
      blade.rotation.z = angle + 0.4;
      fanGroup.add(blade);
    }

    group.add(fanGroup);

    parts.cooler = {
      id: 'cooler',
      group,
      materials: mats,
      pickableMeshes: pickables,
      subAssemblies: { coolerFan: fanGroup }
    };
  }

  // --------------------------------------------------------------------------
  // 4. MEMORY (RAM)
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_ram';

    const slotMat = createMaterial('#181a1c', 0.7, 0.1);
    const latchMat = createMaterial('#e2e5e8', 0.4, 0.1);
    mats.push(slotMat, latchMat);

    // Two DIMM slots (channels A2 and B2)
    const dimmXPositions = [2.2, 2.7];
    for (const dx of dimmXPositions) {
      const slot = makeBox(0.24, 0.18, 4.4, slotMat, dx, 0.09, -0.8);
      const latch1 = makeBox(0.26, 0.28, 0.2, latchMat, dx, 0.15, -0.8 - 2.15);
      const latch2 = makeBox(0.26, 0.28, 0.2, latchMat, dx, 0.15, -0.8 + 2.15);
      group.add(slot, latch1, latch2);
      pickables.push(slot);
    }

    // Two RAM sticks with matte black heatspreaders, gold edge connector, and memory chips
    const ramPcbMat = createMaterial('#162d1e', 0.5, 0.05);
    const ramSpreaderMat = createMaterial('#23282b', 0.35, 0.4);
    const goldPinsMat = createMaterial('#c9a85a', 0.2, 0.95);
    const chipMat = createMaterial('#111314', 0.6, 0.1);
    mats.push(ramPcbMat, ramSpreaderMat, goldPinsMat, chipMat);

    for (const dx of dimmXPositions) {
      // PCB strip
      const pcb = makeBox(0.06, 1.25, 4.1, ramPcbMat, dx, 0.7, -0.8);
      // Gold edge fingers at slot interface
      const goldFingers = makeBox(0.08, 0.12, 3.9, goldPinsMat, dx, 0.15, -0.8);
      // Heatspreader plates on both sides
      const spreader1 = makeBox(0.04, 1.15, 4.05, ramSpreaderMat, dx - 0.05, 0.74, -0.8);
      const spreader2 = makeBox(0.04, 1.15, 4.05, ramSpreaderMat, dx + 0.05, 0.74, -0.8);
      group.add(pcb, goldFingers, spreader1, spreader2);
      pickables.push(spreader1, spreader2);

      // Memory IC packages (8 per stick)
      for (let c = 0; c < 8; c++) {
        const cz = -0.8 - 1.6 + c * 0.46;
        const chip = makeBox(0.12, 0.35, 0.32, chipMat, dx, 0.65, cz);
        group.add(chip);
      }
    }

    parts.ram = { id: 'ram', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 5. GRAPHICS CARD (GPU)
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_gpu';

    // PCIe x16 motherboard slot
    const pcieSlotMat = createMaterial('#1c1e20', 0.6, 0.1);
    mats.push(pcieSlotMat);
    const slot = makeBox(4.4, 0.22, 0.26, pcieSlotMat, -0.8, 0.11, 1.4);
    group.add(slot);
    pickables.push(slot);

    // GPU backplate & PCB
    const gpuPcbMat = createMaterial('#151b18', 0.5, 0.1);
    const gpuBackplateMat = createMaterial('#24292e', 0.4, 0.7);
    mats.push(gpuPcbMat, gpuBackplateMat);
    const gpuPcb = makeBox(5.6, 0.08, 2.4, gpuPcbMat, -0.6, 0.6, 2.45);
    const backplate = makeBox(5.5, 0.04, 2.35, gpuBackplateMat, -0.6, 0.66, 2.45);
    group.add(gpuPcb, backplate);
    pickables.push(backplate);

    // Rear metal chassis mounting bracket with display port cutouts
    const bracketMat = createMaterial('#c8cdd4', 0.25, 0.95);
    mats.push(bracketMat);
    const metalBracket = makeBox(0.06, 1.8, 2.6, bracketMat, -3.42, 1.0, 2.45);
    group.add(metalBracket);
    pickables.push(metalBracket);

    // Internal cooling fin block
    const heatsinkMat = createMaterial('#b0b5ba', 0.35, 0.85);
    mats.push(heatsinkMat);
    const gpuHeatsink = makeBox(4.8, 0.55, 2.2, heatsinkMat, -0.5, 0.95, 2.45);
    group.add(gpuHeatsink);

    // Matte dark shroud with distinctive probe yellow trim stripe
    const shroudMat = createMaterial('#1f2125', 0.5, 0.2);
    const yellowStripeMat = createMaterial('#f1c232', 0.35, 0.1);
    mats.push(shroudMat, yellowStripeMat);
    const shroud = makeBox(5.2, 0.45, 2.4, shroudMat, -0.6, 1.4, 2.45);
    const yellowStripe = makeBox(5.22, 0.06, 0.08, yellowStripeMat, -0.6, 1.48, 3.66);
    group.add(shroud, yellowStripe);
    pickables.push(shroud);

    // Dual cooling fans with center spinners
    const fanMat = createMaterial('#161819', 0.5, 0.1);
    mats.push(fanMat);
    for (const fx of [-1.8, 0.6]) {
      const fanRim = makeCyl(0.9, 0.9, 0.08, 24, fanMat, fx, 1.63, 2.45);
      const fanHub = makeCyl(0.3, 0.3, 0.14, 20, fanMat, fx, 1.66, 2.45);
      group.add(fanRim, fanHub);
    }

    parts.gpu = { id: 'gpu', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 6. NVMe SSD
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_ssd';

    // M.2 slot socket on board
    const m2SocketMat = createMaterial('#232528', 0.6, 0.1);
    const screwMat = createMaterial('#a8adb3', 0.25, 0.9);
    mats.push(m2SocketMat, screwMat);
    const m2Socket = makeBox(0.24, 0.14, 0.9, m2SocketMat, -0.2, 0.07, 0.4);
    const standoff = makeCyl(0.08, 0.08, 0.16, 16, screwMat, 2.4, 0.08, 0.4);
    group.add(m2Socket, standoff);
    pickables.push(m2Socket);

    // M.2 2280 PCB card
    const ssdPcbMat = createMaterial('#193222', 0.5, 0.1);
    mats.push(ssdPcbMat);
    const ssdPcb = makeBox(2.5, 0.04, 0.75, ssdPcbMat, 1.1, 0.15, 0.4);
    group.add(ssdPcb);
    pickables.push(ssdPcb);

    // SSD Silicon controller & NAND flash dies
    const chipMat = createMaterial('#121314', 0.45, 0.15);
    const labelMat = createMaterial('#2b3035', 0.6, 0.1);
    mats.push(chipMat, labelMat);
    const controller = makeBox(0.36, 0.05, 0.36, chipMat, 0.4, 0.19, 0.4);
    const nand1 = makeBox(0.5, 0.05, 0.55, chipMat, 1.2, 0.19, 0.4);
    const nand2 = makeBox(0.5, 0.05, 0.55, chipMat, 1.8, 0.19, 0.4);
    const labelSticker = makeBox(1.9, 0.01, 0.6, labelMat, 1.2, 0.22, 0.4);
    group.add(controller, nand1, nand2, labelSticker);
    pickables.push(labelSticker);

    parts.ssd = { id: 'ssd', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 7. CHIPSET
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_chipset';

    // Machined aluminium heatsink with machined grooves
    const heatsinkMat = createMaterial('#54595e', 0.35, 0.75);
    mats.push(heatsinkMat);
    const sinkBase = makeBox(1.6, 0.26, 1.6, heatsinkMat, 2.7, 0.13, 1.7);
    group.add(sinkBase);
    pickables.push(sinkBase);

    // Heatsink cooling fins
    for (let f = 0; f < 5; f++) {
      const finZ = 1.7 - 0.6 + f * 0.3;
      const fin = makeBox(1.55, 0.22, 0.08, heatsinkMat, 2.7, 0.36, finZ);
      group.add(fin);
    }

    parts.chipset = { id: 'chipset', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 8. VOLTAGE REGULATORS (VRM)
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_vrm';

    // Ferrite chokes (solid grey cubes)
    const chokeMat = createMaterial('#383c40', 0.55, 0.2);
    mats.push(chokeMat);

    // Solid polymer capacitors (silver cylinders with dark marking)
    const capMat = createMaterial('#b0b4b8', 0.25, 0.85);
    mats.push(capMat);

    // Left phase array (parallel to CPU)
    for (let i = 0; i < 6; i++) {
      const cz = -2.1 + i * 0.45;
      const choke = makeBox(0.3, 0.28, 0.3, chokeMat, -1.6, 0.14, cz);
      const cap = makeCyl(0.12, 0.12, 0.38, 16, capMat, -1.95, 0.19, cz);
      group.add(choke, cap);
      pickables.push(choke);
    }

    // Top phase array (above CPU)
    for (let i = 0; i < 4; i++) {
      const cx = -0.7 + i * 0.45;
      const choke = makeBox(0.3, 0.28, 0.3, chokeMat, cx, 0.14, -2.4);
      const cap = makeCyl(0.12, 0.12, 0.38, 16, capMat, cx, 0.19, -2.75);
      group.add(choke, cap);
      pickables.push(choke);
    }

    // Sub-assembly: Heavy sculpted aluminium VRM heatsink sitting atop the MOSFETs
    const vrmSinkGroup = new THREE.Group();
    vrmSinkGroup.name = 'subassembly_vrm_heatsink';

    const sinkMat = createMaterial('#41464b', 0.38, 0.7);
    mats.push(sinkMat);

    const leftSink = makeBox(0.65, 0.7, 2.8, sinkMat, -2.4, 0.55, -1.0);
    const topSink = makeBox(2.2, 0.7, 0.65, sinkMat, 0.0, 0.55, -2.5);
    vrmSinkGroup.add(leftSink, topSink);
    pickables.push(leftSink, topSink);

    group.add(vrmSinkGroup);

    parts.vrm = {
      id: 'vrm',
      group,
      materials: mats,
      pickableMeshes: pickables,
      subAssemblies: { vrmHeatsink: vrmSinkGroup }
    };
  }

  // --------------------------------------------------------------------------
  // 9. 24-PIN POWER CONNECTOR
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_power';

    // Off-white nylon ATX housing
    const housingMat = createMaterial('#e4dfd0', 0.5, 0.05);
    const pinHoleMat = createMaterial('#1f1f1d', 0.8, 0.1);
    mats.push(housingMat, pinHoleMat);

    const housing = makeBox(0.65, 0.85, 3.2, housingMat, 4.3, 0.42, -0.6);
    // Retention latch hook on side
    const latch = makeBox(0.12, 0.45, 0.8, housingMat, 3.92, 0.45, -0.6);
    group.add(housing, latch);
    pickables.push(housing);

    // 2 x 12 grid of pin holes
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 12; col++) {
        const hx = 4.16 + row * 0.28;
        const hz = -2.0 + col * 0.25;
        const hole = makeBox(0.16, 0.05, 0.16, pinHoleMat, hx, 0.85, hz, false, false);
        group.add(hole);
      }
    }

    parts.power = { id: 'power', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 10. CMOS BATTERY
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_battery';

    // Black plastic socket holder with latch
    const socketMat = createMaterial('#1c1e20', 0.7, 0.1);
    mats.push(socketMat);
    const socket = makeCyl(0.62, 0.62, 0.18, 24, socketMat, 1.3, 0.09, 2.6);
    group.add(socket);
    pickables.push(socket);

    // Polished nickel CR2032 coin cell
    const cellMat = createMaterial('#d6dadf', 0.18, 0.96);
    mats.push(cellMat);
    const coinCell = makeCyl(0.52, 0.52, 0.14, 24, cellMat, 1.3, 0.21, 2.6);
    group.add(coinCell);
    pickables.push(coinCell);

    // Gold spring positive contact terminal
    const goldMat = createMaterial('#c9a85a', 0.2, 0.95);
    mats.push(goldMat);
    const contact = makeBox(0.12, 0.16, 0.25, goldMat, 0.74, 0.2, 2.6);
    group.add(contact);

    parts.battery = { id: 'battery', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 11. REAR I/O PORTS
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_io';

    // Metal shield block
    const shieldMat = createMaterial('#b0b6bc', 0.3, 0.85);
    mats.push(shieldMat);
    const shield = makeBox(0.85, 1.1, 4.4, shieldMat, -4.3, 0.55, -1.8);
    group.add(shield);
    pickables.push(shield);

    // USB, Ethernet, HDMI port cutouts and plastic blocks
    const blackPortMat = createMaterial('#1a1c1e', 0.6, 0.1);
    const blueUsbMat = createMaterial('#0d58a6', 0.5, 0.1);
    const audioGreenMat = createMaterial('#4cb862', 0.4, 0.1);
    const audioBlueMat = createMaterial('#387dc4', 0.4, 0.1);
    const audioPinkMat = createMaterial('#d95b7f', 0.4, 0.1);
    mats.push(blackPortMat, blueUsbMat, audioGreenMat, audioBlueMat, audioPinkMat);

    // USB 3.0 stack
    const usb1 = makeBox(0.1, 0.35, 0.45, blueUsbMat, -4.75, 0.65, -3.2);
    const usb2 = makeBox(0.1, 0.35, 0.45, blueUsbMat, -4.75, 0.65, -2.5);
    // RJ-45 Ethernet port
    const lan = makeBox(0.1, 0.45, 0.5, blackPortMat, -4.75, 0.7, -1.8);
    // HDMI / DisplayPort
    const hdmi = makeBox(0.1, 0.25, 0.5, blackPortMat, -4.75, 0.5, -1.0);
    group.add(usb1, usb2, lan, hdmi);

    // Audio jacks
    const jack1 = makeCyl(0.12, 0.12, 0.12, 16, audioGreenMat, -4.75, 0.35, -0.2);
    jack1.rotation.z = Math.PI / 2;
    const jack2 = makeCyl(0.12, 0.12, 0.12, 16, audioBlueMat, -4.75, 0.35, 0.15);
    jack2.rotation.z = Math.PI / 2;
    const jack3 = makeCyl(0.12, 0.12, 0.12, 16, audioPinkMat, -4.75, 0.35, 0.5);
    jack3.rotation.z = Math.PI / 2;
    group.add(jack1, jack2, jack3);

    parts.io = { id: 'io', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // 12. SATA PORTS
  // --------------------------------------------------------------------------
  {
    const mats: THREE.Material[] = [];
    const pickables: THREE.Mesh[] = [];
    const group = new THREE.Group();
    group.name = 'part_sata';

    // Black right-angle plastic sockets stacked in 2 pairs
    const sataHousingMat = createMaterial('#1e2022', 0.6, 0.1);
    const contactGoldMat = createMaterial('#c9a85a', 0.2, 0.9);
    mats.push(sataHousingMat, contactGoldMat);

    const sataPositions = [
      [4.3, 0.16, 2.0],
      [4.3, 0.16, 2.6]
    ];

    for (const [sx, sy, sz] of sataPositions) {
      // Lower and upper stacked ports
      const lower = makeBox(0.75, 0.26, 0.48, sataHousingMat, sx, sy, sz);
      const upper = makeBox(0.75, 0.26, 0.48, sataHousingMat, sx, sy + 0.32, sz);
      // Keyed L-tongue
      const tongue1 = makeBox(0.2, 0.04, 0.36, contactGoldMat, sx + 0.25, sy, sz);
      const tongue2 = makeBox(0.2, 0.04, 0.36, contactGoldMat, sx + 0.25, sy + 0.32, sz);
      group.add(lower, upper, tongue1, tongue2);
      pickables.push(lower, upper);
    }

    parts.sata = { id: 'sata', group, materials: mats, pickableMeshes: pickables };
  }

  // --------------------------------------------------------------------------
  // SURFACE MOUNT COMPONENTS (InstancedMesh: ~280 tiny parts across motherboard)
  // --------------------------------------------------------------------------
  const smdMat = createMaterial('#2d3135', 0.4, 0.6);
  const smdCount = 280;
  const smdGeo = new THREE.BoxGeometry(0.08, 0.04, 0.05);
  const surfaceMountMesh = new THREE.InstancedMesh(smdGeo, smdMat, smdCount);
  surfaceMountMesh.castShadow = false; // Excluded from shadow map for high performance
  surfaceMountMesh.receiveShadow = false;

  const dummy = new THREE.Object3D();
  const seedRandom = (seed: number) => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  for (let i = 0; i < smdCount; i++) {
    const rx = (seedRandom(i * 7 + 1) - 0.5) * 9.2;
    const rz = (seedRandom(i * 7 + 3) - 0.5) * 7.2;
    // Keep clearance around main central CPU socket
    if (Math.abs(rx) < 1.2 && Math.abs(rz + 0.8) < 1.2) {
      dummy.position.set(rx + 2.5, 0.02, rz);
    } else {
      dummy.position.set(rx, 0.02, rz);
    }
    dummy.rotation.y = seedRandom(i * 7 + 5) > 0.5 ? 0 : Math.PI / 2;
    dummy.updateMatrix();
    surfaceMountMesh.setMatrixAt(i, dummy.matrix);
  }
  surfaceMountMesh.instanceMatrix.needsUpdate = true;
  surfaceMountMesh.computeBoundingSphere();

  return {
    parts: parts as Record<PartId, BuiltPart>,
    surfaceMountMesh
  };
}
