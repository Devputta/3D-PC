/**
 * Boardwalk — Flow Player Strip ("How it flows")
 *
 * Sits directly above the bottom lessons bar during Data Flow and Power Flow modes:
 * - Step-by-step player (Prev / Play / Next) walking through one step at a time.
 * - Active step caption: e.g. "2. CPU loads the program into RAM".
 * - Step progress badge (e.g. 2 / 4) and voltage rail label (e.g. +12V EPS).
 */

import React from 'react';
import { FlowMode, FlowStep } from '../packs/types.ts';
import {
  IconActivity,
  IconChevronLeft,
  IconChevronRight,
  IconPause,
  IconPlay,
  IconX,
  IconZap
} from './Icons.tsx';

interface FlowPlayerStripProps {
  flowMode: FlowMode;
  currentStep: FlowStep;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}

export const FlowPlayerStrip: React.FC<FlowPlayerStripProps> = ({
  flowMode,
  currentStep,
  stepIndex,
  totalSteps,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onExit
}) => {
  const isPower = flowMode === 'power';

  return (
    <aside className="flow-player-strip" role="region" aria-label="Step-by-step flow player">
      <div className="flow-player-left">
        {/* Mode Tag */}
        <span className={`flow-mode-badge ${isPower ? 'badge-amber' : 'badge-cyan'}`}>
          {isPower ? <IconZap size={11} /> : <IconActivity size={11} />}
          <span>{isPower ? 'POWER FLOW' : 'DATA FLOW'}</span>
        </span>

        {/* Step Indicator */}
        <span className="flow-step-counter">
          STEP {stepIndex + 1} OF {totalSteps}
        </span>

        {/* Stepper Controls */}
        <div className="flow-controls-group">
          <button
            type="button"
            className="flow-ctrl-btn"
            disabled={stepIndex === 0}
            onClick={onPrev}
            title="Previous step"
            aria-label="Previous step"
          >
            <IconChevronLeft size={13} />
          </button>

          <button
            type="button"
            className="flow-ctrl-btn play-btn"
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause flow' : 'Play flow automatically'}
            aria-label={isPlaying ? 'Pause flow' : 'Play flow automatically'}
          >
            {isPlaying ? <IconPause size={12} /> : <IconPlay size={12} />}
          </button>

          <button
            type="button"
            className="flow-ctrl-btn"
            disabled={stepIndex === totalSteps - 1}
            onClick={onNext}
            title="Next step"
            aria-label="Next step"
          >
            <IconChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Center: Active Step Caption (e.g. "2. CPU loads the program into RAM") */}
      <div className="flow-player-center">
        <span className="flow-caption-text">{currentStep.caption}</span>
      </div>

      {/* Right: Voltage label if power flow + Exit button */}
      <div className="flow-player-right">
        {currentStep.voltageLabel && (
          <span className="flow-voltage-pill" title="Active cable voltage rail">
            {currentStep.voltageLabel}
          </span>
        )}

        <button
          type="button"
          className="flow-exit-btn"
          onClick={onExit}
          title="Exit flow player"
          aria-label="Exit flow player"
        >
          <IconX size={12} />
        </button>
      </div>
    </aside>
  );
};
