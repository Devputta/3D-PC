/**
 * Boardwalk — Internationalization (i18n) Type Definitions
 *
 * Defines the schema for all UI text, allowing per-language bundles (English, Hindi).
 * Supports technical terminology in English letters within Hindi translations.
 */

export type Language = 'en' | 'hi';

export interface TranslationSchema {
  header: {
    brandName: string;
    brandTagline: string;
    sectionBasics: string;
    progressCount: (done: number, total: number) => string;
    modes: {
      explore: string;
      journey: string;
      quiz: string;
      build: string;
    };
    languageLabel: string;
    compareBtn: string;
    shareQuizBtn: string;
  };
  rail: {
    collapse: string;
    expand: string;
    home: string;
    learn: string;
    packSwitchHardware: string;
    packSwitchNetworking: string;
    quiz: string;
    build: string;
    settings: string;
    language: string;
    credit: string;
  };
  toolbar: {
    undo: string;
    redo: string;
    zoomOut: string;
    zoomIn: string;
    info: string;
    labels: string;
    dataFlow: string;
  };
  tabs: {
    overview: string;
    ports: string;
    example: string;
    specs: string;
    expand: string;
    collapse: string;
  };
  tryIt: {
    title: string;
    runBtn: string;
    runningBtn: string;
    copyBtn: string;
    copiedNotice: string;
    simNotice: string;
  };
  lessons: {
    stripTitle: string;
    scrollLeft: string;
    scrollRight: string;
    lessonNumber: (num: number) => string;
    completedBadge: string;
  };
  sheet: {
    pickPartTitle: string;
    pickPartInstruction: string;
    partCounter: (current: number, total: number) => string;
    compareWithOthers: string;
    typicalNumbers: string;
    whenItGoesWrong: string;
    personalNotes: string;
    notesPlaceholder: string;
    notesSaved: string;
    notesSavedBrowser: string;
    printNotesBtn: string;
    askAboutPart: string;
    askPlaceholder: (partName: string) => string;
    askButton: string;
    consultingButton: string;
    aiDisclaimer: string;
    aiAnswerQuestion: string;
    stepCounter: (current: number, total: number) => string;
    activeComponent: string;
    backStepBtn: string;
    nextStepBtn: string;
    startAgainBtn: string;
    sessionResults: string;
    quizComplete: string;
    bestScore: (score: number, total: number) => string;
    allCorrect: string;
    partialScore: (score: number, total: number) => string;
    answersBreakdown: string;
    retakeQuizBtn: string;
    backToExploreBtn: string;
    clueLabel: string;
    instructionClick: string;
    skipQuestionBtn: string;
    nextQuestionBtn: string;
  };
  build: {
    title: (packName: string) => string;
    lede: string;
    summaryTitle: string;
    summaryLede: string;
    restartBtn: string;
    inspectBtn: string;
    trayTitle: string;
    slotsTitle: string;
    dropHint: string;
  };
  welcome: {
    title: string;
    welcomeMsg: string;
    description: string;
    startBtn: string;
    dontShowAgain: string;
    closeBtn: string;
  };
  compare: {
    modalTitle: string;
    modalSubtitle: string;
    keyNumbers: string;
    verdictTitle: string;
    whenToChoose: string;
    closeBtn: string;
  };
  customQuiz: {
    modalTitle: string;
    modalSubtitle: string;
    selectHint: string;
    selectedCount: (count: number, max: number) => string;
    copyLinkBtn: string;
    copiedNotice: string;
    startCustomQuizBtn: string;
    closeBtn: string;
    noPartsSelected: string;
  };
  tools: {
    modalTitle: string;
    modalSubtitle: string;
    compareTitle: string;
    compareDesc: string;
    quizTitle: string;
    quizDesc: string;
    printTitle: string;
    printDesc: string;
    closeBtn: string;
  };
  meta: {
    reviewPendingNotice: string;
    needsReview: boolean;
  };
}
