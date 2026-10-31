/**
 * Boardwalk — Hardware Comparison View
 *
 * Renders two 3D hardware components side by side alongside a side-by-side
 * specification table and a plain decision sentence.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { COMPARE_PAIRS, ComparePair } from '../data/compare.ts';
import { useI18n } from '../i18n/index.tsx';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPairId?: string;
}

function makeBox(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x = 0,
  y = 0,
  z = 0
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
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
  z = 0
): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(rTop, rBot, h, segs);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  return mesh;
}

/**
 * Builds side-by-side 3D models for the chosen comparison pair.
 */
function buildCompareModels(pairId: string): THREE.Group {
  const root = new THREE.Group();

  if (pairId === 'ddr4_vs_ddr5') {
    // Model A: DDR4 (Green PCB, center notch) on the left (x = -2.2)
    const pcbDDR4Mat = new THREE.MeshStandardMaterial({ color: 0x1f5c35, roughness: 0.6 });
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x141618, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a85a, metalness: 0.9, roughness: 0.2 });

    const ddr4Pcb = makeBox(0.08, 1.4, 4.4, pcbDDR4Mat, -2.2, 0.7, 0);
    const ddr4Gold1 = makeBox(0.09, 0.16, 2.0, goldMat, -2.2, 0.08, -1.1);
    const ddr4Gold2 = makeBox(0.09, 0.16, 2.0, goldMat, -2.2, 0.08, 1.1);
    root.add(ddr4Pcb, ddr4Gold1, ddr4Gold2);

    for (let i = 0; i < 8; i++) {
      const cz = -1.7 + i * 0.48;
      const chip = makeBox(0.14, 0.42, 0.35, chipMat, -2.2, 0.7, cz);
      root.add(chip);
    }

    // Model B: DDR5 (Matte black PCB, off-center notch, on-board PMIC) on the right (x = 2.2)
    const pcbDDR5Mat = new THREE.MeshStandardMaterial({ color: 0x1c2124, roughness: 0.4, metalness: 0.3 });
    const pmicMat = new THREE.MeshStandardMaterial({ color: 0xb0b6bc, metalness: 0.85, roughness: 0.3 });

    const ddr5Pcb = makeBox(0.08, 1.4, 4.4, pcbDDR5Mat, 2.2, 0.7, 0);
    const ddr5Gold1 = makeBox(0.09, 0.16, 2.3, goldMat, 2.2, 0.08, -0.9);
    const ddr5Gold2 = makeBox(0.09, 0.16, 1.7, goldMat, 2.2, 0.08, 1.25);
    // On-board power management IC (PMIC) characteristic to DDR5
    const pmic = makeBox(0.14, 0.22, 0.22, pmicMat, 2.2, 1.15, 0);
    root.add(ddr5Pcb, ddr5Gold1, ddr5Gold2, pmic);

    for (let i = 0; i < 8; i++) {
      const cz = -1.7 + i * 0.48;
      const chip = makeBox(0.14, 0.42, 0.35, chipMat, 2.2, 0.65, cz);
      root.add(chip);
    }
  } else if (pairId === 'sata_vs_nvme') {
    // Model A: SATA 2.5-inch SSD on left (x = -2.2)
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x222629, roughness: 0.5, metalness: 0.3 });
    const sataCase = makeBox(2.8, 0.28, 4.0, caseMat, -2.2, 0.14, 0);
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xdde3dd, roughness: 0.6 });
    const label = makeBox(2.2, 0.01, 3.2, labelMat, -2.2, 0.29, 0);
    root.add(sataCase, label);

    // Model B: NVMe M.2 2280 on right (x = 2.2)
    const m2PcbMat = new THREE.MeshStandardMaterial({ color: 0x163422, roughness: 0.5 });
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x111314, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a85a, metalness: 0.9, roughness: 0.2 });

    const m2Pcb = makeBox(0.08, 0.8, 3.2, m2PcbMat, 2.2, 0.4, 0);
    const m2Gold = makeBox(0.09, 0.72, 0.18, goldMat, 2.2, 0.4, -1.6);
    const controller = makeBox(0.14, 0.4, 0.4, chipMat, 2.2, 0.4, -0.9);
    const nand1 = makeBox(0.14, 0.6, 0.65, chipMat, 2.2, 0.4, 0.1);
    const nand2 = makeBox(0.14, 0.6, 0.65, chipMat, 2.2, 0.4, 0.9);
    root.add(m2Pcb, m2Gold, controller, nand1, nand2);
  } else {
    // Model A: 3.5-inch Mechanical HDD on left (x = -2.4)
    const hddCastMat = new THREE.MeshStandardMaterial({ color: 0x828a92, metalness: 0.8, roughness: 0.35 });
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x1d2124, roughness: 0.6 });
    const hddBody = makeBox(3.4, 0.8, 4.6, hddCastMat, -2.4, 0.4, 0);
    const platterHump = makeCyl(1.4, 1.4, 0.1, 32, hddCastMat, -2.4, 0.85, 0.4);
    const hddCover = makeBox(3.1, 0.05, 4.3, coverMat, -2.4, 0.82, 0);
    root.add(hddBody, platterHump, hddCover);

    // Model B: 2.5-inch Solid-State SSD on right (x = 2.4)
    const ssdCaseMat = new THREE.MeshStandardMaterial({ color: 0x22262a, roughness: 0.4, metalness: 0.4 });
    const ssdBadgeMat = new THREE.MeshStandardMaterial({ color: 0xf1c232, roughness: 0.3 });
    const ssdCase = makeBox(2.6, 0.28, 3.8, ssdCaseMat, 2.4, 0.14, 0);
    const ssdBadge = makeBox(1.2, 0.02, 0.3, ssdBadgeMat, 2.4, 0.29, 0.8);
    root.add(ssdCase, ssdBadge);
  }

  return root;
}

export function CompareModal({ isOpen, onClose, initialPairId = 'ddr4_vs_ddr5' }: CompareModalProps) {
  const [selectedPairId, setSelectedPairId] = useState(initialPairId);
  const mountRef = useRef<HTMLDivElement>(null);

  const currentPair =
    COMPARE_PAIRS.find((p) => p.id === selectedPairId) || COMPARE_PAIRS[0];

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 280;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x17201c, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.3);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 3.8, 7.8);
    camera.lookAt(0, 0.5, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 14;

    const modelGroup = buildCompareModels(selectedPairId);
    scene.add(modelGroup);

    mountRef.current.appendChild(renderer.domElement);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isOpen, selectedPairId]);

  // Esc key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-title"
    >
      <div className="blueprint-modal-card compare-modal-panel" style={{ maxWidth: '780px', width: '95vw' }}>
        <div className="compare-modal-header">
          <div>
            <h2 id="compare-title" className="compare-title">
              {t.compare.modalTitle}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)' }}>
              {t.compare.modalSubtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="compare-pair-tabs" role="tablist">
              {COMPARE_PAIRS.map((pair) => (
                <button
                  key={pair.id}
                  type="button"
                  role="tab"
                  className="compare-tab-btn"
                  data-active={selectedPairId === pair.id}
                  onClick={() => setSelectedPairId(pair.id)}
                >
                  {pair.title}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="blueprint-btn blueprint-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '12px' }}
              onClick={onClose}
              aria-label={t.compare.closeBtn}
            >
              {t.compare.closeBtn}
            </button>
          </div>
        </div>

        {/* 3D Dual Model Viewport */}
        <div className="compare-3d-stage">
          <div className="compare-viewport-label label-left">
            {currentPair.itemA.name}
          </div>
          <div className="compare-viewport-label label-right">
            {currentPair.itemB.name}
          </div>
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Specifications & Decision Table */}
        <div className="compare-content-body">
          <div className="compare-cards-row">
            <div className="compare-spec-col">
              <h3 className="compare-col-title">{currentPair.itemA.name}</h3>
              <p className="compare-col-summary">{currentPair.itemA.summary}</p>
              <table className="specs-table">
                <tbody>
                  {currentPair.itemA.specs.map((spec) => (
                    <tr key={spec.label}>
                      <td className="spec-label">{spec.label}</td>
                      <td className="spec-val">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="compare-choice-box">
                <strong>When to choose:</strong> {currentPair.itemA.whenChoice}
              </div>
            </div>

            <div className="compare-spec-col">
              <h3 className="compare-col-title">{currentPair.itemB.name}</h3>
              <p className="compare-col-summary">{currentPair.itemB.summary}</p>
              <table className="specs-table">
                <tbody>
                  {currentPair.itemB.specs.map((spec) => (
                    <tr key={spec.label}>
                      <td className="spec-label">{spec.label}</td>
                      <td className="spec-val">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="compare-choice-box">
                <strong>When to choose:</strong> {currentPair.itemB.whenChoice}
              </div>
            </div>
          </div>

          <div className="compare-verdict-box">
            <strong>Summary:</strong> {currentPair.summarySentence}
          </div>
        </div>
      </div>
    </div>
  );
}
