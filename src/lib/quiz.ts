/**
 * Boardwalk — Pack-Agnostic Quiz Logic
 *
 * Pure functions managing the quiz state machine.
 * Generates questions from any loaded learning pack (PC Hardware, Networking),
 * scores answers, formats honest human feedback without exclamation marks,
 * and maintains the answer log.
 */

import { PartData } from '../packs/types.ts';
import { setBestScore } from './storage.ts';

export interface QuizQuestion {
  questionNumber: number;
  targetPartId: string;
  clue: string;
  answeredPartId?: string;
  status: 'pending' | 'correct' | 'wrong' | 'skipped';
  feedbackText?: string;
}

export interface QuizState {
  packId: string;
  questions: QuizQuestion[];
  currentIndex: number;
  isComplete: boolean;
  score: number;
  total: number;
  activeFeedback: {
    status: 'correct' | 'wrong' | 'skipped';
    message: string;
    correctPartId: string;
    chosenPartId?: string;
  } | null;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function newQuiz(parts: PartData[], packId = 'hardware', count = 8): QuizState {
  const shuffledParts = shuffle(parts).slice(0, Math.min(count, parts.length));
  const questions: QuizQuestion[] = shuffledParts.map((part, index) => ({
    questionNumber: index + 1,
    targetPartId: part.id,
    clue: part.clue,
    status: 'pending'
  }));

  return {
    packId,
    questions,
    currentIndex: 0,
    isComplete: false,
    score: 0,
    total: questions.length,
    activeFeedback: null
  };
}

export function newCustomQuiz(
  parts: PartData[],
  selectedPartIds: string[],
  packId = 'hardware'
): QuizState {
  const selectedSet = new Set(selectedPartIds);
  const matchingParts = parts.filter((p) => selectedSet.has(p.id));
  const finalParts = matchingParts.length > 0 ? matchingParts : parts.slice(0, 8);
  const shuffled = shuffle(finalParts).slice(0, 8);

  const questions: QuizQuestion[] = shuffled.map((part, index) => ({
    questionNumber: index + 1,
    targetPartId: part.id,
    clue: part.clue,
    status: 'pending'
  }));

  return {
    packId,
    questions,
    currentIndex: 0,
    isComplete: false,
    score: 0,
    total: questions.length,
    activeFeedback: null
  };
}

export function answerQuestion(
  state: QuizState,
  chosenPartId: string,
  partsMap: Record<string, PartData>
): { nextState: QuizState; wasCorrect: boolean } {
  if (state.isComplete || state.activeFeedback !== null) {
    return { nextState: state, wasCorrect: false };
  }

  const current = state.questions[state.currentIndex];
  if (!current) return { nextState: state, wasCorrect: false };

  const target = partsMap[current.targetPartId] || { name: current.targetPartId, summary: '' };
  const chosen = partsMap[chosenPartId] || { name: chosenPartId, summary: '' };
  const wasCorrect = chosenPartId === current.targetPartId;

  let feedbackMessage: string;
  if (wasCorrect) {
    feedbackMessage = `Correct. That's the ${target.name}. ${target.summary}`;
  } else {
    feedbackMessage = `Not quite. You picked the ${chosen.name}. The answer is the ${target.name}. ${target.summary}`;
  }

  const updatedQuestions = state.questions.map((q, idx) => {
    if (idx !== state.currentIndex) return q;
    return {
      ...q,
      answeredPartId: chosenPartId,
      status: wasCorrect ? ('correct' as const) : ('wrong' as const),
      feedbackText: feedbackMessage
    };
  });

  const nextScore = wasCorrect ? state.score + 1 : state.score;

  const nextState: QuizState = {
    ...state,
    questions: updatedQuestions,
    score: nextScore,
    activeFeedback: {
      status: wasCorrect ? 'correct' : 'wrong',
      message: feedbackMessage,
      correctPartId: current.targetPartId,
      chosenPartId
    }
  };

  return { nextState, wasCorrect };
}

export function skipQuestion(
  state: QuizState,
  partsMap: Record<string, PartData>
): QuizState {
  if (state.isComplete || state.activeFeedback !== null) {
    return state;
  }

  const current = state.questions[state.currentIndex];
  if (!current) return state;

  const target = partsMap[current.targetPartId] || { name: current.targetPartId, summary: '' };
  const feedbackMessage = `Skipped. It was the ${target.name}. ${target.summary}`;

  const updatedQuestions = state.questions.map((q, idx) => {
    if (idx !== state.currentIndex) return q;
    return {
      ...q,
      status: 'skipped' as const,
      feedbackText: feedbackMessage
    };
  });

  return {
    ...state,
    questions: updatedQuestions,
    activeFeedback: {
      status: 'skipped',
      message: feedbackMessage,
      correctPartId: current.targetPartId
    }
  };
}

export function advanceQuiz(state: QuizState): QuizState {
  const nextIndex = state.currentIndex + 1;
  const isComplete = nextIndex >= state.questions.length;

  if (isComplete) {
    setBestScore(state.score, state.total);
  }

  return {
    ...state,
    currentIndex: nextIndex,
    isComplete,
    activeFeedback: null
  };
}
