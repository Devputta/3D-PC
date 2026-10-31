# Boardwalk — Testing & Quality Assurance Guide

This guide describes the testing strategy, automated test suites, and manual verification procedures for the **Boardwalk 3D PC Hardware & Networking Blueprint Explorer**.

---

## 1. Testing Philosophy

- **Zero Fake Mock Data**: Tests evaluate the application's actual domain data (`hardwarePack`, `networkingPack`, `COMPARE_PAIRS`, `TRAY_PARTS`, `BUILD_SLOTS`).
- **Deterministic State Machines**: Core business logic (quiz grading, lesson progression, compatibility constraints, storage isolation) is decoupled from React rendering and tested as pure functions.
- **Fast Feedback Loop**: The entire Vitest test suite executes in under 2 seconds.

---

## 2. Test Suite Catalog

The test suite is organized into 5 targeted test files in the `/tests/` directory:

| Test File | Focus Area | Key Invariants Verified |
|---|---|---|
| **`tests/boardwalk.test.ts`** | Core Functional Audit | Note scoping by pack/part/lesson; legacy key migration; quiz grading; custom quiz filtering; build mode compatibility constraints. |
| **`tests/i18n.test.ts`** | Localization Parity | Schema symmetry between English (`en`) and Hindi (`hi`); dynamic string formatters; 1-to-1 parity of hardware and networking lessons. |
| **`tests/flows.test.ts`** | Signal & Flow Simulations | Sequential step ordering; 3D Catmull-Rom spline continuity; finite vector points; active component ID validation. |
| **`tests/layout-scene.test.ts`** | 3D Layout & Camera Presets | Explode vector completeness; 3D callout anchor coordinates; subassembly lifts; camera home preset angles and FOV. |
| **`tests/compare.test.ts`** | Comparison Matrices | Comparison pair structure; spec label/value symmetry; "when to choose" decision criteria. |

---

## 3. How to Run Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npx vitest
```

### Run a Single Test File
```bash
npx vitest run tests/i18n.test.ts
```

### Run with Coverage
```bash
npx vitest run --coverage
```

---

## 4. Manual QA Verification Checklist

In addition to automated unit and integration tests, use the following checklist when performing release QA:

### 3D Canvas & Camera Controls
- [ ] **Orbit & Zoom**: Click and drag on the 3D canvas to rotate the model. Scroll to zoom in and out.
- [ ] **Polar Angle Clamping**: Verify that the camera cannot be dragged underneath the table surface or through the top singularity.
- [ ] **Camera Reset**: Click the "Reset View" button (or press `R`) to return the camera to its default framing.
- [ ] **Fullscreen Mode**:
  - Click the fullscreen toggle in the 3D toolbar (or press `F`).
  - Verify that the canvas expands across the entire monitor or viewport.
  - Press `Esc` or click the exit-fullscreen button to restore normal layout.

### Interaction Boundary & Event Isolation
- [ ] **Tab Navigation**: Click repeatedly between *Overview*, *Ports & Connections*, *Example*, *Specs*, and *Notes*.
  - **Critical Test**: Verify that clicking tabs **never** initiates 3D camera dragging or alters the camera angle.
- [ ] **Panel Scrolling**: Scroll long specification tables or lesson overviews. Verify the 3D canvas behind the panel does not zoom.
- [ ] **Note Editing**: Click into the study notes textarea and type. Verify that typing characters (such as `f`, `r`, space, or arrows) does not trigger camera reset or step navigation.

### Personal Study Notes & Printing
- [ ] **Note Scoping**: Type a note on the *CPU* in the *PC Hardware* pack. Switch to the *Networking* pack and verify that the CPU note is isolated and not displayed on network components.
- [ ] **Persistence**: Refresh the browser page. Verify that notes typed previously remain intact.
- [ ] **Printable Notes Sheet**:
  - Click the "Print Notes" button (or press `Ctrl+P` / `Cmd+P`).
  - Verify that the print preview shows a clean, formatted document with student notes and diagrams, with all canvas toolbars and buttons hidden.

### Quiz & Assembly Simulator
- [ ] **3D Quiz Picking**: Start a hardware quiz. Click the correct 3D component on the canvas and verify immediate green feedback. Click an incorrect part and verify red feedback with the correct answer revealed.
- [ ] **Custom Quiz**: Open the Custom Quiz dialog, select 3 specific parts, and start the quiz. Verify that exactly 3 questions targeting those parts are presented.
- [ ] **Build Mode Constraints**:
  - Drag an *AMD AM5 CPU* into the *Intel LGA1700 Socket*. Verify that it is rejected with the message explaining socket mismatch.
  - Drag a *DDR4 RAM Stick* into the *DDR5 Slot*. Verify rejection explaining mechanical key notch misalignment.
  - Drag compatible parts into all 6 slots and verify the assembly completion banner.

### Localization
- [ ] **Language Toggle**: Switch between English and Hindi (`हिन्दी`) in the top header.
- [ ] Verify that all UI headers, navigation buttons, lesson descriptions, facts, and quiz questions instantly switch languages without page reloads.
