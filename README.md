# Boardwalk — 3D PC Hardware & Networking Blueprint Explorer

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r186-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Vitest-31%20Passing-brightgreen.svg)](https://vitest.dev/)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20HI-orange.svg)](#bilingual-learning-en--hi)

> **Boardwalk** is an interactive, browser-based 3D architectural exploration and learning workbench. Built with Three.js and React 19, it translates dense computer engineering concepts into tactile, explodable 3D models with real-time signal simulation, guided lessons, diagnostic quizzes, and assembly verification.

---

## Table of Contents

- [Why Boardwalk?](#why-boardwalk)
- [Interactive Features](#interactive-features)
  - [1. 3D ATX Motherboard Explorer](#1-3d-atx-motherboard-explorer)
  - [2. 3D Networking & Rack Explorer](#2-3d-networking--rack-explorer)
  - [3. Smooth 3D Explode Engine](#3-smooth-3d-explode-engine)
  - [4. Animated Signal & Power Simulations](#4-animated-signal--power-simulations)
  - [5. Progressive Disclosure Lessons](#5-progressive-disclosure-lessons)
  - [6. 3D Spatial & Multiple-Choice Quizzes](#6-3d-spatial--multiple-choice-quizzes)
  - [7. PC Assembly Simulator (Build Mode)](#7-pc-assembly-simulator-build-mode)
  - [8. Scoped Personal Study Notes](#8-scoped-personal-study-notes)
  - [9. Responsive Fullscreen Mode & Gesture Isolation](#9-responsive-fullscreen-mode--gesture-isolation)
  - [10. Bilingual Localization (English & Hindi)](#10-bilingual-localization-english--hindi)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment Guide](DEPLOYMENT.md)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Contributing](#contributing)
- [License](#license)

---

## Why Boardwalk?

Learning computer hardware usually requires either sacrificing expensive physical parts or reading dry, static 2D diagrams. Boardwalk bridges this gap with a high-fidelity virtual workbench where learners can:
- Rotate, inspect, and explode modern desktop components down to the pin-out level.
- Trace microvolt electrical signals and gigabit PCIe data streams in real time.
- Make mistakes in assembly (such as trying to drop an AMD CPU into an Intel socket) and learn the exact architectural reasons why they fail.
- Build confidence before ever picking up a screwdriver.

---

## Interactive Features

### 1. 3D ATX Motherboard Explorer
- **Components Included**: Intel LGA1700 Socket, Dual-Channel DDR5 DIMMs, PCIe 5.0 x16 Slot & GPU, M.2 PCIe 4.0 NVMe SSD with aluminum thermal block, Multiphase VRM and DrMOS power stages, Platform Controller Hub (PCH Chipset), 24-Pin ATX Main Power, CR2032 CMOS battery, SATA 6 Gb/s ports, and Backplate I/O shield.
- **Procedural Geometry**: Custom procedural meshes rendered with realistic solder mask textures, circuit traces, silk-screen component labels, and thousands of instanced SMD surface-mount resistors/capacitors.
- **Lighting & Shadows**: Directional key light with PCF soft shadows, ambient fill, and subtle rim highlights for realistic depth perception.

### 2. 3D Networking & Rack Explorer
- **Components Included**: Client Laptop/Workstation, 24-Port Gigabit Managed Switch, Edge Gateway Router, Perimeter Firewall Appliance, Rackmount Web Server, and Authoritative DNS Resolver.
- **Network Architecture**: Explores the full OSI model from Layer 1 physical patch cables to Layer 7 HTTPS TLS 1.3 encrypted data streams.

### 3. Smooth 3D Explode Engine
- A dedicated slider smoothly explodes the 3D assembly outward along tuned trajectory vectors.
- Subassemblies (such as the CPU cooler fan and VRM heat spreader blocks) lift independently to reveal underlying power chokes, thermal pads, and socket pins without collision.

### 4. Animated Signal & Power Simulations
- **Hardware Data Flow**: 4-stage data pipeline tracing video file playback:
  1. *Storage to RAM* (NVMe SSD DMA transfer)
  2. *RAM to CPU* (L1/L2/L3 cache line population)
  3. *CPU to GPU* (PCIe 5.0 draw calls & vertex submission)
  4. *GPU to Display* (Framebuffer scanout over DisplayPort)
- **Hardware Power Flow**: Traces +12V, +5V, and +3.3V DC power distribution across EPS 8-pin, 24-pin ATX, and PCIe aux cables with real-time voltage badges.
- **Networking Packet Flow**: Traces client web requests through switch MAC forwarding, router default gateway routing, DNS query resolution, and perimeter firewall inspection.

### 5. Progressive Disclosure Lessons
- 8 structured lessons per pack covering fundamental to advanced concepts.
- Each lesson includes:
  - **Overview**: High-level architectural role and exactly 3 verified technical facts.
  - **Ports & Connections**: Interactive signal routing matrix.
  - **Live Example**: Functional configuration or diagnostic code block with one-sentence takeaways.
  - **Specs**: Standard industry operating numbers (voltage, frequency, bandwidth, thermal limits).
  - **Diagnostic Quiz**: Exactly 3 knowledge-check questions with detailed explanations.

### 6. 3D Spatial & Multiple-Choice Quizzes
- **Spatial Picking**: Learners identify parts directly on the 3D canvas based on functional clues (e.g. *"Find the chip that regulates +12V down to ~1.2V core voltage"*).
- **Direct Feedback**: Instant visual green/red feedback with camera fly-to on the target component upon answer.
- **Custom Quiz Builder**: Filter questions to specific weak areas or components.
- **Persistent High Scores**: Track best scores in browser storage with full question breakdowns.

### 7. PC Assembly Simulator (Build Mode)
- Test your hardware knowledge by installing components into their respective motherboard slots.
- **Architectural Rules Enforced**:
  - Socket keying (prevents AMD AM5 from seating in an Intel LGA1700 socket).
  - RAM notch alignment (rejects DDR4 sticks in DDR5 slots).
  - Power budget limits (flags high-TDP GPUs on standard power supplies).
  - Physical clearance checks (flags tall CPU tower coolers exceeding case depth).

### 8. Scoped Personal Study Notes
- Write rich notes directly on any hardware part or lesson.
- **Isolation**: Notes are strictly scoped by pack and component/lesson ID to prevent cross-topic pollution.
- **Persistence**: Safely cached in memory and persisted to `localStorage` with silent error handling and automatic migration from legacy keys.
- **Export & Print**: Full printable study guide (`Ctrl+P` / Print Notes) and formatted plain-text export.

### 9. Responsive Fullscreen Mode & Gesture Isolation
- **Fullscreen API**: Expands the 3D canvas across the entire display with graceful fallback for embedded iframes.
- **Pointer Event Isolation**: Clicking tabs, buttons, or typing notes never accidentally drags or rotates the 3D model.
- **Adaptive Canvas**: Uses `ResizeObserver` to smoothly update camera aspect ratios without stretching or clipping.

### 10. Bilingual Localization (English & Hindi)
- Full support for both English (`en`) and Hindi (`hi`).
- Preserves universal engineering acronyms (CPU, RAM, PCIe, GPU, BIOS, MAC, DNS, TCP) in English script within Hindi text for technical clarity.
- Instant, zero-reload language switching.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Core Framework** | React 19 + TypeScript | Concurrent rendering, strict typing, functional hooks architecture |
| **3D Engine** | Three.js (r186+) | Hardware-accelerated WebGL rendering, custom procedural meshes |
| **Bundler** | Vite 8 | Near-instant HMR, ES module builds, optimized asset bundling |
| **Styling** | Workbench Design System | Hand-crafted anti-static mat palette, dark ink tokens, Barlow typography |
| **Testing** | Vitest 5 | High-speed unit & integration test runner with in-memory storage mocks |

---

## Project Structure

```text
boardwalk/
├── .gitattributes            # Line ending normalization and binary asset rules
├── .gitignore                # Comprehensive Git ignore rules
├── index.html                # HTML entry point with typography preconnects
├── metadata.json             # Applet capabilities and identification
├── package.json              # Dependency definitions and npm scripts
├── tsconfig.json             # Strict TypeScript compiler options
├── vite.config.ts            # Vite configuration
│
├── public/
│   └── fonts/                # Self-hosted Barlow & Barlow Condensed WOFF2 fonts
│
├── src/
│   ├── main.tsx              # Application root mount
│   ├── App.tsx               # Primary workbench state controller
│   ├── styles.css            # Workbench tokens, layout grid, print styles
│   │
│   ├── components/           # UI Component Layer
│   │   ├── BoardView.tsx         # 3D canvas wrapper, toolbar, callouts overlay
│   │   ├── CalloutOverlay.tsx    # Screen-space 3D floating component badges
│   │   ├── RightColumn.tsx       # Specification sheet, tabs, note editor
│   │   ├── LessonsStrip.tsx      # Bottom lesson ribbon with completion badges
│   │   ├── FlowPlayerStrip.tsx   # Step-by-step signal simulation controls
│   │   ├── NavRail.tsx           # Left pack & mode navigation rail
│   │   ├── TopHeader.tsx         # Top bar with pack switch & language selector
│   │   ├── CompareModal.tsx      # Side-by-side component comparison modal
│   │   ├── CustomQuizModal.tsx   # Filtered custom quiz builder
│   │   ├── PrintNotesView.tsx    # Clean printable study notes sheet
│   │   └── WelcomeModal.tsx      # First-run onboarding dialog
│   │
│   ├── data/                 # Static Hardware & Comparison Data
│   │   ├── parts.ts              # Component specs, numbers, failure notes
│   │   ├── build.ts              # Assembly tray parts & compatibility rules
│   │   └── compare.ts            # Side-by-side comparison matrices
│   │
│   ├── i18n/                 # Internationalization
│   │   ├── types.ts              # Translation schema types
│   │   ├── en.ts                 # English dictionary
│   │   ├── hi.ts                 # Hindi dictionary
│   │   └── index.tsx             # I18n context provider & useI18n hook
│   │
│   ├── lib/                  # Pure Utility Logic
│   │   ├── quiz.ts               # Quiz state machine, randomizer, grading
│   │   └── storage.ts            # Isolated persistent note storage
│   │
│   ├── packs/                # Educational Domain Packs
│   │   ├── types.ts              # Pack, lesson, and flow schema interfaces
│   │   ├── index.ts              # Central pack registry
│   │   ├── hardware/             # PC Motherboard pack (3D, lessons, flows)
│   │   └── networking/           # Computer Networking pack (3D, lessons, flows)
│   │
│   └── scene/                # 3D Scene Controller
│       ├── BoardScene.ts         # Three.js renderer, OrbitControls, raycaster
│       ├── build.ts              # Procedural geometry factory
│       └── layout.ts             # Explode trajectories & camera presets
│
└── tests/                    # Automated Test Suite (Vitest)
    ├── boardwalk.test.ts     # Core functional audit (notes, quiz, build)
    ├── i18n.test.ts          # Localization parity & formatter validation
    ├── flows.test.ts         # Data/power/packet flow curves & steps
    ├── layout-scene.test.ts  # 3D explode vectors & camera presets
    └── compare.test.ts       # Hardware comparison pair integrity
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `bun`)

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/Devputta/3D-PC.git
cd 3D-PC

# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Run automated tests
npm test

# Build production bundle
npm run build
```

---

## Testing & Quality Assurance

Boardwalk maintains a comprehensive test suite using **Vitest** with 31 passing unit and integration tests across 5 test suites:

```bash
npm test
```

### Test Coverage Highlights:
1. **`tests/boardwalk.test.ts`**:
   - Pack and component note isolation.
   - Legacy note key backward compatibility.
   - Quiz scoring, skipping, and honest answer evaluation.
   - Build mode physical compatibility logic (socket, RAM notch, TDP, cooler clearance).
2. **`tests/i18n.test.ts`**:
   - Exact schema symmetry between English and Hindi translation dictionaries.
   - Dynamic string formatting functions.
   - 1-to-1 lesson parity between English and Hindi packs.
3. **`tests/flows.test.ts`**:
   - Sequential step numbering and continuous Catmull-Rom 3D splines.
   - Active component cross-validation against the hardware catalog.
4. **`tests/layout-scene.test.ts`**:
   - Finite coordinates for all 3D explode trajectories and callout anchors.
   - Valid camera presets and subassembly offsets.
5. **`tests/compare.test.ts`**:
   - Balanced specifications and decision criteria across comparison matrices.

For full testing documentation and manual QA checklists, see [`TESTING.md`](TESTING.md).

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play / Pause animated signal or power flow |
| `Left Arrow` / `[` | Previous lesson / journey step |
| `Right Arrow` / `]` | Next lesson / journey step |
| `F` | Toggle 3D canvas fullscreen mode |
| `Esc` | Close active dialog / exit fullscreen / deselect component |
| `R` | Reset 3D camera to default workbench angle |
| `Ctrl + P` / `Cmd + P` | Open clean printable study notes view |

---

## Contributing

Contributions, bug reports, and educational pack proposals are warmly welcomed! Please read our [`CONTRIBUTING.md`](CONTRIBUTING.md) guide for details on code style, pack authoring, and our pull request process.

---

## Documentation Links

- [System Architecture](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Testing & QA Guide](TESTING.md)
- [Contribution Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

---

## License

This project is licensed under the MIT License — see the LICENSE file for details.
