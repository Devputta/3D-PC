/**
 * Boardwalk — Main Application Shell (Learn PC & Networks Blueprint)
 *
 * Implements the "Learn Arduino" style blueprint layout:
 * 1. Top Bar: Logo + LEARN PC & NETWORKS + Tagline + Progress Card (0/16) + Live Clock
 * 2. Far-Left Rail (56px): Home, Learn, Pack switch, Quiz, Build, Settings, Language (EN/हि), Credit pill
 * 3. Center 3D Stage: Isometric grid floor, 3D model, floating callout cards with dotted leader lines, mini toolbar
 * 4. Right Column:
 *    - Top Card: Tabs OVERVIEW | PORTS & CONNECTIONS | EXAMPLE | SPECIFICATIONS + 3 icon key facts + Ask box
 *    - Bottom Card: "TRY IT YOURSELF" runnable code editor with line numbers and 3D simulation triggers
 *    - Quiz and Build modes integrated directly into right column (no fullscreen takeovers)
 * 5. Bottom Strip: LESSONS label + 8 horizontally scrolling cards with active navy border & circular buttons
 * 6. Popups: Welcome modal (320px, Esc, click-outside, "Don't show again"), Compare modal, Custom Quiz, Tools modal
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoardView } from './components/BoardView.tsx';
import { CompareModal } from './components/CompareModal.tsx';
import { CustomQuizModal } from './components/CustomQuizModal.tsx';
import { LessonsStrip } from './components/LessonsStrip.tsx';
import { NavRail } from './components/NavRail.tsx';
import { NotesModal } from './components/NotesModal.tsx';
import { PrintNotesView } from './components/PrintNotesView.tsx';
import { RightColumn } from './components/RightColumn.tsx';
import { ToolsModal } from './components/ToolsModal.tsx';
import { TopHeader } from './components/TopHeader.tsx';
import { isWelcomeSuppressed, WelcomeModal } from './components/WelcomeModal.tsx';
import { useI18n } from './i18n/index.tsx';
import { advanceQuiz, answerQuestion, newCustomQuiz, newQuiz, QuizState, skipQuestion } from './lib/quiz.ts';
import { FlowPlayerStrip } from './components/FlowPlayerStrip.tsx';
import { HARDWARE_DATA_FLOW_STEPS, HARDWARE_POWER_FLOW_STEPS } from './packs/hardware/flow.ts';
import { NETWORKING_PACKET_FLOW_STEPS } from './packs/networking/flow.ts';
import { getLocalizedLesson, getPackById, getStoredPackId, PACKS, setStoredPackId } from './packs/index.ts';
import { BuildPart, FlowMode, FlowStep, Lesson } from './packs/types.ts';
import { BoardScene } from './scene/BoardScene.ts';

const COMPLETED_STORAGE_KEY = 'boardwalk_completed_lessons';

function getStoredCompletedLessons(): Set<string> {
  try {
    const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
    if (raw) {
      return new Set(JSON.parse(raw));
    }
  } catch {
    // Fallback
  }
  return new Set();
}

function saveStoredCompletedLessons(completed: Set<string>): void {
  try {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(Array.from(completed)));
  } catch {
    // Fallback
  }
}

export default function App() {
  const { t, isHindi } = useI18n();

  // Pack selection state
  const [activePackId, setActivePackId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlPack = params.get('pack');
      if (urlPack && PACKS.some((p) => p.id === urlPack)) {
        return urlPack;
      }
    }
    return getStoredPackId();
  });

  const activePack = useMemo(() => getPackById(activePackId), [activePackId]);
  const activePartsMap = useMemo(
    () => Object.fromEntries(activePack.parts.map((p) => [p.id, p])),
    [activePack]
  );

  // Lesson state
  const [activeLessonId, setActiveLessonId] = useState<string>(
    () => activePack.lessons[0]?.id || 'pc-lesson-1'
  );

  const activeLesson = useMemo(() => {
    const raw = activePack.lessons.find((l) => l.id === activeLessonId) || activePack.lessons[0];
    return getLocalizedLesson(raw, isHindi);
  }, [activePack, activeLessonId, isHindi]);

  // "How it flows" view state (Parts | Data flow | Power flow)
  const [flowMode, setFlowMode] = useState<FlowMode>('parts');
  const [flowStepIndex, setFlowStepIndex] = useState(0);
  const [isFlowPlaying, setIsFlowPlaying] = useState(false);

  // Available steps for active flow mode
  const currentFlowSteps: FlowStep[] = useMemo(() => {
    if (activePack.id === 'hardware') {
      if (flowMode === 'data') return HARDWARE_DATA_FLOW_STEPS;
      if (flowMode === 'power') return HARDWARE_POWER_FLOW_STEPS;
      return [];
    }
    if (flowMode === 'data') return NETWORKING_PACKET_FLOW_STEPS;
    return [];
  }, [activePack.id, flowMode]);

  const currentFlowStep = currentFlowSteps[flowStepIndex] || null;

  // Flow step auto-play timer
  useEffect(() => {
    if (!isFlowPlaying || currentFlowSteps.length === 0) return;
    const timer = setInterval(() => {
      setFlowStepIndex((prev) => (prev + 1) % currentFlowSteps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isFlowPlaying, currentFlowSteps.length]);

  // Completed lessons progress tracking across all packs (total 16)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() =>
    getStoredCompletedLessons()
  );

  // Navigation mode
  const [mode, setMode] = useState<'explore' | 'journey' | 'quiz' | 'build'>('explore');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(
    () => activeLesson?.callouts?.[0]?.partId || activePack.parts[0]?.id || null
  );

  // 3D Viewport Controls state
  const [explode, setExplode] = useState(0);
  const [isolate, setIsolate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showDataFlow, setShowDataFlow] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);
  const stageRef = useRef<HTMLElement>(null);

  // Toggle 3D Viewport Fullscreen (Browser Fullscreen API + CSS Fallback)
  const handleToggle3DFullscreen = useCallback(() => {
    setIs3DFullscreen((prev) => {
      const next = !prev;
      if (next) {
        const el = stageRef.current;
        if (el && document.fullscreenEnabled && !document.fullscreenElement) {
          el.requestFullscreen?.().catch(() => {
            // Gracefully handled by CSS stage-fullscreen class
          });
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  // Sync state if user exits via browser Escape or native controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setIs3DFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts: F for 3D fullscreen toggle, Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      const isInput = targetTag === 'INPUT' || targetTag === 'TEXTAREA';

      if (e.key === 'Escape' && is3DFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setIs3DFullscreen(false);
      } else if ((e.key === 'f' || e.key === 'F') && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleToggle3DFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [is3DFullscreen, handleToggle3DFullscreen]);

  // Trigger resize observer / camera update whenever fullscreen toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 80);
    return () => clearTimeout(timer);
  }, [is3DFullscreen]);

  // Rail & Layout collapse
  const [isRailCollapsed, setIsRailCollapsed] = useState(false);

  // Modals state
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => !isWelcomeSuppressed());
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCustomQuizOpen, setIsCustomQuizOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  // Build mode state
  const [installedSlots, setInstalledSlots] = useState<Record<string, string>>({});
  const [buildFailureMessage, setBuildFailureMessage] = useState<string | null>(null);

  const sceneRef = useRef<BoardScene | null>(null);

  // Initialize Custom Quiz from URL query on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const quizParam = params.get('quiz');
      const packParam = params.get('pack');

      if (quizParam) {
        const targetPackId =
          packParam && PACKS.some((p) => p.id === packParam) ? packParam : activePackId;
        const targetPack = getPackById(targetPackId);
        const partIds = quizParam.split(',').filter(Boolean);

        if (partIds.length > 0) {
          if (targetPackId !== activePackId) {
            setActivePackId(targetPackId);
            setStoredPackId(targetPackId);
          }
          const customQuiz = newCustomQuiz(targetPack.parts, partIds, targetPackId);
          setQuizState(customQuiz);
          setMode('quiz');
          setSelectedPartId(null);
        }
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  // When active pack changes, sync active lesson & scene
  const handleSwitchPack = () => {
    const nextPackId = activePackId === 'hardware' ? 'networking' : 'hardware';
    setStoredPackId(nextPackId);
    setActivePackId(nextPackId);

    const nextPack = getPackById(nextPackId);
    const firstLesson = nextPack.lessons[0];
    setFlowMode('parts');
    setFlowStepIndex(0);
    setIsFlowPlaying(false);
    if (firstLesson) {
      setActiveLessonId(firstLesson.id);
      const target = firstLesson.callouts?.[0]?.partId || nextPack.parts[0]?.id || null;
      setSelectedPartId(target);
    }
    setMode('explore');
    setIsolate(false);
    setInstalledSlots({});
    setBuildFailureMessage(null);
    sceneRef.current?.setBuildMode(false);
    sceneRef.current?.resetCameraHome(true);
  };

  // Lesson selection
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    const target = lesson.callouts?.[0]?.partId || lesson.highlightParts?.[0] || activePack.parts[0]?.id;
    if (target) {
      setSelectedPartId(target);
      sceneRef.current?.flyToPart(target);
    }
    setMode('explore');
  };

  const currentLessonIndex = activePack.lessons.findIndex((l) => l.id === activeLessonId);
  const canPrevLesson = currentLessonIndex > 0;
  const canNextLesson = currentLessonIndex >= 0 && currentLessonIndex < activePack.lessons.length - 1;

  const handlePrevLesson = () => {
    if (canPrevLesson) {
      handleSelectLesson(activePack.lessons[currentLessonIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (canNextLesson) {
      handleSelectLesson(activePack.lessons[currentLessonIndex + 1]);
    }
  };


  // 3D part picking
  const handleSelectPart = useCallback(
    (partId: string) => {
      if (mode === 'quiz') {
        if (!quizState || quizState.isComplete || quizState.activeFeedback !== null) {
          return;
        }

        const { nextState, wasCorrect } = answerQuestion(quizState, partId, activePartsMap);
        setQuizState(nextState);

        if (wasCorrect) {
          sceneRef.current?.flashPart(partId, 'correct');
        } else {
          sceneRef.current?.flashPart(partId, 'wrong');
          const currentTarget = quizState.questions[quizState.currentIndex].targetPartId;
          setTimeout(() => {
            sceneRef.current?.flashPart(currentTarget, 'correct');
          }, 320);
        }
        return;
      }

      setSelectedPartId(partId);
      sceneRef.current?.flyToPart(partId);

      // Find matching lesson for this part if available
      const matchingLesson = activePack.lessons.find(
        (l) => l.highlightParts?.includes(partId) || l.callouts?.some((c) => c.partId === partId)
      );
      if (matchingLesson) {
        setActiveLessonId(matchingLesson.id);
      }
    },
    [mode, quizState, activePack, activePartsMap]
  );


  // Complete lesson marking
  const handleCompleteLesson = (lessonId: string) => {
    const updated = new Set(completedLessonIds);
    updated.add(lessonId);
    setCompletedLessonIds(updated);
    saveStoredCompletedLessons(updated);
  };

  // Run code simulation trigger
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setShowDataFlow(true);
    sceneRef.current?.triggerSimulation();
    handleCompleteLesson(activeLesson.id);

    setTimeout(() => {
      setIsSimulating(false);
    }, 3200);
  };

  // Mode switching
  const handleModeChange = (nextMode: 'explore' | 'journey' | 'quiz' | 'build') => {
    setMode(nextMode);
    setIsolate(false);
    setBuildFailureMessage(null);

    if (nextMode === 'build') {
      const installedModels = new Set(
        Object.values(installedSlots)
          .map((partId) => activePack.trayParts.find((p) => p.id === partId)?.modelPartId)
          .filter(Boolean) as string[]
      );
      sceneRef.current?.setBuildMode(true, installedModels);
      sceneRef.current?.resetCameraHome(true);
    } else {
      sceneRef.current?.setBuildMode(false);
    }

    if (nextMode === 'quiz') {
      setSelectedPartId(null);
      if (!quizState || quizState.isComplete || quizState.packId !== activePack.id) {
        setQuizState(newQuiz(activePack.parts, activePack.id, Math.min(8, activePack.parts.length)));
      }
      sceneRef.current?.resetCameraHome(true);
    }

    if (nextMode === 'explore') {
      sceneRef.current?.clearFlash();
      if (activeLesson) {
        const target = activeLesson.callouts?.[0]?.partId || activeLesson.highlightParts?.[0] || activePack.parts[0]?.id;
        if (target) {
          setSelectedPartId(target);
          sceneRef.current?.flyToPart(target);
        }
      }
    }
  };


  // Home click
  const handleHomeClick = () => {
    setMode('explore');
    sceneRef.current?.clearFlash();
    sceneRef.current?.resetCameraHome(true);
  };

  // Build mode install logic
  const handleInstallPart = (slotId: string, part: BuildPart) => {
    const slot = activePack.buildSlots.find((s) => s.id === slotId);
    if (!slot) return;

    if (!part.isCompatible) {
      setBuildFailureMessage(
        part.failureSentence || `The ${part.name} is incompatible with this system architecture.`
      );
      return;
    }

    setBuildFailureMessage(null);
    const nextSlots = { ...installedSlots, [slotId]: part.id };
    setInstalledSlots(nextSlots);

    const installedModels = new Set(
      Object.values(nextSlots)
        .map((pId) => activePack.trayParts.find((p) => p.id === pId)?.modelPartId)
        .filter(Boolean) as string[]
    );
    sceneRef.current?.setBuildMode(true, installedModels);
    sceneRef.current?.flashPart(part.modelPartId, 'correct');

    // If all slots filled, complete lesson
    if (Object.keys(nextSlots).length >= activePack.buildSlots.length) {
      handleCompleteLesson(`${activePack.id}-build`);
    }
  };

  const handleResetBuild = () => {
    setInstalledSlots({});
    setBuildFailureMessage(null);
    sceneRef.current?.setBuildMode(true, new Set());
    sceneRef.current?.resetCameraHome(true);
  };

  const handleRemovePart = (slotId: string) => {
    const nextSlots = { ...installedSlots };
    delete nextSlots[slotId];
    setInstalledSlots(nextSlots);
    setBuildFailureMessage(null);

    const installedModels = new Set(
      Object.values(nextSlots)
        .map((pId) => activePack.trayParts.find((p) => p.id === pId)?.modelPartId)
        .filter(Boolean) as string[]
    );
    sceneRef.current?.setBuildMode(true, installedModels);
  };

  const isBuildComplete = Object.keys(installedSlots).length >= activePack.buildSlots.length;

  // Global Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in form controls
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'n' || e.key === 'N') {
        setIsNotesOpen((prev) => !prev);
      } else if (e.key === 'ArrowLeft' && mode === 'explore') {
        if (canPrevLesson) {
          handleSelectLesson(activePack.lessons[currentLessonIndex - 1]);
        }
      } else if (e.key === 'ArrowRight' && mode === 'explore') {
        if (canNextLesson) {
          handleSelectLesson(activePack.lessons[currentLessonIndex + 1]);
        }
      } else if (e.key >= '1' && e.key <= '8' && mode === 'explore') {
        const targetLesson = activePack.lessons[parseInt(e.key, 10) - 1];
        if (targetLesson) {
          handleSelectLesson(targetLesson);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, activePack, activeLessonId, currentLessonIndex, canPrevLesson, canNextLesson]);

  // Quiz actions
  const handleSkipQuizQuestion = () => {
    if (!quizState || quizState.activeFeedback !== null) return;
    const currentTarget = quizState.questions[quizState.currentIndex].targetPartId;
    sceneRef.current?.flashPart(currentTarget, 'correct');
    const nextState = skipQuestion(quizState, activePartsMap);
    setQuizState(nextState);
  };

  const handleNextQuizQuestion = () => {
    if (!quizState) return;
    sceneRef.current?.clearFlash();
    const nextState = advanceQuiz(quizState);
    setQuizState(nextState);
    if (nextState.isComplete) {
      handleCompleteLesson(`${activePack.id}-quiz`);
    }
  };

  const handleRestartQuiz = () => {
    sceneRef.current?.clearFlash();
    setQuizState(newQuiz(activePack.parts, activePack.id, Math.min(8, activePack.parts.length)));
  };

  const handleStartCustomQuiz = (selectedPartIds: string[]) => {
    sceneRef.current?.clearFlash();
    const customQuiz = newCustomQuiz(activePack.parts, selectedPartIds, activePack.id);
    setQuizState(customQuiz);
    setMode('quiz');
    setSelectedPartId(null);
    sceneRef.current?.resetCameraHome(true);
  };

  return (
    <div className="blueprint-app-frame">
      {/* Corner Circuit Traces */}
      <div className="blueprint-frame-decorations" aria-hidden="true">
        <svg className="circuit-corner circuit-corner-tl" width="70" height="70">
          <path d="M 0 16 L 36 16 L 46 26 L 68 26" />
          <rect x="68" y="24" width="4" height="4" fill="#14b8a6" />
        </svg>
        <svg className="circuit-corner circuit-corner-tr" width="70" height="70">
          <path d="M 70 16 L 34 16 L 24 26 L 2 26" />
          <rect x="0" y="24" width="4" height="4" fill="#14b8a6" />
        </svg>
        <svg className="circuit-corner circuit-corner-bl" width="70" height="70">
          <path d="M 0 54 L 36 54 L 46 44 L 68 44" />
          <rect x="68" y="42" width="4" height="4" fill="#14b8a6" />
        </svg>
        <svg className="circuit-corner circuit-corner-br" width="70" height="70">
          <path d="M 70 54 L 34 54 L 24 44 L 2 44" />
          <rect x="0" y="42" width="4" height="4" fill="#14b8a6" />
        </svg>
      </div>

      {/* Top Header Bar */}
      <TopHeader
        pack={activePack}
        completedLessonsCount={completedLessonIds.size}
        totalLessonsCount={16}
        onOpenSettings={() => setIsToolsOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* Main Core Layout: Rail + 3D Viewport + Right Column */}
      <main className="workbench-core-layout">
        {/* Far-Left Vertical Icon Rail (~56px) */}
        <NavRail
          pack={activePack}
          mode={mode}
          onModeChange={handleModeChange}
          onHomeClick={handleHomeClick}
          onSwitchPack={handleSwitchPack}
          onOpenSettings={() => setIsToolsOpen(true)}
          onOpenNotes={() => setIsNotesOpen(true)}
          isNotesOpen={isNotesOpen}
          isCollapsed={isRailCollapsed}
          onToggleCollapse={() => setIsRailCollapsed(!isRailCollapsed)}
        />

        {/* Center 3D Isometric Viewport */}
        <section
          ref={stageRef}
          className={`workbench-center-stage ${is3DFullscreen ? 'stage-fullscreen' : ''}`}
          aria-label="3D Workbench Viewport"
        >
          <BoardView
            pack={activePack}
            lesson={activeLesson}
            mode={mode}
            selectedPartId={selectedPartId}
            onSelectPart={handleSelectPart}
            explode={explode}
            onExplodeChange={setExplode}
            isolate={isolate}
            onToggleIsolate={() => setIsolate(!isolate)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            showDataFlow={showDataFlow}
            onToggleDataFlow={() => setShowDataFlow(!showDataFlow)}
            showInfo={showInfo}
            onToggleInfo={() => setShowInfo(!showInfo)}
            sceneRef={sceneRef}
            isQuizComplete={quizState?.isComplete}
            flowMode={flowMode}
            onSelectFlowMode={(nextMode) => {
              setFlowMode(nextMode);
              setFlowStepIndex(0);
              setIsFlowPlaying(false);
            }}
            currentFlowStep={currentFlowStep}
            isFullscreen={is3DFullscreen}
            onToggleFullscreen={handleToggle3DFullscreen}
          />
        </section>

        {/* Right Column: Top Card Tabs + Bottom Card Try It Yourself */}
        {showInfo && (
          <RightColumn
            pack={activePack}
            mode={mode}
            activeLesson={activeLesson}
            selectedPartId={selectedPartId}
            onRunSimulation={handleRunSimulation}
            isSimulating={isSimulating}
            onCompleteLesson={handleCompleteLesson}
            isLessonCompleted={completedLessonIds.has(activeLesson.id)}
            onPrevLesson={canPrevLesson ? handlePrevLesson : undefined}
            onNextLesson={canNextLesson ? handleNextLesson : undefined}
            onOpenNotes={() => setIsNotesOpen(true)}
            onSelectPart={handleSelectPart}
            quizState={quizState}
            onSkipQuizQuestion={handleSkipQuizQuestion}
            onNextQuizQuestion={handleNextQuizQuestion}
            onRestartQuiz={handleRestartQuiz}
            onBackToExplore={() => handleModeChange('explore')}
            installedSlots={installedSlots}
            buildSlots={activePack.buildSlots}
            trayParts={activePack.trayParts}
            onInstallPart={handleInstallPart}
            onRemovePart={handleRemovePart}
            onResetBuild={handleResetBuild}
            buildFailureMessage={buildFailureMessage}
            isBuildComplete={isBuildComplete}
          />
        )}
      </main>

      {/* Step-by-Step Flow Player (Parts | Data flow | Power flow) */}
      {flowMode !== 'parts' && currentFlowStep && (
        <FlowPlayerStrip
          flowMode={flowMode}
          currentStep={currentFlowStep}
          stepIndex={flowStepIndex}
          totalSteps={currentFlowSteps.length}
          isPlaying={isFlowPlaying}
          onTogglePlay={() => setIsFlowPlaying(!isFlowPlaying)}
          onPrev={() => {
            setFlowStepIndex((prev) => Math.max(0, prev - 1));
            setIsFlowPlaying(false);
          }}
          onNext={() => {
            setFlowStepIndex((prev) => Math.min(currentFlowSteps.length - 1, prev + 1));
            setIsFlowPlaying(false);
          }}
          onExit={() => {
            setFlowMode('parts');
            setIsFlowPlaying(false);
          }}
        />
      )}

      {/* Bottom Horizontal Lessons Strip */}
      <LessonsStrip
        pack={activePack}
        activeLessonId={activeLesson.id}
        onSelectLesson={handleSelectLesson}
        completedLessonIds={completedLessonIds}
        onPrevLesson={canPrevLesson ? handlePrevLesson : undefined}
        onNextLesson={canNextLesson ? handleNextLesson : undefined}
      />


      {/* Welcome / Hi Modal (~320px) */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
      />

      {/* Tools & Settings Menu Dialog */}
      <ToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenCustomQuiz={() => setIsCustomQuizOpen(true)}
        onPrintNotes={() => window.print()}
        onOpenNotes={() => setIsNotesOpen(true)}
        isHardwarePack={activePack.id === 'hardware'}
      />

      {/* Personal Study Notes Modal */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        pack={activePack}
        initialPartId={selectedPartId}
        onSelectPartIn3D={handleSelectPart}
      />

      {/* Hardware Architecture Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      {/* Custom Quiz & Link Share Modal */}
      <CustomQuizModal
        isOpen={isCustomQuizOpen}
        onClose={() => setIsCustomQuizOpen(false)}
        pack={activePack}
        onStartCustomQuiz={handleStartCustomQuiz}
      />

      {/* Hidden printable notes stylesheet view */}
      <PrintNotesView pack={activePack} />
    </div>
  );
}
