# Architecture

## Folders

```
boardwalk/
  index.html
  public/favicon.svg
  src/
    main.tsx            mounts <App/>
    App.tsx             owns mode, selection, explode, theme, quiz
    styles.css          the only stylesheet
    fonts/              Barlow and Barlow Condensed, with the OFL licence
    data/parts.ts       every word and number; part ids; journey steps
    lib/
      quiz.ts           pure functions: newQuiz, answer, next, score
      storage.ts        safe localStorage wrapper
    scene/
      BoardScene.ts     the Three.js class: camera, picking, highlights
      build.ts          builds the 12 parts from primitives
      layout.ts         explode vectors, sub-assembly lifts, home camera
    components/
      BoardView.tsx     canvas mount plus numbered callouts
      Rail.tsx          left column: parts list, journey steps, quiz question
      Sheet.tsx         right column: part detail, intro, journey, quiz log
```

## Who owns what

| State | Lives in | Why |
| --- | --- | --- |
| mode, selected part, explode, isolate, labels, theme | `App` | Several columns read them |
| quiz progress | `App`, as a plain object | Changed by pure functions, easy to test |
| camera, hover, highlights, flashes | `BoardScene` | Drawing concerns; React should not re-render for them |
| notes, best score, theme choice | `localStorage` | Per browser, optional |

## Data flow

```
user click on 3D part
  -> BoardScene.onPointerUp -> events.onPick(id)
  -> App.handlePick(id)  (explore: select, journey: select, quiz: answer)
  -> state changes -> BoardView effects -> scene.select(id) / scene.flash(...)
```

React tells the scene what to show. The scene tells React what was clicked. Neither reaches into the other.

## Callouts

The scene projects each part's anchor point to screen space after every render and calls `onProject`. `BoardView` writes the position straight into each button's `transform`. React does not re-render on camera movement, so a spinning board costs no React work.

## Parts and ids

`PartId` is a union type. Adding a part means:

1. Add the id to the union and an entry to `parts`.
2. Add a builder in `build.ts` and an entry in `buildParts`.
3. Add its explode vector in `layout.ts`.

TypeScript will fail the build until all three exist.

## Materials

Each part gets its own copy of every material at load. This is deliberate: highlighting the RAM must never tint another part that happened to use the same colour.

## Render loop

`requestAnimationFrame` runs always, but draws only when something changed: the controls moved, a camera tween is running, a highlight changed, or the explode value changed. The loop skips entirely while the tab is hidden.

## What is intentionally missing

- No router. It is one screen with three modes.
- No state library. The state is small and local.
- No backend, no accounts. Notes stay in the browser.
