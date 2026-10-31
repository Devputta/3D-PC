# Roadmap

Order matters. Each item makes the one after it more valuable.

## Version 1 (the brief in 01-master-prompt.md)

Hardware pack, three modes, light and dark, notes, quiz best score.

## Version 1.1: polish

- Keyboard rotation of the board with the arrow keys when the canvas is focused.
- A quiz variant for keyboard and screen-reader users (see 11-accessibility.md).
- Subset the fonts and convert them to WOFF2.
- A short "How to use this" overlay the first time, dismissible, remembered.
- Print stylesheet for the part sheet, so a student can print notes.

## Version 2: a second pack

Refactor to the pack structure described in 08-adding-a-pack.md, then build **Networking**:

- Laptop, router, switch, DNS server, web server, firewall.
- A packet that travels along tubes between devices.
- Journey: what happens when you type a web address.
- Quiz clues for each device.

Why networking next: it reuses everything (parts, explode, journey, quiz) and teaches something the hardware pack cannot.

## Version 3: data structures

- Generated geometry only. No models.
- Parts: array, linked list, stack, queue, tree, hash table, heap, graph.
- Step-through mode for algorithms: pick an algorithm, press next, watch nodes highlight.
- A small code panel showing the matching lines in a real language.

## Later ideas

| Idea | Value | Cost |
| --- | --- | --- |
| Ask a question about the selected part, answered by an AI model | High: answers the question the text did not | Needs a server or proxy and an API key; add rate limits; clearly label AI-generated answers |
| Multiple languages | High: Hindi and other Indian languages reach more learners | Text in `data/` is already separate; needs real translation review, right-to-left support for some |
| Teacher mode: share a link with a chosen set of parts and a custom quiz | Medium | Needs storage or a URL format |
| Compare two parts side by side (DDR4 and DDR5, SATA and NVMe) | Medium | New UI and more content |
| Real hardware photos for each part | Medium | Licensing and consistency |
| Accounts and progress sync | Low until there are users | Backend, privacy policy |

## Things to decide with real users, not before

- Whether the opening settle is charming or annoying on the second visit.
- Whether eight quiz questions is the right number.
- Whether the journey should be one of several, such as "boot the PC" or "play a game".

## Things not to build

- A landing page with marketing copy. The tool opens on the tool.
- Gamification points, streaks or badges without a reason from user feedback.
- A chatbot popup in the corner.
- Analytics that track individuals. If you measure anything, measure counts and never store personal data.

## Keeping it honest

Every release, re-read the README and the intro text. If the product does not do something the text says, change the text.
