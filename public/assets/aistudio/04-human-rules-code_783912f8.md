# Human rules: code

Code that was written by a person who cares has a particular feel: small, direct, with comments that explain why. Aim for that.

## Structure

1. **Few files, each with one job.** If you cannot say what a file is for in one sentence, split it.
2. **No premature abstraction.** Do not create a `useGenericThing` hook or a `BaseComponent` until the second real use appears.
3. **Data apart from behaviour.** Words and numbers in `data/`. Drawing code in `scene/`. Screens in `components/`.
4. **No dead code.** No commented-out blocks, no unused exports, no TODO without a reason.
5. **Strict TypeScript.** No `any`. Use union types for ids (`PartId`) so a typo fails the build.

## Comments

6. **Explain why, not what.** Good: "Each part gets its own copy of every material, so highlighting one part can never tint another that shares a colour." Bad: "// loop over parts".
7. **Admit the hacks.** If a number was tuned by eye, say so.
8. **No banner comments**, no ASCII art, no "Author:" headers.
9. **No comment on every line.** Most lines need none.

## Naming

10. Name by meaning: `flyTo`, `applyIsolation`, `homePosition`. Not `handleThing2`, `utils`, `helper`.
11. Constants are named for the idea, not the value: `FLASH_MS`, not `SIXTEEN_HUNDRED`.
12. Booleans read as questions: `isolate`, `locked`, `showLabels`.

## React

13. State lives as low as it can. Quiz state is a plain object with small pure functions (`answer`, `next`) in `lib/quiz.ts`, which are easy to test.
14. The 3D scene is a class created once in an effect and disposed in cleanup. React passes it props through small effects; the scene reports clicks through callbacks.
15. Callbacks given to a long-lived object go through a ref so they are never stale.
16. Do not store values in state that can be derived (the percentage label comes from the explode value).

## Safety and robustness

17. Every `localStorage` call is in try/catch.
18. Dispose of geometries, materials, textures and the renderer on unmount.
19. Handle a missing WebGL context with a message, not a blank screen.
20. Respect `prefers-reduced-motion` in code, not just in CSS.

## CSS

21. One stylesheet, custom properties for colour and type, grouped by area with short comments.
22. Class names describe things (`.rail`, `.sheet`, `.callout`), not looks (`.blue-box`).
23. State goes in attributes the browser understands (`aria-pressed`, `aria-selected`, `data-active`), and CSS reads those.
24. Mind specificity. Do not let a generic `.section` rule and a specific `.cta` rule fight over padding.

## Commits and files

25. Small commits with plain messages: "Add explode slider", "Fix callouts drifting on resize".
26. A README that says what is not finished.
27. No generated lockfile edits by hand, no committed `node_modules`, no `.env` in the repo.

## Test

Open a random file. Could a new teammate understand it in two minutes? If not, cut something.
