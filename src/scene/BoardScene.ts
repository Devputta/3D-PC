/**
 * Boardwalk — 3D Board Scene Controller
 *
 * Generic 3D viewport managing packs (PC Hardware, Computer Networking),
 * blueprint isometric grid floor, camera undo/redo history, zoom in/out,
 * picking raycasts, callout projections, build mode part assembly, and render-on-demand loops.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BuiltPart, DataFlowRoute, FlowMode, FlowStep, Pack, SceneBuildResult } from '../packs/types.ts';

export interface CalloutProjection {
  partId: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface DataFlowCaption {
  id: string;
  label: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface BoardSceneEvents {
  onPick: (partId: string) => void;
  onHover: (partId: string | null) => void;
  onProject: (projections: CalloutProjection[]) => void;
  onProjectDataFlow?: (captions: DataFlowCaption[]) => void;
  onSettleComplete?: () => void;
  onContextLost?: () => void;
  onContextRestored?: () => void;
  onError?: (err: Error) => void;
}

interface CameraTween {
  startTime: number;
  duration: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
}

interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export class BoardScene {
  private container: HTMLElement;
  private events: BoardSceneEvents;
  private pack: Pack;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  private buildResult!: SceneBuildResult;
  private pickableMap = new Map<THREE.Mesh, string>();

  private isDirty = true;
  private isDestroyed = false;
  private animFrameId = 0;

  private selectedPartId: string | null = null;
  private hoveredPartId: string | null = null;
  private isIsolated = false;
  private explodeValue = 0;

  // Build mode state
  private isBuildMode = false;
  private installedPartIds = new Set<string>();

  // Active quiz flash state
  private activeFlash: {
    partId: string;
    color: number;
    intensity: number;
    expiresAt: number;
  } | null = null;

  // Camera tween
  private cameraTween: CameraTween | null = null;

  // Camera history stack for Undo/Redo
  private historyStack: CameraState[] = [];
  private historyIndex = -1;
  private isRestoringHistory = false;

  // Pointer movement tracking for optimized hover raycasting
  private pointerDownPos = new THREE.Vector2();
  private pointerPos = new THREE.Vector2(-9999, -9999);
  private pointerMoved = false;
  private raycaster = new THREE.Raycaster();
  private resizeObserver!: ResizeObserver;

  // Data flow pulse visualizer
  private showDataFlow = false;
  private flowMode: FlowMode = 'parts';
  private activeFlowStep: FlowStep | null = null;
  private dataFlowMesh!: THREE.InstancedMesh;
  private dataFlowRoutes: DataFlowRoute[] = [];
  private totalDataFlowPulses = 28;
  private dataFlowDummy = new THREE.Object3D();

  // Blueprint grid floor mesh
  private gridFloor!: THREE.GridHelper;
  private groundShadow!: THREE.Mesh;

  // Pre-allocated vectors to prevent GC allocations in loop
  private _vec3 = new THREE.Vector3();
  private _box = new THREE.Box3();

  constructor(container: HTMLElement, pack: Pack, events: BoardSceneEvents) {
    this.container = container;
    this.pack = pack;
    this.events = events;

    this.initScene();
    this.loadPackContent();
    this.initListeners();
    this.recordCameraState();
    this.startLoop();
  }

  private initScene(): void {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // Clean container in case of remounts
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Direct canvas element styling to fill container and prevent touch scrolling interference
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.touchAction = 'none';
    this.renderer.domElement.style.outline = 'none';

    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    // Blueprint room lighting
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    this.scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xfffdfa, 0xe8ded1, 0.85);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.35);
    keyLight.position.set(7, 14, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -9;
    keyLight.shadow.camera.right = 9;
    keyLight.shadow.camera.top = 9;
    keyLight.shadow.camera.bottom = -9;
    keyLight.shadow.normalBias = 0.025;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce6df, 0.45);
    fillLight.position.set(-8, 6, -6);
    this.scene.add(fillLight);

    // Subtle ambient light
    const ambLight = new THREE.AmbientLight(0xfdf7ee, 0.3);
    this.scene.add(ambLight);

    // Warm blueprint isometric grid floor
    this.gridFloor = new THREE.GridHelper(32, 32, 0xc8baa7, 0xdfd4c4);
    this.gridFloor.position.y = -0.165;
    this.scene.add(this.gridFloor);

    // Shadow receiver
    const shadowGeo = new THREE.PlaneGeometry(28, 24);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    this.groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.groundShadow.rotation.x = -Math.PI / 2;
    this.groundShadow.position.y = -0.16;
    this.groundShadow.receiveShadow = true;
    this.scene.add(this.groundShadow);

    this.camera = new THREE.PerspectiveCamera(
      this.pack.home.fov || 35,
      width / height,
      0.1,
      100
    );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;
    this.controls.panSpeed = 0.8;
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.8;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.0;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 28;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
    this.controls.minPolarAngle = 0.06;

    this.controls.addEventListener('start', () => {
      if (this.cameraTween) {
        this.cameraTween = null;
      }
    });

    this.controls.addEventListener('end', () => {
      if (!this.isRestoringHistory) {
        this.recordCameraState();
      }
    });

    this.controls.addEventListener('change', () => {
      this.isDirty = true;
    });
  }

  /**
   * Records current camera position & target for Undo / Redo
   */
  private recordCameraState(): void {
    if (!this.camera || !this.controls) return;
    const current: CameraState = {
      position: this.camera.position.clone(),
      target: this.controls.target.clone()
    };

    // If we branched off from middle of history, slice forward stack
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }

    this.historyStack.push(current);
    if (this.historyStack.length > 25) {
      this.historyStack.shift();
    }
    this.historyIndex = this.historyStack.length - 1;
  }

  public undoView(): boolean {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const targetState = this.historyStack[this.historyIndex];
      this.applyCameraState(targetState);
      return true;
    }
    return false;
  }

  public redoView(): boolean {
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyIndex++;
      const targetState = this.historyStack[this.historyIndex];
      this.applyCameraState(targetState);
      return true;
    }
    return false;
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.historyStack.length - 1;
  }

  private applyCameraState(state: CameraState): void {
    this.isRestoringHistory = true;
    this.flyToTarget(state.position, state.target, 500);
    setTimeout(() => {
      this.isRestoringHistory = false;
    }, 550);
  }

  public zoomIn(): void {
    const dir = new THREE.Vector3().subVectors(this.controls.target, this.camera.position);
    const dist = dir.length();
    if (dist > this.controls.minDistance + 0.5) {
      const step = Math.min(dist * 0.22, 2.5);
      const newPos = this.camera.position.clone().addScaledVector(dir.normalize(), step);
      this.flyToTarget(newPos, this.controls.target, 350);
      setTimeout(() => this.recordCameraState(), 360);
    }
  }

  public zoomOut(): void {
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    const dist = dir.length();
    if (dist < this.controls.maxDistance - 0.5) {
      const step = Math.min(dist * 0.22, 2.5);
      const newPos = this.camera.position.clone().addScaledVector(dir.normalize(), step);
      this.flyToTarget(newPos, this.controls.target, 350);
      setTimeout(() => this.recordCameraState(), 360);
    }
  }

  /**
   * Loads or switches the pack models, layout, and dataflow curves.
   */
  private loadPackContent(): void {
    // Clean up previous pack meshes and materials from scene
    if (this.buildResult) {
      for (const part of Object.values(this.buildResult.parts)) {
        this.scene.remove(part.group);
        part.group.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else if (obj.material) {
              obj.material.dispose();
            }
          }
        });
      }
      if (this.buildResult.surfaceMountMesh) {
        this.scene.remove(this.buildResult.surfaceMountMesh);
        this.buildResult.surfaceMountMesh.geometry?.dispose();
        if (Array.isArray(this.buildResult.surfaceMountMesh.material)) {
          this.buildResult.surfaceMountMesh.material.forEach((m) => m.dispose());
        } else if (this.buildResult.surfaceMountMesh.material) {
          this.buildResult.surfaceMountMesh.material.dispose();
        }
      }
      this.pickableMap.clear();
    }

    if (this.dataFlowMesh) {
      this.scene.remove(this.dataFlowMesh);
      this.dataFlowMesh.geometry?.dispose();
      if (Array.isArray(this.dataFlowMesh.material)) {
        this.dataFlowMesh.material.forEach((m) => m.dispose());
      } else if (this.dataFlowMesh.material) {
        this.dataFlowMesh.material.dispose();
      }
    }

    // Build models from the pack
    this.buildResult = this.pack.build();
    for (const part of Object.values(this.buildResult.parts)) {
      this.scene.add(part.group);
      // Recursively index all meshes inside the part group so clicking/hovering anywhere selects it
      part.group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          this.pickableMap.set(child, part.id);
          child.userData.partId = part.id;
        }
      });
      for (const mesh of part.pickableMeshes) {
        this.pickableMap.set(mesh, part.id);
        mesh.userData.partId = part.id;
      }
    }
    if (this.buildResult.surfaceMountMesh) {
      this.scene.add(this.buildResult.surfaceMountMesh);
    }

    // Initialize pack data flow curves
    this.dataFlowRoutes = this.pack.dataFlowRoutes || [];
    this.totalDataFlowPulses = this.dataFlowRoutes.reduce((acc, r) => acc + r.pulseCount, 0) || 28;

    const pulseGeo = new THREE.SphereGeometry(0.052, 10, 10);
    // Teal/amber glowing pulses matching blueprint theme
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6 });
    this.dataFlowMesh = new THREE.InstancedMesh(pulseGeo, pulseMat, Math.max(this.totalDataFlowPulses, 1));
    this.dataFlowMesh.visible = this.showDataFlow;
    this.scene.add(this.dataFlowMesh);

    // Apply build mode visibility if active
    this.applyBuildVisibility();

    // Reset camera to pack home
    this.resetCameraHome(false);
    this.isDirty = true;
  }

  /**
   * Switches to a new educational pack with full disposal.
   */
  public setPack(newPack: Pack): void {
    if (this.pack.id === newPack.id) return;
    this.pack = newPack;
    this.selectedPartId = null;
    this.hoveredPartId = null;
    if (this.camera) {
      this.camera.fov = newPack.home.fov || 35;
      this.camera.updateProjectionMatrix();
    }
    this.loadPackContent();
    this.recordCameraState();
    this.projectCallouts();
    this.isDirty = true;
  }

  public setEvents(events: BoardSceneEvents): void {
    this.events = events;
  }



  /**
   * Toggles build mode. In build mode, parts only render once installed.
   */
  public setBuildMode(isBuildMode: boolean, installedPartIds: Set<string> = new Set()): void {
    this.isBuildMode = isBuildMode;
    this.installedPartIds = installedPartIds;
    this.applyBuildVisibility();
    this.isDirty = true;
  }

  private applyBuildVisibility(): void {
    if (!this.buildResult) return;

    for (const [id, part] of Object.entries(this.buildResult.parts)) {
      if (this.isBuildMode) {
        // Base structures remain visible
        const isBaseSubstrate =
          id === 'motherboard' || id === 'vrm' || id === 'chipset' || id === 'battery' || id === 'io' || id === 'sata';
        part.group.visible = isBaseSubstrate || this.installedPartIds.has(id);
      } else {
        part.group.visible = true;
      }
    }
  }

  public handleResize(width: number, height: number): void {
    if (width <= 0 || height <= 0 || !this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.isDirty = true;
    this.projectCallouts();
  }

  private handlePointerDown = (e: PointerEvent): void => {
    this.pointerDownPos.set(e.clientX, e.clientY);
  };

  private handlePointerUp = (e: PointerEvent): void => {
    // Only primary left button triggers part selection
    if (e.button !== 0) return;
    const dist = Math.hypot(
      e.clientX - this.pointerDownPos.x,
      e.clientY - this.pointerDownPos.y
    );
    if (dist < 6) {
      this.handleClick(e);
    }
  };

  private handlePointerMove = (e: PointerEvent): void => {
    const el = this.renderer?.domElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    this.pointerPos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerPos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.pointerMoved = true;
    this.isDirty = true;
  };

  private handlePointerLeave = (): void => {
    this.pointerPos.set(-9999, -9999);
    this.pointerMoved = false;
    if (this.hoveredPartId !== null) {
      this.hoveredPartId = null;
      this.updateMaterials();
      this.events.onHover(null);
      this.isDirty = true;
    }
  };

  private handleContextLost = (e: Event): void => {
    e.preventDefault();
    console.warn('BoardScene: WebGL context lost.');
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.events.onContextLost?.();
  };

  private handleContextRestored = (): void => {
    console.info('BoardScene: WebGL context restored. Rebuilding scene...');
    this.loadPackContent();
    this.startLoop();
    this.events.onContextRestored?.();
  };

  private initListeners(): void {
    const el = this.renderer.domElement;

    el.addEventListener('pointerdown', this.handlePointerDown);
    el.addEventListener('pointerup', this.handlePointerUp);
    el.addEventListener('pointermove', this.handlePointerMove);
    el.addEventListener('pointerleave', this.handlePointerLeave);
    el.addEventListener('webglcontextlost', this.handleContextLost, false);
    el.addEventListener('webglcontextrestored', this.handleContextRestored, false);

    this.resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      if (width <= 0 || height <= 0) return;
      this.handleResize(width, height);
    });
    this.resizeObserver.observe(this.container);

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = (): void => {
    if (!document.hidden) {
      this.isDirty = true;
    }
  };

  private handleClick(e: MouseEvent): void {
    const el = this.renderer?.domElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);
    const pickables = Array.from(this.pickableMap.keys()).filter((m) => {
      if (!m.visible) return false;
      let cur: THREE.Object3D | null = m.parent;
      while (cur) {
        if (!cur.visible) return false;
        cur = cur.parent;
      }
      return true;
    });

    const hits = this.raycaster.intersectObjects(pickables, false);

    if (hits.length > 0) {
      const hitMesh = hits[0].object as THREE.Mesh;
      const partId = this.pickableMap.get(hitMesh) || (hitMesh.userData.partId as string | undefined);
      if (partId) {
        this.events.onPick(partId);
      }
    }
  }

  private checkHover(): void {
    if (!this.pointerMoved || this.pointerPos.x < -9000 || !this.renderer?.domElement) return;
    this.pointerMoved = false;

    this.raycaster.setFromCamera(this.pointerPos, this.camera);
    const pickables = Array.from(this.pickableMap.keys()).filter((m) => {
      if (!m.visible) return false;
      let cur: THREE.Object3D | null = m.parent;
      while (cur) {
        if (!cur.visible) return false;
        cur = cur.parent;
      }
      return true;
    });

    const hits = this.raycaster.intersectObjects(pickables, false);

    let nextHover: string | null = null;
    if (hits.length > 0) {
      const hitMesh = hits[0].object as THREE.Mesh;
      nextHover = this.pickableMap.get(hitMesh) || (hitMesh.userData.partId as string | undefined) || null;
    }

    if (nextHover !== this.hoveredPartId) {
      this.hoveredPartId = nextHover;
      this.updateMaterials();
      this.events.onHover(nextHover);
      this.isDirty = true;
    }
  }

  public resetCameraHome(animate = true): void {
    const home = this.pack.home;
    const dir = new THREE.Vector3(...home.direction).normalize();
    const target = new THREE.Vector3(...home.target);
    const pos = target.clone().addScaledVector(dir, home.distance);

    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.flyToTarget(pos, target, 850);
      setTimeout(() => this.recordCameraState(), 860);
    } else {
      this.camera.position.copy(pos);
      this.camera.lookAt(target);
      if (this.controls) {
        this.controls.target.copy(target);
        this.controls.update();
      }
      this.recordCameraState();
      this.isDirty = true;
    }
  }

  public flyToPart(partId: string): void {
    const part = this.buildResult.parts[partId];
    if (!part) return;

    this._box.setFromObject(part.group);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    this._box.getCenter(center);
    this._box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = THREE.MathUtils.clamp(maxDim * 1.5 + 3.0, 5.0, 16.5);

    const currentDir = this.camera.position.clone().sub(this.controls.target).normalize();
    if (currentDir.y < 0.52) {
      currentDir.y = 0.58;
      currentDir.normalize();
    }

    const endPos = center.clone().addScaledVector(currentDir, distance);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.camera.position.copy(endPos);
      this.controls.target.copy(center);
      this.controls.update();
      this.recordCameraState();
      this.isDirty = true;
    } else {
      this.flyToTarget(endPos, center, 850);
      setTimeout(() => this.recordCameraState(), 860);
    }
  }

  private flyToTarget(endPos: THREE.Vector3, endTarget: THREE.Vector3, duration: number): void {
    this.cameraTween = {
      startTime: performance.now(),
      duration,
      startPos: this.camera.position.clone(),
      endPos: endPos.clone(),
      startTarget: this.controls.target.clone(),
      endTarget: endTarget.clone()
    };
    this.isDirty = true;
  }

  public setExplode(val: number): void {
    this.explodeValue = THREE.MathUtils.clamp(val, 0, 1);

    for (const [id, part] of Object.entries(this.buildResult.parts)) {
      const vec = this.pack.explode[id];
      if (vec) {
        part.group.position.set(
          vec[0] * this.explodeValue,
          vec[1] * this.explodeValue,
          vec[2] * this.explodeValue
        );
      }

      if (part.subAssemblies && this.pack.subassemblyLifts) {
        for (const [subKey, subGroup] of Object.entries(part.subAssemblies)) {
          const subVec = this.pack.subassemblyLifts[subKey];
          if (subVec) {
            subGroup.position.set(
              subVec[0] * this.explodeValue,
              subVec[1] * this.explodeValue,
              subVec[2] * this.explodeValue
            );
          }
        }
      }
    }

    this.isDirty = true;
  }

  public selectPart(partId: string | null): void {
    if (this.selectedPartId === partId) return;
    this.selectedPartId = partId;
    this.updateMaterials();
    this.isDirty = true;
  }

  public setIsolate(isolated: boolean): void {
    if (this.isIsolated === isolated) return;
    this.isIsolated = isolated;
    this.updateMaterials();
    this.isDirty = true;
  }

  public setShowDataFlow(enabled: boolean): void {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targetState = enabled && !prefersReducedMotion;
    if (this.showDataFlow === targetState) return;

    this.showDataFlow = targetState;
    if (this.dataFlowMesh) {
      this.dataFlowMesh.visible = this.showDataFlow;
    }
    this.isDirty = true;
  }

  public getDataFlowEnabled(): boolean {
    return this.showDataFlow;
  }

  public setFlowState(mode: FlowMode, currentStep: FlowStep | null): void {
    this.flowMode = mode;
    this.activeFlowStep = currentStep;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mode === 'parts' || prefersReducedMotion) {
      if (this.dataFlowMesh) {
        this.dataFlowMesh.visible = this.showDataFlow;
      }
    } else if (currentStep && currentStep.curve) {
      if (this.dataFlowMesh) {
        this.dataFlowMesh.visible = true;
        (this.dataFlowMesh.material as THREE.MeshBasicMaterial).color.setHex(currentStep.pulseColor);
      }
    }

    this.updateMaterials();
    this.isDirty = true;
  }

  /**
   * Triggers a live simulation animation in 3D (e.g. from the Run button)
   */
  public triggerSimulation(): void {
    this.setShowDataFlow(true);
    // Flash all active nodes along data routes
    for (const route of this.dataFlowRoutes) {
      const parts = route.id.split('-');
      for (const p of parts) {
        if (this.buildResult.parts[p]) {
          this.flashPart(p, 'active');
        }
      }
    }
  }

  public flashPart(partId: string, type: 'correct' | 'wrong' | 'active' = 'correct'): void {
    const color = type === 'correct' ? 0x14b8a6 : type === 'wrong' ? 0xe0483b : 0x1f3a5f;
    this.activeFlash = {
      partId,
      color,
      intensity: 0.85,
      expiresAt: performance.now() + 2200
    };
    this.updateMaterials();
    this.isDirty = true;
  }

  public clearFlash(): void {
    if (this.activeFlash) {
      this.activeFlash = null;
      this.updateMaterials();
      this.isDirty = true;
    }
  }

  private updateMaterials(): void {
    const now = performance.now();
    const flashActive = this.activeFlash && now < this.activeFlash.expiresAt;
    const inFlowMode = this.flowMode !== 'parts' && this.activeFlowStep !== null;
    const activeFlowSet = inFlowMode ? new Set(this.activeFlowStep!.activeParts) : null;

    for (const [id, part] of Object.entries(this.buildResult.parts)) {
      const isSelected = this.selectedPartId === id;
      const isHovered = this.hoveredPartId === id;
      const isFlashed = flashActive && this.activeFlash?.partId === id;
      const isFlowActive = inFlowMode && activeFlowSet ? activeFlowSet.has(id) : false;

      // Only fade when Isolate mode is enabled or when in a specific Flow step
      let shouldFade = this.isIsolated && !isSelected && !isFlashed;
      if (inFlowMode) {
        shouldFade = !isFlowActive;
      }

      for (const mat of part.materials) {
        if (!(mat instanceof THREE.MeshStandardMaterial)) continue;

        const targetOpacity = shouldFade ? (inFlowMode ? 0.18 : 0.15) : 1.0;
        const targetTransparent = shouldFade;

        if (mat.transparent !== targetTransparent) {
          mat.transparent = targetTransparent;
          mat.depthWrite = !targetTransparent;
          mat.needsUpdate = true;
        }
        mat.opacity = targetOpacity;

        if (isFlashed && this.activeFlash) {
          mat.emissive.setHex(this.activeFlash.color);
          mat.emissiveIntensity = this.activeFlash.intensity;
        } else if (isFlowActive && this.activeFlowStep) {
          mat.emissive.setHex(this.activeFlowStep.pulseColor);
          mat.emissiveIntensity = 0.36;
        } else if (isSelected) {
          // Navy/teal blueprint accent
          mat.emissive.setHex(0x14b8a6);
          mat.emissiveIntensity = 0.38;
        } else if (isHovered) {
          mat.emissive.setHex(0x1f3a5f);
          mat.emissiveIntensity = 0.25;
        } else {
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
    }
  }

  private projectCallouts(): void {
    const rect = this.container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const projections: CalloutProjection[] = [];

    for (const [id, part] of Object.entries(this.buildResult.parts)) {
      if (this.isBuildMode && !part.group.visible) continue;

      let anchor = new THREE.Vector3();
      const override = this.pack.anchors?.[id];

      if (override) {
        anchor.set(override[0], override[1], override[2]);
      } else {
        this._box.setFromObject(part.group);
        anchor.set(
          (this._box.min.x + this._box.max.x) / 2,
          this._box.max.y,
          (this._box.min.z + this._box.max.z) / 2
        );
      }

      if (override) {
        anchor.add(part.group.position);
      }

      this._vec3.copy(anchor).project(this.camera);

      const visible = this._vec3.z < 1.0;
      const x = (this._vec3.x * 0.5 + 0.5) * rect.width;
      const y = (-(this._vec3.y * 0.5) + 0.5) * rect.height;

      projections.push({
        partId: id,
        x,
        y,
        visible
      });
    }

    this.events.onProject(projections);

    if (this.showDataFlow && this.events.onProjectDataFlow) {
      const captions: DataFlowCaption[] = [];
      for (const route of this.dataFlowRoutes) {
        const midPoint = route.curve.getPointAt(0.5);
        this._vec3.copy(midPoint).project(this.camera);
        const visible = this._vec3.z < 1.0;
        const x = (this._vec3.x * 0.5 + 0.5) * rect.width;
        const y = (-(this._vec3.y * 0.5) + 0.5) * rect.height;

        captions.push({
          id: route.id,
          label: route.label,
          x,
          y,
          visible
        });
      }
      this.events.onProjectDataFlow(captions);
    }
  }

  private updateDataFlowAnimation(time: number): void {
    if (!this.dataFlowMesh) return;

    if (this.flowMode !== 'parts' && this.activeFlowStep && this.activeFlowStep.curve) {
      const pulseCount = 7;
      const speed = 0.00045;
      const baseOffset = (time * speed) % 1;
      const curve = this.activeFlowStep.curve;

      for (let i = 0; i < pulseCount; i++) {
        const t = (baseOffset + i / pulseCount) % 1;
        const pos = curve.getPointAt(t);

        this.dataFlowDummy.position.copy(pos);
        this.dataFlowDummy.scale.setScalar(1.2);
        this.dataFlowDummy.updateMatrix();

        this.dataFlowMesh.setMatrixAt(i, this.dataFlowDummy.matrix);
      }

      for (let i = pulseCount; i < this.totalDataFlowPulses; i++) {
        this.dataFlowDummy.position.set(0, -9999, 0);
        this.dataFlowDummy.scale.setScalar(0);
        this.dataFlowDummy.updateMatrix();
        this.dataFlowMesh.setMatrixAt(i, this.dataFlowDummy.matrix);
      }

      this.dataFlowMesh.instanceMatrix.needsUpdate = true;
      this.isDirty = true;
      return;
    }

    if (!this.showDataFlow || this.dataFlowRoutes.length === 0) return;

    const speed = 0.00038;
    const baseOffset = (time * speed) % 1;

    for (const route of this.dataFlowRoutes) {
      for (let i = 0; i < route.pulseCount; i++) {
        const t = (baseOffset + i / route.pulseCount) % 1;
        const pos = route.curve.getPointAt(t);

        this.dataFlowDummy.position.copy(pos);
        this.dataFlowDummy.scale.setScalar(1);
        this.dataFlowDummy.updateMatrix();

        this.dataFlowMesh.setMatrixAt(route.startIndex + i, this.dataFlowDummy.matrix);
      }
    }

    this.dataFlowMesh.instanceMatrix.needsUpdate = true;
    this.isDirty = true;
  }

  private startLoop = (): void => {
    const loop = (time: number) => {
      if (this.isDestroyed) return;
      this.animFrameId = requestAnimationFrame(loop);

      // Performance: pause rendering when tab is hidden
      if (document.hidden) return;

      if (this.cameraTween) {
        const { startTime, duration, startPos, endPos, startTarget, endTarget } = this.cameraTween;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        this.camera.position.lerpVectors(startPos, endPos, ease);
        this.controls.target.lerpVectors(startTarget, endTarget, ease);
        this.controls.update();

        this.isDirty = true;

        if (progress >= 1) {
          this.cameraTween = null;
        }
      } else {
        const moved = this.controls.update();
        if (moved) this.isDirty = true;
      }

      if (this.activeFlash && time >= this.activeFlash.expiresAt) {
        this.activeFlash = null;
        this.updateMaterials();
        this.isDirty = true;
      }

      this.checkHover();

      if (this.showDataFlow || (this.flowMode !== 'parts' && this.activeFlowStep)) {
        this.updateDataFlowAnimation(time);
      }

      if (this.isDirty) {
        try {
          this.renderer.render(this.scene, this.camera);
          this.projectCallouts();
          this.isDirty = false;
        } catch (err) {
          console.error('BoardScene render error:', err);
          this.events.onError?.(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    this.animFrameId = requestAnimationFrame(loop);
  };

  public dispose(): void {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animFrameId);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    const el = this.renderer?.domElement;
    if (el) {
      el.removeEventListener('pointerdown', this.handlePointerDown);
      el.removeEventListener('pointerup', this.handlePointerUp);
      el.removeEventListener('pointermove', this.handlePointerMove);
      el.removeEventListener('pointerleave', this.handlePointerLeave);
      el.removeEventListener('webglcontextlost', this.handleContextLost);
      el.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }

    this.resizeObserver?.disconnect();
    this.controls?.dispose();

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });

    if (this.scene.environment) {
      this.scene.environment.dispose();
    }

    this.renderer?.dispose();
    if (this.renderer?.domElement?.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
