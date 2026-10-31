# Design tokens

Use these exact values. They define the workbench look.

## Colour (light)

| Token | Value | Use |
| --- | --- | --- |
| `--mat` | `#dde3dd` | Stage and page background, like an anti-static mat |
| `--mat-2` | `#d0d8d1` | Left rail and right sheet |
| `--mat-3` | `#bfcac1` | Hover fill, slider track |
| `--ink` | `#17201c` | Text, controls, callout discs |
| `--ink-2` | `#435049` | Secondary text |
| `--ink-3` | `#5f6d65` | Captions, hints |
| `--line` | `#b3beb6` | One-pixel rules |
| `--probe` | `#f1c232` | The one accent: the thing you are looking at |
| `--probe-ink` | `#231b00` | Text on the accent |
| `--good` | `#1f6b40` | Correct answers |
| `--bad` | `#b02f25` | Wrong answers |
| Header bar | `#17201c` | Always dark, in both themes |

## Colour (dark)

| Token | Value |
| --- | --- |
| `--mat` | `#151a17` |
| `--mat-2` | `#1c2320` |
| `--mat-3` | `#2a342f` |
| `--ink` | `#e8eee9` |
| `--ink-2` | `#b9c5bd` |
| `--ink-3` | `#8e9b93` |
| `--line` | `#333f39` |
| `--good` | `#72d198` |
| `--bad` | `#ff8b7e` |

`--probe` and `--probe-ink` stay the same in both themes.

## Where the accent may appear

Yes: selected callout disc, active list row (4 px bar on the left), the number tag on the part title, the primary button, the active tab underline, the logo mark, the trim stripe on the graphics card.

No: backgrounds of sections, links, borders, icons, anything decorative.

## Stage background

A cutting-mat grid made of four layered gradients: major lines every 160 px, minor lines every 32 px. Light: `rgba(23,32,28,.11)` major and `.06` minor. Dark: `rgba(232,238,233,.09)` and `.045`.

## Type

| Role | Family | Weight | Size |
| --- | --- | --- | --- |
| Wordmark | Barlow Condensed | 700 | 25 px |
| Part title | Barlow Condensed | 700 | 41 px (36 px on narrow desktop) |
| Section heading | Barlow Condensed | 600 | 22 px |
| Journey step title | Barlow Condensed | 700 | 30 px |
| Big score | Barlow Condensed | 700 | 64 px |
| Callout numbers | Barlow Condensed | 700 | 14 px |
| Lede | Barlow | 500 | 19.5 px, line height 1.35 |
| Body | Barlow | 400 | 16.5 px, line height 1.55 |
| Controls | Barlow | 600 | 14 to 16 px |

Rules: sentence case, no letter-spacing tricks, reading lines capped at `60ch`.

## Shape

| Thing | Radius |
| --- | --- |
| Buttons, text areas | 3 px |
| Control bar | 4 px |
| Callout discs, list number discs | 50 percent |
| Panels, rail, sheet | 0 |

## Spacing

Base unit 4 px. Common gaps: 8, 12, 14, 16, 22, 28. Sheet padding 28 px by 30 px on desktop, 24 px by 18 px on phones.

## Layout widths

- Desktop: rail 268 px, stage flexible, sheet 390 px.
- Below 1180 px: rail 230 px, sheet 340 px.
- Below 920 px: single column, stage first at 64 percent of viewport height (minimum 420 px).

## Focus

`outline: 2px solid var(--ink); outline-offset: 2px`. In the dark header, the outline is white and inset. Never remove it.

## 3D palette

| Thing | Colour |
| --- | --- |
| Board mask | `#1c3a2d` |
| Traces | `rgba(126,196,156,.26)`, every fifth trace gold |
| Gold contacts | `#c9a85a` |
| Heatsink aluminium | `#b7bcc2` |
| Copper | `#b8703f` |
| Graphics card shroud | `#1f2125` with a `#f1c232` trim stripe |
| Power connector | `#e4dfd0` |
| Correct flash | `#3fae66` |
| Wrong flash | `#e0483b` |
