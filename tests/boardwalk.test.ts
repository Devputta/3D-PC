/**
 * Boardwalk — Comprehensive Functional Audit Automated Test Suite
 *
 * Validates critical behaviors:
 * 1. Notes isolation, persistence, legacy key restoration, and error tolerance.
 * 2. Quiz generation, honest grading, feedback messages, scoring, skipping, and completion.
 * 3. Pack data integrity, lesson progression, and bilingual localization (EN & HI).
 * 4. Build mode hardware compatibility rules and slot matching.
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { BUILD_SLOTS, TRAY_PARTS } from '../src/data/build.ts';
import { getLocalizedLesson, getPackById, PACKS } from '../src/packs/index.ts';
import { hardwarePack } from '../src/packs/hardware/index.ts';
import { networkingPack } from '../src/packs/networking/index.ts';
import {
  advanceQuiz,
  answerQuestion,
  newCustomQuiz,
  newQuiz,
  skipQuestion
} from '../src/lib/quiz.ts';
import {
  clearNotesMemoryCache,
  exportNotesAsText,
  getBestScore,
  getLessonNote,
  getNote,
  getPartNote,
  setBestScore,
  setLessonNote,
  setNote,
  setPartNote
} from '../src/lib/storage.ts';

// Mock localStorage for node test environment
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => (key in mockStorage ? mockStorage[key] : null),
  setItem: (key: string, val: string) => {
    mockStorage[key] = String(val);
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    for (const k of Object.keys(mockStorage)) delete mockStorage[k];
  },
  key: (idx: number) => Object.keys(mockStorage)[idx] || null,
  get length() {
    return Object.keys(mockStorage).length;
  }
} as unknown as Storage;

describe('1. Personal Study Notes Audit', () => {
  beforeEach(() => {
    localStorage.clear();
    clearNotesMemoryCache();
  });

  it('saves and restores notes isolated by pack and component', () => {
    setNote('hardware', 'cpu', 'Intel LGA1700 LGA contact pads note', 'part');
    setNote('networking', 'switch', 'VLAN tagging and MAC forwarding table', 'part');

    // Scoped retrieval
    expect(getNote('hardware', 'cpu', 'part')).toBe('Intel LGA1700 LGA contact pads note');
    expect(getNote('networking', 'switch', 'part')).toBe('VLAN tagging and MAC forwarding table');

    // Cross-pack isolation: querying cpu on networking pack returns empty
    expect(getNote('networking', 'cpu', 'part')).toBe('');
  });

  it('saves and restores notes isolated by lesson', () => {
    setLessonNote('hardware', 'pc-lesson-1', 'Lesson 1: LGA1700 Land Grid Array principles');
    setLessonNote('networking', 'net-lesson-1', 'Lesson 1: TCP/IP Ethernet Frame structure');

    expect(getLessonNote('hardware', 'pc-lesson-1')).toBe(
      'Lesson 1: LGA1700 Land Grid Array principles'
    );
    expect(getLessonNote('networking', 'net-lesson-1')).toBe(
      'Lesson 1: TCP/IP Ethernet Frame structure'
    );

    // Cross-lesson isolation
    expect(getLessonNote('hardware', 'pc-lesson-2')).toBe('');
  });

  it('restores legacy un-scoped notes seamlessly', () => {
    // Simulate existing user notes saved under old boardwalk_note_cpu key
    localStorage.setItem('boardwalk_note_gpu', 'Legacy user notes for GPU PCIe slot');

    // Retrieve via updated getNote or getPartNote
    const restored = getPartNote('gpu', 'hardware');
    expect(restored).toBe('Legacy user notes for GPU PCIe slot');
  });

  it('formats study notes text export with components and lessons', () => {
    setNote('hardware', 'cpu', 'High IPC performance hybrid cores', 'part');
    setLessonNote('hardware', 'pc-lesson-1', 'Understood pin density and socket retention');

    const exported = exportNotesAsText(
      hardwarePack.name,
      hardwarePack.parts,
      hardwarePack.lessons,
      'hardware'
    );

    expect(exported).toContain('BOARDWALK STUDY NOTES — PC HARDWARE');
    expect(exported).toContain('[COMPONENT] Central processor (CPU) (ID: cpu)');
    expect(exported).toContain('High IPC performance hybrid cores');
    expect(exported).toContain('[LESSON 1]');
    expect(exported).toContain('Understood pin density and socket retention');
    expect(exported).toContain('SUMMARY:');
  });
});

describe('2. Quiz Engine & Scoring Audit', () => {
  const partsMap = Object.fromEntries(hardwarePack.parts.map((p) => [p.id, p]));

  it('generates a valid 3D quiz from actual pack parts', () => {
    const quiz = newQuiz(hardwarePack.parts, 'hardware', 6);
    expect(quiz.questions.length).toBe(6);
    expect(quiz.currentIndex).toBe(0);
    expect(quiz.score).toBe(0);
    expect(quiz.isComplete).toBe(false);

    // Question clues match actual parts
    const firstQ = quiz.questions[0];
    const matchingPart = hardwarePack.parts.find((p) => p.id === firstQ.targetPartId);
    expect(matchingPart).toBeDefined();
    expect(firstQ.clue).toBe(matchingPart?.clue);
  });

  it('grades answers honestly and updates scores and feedback correctly', () => {
    const quiz = newQuiz(hardwarePack.parts, 'hardware', 4);
    const targetId = quiz.questions[0].targetPartId;

    // Correct answer test
    const { nextState: correctState, wasCorrect: correctResult } = answerQuestion(
      quiz,
      targetId,
      partsMap
    );
    expect(correctResult).toBe(true);
    expect(correctState.score).toBe(1);
    expect(correctState.activeFeedback?.status).toBe('correct');
    expect(correctState.activeFeedback?.message).toContain('Correct');

    // Wrong answer test
    const wrongPartId = targetId === 'cpu' ? 'ram' : 'cpu';
    const { nextState: wrongState, wasCorrect: wrongResult } = answerQuestion(
      quiz,
      wrongPartId,
      partsMap
    );
    expect(wrongResult).toBe(false);
    expect(wrongState.score).toBe(0);
    expect(wrongState.activeFeedback?.status).toBe('wrong');
    expect(wrongState.activeFeedback?.message).toContain('Not quite');
  });

  it('handles question skip correctly', () => {
    const quiz = newQuiz(hardwarePack.parts, 'hardware', 4);
    const skipped = skipQuestion(quiz, partsMap);
    expect(skipped.score).toBe(0);
    expect(skipped.activeFeedback?.status).toBe('skipped');
    expect(skipped.activeFeedback?.message).toContain('Skipped');
  });

  it('advances through questions and sets best score upon completion', () => {
    let quiz = newQuiz(hardwarePack.parts, 'hardware', 2);
    // Answer Q1 correctly
    const res1 = answerQuestion(quiz, quiz.questions[0].targetPartId, partsMap);
    quiz = advanceQuiz(res1.nextState);
    expect(quiz.currentIndex).toBe(1);
    expect(quiz.isComplete).toBe(false);

    // Answer Q2 correctly
    const res2 = answerQuestion(quiz, quiz.questions[1].targetPartId, partsMap);
    quiz = advanceQuiz(res2.nextState);
    expect(quiz.isComplete).toBe(true);
    expect(quiz.score).toBe(2);

    // Best score saved
    const best = getBestScore();
    expect(best?.score).toBe(2);
    expect(best?.total).toBe(2);
  });

  it('creates custom quizzes filtered to user selected parts', () => {
    const selected = ['cpu', 'gpu', 'ssd'];
    const custom = newCustomQuiz(hardwarePack.parts, selected, 'hardware');
    expect(custom.total).toBe(3);
    for (const q of custom.questions) {
      expect(selected).toContain(q.targetPartId);
    }
  });
});

describe('3. Build Mode & Compatibility Rules Audit', () => {
  it('has valid build slots and matching tray categories', () => {
    expect(BUILD_SLOTS.length).toBe(6);
    const categories = new Set(BUILD_SLOTS.map((s) => s.acceptedCategory));
    expect(categories.has('cpu')).toBe(true);
    expect(categories.has('cooler')).toBe(true);
    expect(categories.has('ram')).toBe(true);
    expect(categories.has('gpu')).toBe(true);
    expect(categories.has('ssd')).toBe(true);
    expect(categories.has('power')).toBe(true);
  });

  it('enforces exact architectural compatibility constraints', () => {
    const amdCpu = TRAY_PARTS.find((p) => p.id === 'cpu_amd');
    expect(amdCpu?.isCompatible).toBe(false);
    expect(amdCpu?.failureSentence).toContain('AMD AM5 processor cannot fit into an Intel LGA1700');

    const ddr4Ram = TRAY_PARTS.find((p) => p.id === 'ram_ddr4');
    expect(ddr4Ram?.isCompatible).toBe(false);
    expect(ddr4Ram?.failureSentence).toContain('prevents insertion into DDR5 slots');

    const highTdpGpu = TRAY_PARTS.find((p) => p.id === 'gpu_rtx_450w');
    expect(highTdpGpu?.isCompatible).toBe(false);
    expect(highTdpGpu?.failureSentence).toContain('exceeding this system’s 650-watt unit');

    const sataBayDrive = TRAY_PARTS.find((p) => p.id === 'ssd_sata_25');
    expect(sataBayDrive?.isCompatible).toBe(false);
    expect(sataBayDrive?.failureSentence).toContain('cannot plug into an M.2 motherboard slot');

    const tallCooler = TRAY_PARTS.find((p) => p.id === 'cooler_175');
    expect(tallCooler?.isCompatible).toBe(false);
    expect(tallCooler?.failureSentence).toContain('clearance of 155 mm');
  });
});

describe('4. Lessons & Localization Integrity Audit', () => {
  it('validates PC Hardware lessons have complete schemas', () => {
    expect(hardwarePack.lessons.length).toBe(8);
    for (const lesson of hardwarePack.lessons) {
      expect(lesson.title).toBeTruthy();
      expect(lesson.goal).toBeTruthy();
      expect(lesson.overview.facts.length).toBe(3);
      expect(lesson.specs.length).toBeGreaterThan(0);
      expect(lesson.quiz.length).toBe(3);
      for (const q of lesson.quiz) {
        expect(q.options.length).toBe(4);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        expect(q.explanation).toBeTruthy();
      }
    }
  });

  it('validates Networking lessons have complete schemas', () => {
    expect(networkingPack.lessons.length).toBe(8);
    for (const lesson of networkingPack.lessons) {
      expect(lesson.title).toBeTruthy();
      expect(lesson.goal).toBeTruthy();
      expect(lesson.overview.facts.length).toBe(3);
      expect(lesson.quiz.length).toBe(3);
    }
  });

  it('localizes lessons correctly in English and Hindi', () => {
    const rawLesson = hardwarePack.lessons[0];
    const enLesson = getLocalizedLesson(rawLesson, false);
    const hiLesson = getLocalizedLesson(rawLesson, true);

    expect(enLesson.title).toBe(rawLesson.title);
    expect(hiLesson.title).not.toBe(rawLesson.title); // Hindi localized title
    expect(hiLesson.quiz.length).toBe(3);
  });

  it('packs registry resolves both hardware and networking packs', () => {
    expect(PACKS.length).toBe(2);
    expect(getPackById('hardware').id).toBe('hardware');
    expect(getPackById('networking').id).toBe('networking');
  });
});
