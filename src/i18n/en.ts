/**
 * Boardwalk — English Translation Bundle
 */

import { TranslationSchema } from './types.ts';

export const en: TranslationSchema = {
  header: {
    brandName: 'LEARN PC & NETWORKS',
    brandTagline: 'EXPLORE · UNDERSTAND · BUILD',
    sectionBasics: 'BASICS',
    progressCount: (done: number, total: number) => `${done}/${total}`,
    modes: {
      explore: 'Explore',
      journey: 'Journey',
      quiz: 'Quiz',
      build: 'Build'
    },
    languageLabel: 'Language',
    compareBtn: 'Compare',
    shareQuizBtn: 'Custom Quiz'
  },
  rail: {
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    home: 'Home (Reset View)',
    learn: 'Lessons & Journey',
    packSwitchHardware: 'Switch to Networking pack',
    packSwitchNetworking: 'Switch to PC Hardware pack',
    quiz: 'Interactive Quiz',
    build: 'Assembly Workbench',
    settings: 'Tools & Utilities',
    language: 'Change language',
    credit: 'Boardwalk v2'
  },
  toolbar: {
    undo: 'Undo camera view',
    redo: 'Redo camera view',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    info: 'Toggle part details',
    labels: 'Toggle 3D callout labels',
    dataFlow: 'Toggle animated data flow'
  },
  tabs: {
    overview: 'OVERVIEW',
    ports: 'PORTS & CONNECTIONS',
    example: 'EXAMPLE',
    specs: 'SPECIFICATIONS',
    expand: 'Expand card',
    collapse: 'Collapse card'
  },
  tryIt: {
    title: 'TRY IT YOURSELF',
    runBtn: 'Run in 3D',
    runningBtn: 'Transmitting...',
    copyBtn: 'Copy code',
    copiedNotice: 'Copied!',
    simNotice: 'Signal animation playing in 3D viewport'
  },
  lessons: {
    stripTitle: 'LESSONS',
    scrollLeft: 'Scroll left',
    scrollRight: 'Scroll right',
    lessonNumber: (num: number) => `0${num}`,
    completedBadge: 'Completed'
  },
  sheet: {
    pickPartTitle: 'Pick a part',
    pickPartInstruction: 'Click any callout tag or component on the 3D board to inspect its technical architecture and connections.',
    partCounter: (current: number, total: number) => `Part ${current} of ${total}`,
    compareWithOthers: 'Compare PC hardware standards',
    typicalNumbers: 'Key specifications',
    whenItGoesWrong: 'When it goes wrong',
    personalNotes: 'Personal notes',
    notesPlaceholder: 'Record observations, pinouts, or study notes...',
    notesSaved: 'Saved in browser',
    notesSavedBrowser: 'Notes are saved in your local browser',
    printNotesBtn: 'Print Study Notes',
    askAboutPart: 'Ask about this part',
    askPlaceholder: (partName: string) => `Ask a question about ${partName.toLowerCase()}...`,
    askButton: 'Ask question',
    consultingButton: 'Consulting...',
    aiDisclaimer: 'AI answer, check it before relying on it',
    aiAnswerQuestion: 'Q:',
    stepCounter: (current: number, total: number) => `Step ${current} of ${total}`,
    activeComponent: 'Active component',
    backStepBtn: 'Back',
    nextStepBtn: 'Next step',
    startAgainBtn: 'Start again',
    sessionResults: 'Session results',
    quizComplete: 'Quiz complete',
    bestScore: (score: number, total: number) => `Best score: ${score} / ${total}`,
    allCorrect: 'All components identified correctly.',
    partialScore: (score: number, total: number) => `Identified ${score} of ${total} components correctly.`,
    answersBreakdown: 'Answers breakdown',
    retakeQuizBtn: 'Retake quiz',
    backToExploreBtn: 'Back to explore',
    clueLabel: 'Clue',
    instructionClick: 'Click the matching component in the 3D view.',
    skipQuestionBtn: 'Skip',
    nextQuestionBtn: 'Next question'
  },
  build: {
    title: (packName: string) => `${packName} Assembly`,
    lede: 'Drag each part from the tray to its matching slot. Incompatible pairings will be rejected with an explanation.',
    summaryTitle: 'Assembly complete',
    summaryLede: 'All primary sockets and slots are occupied and verified for compatibility.',
    restartBtn: 'Start over',
    inspectBtn: 'Inspect in 3D',
    trayTitle: 'Component Tray',
    slotsTitle: 'Target Slots & Ports',
    dropHint: 'Drag or click to install'
  },
  welcome: {
    title: 'LEARN PC & NETWORKS',
    welcomeMsg: 'Welcome to the 3D Blueprint Workbench',
    description: 'Explore motherboard electronics and networking devices in real-time 3D. Inspect high-speed buses, packet flows, and assembly rules.',
    startBtn: 'Start exploring',
    dontShowAgain: "Don't show again",
    closeBtn: 'Close welcome dialog'
  },
  compare: {
    modalTitle: 'Hardware Architecture Compare',
    modalSubtitle: 'Direct side-by-side technical evaluation of common PC hardware standards.',
    keyNumbers: 'Key specifications',
    verdictTitle: 'Architecture summary',
    whenToChoose: 'When to choose which:',
    closeBtn: 'Close compare view'
  },
  customQuiz: {
    modalTitle: 'Custom Quiz & Shareable Link',
    modalSubtitle: 'Select up to 8 parts to generate a custom quiz link that opens directly without requiring a backend.',
    selectHint: 'Pick parts to test:',
    selectedCount: (count: number, max: number) => `Selected: ${count} of ${max} parts`,
    copyLinkBtn: 'Copy shareable link',
    copiedNotice: 'Link copied to clipboard',
    startCustomQuizBtn: 'Start custom quiz',
    closeBtn: 'Close custom quiz dialog',
    noPartsSelected: 'Select at least 1 part to generate a quiz link.'
  },
  tools: {
    modalTitle: 'Workbench Tools & Utilities',
    modalSubtitle: 'Interactive reference tools and utilities for computer architecture learning.',
    compareTitle: 'Hardware Architecture Comparison',
    compareDesc: 'Side-by-side technical analysis of DDR4 vs DDR5, NVMe vs SATA, and HDD vs SSD.',
    quizTitle: 'Custom Quiz Generator',
    quizDesc: 'Select specific hardware parts or network nodes and export a sharable link.',
    printTitle: 'Printable Study Notes',
    printDesc: 'Export cleanly formatted component summaries and personal study notes to PDF or printer.',
    closeBtn: 'Close tools dialog'
  },
  meta: {
    reviewPendingNotice: 'Needs review',
    needsReview: false
  }
};
