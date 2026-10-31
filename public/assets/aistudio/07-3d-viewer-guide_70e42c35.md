# 3D viewer guide

## Coordinates

- The board's top surface is `y = 0`. Board spans `x` from -5 to 5 and `z` from -4 to 4.
- Back of the board is `-z`, front is `+z`. The rear I/O is on the left edge (`-x`), like a real board.
- One scene unit is about 30 mm. Parts are enlarged slightly for visibility (the CPU socket is about 2 units, not 1.3).
- Each part is a `THREE.Group` with its origin at the world origin and children in absolute positions. Exploding is just moving the group.

## Scene setup

- Renderer: antialias on, alpha on (so the CSS grid shows through), ACES tone mapping, sRGB output, pixel ratio capped at 2.
- Light: a soft hemisphere light, one directional light with shadows (2048 map, normal bias 0.03), and a room-style environment map at about 0.55 intensity for the metal.
- A `ShadowMaterial` plane just below the board catches the shadow so the model sits on the page.
- Camera: perspective, field of view 35, home direction `(-0.38, 0.62, 0.8)`, distance 15.5, target `(0, 0.5, 0.1)`. On narrow stages the distance grows so the board still fits.

## Controls

- Orbit with damping 0.08.
- No panning.
- Distance between 4 and 26.
- Polar angle capped so you cannot look from underneath.

## Building a part

Use two helpers: `box(w, h, d, material, x, y, z)` and `cyl(radius, height, material, x, y, z)`. Make materials with a small factory so every part starts with fresh ones.

Tips that make primitives read as real hardware:

- **Layer small boxes.** A RAM stick is a thin board, two rows of black chips, a gold strip along the bottom, and a white sticker.
- **Use a texture for printed things.** Silkscreen text, traces and the CPU lid markings are drawn on canvases. Real boards look wrong without them.
- **Instance anything repeated.** Cooler fins (26) and surface-mount parts (280) are `InstancedMesh`.
- **Metal needs light from the environment.** Metalness 0.8 and roughness 0.35 look right only with the environment map.
- **Seed your random numbers.** Use a small seeded generator so the board is identical on every load.
- **Offset overlapping planes.** The trace texture sits 0.002 above the board with `polygonOffset` so it never z-fights.

## Explode

`layout.ts` holds a vector per part: where it goes at 100 percent. Sub-assemblies (the cooler fan, the regulator heatsink) have a second vector applied on top, which is what lets you see the chokes under the heatsink. Tune by eye: nothing should end up covering another part's callout.

## Picking

- Raycast against a list of pickable meshes collected at build time. Leave out the surface-mount instances so the cursor passes through to the board.
- A click counts only if the pointer moved less than 5 px between down and up. Otherwise it was a drag.
- Hover is checked once per frame, not on every pointer event.

## Camera fly-to

1. Compute the part's bounding box in its current exploded position.
2. Target is the box centre. Distance is `size * 1.45 + 2.6`, clamped from 6.5 to 17.
3. Keep the current viewing direction but raise it so the elevation is at least about 33 degrees.
4. Tween position and target together over 850 ms with a cubic ease-in-out. Zero duration for reduced motion.
5. Starting a drag cancels the tween immediately.

## Highlights

- Hover: the accent colour as emissive at 0.14.
- Selected: 0.32.
- Quiz flash: green or red at 0.6 for 1.6 seconds.
- Isolate: other parts get opacity 0.1 and stop writing depth. Set `needsUpdate` only when the transparency actually changes.

## Callouts

After each render, project every part's anchor to screen pixels and hand the list to the UI. The anchor is the top-centre of the bounding box at 0 percent explode, plus the group's current offset. The board's anchor is hand-placed in the front-left corner because its bounding box top is the whole board.

## Cleanup

On unmount: cancel the animation frame, disconnect the resize observer, remove pointer listeners, dispose controls, geometries, materials, textures and the renderer, and remove the canvas.
