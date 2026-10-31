# Content style guide

How to write the part descriptions, specs, journey steps and quiz clues.

## A part entry has these fields

| Field | What goes in it |
| --- | --- |
| `name` | What a beginner would call it. "Memory (RAM)", "CPU cooler". |
| `summary` | One sentence saying what it does. Shown under the title and in quiz feedback. |
| `body` | Two short paragraphs. |
| `specs` | Four label and value pairs, "Typical numbers". |
| `fails` | One or two sentences on what it looks like when this part goes wrong. |
| `clue` | One sentence for the quiz, without the part's name. |

## Summary

- One sentence, a plain verb, no adjectives that sell.
- Say the job, not the category. "Runs the program. Everything else is there to feed it or cool it." beats "The central processing unit".

## Body

Paragraph one: how it actually works, in one concrete image.
Paragraph two: one fact most beginners do not know or get wrong.

Good second paragraphs from the hardware pack:

- RAM: two sticks are not just capacity, they run in dual channel.
- Rear I/O: with a graphics card installed, the monitor goes into the card, not the board.
- Cooler: the fan is the least interesting part, the surface area is the trick.

## Specs

- Exactly four rows so every sheet has the same shape.
- Labels are short nouns ("Speed", "Power", "Shape").
- Values are ranges or typical numbers, with units and a space before the unit.
- If the number depends on generation, say which ("DDR5 starts at 4800 MT/s").
- Never put a number you cannot defend. If unsure, say "Varies" and say what it varies with.

## Fails

Describe the symptom the owner would notice, then the usual cause. Do not give repair instructions that could hurt the reader (opening a power supply, for example).

## Quiz clues

1. The clue never contains the part's name or an obvious abbreviation of it.
2. It describes the job or the look, ideally both: "Click the big card with three fans that draws the picture."
3. If the part is hidden under another, say so: "It is hidden under another part."
4. Two clues in the same quiz must not describe the same part in a way that overlaps.
5. A beginner who has read the part once should be able to answer.

## Journey steps

- Title is a short sentence about what is happening, not a part name: "A copy lands in memory".
- Text is two or three sentences, with one comparison that gives scale ("roughly a thousand times longer").
- Each step leaves the reader wanting the next one.
- Six steps is enough. Seven or more and people stop following.

## Accuracy

- Use typical values for current desktop hardware and say "typical".
- Do not mention brands or model numbers. They date quickly and imply an endorsement.
- When you simplify, simplify in the true direction. "The CPU runs the player" is fine. "The CPU does all the work of decoding video" is wrong, because dedicated hardware often does it.
- Have a person who knows hardware read it before publishing.

## Tone

Plain, specific, a bit dry. See 03-human-rules-copywriting.md.

## Checklist for a new part

- [ ] Summary is one sentence
- [ ] Body has exactly two paragraphs
- [ ] Specs has four rows with units
- [ ] Fails describes a symptom
- [ ] Clue does not contain the name
- [ ] No brand names, no superlatives
