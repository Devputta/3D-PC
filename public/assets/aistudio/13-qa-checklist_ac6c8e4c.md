# QA checklist

Run this before calling a build done. Mark each line honestly. If something could not be tested, write "not tested" instead of ticking it.

## Build

- [ ] `npm install` finishes with no errors
- [ ] `npm run dev` starts and the page loads
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes with no errors
- [ ] No console errors or warnings on load, in Explore, Journey or Quiz

## Explore

- [ ] The board appears and settles from its exploded state
- [ ] Dragging turns the board; scrolling zooms; the camera cannot go under the board
- [ ] Clicking each of the 12 parts selects it and the sheet shows the right text
- [ ] Clicking each of the 12 list rows does the same
- [ ] Clicking each numbered disc does the same
- [ ] Clicking empty space clears the selection
- [ ] The explode slider moves every part and reveals the CPU under the cooler
- [ ] Isolate part fades everything else and is disabled when nothing is selected
- [ ] Numbers toggle hides and shows the discs
- [ ] Reset view returns to the home camera
- [ ] Notes save, survive a reload, and belong to the right part

## Journey

- [ ] Six steps, each with the right part selected and the camera moved to it
- [ ] Next, Back, left and right arrows all work
- [ ] Back is disabled on step 1; the last step offers "Start again"
- [ ] Typing in a notes box does not trigger the arrow keys

## Quiz

- [ ] Eight different questions, in a new order each run
- [ ] No clue contains the answer's name
- [ ] Discs are hidden during the quiz
- [ ] A right answer flashes green; a wrong one flashes red and shows the right part in green
- [ ] A second click while an answer is showing does nothing
- [ ] Skip counts as missed and reveals the answer
- [ ] Final screen shows score, best score, "Try again" and "Back to exploring"
- [ ] The answers list on the right matches what happened
- [ ] Best score persists across reloads

## Visual

- [ ] Light and dark themes both look intentional, not inverted
- [ ] The yellow accent appears only where 06-design-tokens.md allows it
- [ ] No gradients as decoration, no cards, no emoji
- [ ] Callout discs never overlap each other at the home view
- [ ] Text is readable over the grid in both themes
- [ ] At phone width (360 px) there is no horizontal scroll and the stage is usable

## The human test

- [ ] Show the screenshot to someone for five seconds. Ask what made it. If they say "AI", write down why and fix it.
- [ ] Read all on-screen text aloud. Anything that sounds like an advert is rewritten.
- [ ] Open three random source files. Each one is understandable in two minutes.

## Accessibility

- [ ] Whole app works with keyboard only
- [ ] Focus ring is visible everywhere
- [ ] Screen reader announces quiz results
- [ ] Reduced motion skips the opening and the camera tweens
- [ ] 200 percent zoom still works

## Robustness

- [ ] With WebGL disabled the page shows the explanatory message
- [ ] With localStorage blocked the app still works
- [ ] Resizing the window keeps the board centred and the discs aligned
- [ ] Switching mode repeatedly does not leak canvases or listeners
- [ ] Switching tabs away and back resumes drawing

## Content

- [ ] Every number is marked typical or given as a range
- [ ] No brand names or model numbers
- [ ] A hardware-literate person has read every part entry
- [ ] Footer or intro says specs are typical, not for one product

## Release

- [ ] README says what is not finished
- [ ] Font licence file is included
- [ ] No `node_modules`, no `.env`, no large unused files
