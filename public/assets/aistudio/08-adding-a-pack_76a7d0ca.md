# Adding a pack

Version 1 ships one pack: PC hardware. This file describes how to add another subject (networking, data structures, operating systems) without rewriting the viewer.

## What a pack is

A pack is a folder with four things:

1. A list of parts: ids, names, summaries, body text, specs, failure notes, quiz clues.
2. A builder that creates a `THREE.Group` per part.
3. A layout file: explode vectors, sub-assembly lifts, home camera.
4. An optional journey: an ordered list of steps, each pointing at a part.

The viewer, quiz logic, rail and sheet do not change.

## Refactor first

Version 1 hard-codes the hardware pack. Before adding a second pack, do this once:

1. Move `data/parts.ts`, `scene/build.ts` and `scene/layout.ts` into `packs/hardware/`.
2. Define a `Pack` type:

```ts
interface Pack {
  id: string;
  title: string;
  parts: Part[];
  journey: JourneyStep[];
  build(): Record<string, THREE.Group>;
  explode: Record<string, [number, number, number]>;
  layers?: Record<string, [number, number, number]>;
  anchors?: Record<string, [number, number, number]>;
  home: { direction: [number, number, number]; target: [number, number, number]; distance: number };
}
```

3. Make `PartId` a string instead of a union, and check ids against the pack at load.
4. Add a pack switcher in the header. Persist the choice.

## Pack ideas and how to model them

### Networking

- Parts: laptop, Wi-Fi router, switch, DNS server, web server, firewall.
- Model each as a simple labelled box on a floor plane.
- Journey: a packet leaves the laptop, hits DNS, crosses the router, reaches the server. A small sphere travels along a tube between parts.
- Quiz clues: "Click the device that turns a name into an address."

### Data structures

- Parts: array, linked list, stack, queue, binary tree, hash table, heap, graph.
- No outside models needed. Generate nodes and edges in code.
- Add a step-through mode for an algorithm (breadth-first search, binary search). Highlight the current node using the same flash code.

### Operating system

- Parts: kernel, scheduler, memory manager, file system, drivers, user programs.
- Show them as stacked layers; the explode slider separates the layers.
- Journey: a program asks to read a file and the request moves down the layers.

## Content rules

- Follow 10-content-style-guide.md for every part.
- Write a quiz clue for every part, and make sure it does not contain the part's name.
- Mark numbers as typical, not exact.

## Review before shipping a pack

- [ ] Every part id appears in `parts`, `build`, `explode`.
- [ ] No two parts share a material instance.
- [ ] Every part can be clicked without another part covering it at the home view or after exploding.
- [ ] The journey ends somewhere sensible, not mid-process.
- [ ] A person who has never studied the subject can pass the quiz after reading the parts once.
