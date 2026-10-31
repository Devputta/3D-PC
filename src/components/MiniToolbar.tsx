/**
 * Boardwalk — Floating Mini Toolbar with "How it flows" View Toggle
 *
 * Sits bottom-center over the 3D viewport:
 * - Segmented Flow Toggle: "Parts | Data flow | Power flow" (Hardware) or "Devices | Packet flow" (Networking)
 * - Undo View, Redo View, Zoom Out, Zoom In, Labels Show/Hide.
 */

import React from 'react';
import { useI18n } from '../i18n/index.tsx';
import { FlowMode } from '../packs/types.ts';
import {
  IconActivity,
  IconCpu,
  IconEye,
  IconInfo,
  IconLayers,
  IconMaximize,
  IconMinimize,
  IconNetwork,
  IconRedo,
  IconRotateCcw,
  IconTag,
  IconUndo,
  IconZap,
  IconZoomIn,
  IconZoomOut
} from './Icons.tsx';

interface MiniToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onResetCamera?: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  packId: 'hardware' | 'networking';
  flowMode: FlowMode;
  onSelectFlowMode: (mode: FlowMode) => void;
  isolate?: boolean;
  onToggleIsolate?: () => void;
  showInfo?: boolean;
  onToggleInfo?: () => void;
  explode?: number;
  onExplodeChange?: (value: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const MiniToolbar: React.FC<MiniToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onZoomOut,
  onZoomIn,
  onResetCamera,
  showLabels,
  onToggleLabels,
  packId,
  flowMode,
  onSelectFlowMode,
  isolate = false,
  onToggleIsolate,
  showInfo = true,
  onToggleInfo,
  explode = 0,
  onExplodeChange,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const { t } = useI18n();

  return (
    <nav className="mini-toolbar" role="toolbar" aria-label="3D Viewport Controls">
      {/* "How it flows" Segmented Toggle */}
      <div className="flow-mode-segmented-toggle" role="group" aria-label="How it flows view">
        {/* Parts / Devices */}
        <button
          type="button"
          className="flow-segment-btn"
          data-active={flowMode === 'parts'}
          onClick={() => onSelectFlowMode('parts')}
          title={packId === 'hardware' ? 'Parts view: normal 3D model with callouts' : 'Devices view'}
        >
          {packId === 'hardware' ? <IconCpu size={12} /> : <IconNetwork size={12} />}
          <span>{packId === 'hardware' ? 'Parts' : 'Devices'}</span>
        </button>

        {/* Data flow / Packet flow */}
        <button
          type="button"
          className="flow-segment-btn"
          data-active={flowMode === 'data'}
          onClick={() => onSelectFlowMode('data')}
          title={packId === 'hardware' ? 'Data flow: Storage → RAM → CPU → GPU → Display' : 'Packet flow journey'}
        >
          <IconActivity size={12} />
          <span>{packId === 'hardware' ? 'Data flow' : 'Packet flow'}</span>
        </button>

        {/* Power flow (PC Hardware only) */}
        {packId === 'hardware' && (
          <button
            type="button"
            className="flow-segment-btn"
            data-active={flowMode === 'power'}
            onClick={() => onSelectFlowMode('power')}
            title="Power flow: PSU voltage rails (+12V, +5V, +3.3V)"
          >
            <IconZap size={12} />
            <span>Power flow</span>
          </button>
        )}
      </div>

      <span className="mini-toolbar-sep" />

      {/* Undo View */}
      <button
        type="button"
        className="mini-toolbar-btn"
        disabled={!canUndo}
        onClick={onUndo}
        title={t.toolbar.undo}
        aria-label={t.toolbar.undo}
      >
        <IconUndo size={13} />
      </button>

      {/* Redo View */}
      <button
        type="button"
        className="mini-toolbar-btn"
        disabled={!canRedo}
        onClick={onRedo}
        title={t.toolbar.redo}
        aria-label={t.toolbar.redo}
      >
        <IconRedo size={13} />
      </button>

      <span className="mini-toolbar-sep" />

      {/* Zoom Out */}
      <button
        type="button"
        className="mini-toolbar-btn"
        onClick={onZoomOut}
        title={t.toolbar.zoomOut}
        aria-label={t.toolbar.zoomOut}
      >
        <IconZoomOut size={13} />
      </button>

      {/* Zoom In */}
      <button
        type="button"
        className="mini-toolbar-btn"
        onClick={onZoomIn}
        title={t.toolbar.zoomIn}
        aria-label={t.toolbar.zoomIn}
      >
        <IconZoomIn size={13} />
      </button>

      {/* Reset Camera Home */}
      {onResetCamera && (
        <button
          type="button"
          className="mini-toolbar-btn"
          onClick={onResetCamera}
          title="Reset camera home"
          aria-label="Reset camera home"
        >
          <IconRotateCcw size={13} />
        </button>
      )}

      {/* Fullscreen Expand / Exit */}
      {onToggleFullscreen && (
        <button
          type="button"
          className="mini-toolbar-btn"
          data-active={isFullscreen}
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand 3D Viewport Fullscreen (F)'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Expand 3D Viewport Fullscreen'}
        >
          {isFullscreen ? <IconMinimize size={13} /> : <IconMaximize size={13} />}
        </button>
      )}

      <span className="mini-toolbar-sep" />

      {/* Labels / Callout Tags Show/Hide */}
      <button
        type="button"
        className="mini-toolbar-btn"
        data-active={showLabels}
        onClick={onToggleLabels}
        title={t.toolbar.labels}
        aria-label={t.toolbar.labels}
      >
        <IconTag size={13} />
      </button>

      {/* Isolate Active Part (dims other components) */}
      {onToggleIsolate && (
        <button
          type="button"
          className="mini-toolbar-btn"
          data-active={isolate}
          onClick={onToggleIsolate}
          title={isolate ? 'Exit isolation mode' : 'Isolate active component'}
          aria-label={isolate ? 'Exit isolation mode' : 'Isolate active component'}
        >
          <IconEye size={13} />
        </button>
      )}

      {/* Explode 3D Model Assembly */}
      {onExplodeChange && (
        <div className="mini-toolbar-explode" title={`Explode model: ${Math.round(explode * 100)}%`}>
          <button
            type="button"
            className="mini-toolbar-btn"
            data-active={explode > 0}
            onClick={() => onExplodeChange(explode > 0 ? 0 : 0.65)}
            title={explode > 0 ? 'Collapse assembly (0%)' : 'Explode assembly (65%)'}
            aria-label={explode > 0 ? 'Collapse assembly' : 'Explode assembly'}
          >
            <IconLayers size={13} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={explode}
            onChange={(e) => onExplodeChange(parseFloat(e.target.value))}
            className="mini-explode-slider"
            aria-label="Explode slider"
          />
          {explode > 0 && <span className="mini-explode-badge">{Math.round(explode * 100)}%</span>}
        </div>
      )}

      <span className="mini-toolbar-sep" />

      {/* Toggle Right Details Panel (Minimize / Maximize 3D Diagram) */}
      {onToggleInfo && (
        <button
          type="button"
          className="mini-toolbar-btn"
          data-active={showInfo}
          onClick={onToggleInfo}
          title={showInfo ? 'Minimize details panel (full diagram)' : t.toolbar.info}
          aria-label={showInfo ? 'Minimize details panel' : t.toolbar.info}
        >
          <IconInfo size={13} />
        </button>
      )}
    </nav>
  );
};
