# Master prompt

Paste everything below the line into your coding assistant. Attach files 02, 03, 04 and 06 with it.

---

You are building **Boardwalk**, a browser app that teaches computer hardware through an interactive 3D motherboard. It is inspired by a 3D anatomy explorer, but the subject is a PC. Build a working first version, not a mockup.

## Who it is for

Students and self-taught beginners who have never opened a computer. They should finish a ten-minute session able to point at the CPU, RAM, GPU and SSD on a real board and say what each one does.

## Stack

- Vite, React 19, TypeScript (strict), Three.js.
- Hand-written CSS in one stylesheet. No Tailwind, no component library, no icon pack.
- Fonts: Barlow and Barlow Condensed, shipped as local files.
- No backend. Notes and quiz best score go in localStorage, wrapped in try/catch.

## The 3D board

Build every part from Three.js primitives (boxes, cylinders, a canvas-drawn texture). Do not download or import models.

Twelve parts: motherboard, CPU, CPU cooler, RAM (two sticks), graphics card, NVMe SSD, chipset, voltage regulators, 24-pin power connector, CMOS battery, rear I/O, SATA ports.

Details that make it believable:

- A canvas texture for the board with trace bundles, mounting holes, pads and white silkscreen text (CPU_SOCKET, DIMM_A1, PCIEX16_1 and so on).
- About 280 tiny surface-mount parts as one instanced mesh.
- A CPU lid texture with engraved text and a corner marker.
- Fins on the cooler as an instanced mesh, a fan with blades, heat pipes.
- A soft shadow on the ground plane so the board does not float.

Behaviour:

- Orbit controls with damping, no panning, clamp the polar angle so you cannot go under the board.
- Click a part to select it. The camera flies to it over about 850 ms.
- Hover gives a faint highlight. Selection gives a stronger one.
- An **Explode** slider moves every part along its own vector. Some parts have a sub-assembly that travels further (the cooler fan, the regulator heatsink).
- **Isolate part** fades everything except the selected part.
- Numbered callout discs float over the model, one per part. Clicking one selects it.
- Render on demand. When nothing moves, nothing is drawn.
- If WebGL is missing, show a plain message with what to try.

## Modes

**Explore.** Left: numbered list of the twelve parts. Right: a detail sheet (name, one-line summary, two short paragraphs, "Typical numbers" table, "When it goes wrong", a notes box).

**Journey.** Six steps following a video file being opened: SSD, RAM, CPU, voltage regulators, GPU, cooler. Each step moves the camera to the part. Next, Back, and the arrow keys work.

**Quiz.** Eight random questions. Each shows a clue that does not contain the part's name. The player clicks the part on the board. Numbers are hidden. Correct flashes green, wrong flashes red and reveals the right one. Skip is allowed. End screen shows the score, the best score, and a list of answers.

## Layout

Three zones: a narrow left rail, the 3D stage in the middle, a right sheet. Stage is the widest. Below 920 px wide, stack with the stage first.

## Opening moment

On load the board starts 80 percent exploded and settles together over about 1.7 seconds. This is the only motion that is not a response to a click. Skip it when the user prefers reduced motion, and cancel it if they touch the slider.

## Rules you must follow

- Follow 02-human-rules-visual.md, 03-human-rules-copywriting.md and 04-human-rules-code.md as hard constraints, not suggestions.
- Use the exact tokens in 06-design-tokens.md.
- Keep all text and numbers in `src/data/parts.ts`. The 3D code knows only ids.
- Every interactive thing must work with a keyboard and have a visible focus ring.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`. Provide a light and a dark theme with a toggle.

## Do not

- Do not add gradients as decoration, glass effects, glow, or emoji.
- Do not add a hero section, a feature grid, a testimonial block or a pricing block. This is a tool, not a landing page.
- Do not invent statistics, user counts or testimonials.
- Do not claim features that are not built.

## Deliverables

1. The full project, running with `npm install` then `npm run dev`.
2. `npm run build` passes and `npm run typecheck` passes.
3. A README that says what it is, how to run it, how the folders are laid out, and what is not finished.

## Check your work before you say you are done

Run the build. Open the page in a real browser and take screenshots of Explore, Journey and Quiz, in light and dark, at desktop and phone width. Fix what looks wrong. Then walk through 13-qa-checklist.md and report anything that fails. If something could not be tested, say so.
