# Performance

## Budgets

| Thing | Target |
| --- | --- |
| First load, over a typical connection | Usable in under 3 seconds |
| JavaScript, compressed | Under 250 KB for the app, plus Three.js in its own chunk |
| Fonts | Five local files, about 540 KB in total. Subset them if size matters. |
| Draw calls | Under 400 |
| Frame time while moving | Under 8 ms on a mid-range laptop |
| Frame time while still | Zero. Nothing is drawn. |

## Render on demand

The loop runs every frame but only calls `render` when something changed. That is the single biggest saving, and it keeps phones cool and batteries alive.

Mark the scene dirty when:

- the orbit controls report movement
- a camera tween is running
- explode changes
- a highlight or isolation changes
- the container resizes

Skip the loop completely when `document.hidden` is true.

## Geometry and materials

- Instance anything repeated: 26 cooler fins and 280 surface-mount parts are two draw calls, not 306.
- Share geometries within a part. Materials are cloned per part on purpose (see 05-architecture.md), which is a few dozen extra materials and nothing more.
- Keep cylinder segment counts at 12 to 40 depending on how big they are on screen.
- The board texture is one 2048 by 1638 canvas. Do not go larger.

## Shadows

- One directional light, one 2048 shadow map, drawn only when the scene changes.
- Surface-mount instances do not cast shadows. They are tiny and cost a lot to render into the map.

## Pixel ratio

Cap at 2. A three-times pixel ratio on a phone nearly triples the work for detail nobody sees.

## Memory

- Dispose of geometries, materials, textures and the renderer when the viewer unmounts.
- Under React Strict Mode in development the scene is created, destroyed and created again. If the second one is missing something, the cleanup is incomplete.

## React

- Callout positions are written straight to the DOM from the scene, not through state. The camera moving never re-renders React.
- The only frequent state change is the explode value during the opening settle and while dragging the slider. Both re-render the app a few times per frame at most, which is fine for a tree this small.
- If profiling shows that is not fine, move the explode value to a ref and a subscription.

## Build

- Split Three.js into its own chunk so app edits do not invalidate its cache.
- Compress fonts to WOFF2 if they grow.
- Serve with long-lived caching on hashed files.

## Phones

- Lower the pixel ratio cap to 1.5 on small screens.
- Consider turning off shadows below a certain width if frame times suffer.
- Test on a real mid-range Android phone, not only an emulator.

## Measuring

- Use the browser Performance panel and watch for long frames while orbiting.
- Log `renderer.info.render.calls` once after load and compare it to the budget.
- Check the Network panel for anything loading that should not.
