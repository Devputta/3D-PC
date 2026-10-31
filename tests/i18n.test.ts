/**
 * Boardwalk — Internationalization (i18n) Test Suite
 *
 * Validates:
 * 1. Symmetry and completeness between English (en) and Hindi (hi) dictionaries.
 * 2. Proper execution and return values of dynamic translation helper functions.
 * 3. Complete parity between English and Hindi lesson packs (Hardware and Networking).
 */

import { describe, expect, it } from 'vitest';
import { en } from '../src/i18n/en.ts';
import { hi } from '../src/i18n/hi.ts';
import { TranslationSchema } from '../src/i18n/types.ts';
import { HARDWARE_LESSONS } from '../src/packs/hardware/lessons.ts';
import { HARDWARE_LESSONS_HI } from '../src/packs/hardware/lessons-hi.ts';
import { NETWORKING_LESSONS } from '../src/packs/networking/lessons.ts';
import { NETWORKING_LESSONS_HI } from '../src/packs/networking/lessons-hi.ts';

// Helper to recursively check key parity between two objects
function assertObjectShape(base: Record<string, unknown>, target: Record<string, unknown>, path = '') {
  for (const key of Object.keys(base)) {
    const currentPath = path ? `${path}.${key}` : key;
    expect(target, `Missing key "${currentPath}" in target translation dictionary`).toHaveProperty(key);

    const baseVal = base[key];
    const targetVal = target[key];

    if (typeof baseVal === 'function') {
      expect(typeof targetVal, `Expected function at "${currentPath}"`).toBe('function');
    } else if (typeof baseVal === 'boolean') {
      expect(typeof targetVal, `Expected boolean at "${currentPath}"`).toBe('boolean');
    } else if (typeof baseVal === 'object' && baseVal !== null) {
      expect(typeof targetVal, `Expected object at "${currentPath}"`).toBe('object');
      assertObjectShape(
        baseVal as Record<string, unknown>,
        targetVal as Record<string, unknown>,
        currentPath
      );
    } else {
      expect(typeof targetVal, `Expected non-empty string at "${currentPath}"`).toBe('string');
      expect((targetVal as string).trim().length, `Empty string at "${currentPath}"`).toBeGreaterThan(0);
    }
  }
}

describe('Internationalization (i18n) Parity', () => {
  it('has identical schema structure between English and Hindi bundles', () => {
    assertObjectShape(en as unknown as Record<string, unknown>, hi as unknown as Record<string, unknown>);
    assertObjectShape(hi as unknown as Record<string, unknown>, en as unknown as Record<string, unknown>);
  });

  it('evaluates all dynamic translation formatter functions properly in both languages', () => {
    const bundles: { lang: string; dict: TranslationSchema }[] = [
      { lang: 'en', dict: en },
      { lang: 'hi', dict: hi }
    ];

    for (const { lang, dict } of bundles) {
      // Header progress
      const progressStr = dict.header.progressCount(3, 8);
      expect(progressStr, `[${lang}] progressCount`).toContain('3');
      expect(progressStr, `[${lang}] progressCount`).toContain('8');

      // Lessons number
      const lessonStr = dict.lessons.lessonNumber(4);
      expect(lessonStr, `[${lang}] lessonNumber`).toContain('4');

      // Part counter
      const partStr = dict.sheet.partCounter(2, 12);
      expect(partStr, `[${lang}] partCounter`).toContain('2');
      expect(partStr, `[${lang}] partCounter`).toContain('12');

      // Ask placeholder
      const askStr = dict.sheet.askPlaceholder('CPU');
      expect(askStr.toLowerCase(), `[${lang}] askPlaceholder`).toContain('cpu');

      // Step counter
      const stepStr = dict.sheet.stepCounter(1, 5);
      expect(stepStr, `[${lang}] stepCounter`).toContain('1');
      expect(stepStr, `[${lang}] stepCounter`).toContain('5');

      // Scores
      const bestStr = dict.sheet.bestScore(5, 6);
      expect(bestStr, `[${lang}] bestScore`).toContain('5');
      expect(bestStr, `[${lang}] bestScore`).toContain('6');

      const partialStr = dict.sheet.partialScore(4, 6);
      expect(partialStr, `[${lang}] partialScore`).toContain('4');
      expect(partialStr, `[${lang}] partialScore`).toContain('6');

      // Build title
      const buildTitle = dict.build.title('PC Hardware');
      expect(buildTitle, `[${lang}] build.title`).toContain('PC Hardware');

      // Custom quiz count
      const customQuizStr = dict.customQuiz.selectedCount(3, 12);
      expect(customQuizStr, `[${lang}] customQuiz.selectedCount`).toContain('3');
      expect(customQuizStr, `[${lang}] customQuiz.selectedCount`).toContain('12');
    }
  });

  it('validates 1-to-1 parity between Hardware English and Hindi lessons', () => {
    for (const enLesson of HARDWARE_LESSONS) {
      const hiLesson = HARDWARE_LESSONS_HI[enLesson.id];
      expect(hiLesson, `Missing Hindi translation for hardware lesson ${enLesson.id}`).toBeDefined();

      expect(hiLesson.id).toBe(enLesson.id);
      expect(hiLesson.title.trim().length).toBeGreaterThan(0);
      expect(hiLesson.goal.trim().length).toBeGreaterThan(0);
      expect(hiLesson.overview.facts.length).toBe(enLesson.overview.facts.length);

      // Quiz questions parity
      expect(hiLesson.quiz.length).toBe(enLesson.quiz.length);
      for (let q = 0; q < enLesson.quiz.length; q++) {
        expect(hiLesson.quiz[q].question.trim().length).toBeGreaterThan(0);
        expect(hiLesson.quiz[q].options.length).toBe(enLesson.quiz[q].options.length);
        expect(hiLesson.quiz[q].explanation.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('validates 1-to-1 parity between Networking English and Hindi lessons', () => {
    for (const enLesson of NETWORKING_LESSONS) {
      const hiLesson = NETWORKING_LESSONS_HI[enLesson.id];
      expect(hiLesson, `Missing Hindi translation for networking lesson ${enLesson.id}`).toBeDefined();

      expect(hiLesson.id).toBe(enLesson.id);
      expect(hiLesson.title.trim().length).toBeGreaterThan(0);
      expect(hiLesson.goal.trim().length).toBeGreaterThan(0);
      expect(hiLesson.overview.facts.length).toBe(enLesson.overview.facts.length);

      expect(hiLesson.quiz.length).toBe(enLesson.quiz.length);
      for (let q = 0; q < enLesson.quiz.length; q++) {
        expect(hiLesson.quiz[q].question.trim().length).toBeGreaterThan(0);
        expect(hiLesson.quiz[q].options.length).toBe(enLesson.quiz[q].options.length);
        expect(hiLesson.quiz[q].explanation.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
