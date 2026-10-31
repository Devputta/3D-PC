# Boardwalk — System Architecture & Technical Design

This document details the architectural decisions, graphics pipeline, state management, and extensibility patterns of the **Boardwalk 3D PC Hardware & Networking Blueprint Explorer**.

---

## 1. High-Level Architecture

Boardwalk is designed around a decoupled **hybrid architecture** combining a high-performance **Three.js WebGL scene engine** with a declarative **React 19 presentation layer**.

```text
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                                React 19 UI Layer                           │
 │  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐  ┌──────────────┐  │
 │  │ TopHeader.tsx│  │  NavRail.tsx   │  │RightColumn.tsx│  │LessonsStrip  │  │
 │  │ (Pack/Lang)  │  │  (Modes/Tools) │  │(Specs/Notes)  │  │ (Progress)   │  │
 │  └──────┬───────┘  └───────┬────────┘  └───────┬───────┘  └──────┬───────┘  │
 │         │                  │                   │                 │          │
 │         └──────────────────┼───────────────────┼─────────────────┘          │
 │                            ▼                   ▼                            │
 │                      ┌───────────────────────────────┐                      │
 │                      │      App.tsx (Root State)     │                      │
 │                      │  pack, lesson, part, explode  │                      │
 │                      └───────────────┬───────────────┘                      │
 └──────────────────────────────────────┼──────────────────────────────────────┘
                                        │ Synchronizes
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                           Three.js 3D Viewport                              │
 │  ┌───────────────────────────────────────────────────────────────────────┐  │
 │  │ BoardScene.ts (Three.js WebGLRenderer, Camera, OrbitControls, PCF)    │  │
 │  └───────────────────────────────────┬───────────────────────────────────┘  │
 │                                      │                                      │
 │            ┌─────────────────────────┴─────────────────────────┐            │
 │            ▼                                                   ▼            │
 │  ┌─────────────────────────┐                         ┌───────────────────┐  │
 │  │ Pack 3D Procedural Mesh │                         │ Signal Simulation │  │
 │  │ (Motherboard / Network) │                         │ (Curves & Pulses) │  │
 │  └─────────────────────────┘                         └───────────────────┘  │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 3D Viewport & Rendering Pipeline (`src/scene/BoardScene.ts`)

The 3D stage is driven by `BoardScene`, an encapsulated controller class that manages the WebGL lifecycle, scene graph, lighting, camera choreography, and input raycasting.

### Key Capabilities:
1. **Renderer Configuration**:
   - Uses `THREE.WebGLRenderer` with `antialias: true` and `alpha: true`.
   - Shadow map type: `THREE.PCFShadowMap` (Percentage-Closer Filtering) for soft, natural contact shadows.
   - Tone mapping: `THREE.ACESFilmicToneMapping` with tuned exposure (`1.08`) for realistic metallic surfaces.
2. **Camera & Orbit Clamping**:
   - `THREE.PerspectiveCamera` with variable FOV per pack (35° for PC motherboard, 38° for network rack).
   - Polar angle is strictly clamped:
     ```typescript
     this.controls.minPolarAngle = Math.PI * 0.05; // Prevents top singularity
     this.controls.maxPolarAngle = Math.PI * 0.44; // Clamps above workbench surface
     ```
   - Prevents learners from rotating the camera beneath the table or losing orientation.
3. **Screen-Space Projection**:
   - Converts 3D world coordinates of component anchors into 2D viewport coordinates `(x, y)`:
     ```typescript
     vector.project(this.camera);
     const screenX = ((vector.x + 1) * width) / 2;
     const screenY = ((-vector.y + 1) * height) / 2;
     ```
   - Powers the floating callout discs in `CalloutOverlay.tsx` with zero DOM-canvas desynchronization.
4. **Camera Choreography (Fly-To)**:
   - Smoothly interpolates the camera position and target between educational points of interest using smooth cubic ease-out curves (`t * (2 - t)`).
5. **Clean Resource Deallocation**:
   - Iterates through the scene graph, disposing of geometries, textures, materials, and canvas contexts to prevent WebGL memory leaks during pack switching.

---

## 3. Interaction Boundary & Event Isolation

A critical challenge in hybrid WebGL/DOM applications is preventing pointer gestures on DOM elements (such as clicking tabs, typing in text areas, or scrolling spec tables) from accidentally rotating or zooming the 3D canvas behind them.

### Architectural Solution:
- **Dedicated Interaction Surface**: OrbitControls are bound strictly to the canvas interaction element.
- **Pointer Down Event Propagation Stops**: React panels that sit above or beside the canvas (`RightColumn.tsx`, `CalloutOverlay.tsx`, modal backdrops) stop pointer events at their root:
  ```tsx
  <aside
    className="workbench-sheet ..."
    onPointerDown={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
  >
    {/* Tab controls, notes editor, and spec tables */}
  </aside>
  ```
- **Result**: Users can freely select text, click tabs, scroll tables, and edit notes without causing unwanted camera jumps or model spinning.

---

## 4. Procedural Geometry Factory (`src/packs/hardware/build.ts`)

Rather than relying on massive external 3D model files (`.gltf` / `.obj`), Boardwalk procedurally generates its components using Three.js primitives and canvas-backed textures.

### Advantages:
- **Zero Asset Loading Lag**: Loads instantly with zero network asset requests.
- **Exact Proportions**: Real-world ATX motherboard dimensions (305 mm × 244 mm) and socket pin footprints.
- **Instanced Mesh Optimization**: Surface-mount components (SMD capacitors, resistors, decoupling chokes) are rendered using a single `THREE.InstancedMesh`, allowing thousands of individual parts to be drawn in a single GPU draw call at a steady 60 FPS.
- **Dynamic Textures**: Silkscreen labels, motherboard PCB traces, and CPU heat spreader logos are drawn procedurally onto an offscreen HTML5 2D canvas and uploaded as dynamic Three.js canvas textures.

---

## 5. Explode Mechanics & Trajectories (`src/packs/*/layout.ts`)

Components explode outward along predetermined 3D vectors when the user drags the explode slider:

```typescript
export const HARDWARE_EXPLODE_VECTORS: Record<string, Vector3Tuple> = {
  motherboard: [0, -0.5, 0],
  cpu:         [0, 1.1, -0.8],
  cooler:      [0, 3.6, -0.8],
  ram:         [2.3, 1.5, -1.2],
  gpu:         [-0.6, 1.8, 1.8],
  ssd:         [0.8, 1.3, 0.5],
  ...
};
```

### Subassembly Hierarchies:
Certain parts contain internal nested subassemblies:
- The **CPU Cooler** contains the heatsink tower and an independent **Cooler Fan**.
- The **VRM Module** contains power chokes and an independent **VRM Heatsink**.

When exploded, subassemblies lift along secondary offsets relative to their parent group, exposing underlying silicon dies and socket retention levers without overlapping.

---

## 6. Flow & Signal Simulation Engine (`src/packs/*/flow.ts`)

Boardwalk features an interactive flow simulation system for educational signal tracing:

1. **Catmull-Rom 3D Splines**:
   - Each signal step defines a `THREE.CatmullRomCurve3` tracing the physical electrical or network route.
2. **Step Sequencing**:
   - Steps can run continuously or advance one step at a time via the `FlowPlayerStrip.tsx` controller.
3. **Pulsing Shaders / Particle Billboards**:
   - Animated light pulses travel along the spline at variable speed, color-coded by signal type:
     - **Cyan (`0x38bdf8`)**: PCIe & Memory data bus signals.
     - **Amber (`0xf59e0b`)**: +12V / +5V DC power rails.
     - **Teal (`0x14b8a6`)**: Layer 2/3 network packets.

---

## 7. Educational Pack Extensibility Pattern

Boardwalk uses a modular pack architecture defined in `src/packs/types.ts`. Any new engineering domain (e.g., *Operating System Kernel Architecture*, *Smartphone SoC*, *Automotive CAN Bus*) can be added by implementing the `PackDefinition` interface:

```typescript
export interface PackDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  parts: HardwarePart[];
  lessons: Lesson[];
  buildScene: (container: THREE.Group) => SceneBuildResult;
  explodeVectors: Record<string, Vector3Tuple>;
  anchors: Partial<Record<string, Vector3Tuple>>;
  homeCamera: CameraPreset;
  dataFlowRoutes: () => DataFlowRoute[];
  flows?: {
    dataFlow?: FlowStep[];
    powerFlow?: FlowStep[];
    packetFlow?: FlowStep[];
  };
}
```

Adding a pack requires only:
1. Creating a pack directory (`src/packs/<pack-name>/`).
2. Providing procedural geometry, lessons, and layout definitions.
3. Registering the pack in `src/packs/index.ts`.

---

## 8. Persistence & Notes Architecture (`src/lib/storage.ts`)

User notes and quiz high scores are stored using a resilient local storage engine:

- **Key Scoping**: Notes are keyed by pack, type, and target ID:
  ```text
  boardwalk_note_{packId}_{type}_{id}
  Example: boardwalk_note_hardware_part_cpu
  Example: boardwalk_note_networking_lesson_net-lesson-1
  ```
- **Legacy Migration**: If a scoped note is not found, the storage engine falls back to legacy keys (`boardwalk_note_{id}`) and migrates them forward automatically.
- **Fault Tolerance**: Wrapped in try/catch blocks with an in-memory cache fallback to ensure the application never crashes in private browsing mode or when storage quotas are exceeded.
- **Export & Print**:
  - `exportNotesAsText`: Compiles all saved notes into a clean, formatted plain-text study guide.
  - `@media print` in `src/styles.css`: Hides the 3D canvas, toolbars, and navigation rails during print dialogs, showing only the student's study notes and component diagrams.

---

## 9. Internationalization (i18n)

The i18n system uses a strongly-typed schema (`TranslationSchema` in `src/i18n/types.ts`) ensuring:
- Full compile-time type safety for every text string and parameterized formatter.
- Strict 1-to-1 parity between English (`en.ts`) and Hindi (`hi.ts`) translation bundles.
- Preserves technical engineering acronyms in English script within Hindi text to ensure conceptual accuracy for Hindi learners.
