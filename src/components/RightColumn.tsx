/**
 * Boardwalk — Right Column Panel
 *
 * Implements strict progressive disclosure, interactive educational tabs,
 * study notes with autosave & export, interactive 3D board quiz with option buttons,
 * scored lesson quiz with completion review, guided journey walkthroughs,
 * and assembly build workbench with installation and removal controls.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { QuizState } from '../lib/quiz.ts';
import { downloadFile, exportNotesAsText, getBestScore, getNote, setNote } from '../lib/storage.ts';
import { BuildPart, BuildSlot, Lesson, Pack, PartData } from '../packs/types.ts';
import {
  IconActivity,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconCpu,
  IconFileText,
  IconMaximize,
  IconMinimize,
  IconNetwork,
  IconPlay,
  IconQuiz,
  IconWrench,
  IconX
} from './Icons.tsx';

type TabKey = 'overview' | 'ports' | 'example' | 'specs' | 'notes';

interface RightColumnProps {
  pack: Pack;
  mode: 'explore' | 'journey' | 'quiz' | 'build';
  activeLesson: Lesson;
  selectedPartId: string | null;
  onRunSimulation: () => void;
  isSimulating: boolean;
  onCompleteLesson: (lessonId: string) => void;
  isLessonCompleted?: boolean;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  onOpenNotes?: () => void;
  onSelectPart?: (partId: string) => void;
  // Quiz state props
  quizState: QuizState | null;
  onSkipQuizQuestion: () => void;
  onNextQuizQuestion: () => void;
  onRestartQuiz: () => void;
  onBackToExplore: () => void;
  // Build state props
  installedSlots: Record<string, string>;
  buildSlots: BuildSlot[];
  trayParts: BuildPart[];
  onInstallPart: (slotId: string, part: BuildPart) => void;
  onRemovePart?: (slotId: string) => void;
  onResetBuild: () => void;
  buildFailureMessage: string | null;
  isBuildComplete: boolean;
}

export const RightColumn: React.FC<RightColumnProps> = ({
  pack,
  mode,
  activeLesson,
  selectedPartId,
  onRunSimulation,
  isSimulating,
  onCompleteLesson,
  isLessonCompleted = false,
  onPrevLesson,
  onNextLesson,
  onOpenNotes,
  onSelectPart,
  quizState,
  onSkipQuizQuestion,
  onNextQuizQuestion,
  onRestartQuiz,
  onBackToExplore,
  installedSlots,
  buildSlots,
  trayParts,
  onInstallPart,
  onRemovePart,
  onResetBuild,
  buildFailureMessage,
  isBuildComplete
}) => {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [topCardExpanded, setTopCardExpanded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [codeFullscreen, setCodeFullscreen] = useState(false);

  // Lesson Quiz Interactive State with full score tracking
  const [lessonQuizIndex, setLessonQuizIndex] = useState(0);
  const [lessonSelectedOption, setLessonSelectedOption] = useState<number | null>(null);
  const [lessonQuizScore, setLessonQuizScore] = useState(0);
  const [lessonQuizComplete, setLessonQuizComplete] = useState(false);
  const [quizViewType, setQuizViewType] = useState<'3d' | 'lesson'>('3d');

  // Reset lesson quiz state when lesson changes
  useEffect(() => {
    setLessonQuizIndex(0);
    setLessonSelectedOption(null);
    setLessonQuizScore(0);
    setLessonQuizComplete(false);
  }, [activeLesson.id]);

  // Journey mode step state
  const [journeyStepIndex, setJourneyStepIndex] = useState(0);

  // "Ask about this part" state
  const [askQuestion, setAskQuestion] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);

  // Personal Study Notes State
  const selectedPart = pack.parts.find((p) => p.id === selectedPartId) || pack.parts[0];
  const [userNote, setUserNote] = useState<string>('');
  const [noteSavedStatus, setNoteSavedStatus] = useState<string>('');

  // Sync note when selected part or pack changes
  useEffect(() => {
    if (selectedPart) {
      setUserNote(getNote(pack.id, selectedPart.id, 'part'));
      setNoteSavedStatus('');
    }
  }, [selectedPart?.id, pack.id]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUserNote(val);
    if (selectedPart) {
      setNote(pack.id, selectedPart.id, val, 'part');
      setNoteSavedStatus(t.sheet.notesSaved);
    }
  };

  const handleSaveNote = () => {
    if (selectedPart) {
      setNote(pack.id, selectedPart.id, userNote, 'part');
      setNoteSavedStatus(t.sheet.notesSaved);
      setTimeout(() => setNoteSavedStatus(''), 2500);
    }
  };

  const handleExportNotes = () => {
    if (selectedPart) {
      setNote(pack.id, selectedPart.id, userNote, 'part');
    }
    const text = exportNotesAsText(pack.name, pack.parts, pack.lessons, pack.id);
    downloadFile(`boardwalk-${pack.id}-notes.txt`, text);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeLesson.example?.code || '');
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleRunCode = () => {
    onRunSimulation();
    onCompleteLesson(activeLesson.id);
  };

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim() || askLoading) return;

    setAskLoading(true);
    setAskAnswer(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: askQuestion.trim(),
          part: selectedPart
        })
      });

      if (!res.ok) throw new Error('API failed');

      const data = await res.json();
      setAskAnswer(data.answer || 'Response generated.');
    } catch {
      // Plain language fallback response under 120 words
      setAskAnswer(
        pack.id === 'hardware'
          ? `${selectedPart.name} is a key PC component. It handles core signals, buses, and processing according to system architecture specifications.`
          : `${selectedPart.name} routes network packets and maintains communication standards across network layers.`
      );
    } finally {
      setAskLoading(false);
    }
  };

  // 1. GUIDED JOURNEY MODE VIEW
  if (mode === 'journey') {
    const journeySteps = pack.journey || [];
    const currentStep = journeySteps[journeyStepIndex] || journeySteps[0];
    const isFirstStep = journeyStepIndex === 0;
    const isLastStep = journeyStepIndex >= journeySteps.length - 1;

    return (
      <aside
        className="right-column-panel"
        aria-label="Guided Journey Panel"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="blueprint-card journey-card">
          <div className="card-header-bar">
            <span className="card-badge">{pack.shortTitle.toUpperCase()} JOURNEY</span>
            <span className="card-counter">
              {t.sheet.stepCounter(journeyStepIndex + 1, journeySteps.length)}
            </span>
          </div>

          {currentStep && (
            <div className="journey-body">
              <div className="journey-title-wrap">
                <span className="journey-num-badge">STEP {journeyStepIndex + 1}</span>
                <h2 className="journey-step-title">{currentStep.title}</h2>
              </div>

              <p className="journey-story-text">
                <strong>{currentStep.lede}</strong> {currentStep.body}
              </p>

              {/* Active Component Pill */}
              <div className="journey-component-box">
                <span className="component-label">{t.sheet.activeComponent}:</span>
                <span className="component-val">
                  {pack.parts.find((p) => p.id === currentStep.partId)?.name ||
                    currentStep.partId.toUpperCase()}
                </span>
              </div>

              {/* Journey Action Buttons */}
              <div className="journey-actions-row">
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  disabled={isFirstStep}
                  onClick={() => setJourneyStepIndex((prev) => Math.max(0, prev - 1))}
                >
                  {t.sheet.backStepBtn}
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-primary"
                    onClick={() =>
                      setJourneyStepIndex((prev) => Math.min(journeySteps.length - 1, prev + 1))
                    }
                  >
                    {t.sheet.nextStepBtn}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-primary"
                    onClick={() => {
                      onCompleteLesson(`${pack.id}-journey`);
                      onBackToExplore();
                    }}
                  >
                    {t.sheet.startAgainBtn}
                  </button>
                )}

                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={onBackToExplore}
                >
                  {t.sheet.backToExploreBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 2. QUIZ MODE VIEW
  if (mode === 'quiz') {
    const is3DQuiz = quizViewType === '3d' && !!quizState;

    // A. 3D Board Identification Quiz
    if (is3DQuiz && quizState) {
      const currentQ = quizState.questions[quizState.currentIndex];
      const bestScore = getBestScore();

      // Accessible options for current question (target + 3 distractors)
      const optionsForCurrentQ: PartData[] = currentQ
        ? (() => {
            const targetPart = pack.parts.find((p) => p.id === currentQ.targetPartId);
            const others = pack.parts.filter((p) => p.id !== currentQ.targetPartId);
            const distractors = others.slice(0, 3);
            const combined = targetPart ? [targetPart, ...distractors] : distractors;
            // Stable sort by name for predictable layout
            return combined.sort((a, b) => a.name.localeCompare(b.name));
          })()
        : [];

      return (
        <aside
          className="right-column-panel"
          aria-label="3D Interactive Quiz Panel"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="blueprint-card quiz-card">
            <div className="card-header-bar">
              <span className="card-badge">3D IDENTIFICATION QUIZ</span>
              <span className="card-counter">
                {quizState.isComplete
                  ? 'COMPLETED'
                  : `QUESTION ${quizState.currentIndex + 1} / ${quizState.total}`}
              </span>
            </div>

            {/* Quiz Complete Summary */}
            {quizState.isComplete ? (
              <div className="quiz-complete-body">
                <div className="success-badge">
                  <IconCheck size={20} />
                </div>
                <h2 className="quiz-result-score">
                  {quizState.score} / {quizState.total}
                </h2>
                <p className="quiz-result-lede">
                  {quizState.score === quizState.total
                    ? t.sheet.allCorrect
                    : t.sheet.partialScore(quizState.score, quizState.total)}
                </p>

                {bestScore && (
                  <div className="quiz-best-score">
                    {t.sheet.bestScore(bestScore.score, bestScore.total)}
                  </div>
                )}

                {/* Answers Breakdown */}
                <div className="quiz-answers-log">
                  <h3 className="log-title">{t.sheet.answersBreakdown}</h3>
                  <div className="log-list">
                    {quizState.questions.map((q, idx) => (
                      <div key={idx} className={`log-row log-${q.status}`}>
                        <span className="log-q-num">Q{q.questionNumber}</span>
                        <span className="log-target">{q.targetPartId.toUpperCase()}</span>
                        <span className="log-status">{q.status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="quiz-actions-row">
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-primary"
                    onClick={onRestartQuiz}
                  >
                    {t.sheet.retakeQuizBtn}
                  </button>
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-secondary"
                    onClick={onBackToExplore}
                  >
                    {t.sheet.backToExploreBtn}
                  </button>
                </div>
              </div>
            ) : (
              // Active 3D Identification Question
              <div className="quiz-body">
                <div className="quiz-instruction-banner">
                  <span className="pulse-dot" />
                  <span>{t.sheet.instructionClick}</span>
                </div>

                {currentQ && (
                  <div className="quiz-clue-card">
                    <span className="clue-tag">{t.sheet.clueLabel.toUpperCase()}</span>
                    <p className="clue-text">{currentQ.clue}</p>
                  </div>
                )}

                {/* Accessible Multiple-Choice Buttons */}
                {!quizState.activeFeedback && currentQ && optionsForCurrentQ.length > 0 && (
                  <div className="quiz-3d-options-grid" role="group" aria-label="Select component answer">
                    {optionsForCurrentQ.map((part) => (
                      <button
                        key={part.id}
                        type="button"
                        className="quiz-3d-option-btn"
                        onClick={() => onSelectPart && onSelectPart(part.id)}
                      >
                        {part.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Feedback on answer */}
                {quizState.activeFeedback && (
                  <div
                    className={`quiz-feedback-box ${
                      quizState.activeFeedback.status === 'correct' ? 'box-correct' : 'box-wrong'
                    }`}
                  >
                    <span className="feedback-status">
                      {quizState.activeFeedback.status === 'correct' ? 'CORRECT' : 'INCORRECT'}
                    </span>
                    <p className="feedback-explanation">{quizState.activeFeedback.message}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="quiz-actions-row">
                  {quizState.activeFeedback ? (
                    <button
                      type="button"
                      className="blueprint-btn blueprint-btn-primary"
                      onClick={onNextQuizQuestion}
                    >
                      {t.sheet.nextQuestionBtn}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="blueprint-btn blueprint-btn-secondary"
                      onClick={onSkipQuizQuestion}
                    >
                      {t.sheet.skipQuestionBtn}
                    </button>
                  )}

                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-secondary"
                    onClick={() => setQuizViewType('lesson')}
                    title="Switch to Lesson Multiple-Choice Quiz"
                  >
                    Lesson Questions
                  </button>

                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-secondary"
                    onClick={onBackToExplore}
                  >
                    {t.sheet.backToExploreBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      );
    }

    // B. Lesson Concept Quiz (3 Multiple Choice Questions)
    const questions = activeLesson.quiz || [];
    const currentQ = questions[lessonQuizIndex] || questions[0];
    const isAnswered = lessonSelectedOption !== null;
    const isCorrect = isAnswered && lessonSelectedOption === currentQ?.correctIndex;

    const handleSelectLessonOption = (idx: number) => {
      if (isAnswered) return;
      setLessonSelectedOption(idx);
      if (idx === currentQ.correctIndex) {
        setLessonQuizScore((prev) => prev + 1);
      }
    };

    return (
      <aside
        className="right-column-panel"
        aria-label="Lesson Quiz Control Panel"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="blueprint-card quiz-card">
          <div className="card-header-bar">
            <span className="card-badge">{pack.shortTitle.toUpperCase()} LESSON QUIZ</span>
            <span className="card-counter">
              {lessonQuizComplete
                ? 'COMPLETED'
                : `QUESTION ${lessonQuizIndex + 1} / ${questions.length}`}
            </span>
          </div>

          {/* Lesson Quiz Complete Screen */}
          {lessonQuizComplete ? (
            <div className="quiz-complete-body">
              <div className="success-badge">
                <IconCheck size={20} />
              </div>
              <h2 className="quiz-result-score">
                {lessonQuizScore} / {questions.length}
              </h2>
              <p className="quiz-result-lede">
                {lessonQuizScore === questions.length
                  ? 'Outstanding! You mastered all questions in this lesson.'
                  : `Good effort! You answered ${lessonQuizScore} of ${questions.length} questions correctly.`}
              </p>

              <div className="quiz-actions-row">
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-primary"
                  onClick={() => {
                    setLessonQuizIndex(0);
                    setLessonSelectedOption(null);
                    setLessonQuizScore(0);
                    setLessonQuizComplete(false);
                  }}
                >
                  {t.sheet.retakeQuizBtn}
                </button>
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={onBackToExplore}
                >
                  {t.sheet.backToExploreBtn}
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="quiz-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="quiz-score-badge">
                  SCORE: {lessonQuizScore} / {lessonQuizIndex + (isAnswered ? 1 : 0)}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--bp-ink-muted)' }}>
                  {activeLesson.title}
                </span>
              </div>

              <h2 className="quiz-q-title">{currentQ.question}</h2>

              {/* Multiple Choice Options */}
              <div className="quiz-options-list" role="radiogroup">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = lessonSelectedOption === idx;
                  const isRightChoice = idx === currentQ.correctIndex;
                  let optClass = 'quiz-option-btn';

                  if (isAnswered) {
                    if (isRightChoice) optClass += ' option-correct';
                    else if (isSelected) optClass += ' option-wrong';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={optClass}
                      disabled={isAnswered}
                      onClick={() => handleSelectLessonOption(idx)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {isAnswered && (
                <div className={`quiz-feedback-box ${isCorrect ? 'box-correct' : 'box-wrong'}`}>
                  <span className="feedback-status">{isCorrect ? 'CORRECT' : 'INCORRECT'}</span>
                  <p className="feedback-explanation">{currentQ.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="quiz-actions-row">
                {lessonQuizIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-primary"
                    disabled={!isAnswered}
                    onClick={() => {
                      setLessonQuizIndex((prev) => prev + 1);
                      setLessonSelectedOption(null);
                    }}
                  >
                    NEXT QUESTION
                  </button>
                ) : (
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-primary"
                    disabled={!isAnswered}
                    onClick={() => {
                      setLessonQuizComplete(true);
                      onCompleteLesson(activeLesson.id);
                    }}
                  >
                    FINISH QUIZ
                  </button>
                )}

                {quizState && (
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-secondary"
                    onClick={() => setQuizViewType('3d')}
                  >
                    3D Board Quiz
                  </button>
                )}

                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={onBackToExplore}
                >
                  EXIT QUIZ
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    );
  }

  // 3. BUILD MODE VIEW
  if (mode === 'build') {
    return (
      <aside
        className="right-column-panel"
        aria-label="Build Mode Panel"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="blueprint-card build-panel-card">
          <div className="card-header-bar">
            <span className="card-badge">{t.build.title(pack.shortTitle).toUpperCase()}</span>
            <button
              type="button"
              className="blueprint-btn-link"
              onClick={onResetBuild}
              title={t.build.restartBtn}
            >
              {t.build.restartBtn}
            </button>
          </div>

          {buildFailureMessage && (
            <div className="build-error-banner" role="alert">
              <span className="error-icon">!</span>
              <p className="error-sentence">{buildFailureMessage}</p>
            </div>
          )}

          {isBuildComplete ? (
            <div className="build-summary-body">
              <div className="success-badge">
                <IconCheck size={16} />
              </div>
              <h2 className="build-complete-title">{t.build.summaryTitle}</h2>
              <p className="build-complete-lede">{t.build.summaryLede}</p>
              <button
                type="button"
                className="blueprint-btn blueprint-btn-primary"
                onClick={onResetBuild}
              >
                {t.build.restartBtn}
              </button>
            </div>
          ) : (
            <>
              {/* Target Slots List with Remove Support */}
              <div className="build-section">
                <h3 className="build-section-title">{t.build.slotsTitle}</h3>
                <div className="build-slots-list">
                  {buildSlots.map((slot) => {
                    const installedPartId = installedSlots[slot.id];
                    const installedPart = trayParts.find((p) => p.id === installedPartId);

                    return (
                      <div
                        key={slot.id}
                        className={`build-slot-row ${installedPart ? 'slot-occupied' : 'slot-empty'}`}
                      >
                        <div className="slot-info">
                          <span className="slot-name">{slot.name}</span>
                          <span className="slot-status">
                            {installedPart ? `✓ ${installedPart.name}` : 'Awaiting component'}
                          </span>
                        </div>

                        {installedPart && onRemovePart && (
                          <button
                            type="button"
                            className="build-slot-remove-btn"
                            onClick={() => onRemovePart(slot.id)}
                            title={`Remove ${installedPart.name} from ${slot.name}`}
                            aria-label={`Remove ${installedPart.name}`}
                          >
                            <IconX size={11} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Component Tray */}
              <div className="build-section">
                <h3 className="build-section-title">{t.build.trayTitle}</h3>
                <div className="build-tray-grid">
                  {trayParts.map((part) => {
                    const isInstalled = Object.values(installedSlots).includes(part.id);
                    const matchingSlot = buildSlots.find(
                      (s) => s.acceptedCategory === part.category
                    );

                    const handleInstall = () => {
                      if (!isInstalled && matchingSlot) {
                        onInstallPart(matchingSlot.id, part);
                      }
                    };

                    const handleRemove = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (matchingSlot && onRemovePart) {
                        onRemovePart(matchingSlot.id);
                      }
                    };

                    return (
                      <div
                        key={part.id}
                        role="button"
                        tabIndex={0}
                        className={`tray-part-card ${isInstalled ? 'tray-part-installed' : ''}`}
                        onClick={isInstalled ? undefined : handleInstall}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!isInstalled) handleInstall();
                          }
                        }}
                      >
                        <div className="tray-part-header">
                          <IconWrench size={13} className="tray-icon" />
                          <span className="tray-part-name">{part.name}</span>
                        </div>
                        <p className="tray-part-summary">{part.summary}</p>
                        <div className="tray-part-footer">
                          <span className="tray-category-tag">{part.category.toUpperCase()}</span>
                          {isInstalled ? (
                            <button
                              type="button"
                              className="build-slot-remove-btn"
                              onClick={handleRemove}
                              title="Remove installed component"
                            >
                              <IconX size={10} />
                              <span>Remove</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="tray-install-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInstall();
                              }}
                            >
                              Install
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    );
  }

  // 4. EXPLORE & LESSONS VIEW (Default)
  const codeContent = activeLesson.example?.code || '';
  const codeLines = codeContent.split('\n');

  return (
    <aside
      className={`right-column-panel ${codeFullscreen ? 'fullscreen-code' : ''}`}
      aria-label="Component Information and Try-it Playground"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* TOP CARD: Tabs (OVERVIEW | PORTS & CONNECTIONS | EXAMPLE | SPECIFICATIONS | NOTES) */}
      {!codeFullscreen && (
        <div className={`blueprint-card top-info-card ${topCardExpanded ? 'card-expanded' : ''}`}>
          {/* Card Tabs Navigation */}
          <div className="tabs-header-bar" role="tablist">
            <div className="tabs-nav">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'overview'}
                className={`tab-btn ${activeTab === 'overview' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                {t.tabs.overview}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ports'}
                className={`tab-btn ${activeTab === 'ports' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('ports')}
              >
                {t.tabs.ports}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'example'}
                className={`tab-btn ${activeTab === 'example' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('example')}
              >
                {t.tabs.example}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'specs'}
                className={`tab-btn ${activeTab === 'specs' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                {t.tabs.specs}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'notes'}
                className={`tab-btn ${activeTab === 'notes' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                NOTES
              </button>
            </div>

            <button
              type="button"
              className="expand-card-btn"
              onClick={() => setTopCardExpanded(!topCardExpanded)}
              title={topCardExpanded ? t.tabs.collapse : t.tabs.expand}
              aria-label={topCardExpanded ? t.tabs.collapse : t.tabs.expand}
            >
              {topCardExpanded ? <IconMinimize size={13} /> : <IconMaximize size={13} />}
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="top-card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <span className="card-badge" style={{ marginBottom: '4px', display: 'inline-block' }}>
                    PART #{selectedPart.number} · {selectedPart.id.toUpperCase()}
                  </span>
                  <h2 className="top-card-title">{selectedPart.name.toUpperCase()}</h2>
                </div>

                <button
                  type="button"
                  className={`mark-complete-btn ${isLessonCompleted ? 'mark-complete-btn-active' : ''}`}
                  onClick={() => onCompleteLesson(activeLesson.id)}
                  title={isLessonCompleted ? 'Lesson completed' : 'Mark lesson as complete'}
                >
                  <IconCheck size={12} />
                  <span>{isLessonCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                </button>
              </div>

              <p className="top-card-desc">
                <strong>{selectedPart.summary}</strong>
              </p>

              {/* In-Depth Architecture Body */}
              <div style={{ fontSize: '11px', color: 'var(--bp-ink-muted)', lineHeight: '1.45', margin: '6px 0' }}>
                <p style={{ marginBottom: '4px' }}>{selectedPart.body[0]}</p>
                <p>{selectedPart.body[1]}</p>
              </div>

              {/* Active Lesson Context & Goal */}
              <div style={{ padding: '8px 10px', backgroundColor: 'var(--bp-bg-mesh)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bp-border)', margin: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: '11px', color: 'var(--bp-navy)', textTransform: 'uppercase' }}>
                    Lesson {activeLesson.number}: {activeLesson.title}
                  </span>
                </div>
                <p style={{ fontSize: '10.5px', color: 'var(--bp-ink-muted)', margin: 0 }}>
                  {activeLesson.goal}
                </p>
              </div>

              {/* 3 Icon Key Facts */}
              <div className="key-facts-container">
                {activeLesson.overview.facts.map((fact, i) => (
                  <div key={i} className="key-fact-row">
                    <span className="fact-icon">
                      <IconActivity size={12} />
                    </span>
                    <span className="fact-text">{fact.text}</span>
                  </div>
                ))}
              </div>

              {/* Prev / Next Lesson Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--bp-border)' }}>
                {onPrevLesson ? (
                  <button
                    type="button"
                    className="lesson-nav-btn"
                    onClick={onPrevLesson}
                  >
                    <IconChevronLeft size={11} />
                    <span>Prev Lesson</span>
                  </button>
                ) : <span />}

                {onNextLesson && (
                  <button
                    type="button"
                    className="lesson-nav-btn"
                    onClick={onNextLesson}
                  >
                    <span>Next Lesson</span>
                    <IconChevronRight size={11} />
                  </button>
                )}
              </div>

              {/* Ask About This Part Box */}
              <div className="ask-part-section" style={{ marginTop: '8px' }}>
                <form onSubmit={handleAskSubmit} className="ask-form">
                  <input
                    type="text"
                    className="ask-input"
                    placeholder={`Ask about ${selectedPart.name}...`}
                    value={askQuestion}
                    onChange={(e) => setAskQuestion(e.target.value)}
                    aria-label={`Ask about ${selectedPart.name}`}
                  />
                  <button
                    type="submit"
                    className="ask-submit-btn"
                    disabled={askLoading || !askQuestion.trim()}
                  >
                    {askLoading ? t.sheet.consultingButton : t.sheet.askButton}
                  </button>
                </form>

                {askAnswer && (
                  <div className="ask-answer-box">
                    <div className="ai-disclaimer-pill">{t.sheet.aiDisclaimer}</div>
                    <p className="ai-answer-text">{askAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PORTS & CONNECTIONS */}
          {activeTab === 'ports' && (
            <div className="top-card-body">
              <h2 className="top-card-title">PORTS & BUS CONNECTIONS</h2>
              <p className="top-card-caption">
                Direct signal interfaces, pinouts, and hardware routing for {selectedPart.name}.
              </p>

              <div className="connections-list">
                {activeLesson.connections.map((conn, idx) => (
                  <div key={idx} className="connection-card-row">
                    <div className="connection-endpoints">
                      <span className="endpoint-node">{conn.from}</span>
                      <span className="endpoint-arrow">──▶</span>
                      <span className="endpoint-node">{conn.to}</span>
                    </div>
                    <span className="connection-label">{conn.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXAMPLE & EXPLANATION */}
          {activeTab === 'example' && (
            <div className="top-card-body">
              <h2 className="top-card-title">RUNTIME EXPLANATION</h2>
              <p className="top-card-desc">{activeLesson.example.explanation}</p>
              <div className="example-hint-box">
                <span className="hint-pill">RUNNABLE SNIPPET</span>
                <span className="hint-text">
                  Inspect or run the terminal query below to view hardware telemetry and bus activity.
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="top-card-body">
              <h2 className="top-card-title">{selectedPart.name.toUpperCase()} SPECIFICATIONS</h2>
              <p className="top-card-caption">Engineering standards, timing ratings, and electrical limits.</p>

              <div className="specs-table-container">
                <table className="specs-data-table">
                  <tbody>
                    {selectedPart.specs.map((spec, i) => (
                      <tr key={`part-spec-${i}`} className="spec-row">
                        <td className="spec-label-col">{spec.label}</td>
                        <td className="spec-val-col">{spec.value}</td>
                      </tr>
                    ))}
                    {activeLesson.specs.map((spec, i) => (
                      <tr key={`lesson-spec-${i}`} className="spec-row">
                        <td className="spec-label-col">{spec.label}</td>
                        <td className="spec-val-col">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Failure Modes & Diagnostics */}
              <div style={{ marginTop: '10pt' }}>
                <span className="card-badge" style={{ color: '#b91c1c' }}>FAILURE MODES & DIAGNOSTICS</span>
                <p style={{ fontSize: '11px', color: '#991b1b', backgroundColor: '#fef2f2', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #ef4444', marginTop: '4px', lineHeight: '1.4' }}>
                  {selectedPart.fails}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: PERSONAL STUDY NOTES */}
          {activeTab === 'notes' && (
            <div className="top-card-body notes-tab-body">
              <div className="notes-tab-header">
                <div>
                  <h2 className="top-card-title">{selectedPart.name}</h2>
                  <p className="top-card-caption">{t.sheet.notesSavedBrowser}</p>
                </div>
                {noteSavedStatus && (
                  <span className="save-status-badge">
                    <IconCheck size={11} />
                    <span>{noteSavedStatus}</span>
                  </span>
                )}
              </div>

              <textarea
                className="notes-textarea"
                rows={5}
                value={userNote}
                onChange={handleNoteChange}
                placeholder={t.sheet.notesPlaceholder}
                aria-label={`Personal notes for ${selectedPart.name}`}
              />

              <div className="notes-tab-actions">
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-primary"
                  onClick={handleSaveNote}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={handleExportNotes}
                  title="Export all notes as text"
                >
                  Export All
                </button>
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={() => window.print()}
                  title={t.sheet.printNotesBtn}
                >
                  Print
                </button>
                {onOpenNotes && (
                  <button
                    type="button"
                    className="blueprint-btn blueprint-btn-secondary"
                    onClick={onOpenNotes}
                    title="Open Full Study Notes Editor"
                  >
                    Open Editor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM CARD: TRY IT YOURSELF (Code block <= 10 lines with Run & Copy buttons) */}
      <div className={`blueprint-card try-it-card ${codeFullscreen ? 'card-fullscreen' : ''}`}>
        <div className="card-header-bar">
          <div className="try-it-title-wrap">
            <span className="try-it-badge">{t.tryIt.title}</span>
            <span className="code-lang-tag">
              {(activeLesson.example?.language || 'bash').toUpperCase()}
            </span>
          </div>

          <div className="try-it-actions">
            {/* Copy Button */}
            <button
              type="button"
              className="action-icon-btn"
              onClick={handleCopyCode}
              title={codeCopied ? t.tryIt.copiedNotice : t.tryIt.copyBtn}
              aria-label={codeCopied ? t.tryIt.copiedNotice : t.tryIt.copyBtn}
            >
              <IconCopy size={13} />
              {codeCopied && <span className="action-tag">{t.tryIt.copiedNotice}</span>}
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              className="action-icon-btn"
              onClick={() => setCodeFullscreen(!codeFullscreen)}
              title={codeFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code'}
              aria-label={codeFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code'}
            >
              {codeFullscreen ? <IconMinimize size={13} /> : <IconMaximize size={13} />}
            </button>

            {/* Run Button (Plays 3D simulation) */}
            <button
              type="button"
              className="run-code-btn"
              onClick={handleRunCode}
              disabled={isSimulating}
              title={t.tryIt.runBtn}
            >
              <IconPlay size={12} />
              <span>{isSimulating ? t.tryIt.runningBtn : t.tryIt.runBtn}</span>
            </button>
          </div>
        </div>

        {/* Monospace Code Area with Line Numbers (max 10 lines) */}
        <div className="code-editor-viewport">
          <div className="code-line-numbers" aria-hidden="true">
            {codeLines.map((_line: string, idx: number) => (
              <span key={idx} className="line-num">
                {idx + 1}
              </span>
            ))}
          </div>
          <pre className="code-content-block">
            <code>{codeContent}</code>
          </pre>
        </div>

        {isSimulating && (
          <div className="simulation-status-banner">
            <span className="pulse-dot" />
            <span className="status-text">{t.tryIt.simNotice}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
