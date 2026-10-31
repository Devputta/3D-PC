/**
 * Boardwalk — Pack System Types
 *
 * Defines the contract for interchangeable learning packs (PC Hardware, Computer Networking).
 * Every pack supplies its catalog of parts, 8 lessons with runnable code snippets and technical tabs,
 * 3D procedural builder, explode layout, guided dataflow journey, and build mode configuration.
 */

import * as THREE from 'three';

export interface PartSpec {
  label: string;
  value: string;
}

export interface PartData {
  id: string;
  number: number;
  name: string;
  summary: string;
  body: [string, string];
  specs: [PartSpec, PartSpec, PartSpec, PartSpec];
  fails: string;
  clue: string;
}

export interface JourneyStep {
  partId: string;
  stepNumber: number;
  title: string;
  lede: string;
  body: string;
}

// Strict progressive disclosure Lesson Schema
export interface LessonCallout {
  partId: string;
  title: string; // Max 3 words, bold uppercase
  line: string;  // Under 8 words
}

export interface LessonFact {
  icon: string;
  text: string;
}

export interface LessonOverview {
  description: string; // Max 2 sentences
  facts: [LessonFact, LessonFact, LessonFact]; // Exactly 3 facts
}

export interface LessonConnection {
  from: string;
  to: string;
  label: string;
}

export interface LessonExample {
  language: string;
  code: string; // Max 10 lines
  explanation: string; // One sentence
  runAnimation?: 'dataflow' | 'powerflow' | 'packet' | 'bus';
}

export interface LessonSpec {
  label: string;
  value: string;
}

export interface LessonQuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string; // One-line explanation
}

export interface Lesson {
  id: string;
  number: number;
  title: string; // Max 3 words
  goal: string; // One sentence: what you will learn
  highlightParts: string[]; // Part IDs to glow in 3D
  callouts: LessonCallout[]; // Max 5 callout cards
  overview: LessonOverview;
  connections: LessonConnection[]; // Shown in Ports & Connections tab
  example: LessonExample;
  specs: LessonSpec[]; // Max 6 rows
  quiz: [LessonQuizQuestion, LessonQuizQuestion, LessonQuizQuestion]; // Exactly 3 questions
}

export interface LocalizedLesson {
  id: string;
  title: string;
  goal: string;
  callouts: LessonCallout[];
  overview: LessonOverview;
  connections: LessonConnection[];
  example: {
    explanation: string;
  };
  specs: LessonSpec[];
  quiz: [
    { question: string; options: [string, string, string, string]; explanation: string },
    { question: string; options: [string, string, string, string]; explanation: string },
    { question: string; options: [string, string, string, string]; explanation: string }
  ];
}

export interface BuiltPart {
  id: string;
  group: THREE.Group;
  materials: THREE.Material[];
  pickableMeshes: THREE.Mesh[];
  subAssemblies?: Record<string, THREE.Group>;
}

export interface SceneBuildResult {
  parts: Record<string, BuiltPart>;
  surfaceMountMesh?: THREE.InstancedMesh;
}

export interface DataFlowRoute {
  id: string;
  label: string;
  curve: THREE.CatmullRomCurve3;
  pulseCount: number;
  startIndex: number;
}

export type FlowMode = 'parts' | 'data' | 'power';

export interface FlowStep {
  stepNumber: number;
  id: string;
  title: string;
  caption: string;
  activeParts: string[];
  pulseColor: number;
  curve?: THREE.CatmullRomCurve3;
  voltageLabel?: string;
  badgeNumber: number;
}

export interface BuildSlot {
  id: string;
  name: string;
  description: string;
  acceptedCategory: string;
  installedPartId: string | null;
}

export interface BuildPart {
  id: string;
  name: string;
  category: string;
  summary: string;
  specs: { label: string; value: string }[];
  isCompatible: boolean;
  failureSentence?: string;
  modelPartId: string;
}

export interface Pack {
  id: 'hardware' | 'networking';
  name: string;
  title: string;
  shortTitle: string;
  journeySubtitle?: string;
  parts: PartData[];
  lessons: Lesson[];
  journey: JourneyStep[];
  buildSlots: BuildSlot[];
  trayParts: BuildPart[];
  build(): SceneBuildResult;
  explode: Record<string, [number, number, number]>;
  subassemblyLifts?: Record<string, [number, number, number]>;
  anchors?: Partial<Record<string, [number, number, number]>>;
  home: {
    direction: [number, number, number];
    target: [number, number, number];
    distance: number;
    fov?: number;
  };
  dataFlowRoutes?: DataFlowRoute[];
}
