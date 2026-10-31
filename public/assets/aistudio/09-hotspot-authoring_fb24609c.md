# Hotspot authoring

"Hotspots" in this project are the numbered callout discs. This file explains how they are placed and how to fix them when they look wrong.

## How a callout finds its position

1. At build time, the scene measures each part's bounding box with all parts in their assembled positions.
2. The anchor is the top-centre of that box: the middle in x and z, the highest y.
3. While exploded, the anchor moves with the part's group offset.
4. After every render the anchor is projected to screen coordinates and the disc is moved there.

A part can override this in `layout.ts` under `ANCHOR_OVERRIDE`. Only the motherboard does in version 1, because its bounding box top is the entire board, so a disc in the middle would sit on top of other parts. It is placed in the front-left corner, where nothing else is.

## When to override

- The part is large and flat and the centre is covered by something else.
- The part is hidden by another part and you would rather the disc sat at its edge. (The CPU disc deliberately sits under the cooler. That tells the reader "it is under there".)
- The part is long and the centre is not a natural place to point (the regulator bar).

## Rules for placement

1. Two discs should never overlap at the home view. If they do, move one to a part edge.
2. A disc must not cover the thing it labels. Prefer the top face, close to a corner.
3. Every disc must stay on screen at every viewing angle the camera allows. The polar clamp helps.
4. Discs should not cluster. If three parts sit together (chipset, battery, SATA), push their anchors apart a little.

## Finding good coordinates

Add a temporary debug mode:

1. On click, log the intersection point from the raycaster, rounded to two decimals.
2. Open the page with `?authoring=1`.
3. Click where you want the disc and copy the coordinates into `ANCHOR_OVERRIDE`.
4. Remove or hide the debug mode before shipping, or keep it behind the query flag.

This is the same idea the original anatomy app used for its dots.

## Visual spec

- 26 px circle, 2 px border in the mat colour so it reads over the dark board and the light grid.
- Dark ink fill with a light number. Selected or hovered: accent fill, dark number, ink border.
- Number is the part's number from the list.
- Pointer events on, so the disc is clickable. The wrapper around all discs has pointer events off so dragging the board works between them.
- In the quiz the discs are hidden, because they would give the answers away.

## Accessibility

Each disc is a real button with a label like "4, Memory (RAM)". Tab goes through them in list order. Enter selects.

## Common problems

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Discs drift when the window resizes | Projection used a stale size | Update width and height in the resize handler before projecting |
| A disc sits far from its part when exploded | Anchor ignores the group offset | Add the group position to the anchor every projection |
| All discs jump to the corner on load | Projection ran before the first size | Skip projecting until the container has a size |
| A disc shows when its part is behind the camera | Not checking depth | Hide when the projected z is 1 or more |
