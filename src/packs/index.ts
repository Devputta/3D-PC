/**
 * Boardwalk — Pack Registry
 *
 * Manages available learning packs and persists the user's active pack selection.
 * Exclusively provides PC Hardware and Computer Networking.
 */

import { hardwarePack } from './hardware/index.ts';
import { networkingPack } from './networking/index.ts';
import { Pack } from './types.ts';

export * from './types.ts';
export { hardwarePack } from './hardware/index.ts';
export { networkingPack } from './networking/index.ts';

export const PACKS: Pack[] = [hardwarePack, networkingPack];

const PACK_STORAGE_KEY = 'boardwalk_active_pack';

export function getStoredPackId(): string {
  try {
    const saved = localStorage.getItem(PACK_STORAGE_KEY);
    if (saved && PACKS.some((p) => p.id === saved)) {
      return saved;
    }
    return hardwarePack.id;
  } catch {
    return hardwarePack.id;
  }
}

export function setStoredPackId(packId: string): void {
  try {
    localStorage.setItem(PACK_STORAGE_KEY, packId);
  } catch {
    // Graceful fallback
  }
}

import { HARDWARE_LESSONS_HI } from './hardware/lessons-hi.ts';
import { NETWORKING_LESSONS_HI } from './networking/lessons-hi.ts';
import { Lesson } from './types.ts';

export function getLocalizedLesson(lesson: Lesson, isHindi: boolean): Lesson {
  if (!isHindi) return lesson;
  const hi = HARDWARE_LESSONS_HI[lesson.id] || NETWORKING_LESSONS_HI[lesson.id];
  if (!hi) return lesson;
  return {
    ...lesson,
    title: hi.title,
    goal: hi.goal,
    callouts: hi.callouts,
    overview: hi.overview,
    connections: hi.connections,
    example: {
      ...lesson.example,
      explanation: hi.example.explanation
    },
    specs: hi.specs,
    quiz: [
      {
        ...lesson.quiz[0],
        question: hi.quiz[0].question,
        options: hi.quiz[0].options,
        explanation: hi.quiz[0].explanation
      },
      {
        ...lesson.quiz[1],
        question: hi.quiz[1].question,
        options: hi.quiz[1].options,
        explanation: hi.quiz[1].explanation
      },
      {
        ...lesson.quiz[2],
        question: hi.quiz[2].question,
        options: hi.quiz[2].options,
        explanation: hi.quiz[2].explanation
      }
    ]
  };
}

export function getPackById(id: string): Pack {
  return PACKS.find((p) => p.id === id) || hardwarePack;
}

