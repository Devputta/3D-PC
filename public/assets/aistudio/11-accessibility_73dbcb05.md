# Accessibility

A 3D viewer is the hardest thing to make accessible. The rule here is that nothing you can learn by clicking the model is available only by clicking the model.

## The core idea

Everything in the 3D view has a twin that works without it:

- Every part is in the numbered list on the left, as a real button.
- Every callout disc is a real button with a label.
- Every part has its full description in the right sheet, as normal text.
- The quiz can be answered by using the callouts in a version that shows them (see below).

## Keyboard

| Action | Keys |
| --- | --- |
| Move through parts, tabs, buttons | Tab and Shift+Tab |
| Select a part from the list or a callout | Enter or Space |
| Move between journey steps | Left and right arrows (not while typing in the notes box) |
| Change explode | Arrow keys on the slider |
| Switch mode | Tab to the mode tabs, Enter |
| Turn the board | The canvas is focusable; add arrow-key rotation in version 2 |

## Focus

- A visible focus ring on everything: 2 px solid ink with a 2 px offset.
- Inside the dark header, the ring is white and inset.
- Do not remove outlines. If a design needs a different ring, restyle it, do not hide it.

## Screen readers

- The canvas has a label that says what it is and how to use it.
- The mode tabs use `role="tablist"`, `role="tab"` and `aria-selected`.
- The journey step list uses `aria-current="step"` on the active step.
- Quiz feedback is in a live region (`aria-live="polite"`), so a right or wrong answer is announced.
- Toggle buttons use `aria-pressed`.
- Callout discs use `aria-label` like "4, Memory (RAM)".
- Notes boxes have a hidden label naming the part.

## Quiz accessibility

The quiz hides the numbered discs because they would give away the answers by showing names on hover. That makes it mouse-only. For version 2, add an accessible quiz variant: show the discs without any names, so a keyboard user can move through them and press Enter to answer.

## Colour and contrast

- Body text on the mat is ink on grey-green: well above 7:1.
- Secondary text (`--ink-3`) must still reach 4.5:1 on both mats. Check after any change.
- Accent yellow on the mat has poor contrast on its own, so it never carries text by itself. Yellow is always paired with dark ink for text, and an ink border on the callout.
- Right and wrong are never colour alone. The feedback says "Correct" or "Not quite" and the results list says "Right" or "Missed".

## Motion

- `prefers-reduced-motion: reduce` turns off the opening settle and sets camera tweens to zero length.
- Nothing flashes. The quiz flash is a steady colour for 1.6 seconds.
- No parallax, no auto-rotating board.

## Touch

- Tap to select. Drag to orbit. Pinch to zoom.
- Target size for discs is 26 px; on touch widths consider 32 px.
- The canvas sets `touch-action: none` so dragging the board does not scroll the page. On phones, leave enough room around the stage so users can still scroll past it.

## Zoom and text size

The layout must work at 200 percent browser zoom and with the user's font size increased. Use relative units for text where possible and test the stacked layout.

## Language

`<html lang="en">`. If a second language is added, set the attribute per page and mirror layout for right-to-left languages.

## Test

- [ ] Use the whole app with only the keyboard
- [ ] Run a screen reader over Explore, Journey, Quiz
- [ ] Turn on reduced motion in the OS and reload
- [ ] Check contrast in both themes
- [ ] Zoom to 200 percent
