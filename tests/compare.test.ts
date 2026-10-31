/**
 * Boardwalk — Comparison Matrix Test Suite
 *
 * Validates:
 * 1. Hardware comparison pairs schema and content integrity.
 * 2. Balance of specification labels and values across compared items.
 * 3. Soundness of "when to choose" decision criteria.
 */

import { describe, expect, it } from 'vitest';
import { COMPARE_PAIRS } from '../src/data/compare.ts';

describe('Hardware Comparison Matrices', () => {
  it('contains valid comparison pairs with distinct items', () => {
    expect(COMPARE_PAIRS.length).toBeGreaterThanOrEqual(3);

    const pairIds = new Set<string>();
    for (const pair of COMPARE_PAIRS) {
      expect(pair.id.trim().length).toBeGreaterThan(0);
      expect(pairIds.has(pair.id), `Duplicate pair ID "${pair.id}"`).toBe(false);
      pairIds.add(pair.id);

      expect(pair.title.trim().length).toBeGreaterThan(0);
      expect(pair.summarySentence.trim().length).toBeGreaterThan(0);

      // Verify itemA and itemB
      expect(pair.itemA.id).not.toBe(pair.itemB.id);
      expect(pair.itemA.name.trim().length).toBeGreaterThan(0);
      expect(pair.itemB.name.trim().length).toBeGreaterThan(0);
      expect(pair.itemA.summary.trim().length).toBeGreaterThan(0);
      expect(pair.itemB.summary.trim().length).toBeGreaterThan(0);
      expect(pair.itemA.whenChoice.trim().length).toBeGreaterThan(0);
      expect(pair.itemB.whenChoice.trim().length).toBeGreaterThan(0);

      // Verify specs
      expect(pair.itemA.specs.length).toBeGreaterThanOrEqual(3);
      expect(pair.itemB.specs.length).toBeGreaterThanOrEqual(3);
      expect(pair.itemA.specs.length).toBe(pair.itemB.specs.length);

      for (let s = 0; s < pair.itemA.specs.length; s++) {
        const specA = pair.itemA.specs[s];
        const specB = pair.itemB.specs[s];

        expect(specA.label.trim().length).toBeGreaterThan(0);
        expect(specA.value.trim().length).toBeGreaterThan(0);
        expect(specB.label.trim().length).toBeGreaterThan(0);
        expect(specB.value.trim().length).toBeGreaterThan(0);
        // Spec labels should match between comparison items
        expect(specA.label.toLowerCase()).toBe(specB.label.toLowerCase());
      }
    }
  });
});
