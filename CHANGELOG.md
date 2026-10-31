# Changelog

All notable changes to the **Boardwalk — 3D PC Hardware & Networking Blueprint Explorer** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-30

### Fixed
- **3D Canvas Dragging on Tab Clicks**: Resolved critical issue where clicking *Overview*, *Ports & Connections*, *Example*, *Specs*, or *Notes* tabs initiated camera rotation or caused unwanted 3D gestures. Added pointer-event propagation barriers (`onPointerDown={(e) => e.stopPropagation()}`) across `RightColumn.tsx` and `CalloutOverlay.tsx`.
- **Three.js Shadow Map Deprecation**: Migrated deprecated `PCFSoftShadowMap` to `THREE.PCFShadowMap` in `BoardScene.ts`, eliminating runtime console warnings in Three.js r186+.
- **Study Notes Isolation**: Scoped note storage keys by pack ID and target ID (`boardwalk_note_{packId}_{type}_{id}`), preventing notes written on hardware components from bleeding into networking components or across lessons.
- **Legacy Notes Migration**: Implemented transparent forward migration for legacy un-scoped note keys (`boardwalk_note_{id}`) with in-memory caching fallback.
- **Print Notes Blank Page Bug**: Overhauled print stylesheet (`@media print`) in `src/styles.css` and `PrintNotesView.tsx` to cleanly isolate printable note cards and hide all canvas viewports, toolbars, and navigation rails during printing.
- **Card Scrolling & Clipping**: Added internal overflow scrolling to technical specification tables and lesson cards to prevent buttons and tabs from clipping on smaller viewports.

### Added
- **Fullscreen 3D Viewer Mode**: Added expand/fullscreen toggle to the 3D viewer toolbar with browser Fullscreen API integration, responsive `ResizeObserver` re-projection, and `Escape` key exit handler.
- **Comprehensive Vitest Automated Test Suite**: Expanded testing coverage to 31 tests across 5 test suites:
  - `tests/boardwalk.test.ts`: Notes isolation, legacy migration, quiz engine, and build mode compatibility rules.
  - `tests/i18n.test.ts`: Structural symmetry between English and Hindi dictionaries, dynamic string formatters, and lesson parity.
  - `tests/flows.test.ts`: Hardware data flow, power flow, and networking packet flow spline continuity and part references.
  - `tests/layout-scene.test.ts`: 3D explode vectors, callout anchors, and camera home presets.
  - `tests/compare.test.ts`: Hardware comparison pairs, spec symmetry, and decision criteria.
- **Complete Git Repository Documentation**: Added production-grade markdown documents:
  - `README.md`: Comprehensive project overview, feature matrix, quick start, architecture, and shortcuts.
  - `ARCHITECTURE.md`: In-depth breakdown of Three.js rendering, procedural geometry, interaction boundaries, and pack extensibility.
  - `CONTRIBUTING.md`: Developer guide, coding conventions, pack authoring tutorial, and pull request checklist.
  - `TESTING.md`: Test catalog, test commands, and comprehensive manual QA verification checklist.
  - `CHANGELOG.md`: Detailed release and bug-fix history.
  - `.gitattributes`: Line ending normalization (`LF`) and binary asset handling rules.
  - `.gitignore`: Clean ignore patterns for node, vite, vitest, and OS artifacts.

---

## [1.1.0] - 2026-10-15

### Added
- **Computer Networking Educational Pack**:
  - 6 new 3D models: Client Laptop, 24-Port Switch, Gateway Router, Perimeter Firewall, Web Server, and DNS Resolver.
  - 8 networking lessons covering physical framing, MAC tables, IP routing, DNS resolution, TLS handshakes, and firewalls.
  - Animated 5-step packet flow simulation tracing client HTTP requests and server responses.
- **Bilingual Localization (English & Hindi)**:
  - Full Hindi translation bundle (`src/i18n/hi.ts`, `lessons-hi.ts`).
  - Preserves universal engineering acronyms (CPU, RAM, PCIe, GPU, MAC, IP, DNS) in English letters within Hindi text.
  - Seamless zero-reload language switcher in top header.
- **Custom Quiz Builder**:
  - Filter quiz questions to specific user-selected hardware components.
  - Shareable quiz links and question count selection.

---

## [1.0.0] - 2026-09-01

### Added
- **Initial Release of Boardwalk 3D PC Hardware Explorer**:
  - 12 procedural ATX motherboard hardware components (LGA1700 Socket, DDR5 RAM, PCIe 5.0 GPU, M.2 NVMe SSD, VRM, Chipset, PSU, CMOS Battery, SATA, I/O).
  - Procedural solder mask, circuit traces, silkscreen labels, and instanced surface-mount meshes.
  - Explode slider with tuned 3D trajectories and subassembly lifts (Cooler Fan, VRM Heatsink).
  - 4-stage hardware data flow and power rail distribution animation.
  - 8 structured hardware lessons with progressive disclosure.
  - 3D spatial picking quiz and multiple-choice tests with persistent score tracking.
  - PC Assembly Simulator (Build Mode) enforcing physical socket keying and power budget constraints.
