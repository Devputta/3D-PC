# Contributing to Boardwalk

Thank you for your interest in contributing to **Boardwalk — 3D PC Hardware & Networking Blueprint Explorer**! We welcome community contributions ranging from bug fixes and documentation enhancements to new 3D models and educational packs.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and open to feedback in all discussions, issues, and pull requests.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `bun`)
- **Git**

### 2. Fork & Clone
```bash
# Clone your fork
git clone https://github.com/<your-username>/3D-PC.git
cd 3D-PC

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The application will be running at `http://localhost:3000`.

---

## Development Workflow

### Branching Convention
Create a descriptive branch for your work:
- `feat/add-audio-hardware-pack` (new feature or pack)
- `fix/orbit-controls-drag-isolation` (bug fix)
- `docs/update-architecture-guide` (documentation)
- `perf/instanced-mesh-vrm` (performance optimization)

### Commit Message Guidelines
Follow conventional commit formatting:
- `feat: add optical SFP+ transceiver to networking pack`
- `fix: prevent 3D canvas drag when scrolling specification table`
- `test: add unit tests for Hindi lesson localization parity`
- `docs: update quick start instructions in README`

---

## Coding Standards

### 1. TypeScript Strictness
- Strict mode is enabled (`"strict": true` in `tsconfig.json`).
- Avoid using `any`; define explicit interfaces and types.
- Ensure all types are properly exported and shared via `src/packs/types.ts` or appropriate module definitions.

### 2. React Guidelines
- Use modern functional components with hooks (`useState`, `useCallback`, `useMemo`, `useRef`).
- Keep components modular and self-contained in `src/components/`.
- Ensure pointer events originating on UI panels do not leak into the 3D canvas. Use `onPointerDown={(e) => e.stopPropagation()}` on interactive panel roots.

### 3. Three.js / WebGL Guidelines
- **Procedural Geometry First**: Prefer creating procedural geometry using Three.js primitives rather than loading heavy external 3D files.
- **InstancedMeshes for Repetition**: Always use `THREE.InstancedMesh` when rendering repeated elements (such as capacitors, pins, or cooling fins) to keep GPU draw calls low.
- **Resource Disposal**: Always properly dispose of geometries and materials when removing objects from the scene graph to prevent WebGL memory leaks.
- **Shadow Mapping**: Use `THREE.PCFShadowMap` for soft, performant contact shadows.

### 4. Styling & Design Tokens
- Boardwalk uses a dedicated **workbench theme** inspired by anti-static mats and engineering schematics.
- All styles live in `src/styles.css`. Maintain consistency with existing CSS variables:
  - Surface colors: `--canvas-bg`, `--card-bg`, `--panel-bg`
  - Accent colors: `--accent-blue` (data), `--accent-amber` (power), `--accent-teal` (network)
  - Typography: Barlow and Barlow Condensed

### 5. Accessibility (a11y)
- Provide visible focus rings for keyboard navigation.
- Include descriptive `aria-label` attributes on icon-only buttons.
- Ensure modal dialogs can be closed with the `Escape` key.
- Maintain high contrast ratios for text over backgrounds.

---

## How to Add a New Educational Pack

Boardwalk's modular pack architecture makes it straightforward to add new subjects (such as *GPU Microarchitecture*, *Storage & RAID*, or *Embedded Microcontrollers*):

1. **Create Pack Directory**:
   Create `src/packs/<pack-name>/`.

2. **Define Components (`parts.ts`)**:
   Export an array of `HardwarePart` objects including name, role, specifications, typical numbers, and quiz clues.

3. **Build 3D Geometry (`build.ts`)**:
   Implement a builder function `(container: THREE.Group) => SceneBuildResult` constructing procedural meshes, materials, and pickable hitboxes.

4. **Define Layout & Explode Vectors (`layout.ts`)**:
   Define `EXPLODE_VECTORS` and 3D `ANCHORS` for floating callout discs in screen space.

5. **Write Lessons (`lessons.ts` & `lessons-hi.ts`)**:
   Create 8 progressive disclosure lessons conforming to the `Lesson` schema, with English and Hindi translations.

6. **Define Signal Flows (`flow.ts`)**:
   Optionally define Catmull-Rom 3D splines and pulse colors for data or power simulations.

7. **Register in `src/packs/index.ts`**:
   Add the new pack definition to the `PACKS` registry array.

---

## Testing Requirements

Before opening a pull request, verify that your changes pass all checks:

```bash
# 1. Type check
npm run typecheck

# 2. Lint / Validation
npm run lint

# 3. Automated Vitest suite
npm test

# 4. Production build check
npm run build
```

When adding new features or packs, write corresponding automated tests in `tests/`.

---

## Pull Request Checklist

- [ ] My code follows the project's TypeScript and styling conventions.
- [ ] New components and controls include keyboard accessibility and ARIA labels.
- [ ] `npm run typecheck` passes with 0 errors.
- [ ] `npm test` passes all tests.
- [ ] `npm run build` generates a production build without errors.
- [ ] Updated documentation (`README.md`, `CHANGELOG.md`) if introducing new features or behavioral changes.
