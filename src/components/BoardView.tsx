/**
 * Boardwalk — 3D Board View Component
 *
 * Coordinates WebGL canvas mount, blueprint isometric grid floor,
 * dynamic callout cards with dotted leader lines, and floating mini toolbar.
 */

import React, { useEffect, useRef, useState } from 'react';
import { FlowMode, FlowStep, Lesson, Pack } from '../packs/types.ts';
import { BoardScene, CalloutProjection, DataFlowCaption } from '../scene/BoardScene.ts';
import { CalloutOverlay } from './CalloutOverlay.tsx';
import { IconMaximize, IconMinimize } from './Icons.tsx';
import { MiniToolbar } from './MiniToolbar.tsx';

interface BoardViewProps {
  pack: Pack;
  lesson?: Lesson;
  mode: 'explore' | 'journey' | 'quiz' | 'build';
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  explode: number;
  onExplodeChange: (value: number) => void;
  isolate: boolean;
  onToggleIsolate: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showDataFlow: boolean;
  onToggleDataFlow: () => void;
  showInfo: boolean;
  onToggleInfo: () => void;
  sceneRef: React.MutableRefObject<BoardScene | null>;
  isQuizComplete?: boolean;
  flowMode: FlowMode;
  onSelectFlowMode: (mode: FlowMode) => void;
  currentFlowStep?: FlowStep | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  pack,
  lesson,
  mode,
  selectedPartId,
  onSelectPart,
  explode,
  onExplodeChange,
  isolate,
  onToggleIsolate,
  showLabels,
  onToggleLabels,
  showDataFlow,
  onToggleDataFlow,
  showInfo,
  onToggleInfo,
  sceneRef,
  isQuizComplete = false,
  flowMode,
  onSelectFlowMode,
  currentFlowStep = null,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlAvailable, setWebGlAvailable] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [projections, setProjections] = useState<CalloutProjection[]>([]);
  const [dataFlowCaptions, setDataFlowCaptions] = useState<DataFlowCaption[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 600 });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Initialize WebGL Scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Test WebGL support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      setWebGlAvailable(false);
      return;
    }

    const scene = new BoardScene(mountRef.current, pack, {
      onPick: (partId) => {
        onSelectPart(partId);
      },
      onHover: () => {},
      onProject: (projList) => {
        setProjections(projList);
        if (sceneRef.current) {
          setCanUndo(sceneRef.current.canUndo());
          setCanRedo(sceneRef.current.canRedo());
        }
      },
      onProjectDataFlow: (captions) => {
        setDataFlowCaptions(captions);
      },
      onContextLost: () => {
        setContextLost(true);
      },
      onContextRestored: () => {
        setContextLost(false);
        setRenderError(null);
      },
      onError: (err) => {
        setRenderError(err.message || 'Rendering error');
      }
    });

    sceneRef.current = scene;

    const ro = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setContainerDimensions({ width, height });
        scene.handleResize(width, height);
      }
    });

    if (mountRef.current) {
      ro.observe(mountRef.current);
      const initialW = mountRef.current.clientWidth || 800;
      const initialH = mountRef.current.clientHeight || 600;
      setContainerDimensions({ width: initialW, height: initialH });

      // Secondary check once layout calculations settle
      const rafId = requestAnimationFrame(() => {
        if (mountRef.current) {
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          if (w > 0 && h > 0) {
            scene.handleResize(w, h);
            setContainerDimensions({ width: w, height: h });
          }
        }
      });
      const timerId = setTimeout(() => {
        if (mountRef.current) {
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          if (w > 0 && h > 0) {
            scene.handleResize(w, h);
            setContainerDimensions({ width: w, height: h });
          }
        }
      }, 100);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
        ro.disconnect();
        scene.dispose();
        sceneRef.current = null;
      };
    }

    return () => {
      ro.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Sync callbacks to scene when onSelectPart changes
  useEffect(() => {
    sceneRef.current?.setEvents({
      onPick: (partId) => {
        onSelectPart(partId);
      },
      onHover: () => {},
      onProject: (projList) => {
        setProjections(projList);
        if (sceneRef.current) {
          setCanUndo(sceneRef.current.canUndo());
          setCanRedo(sceneRef.current.canRedo());
        }
      },
      onProjectDataFlow: (captions) => {
        setDataFlowCaptions(captions);
      },
      onContextLost: () => {
        setContextLost(true);
      },
      onContextRestored: () => {
        setContextLost(false);
        setRenderError(null);
      },
      onError: (err) => {
        setRenderError(err.message || 'Rendering error');
      }
    });
  }, [onSelectPart]);

  // Sync active pack to scene
  useEffect(() => {
    sceneRef.current?.setPack(pack);
  }, [pack]);

  // Sync explode value to scene
  useEffect(() => {
    sceneRef.current?.setExplode(explode);
  }, [explode]);

  // Sync selection to scene
  useEffect(() => {
    sceneRef.current?.selectPart(selectedPartId);
  }, [selectedPartId]);

  // Sync isolation mode to scene
  useEffect(() => {
    sceneRef.current?.setIsolate(isolate);
  }, [isolate]);

  // Sync data flow visibility to scene
  useEffect(() => {
    sceneRef.current?.setShowDataFlow(showDataFlow);
  }, [showDataFlow]);

  // Sync flow state to scene
  useEffect(() => {
    sceneRef.current?.setFlowState(flowMode, currentFlowStep || null);
  }, [flowMode, currentFlowStep]);

  const handleUndo = () => {
    sceneRef.current?.undoView();
    if (sceneRef.current) {
      setCanUndo(sceneRef.current.canUndo());
      setCanRedo(sceneRef.current.canRedo());
    }
  };

  const handleRedo = () => {
    sceneRef.current?.redoView();
    if (sceneRef.current) {
      setCanUndo(sceneRef.current.canUndo());
      setCanRedo(sceneRef.current.canRedo());
    }
  };

  const handleZoomIn = () => {
    sceneRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    sceneRef.current?.zoomOut();
  };

  // Hide callouts during active quiz without completion or in build mode
  const hideCallouts = mode === 'build' || (mode === 'quiz' && !isQuizComplete);

  return (
    <div className="stage-canvas-wrap">
      {/* Circuit Trace Background Overlay */}
      <div className="circuit-traces-bg" aria-hidden="true">
        <svg width="100%" height="100%" className="circuit-traces-svg">
          {/* Top-left corner trace */}
          <path d="M 24 16 L 90 16 L 110 36 L 180 36" stroke="#e0d4c2" strokeWidth="1" fill="none" />
          <rect x="180" y="34" width="4" height="4" fill="#14b8a6" />
          {/* Bottom-right corner trace */}
          <path d="M 100% 92% L 92% 92% L 88% 88% L 78% 88%" stroke="#e0d4c2" strokeWidth="1" fill="none" />
          <rect x="78%" y="87%" width="4" height="4" fill="#14b8a6" />
        </svg>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          touchAction: 'none',
          zIndex: 1
        }}
      />

      {/* WebGL Missing Fallback */}
      {!webGlAvailable && (
        <div className="webgl-missing-card" role="alert">
          <h2 className="webgl-missing-title">WebGL unavailable</h2>
          <p className="empty-instruction">
            This browser cannot draw the 3D board. WebGL is switched off or unavailable.
            Try another browser, or check that hardware acceleration is turned on in your settings.
          </p>
        </div>
      )}

      {/* WebGL Context Lost Fallback */}
      {contextLost && (
        <div className="webgl-missing-card" role="alert">
          <h2 className="webgl-missing-title">3D Context Lost</h2>
          <p className="empty-instruction">
            Hardware graphics acceleration was interrupted. Click below to reload the 3D scene.
          </p>
          <button
            type="button"
            className="blueprint-btn blueprint-btn-primary"
            style={{ marginTop: 8 }}
            onClick={() => window.location.reload()}
          >
            Reload Scene
          </button>
        </div>
      )}

      {/* Render Error Fallback */}
      {renderError && (
        <div className="webgl-missing-card" role="alert">
          <h2 className="webgl-missing-title">Graphics Error</h2>
          <p className="empty-instruction">{renderError}</p>
          <button
            type="button"
            className="blueprint-btn blueprint-btn-primary"
            style={{ marginTop: 8 }}
            onClick={() => setRenderError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dynamic 2D Callout Cards with Progressive Disclosure & Dotted Leader Lines */}
      {!hideCallouts && (
        <CalloutOverlay
          pack={pack}
          lesson={lesson}
          projections={projections}
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          showLabels={showLabels}
          containerWidth={containerDimensions.width}
          containerHeight={containerDimensions.height}
          flowMode={flowMode}
          currentFlowStep={currentFlowStep}
        />
      )}

      {/* 2D Data Flow Captions Overlay */}
      {showDataFlow && (
        <div className="callout-overlay" aria-hidden="true">
          {dataFlowCaptions.map((cap) => {
            if (!cap.visible) return null;
            return (
              <div
                key={cap.id}
                className="data-flow-caption"
                style={{
                  transform: `translate3d(${cap.x}px, ${cap.y}px, 0)`
                }}
              >
                {cap.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Top-Right Corner Fullscreen / Expand Control */}
      {onToggleFullscreen && (
        <button
          type="button"
          className="board-fullscreen-corner-btn"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand 3D Viewport Fullscreen (F)'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Expand 3D Viewport Fullscreen'}
        >
          {isFullscreen ? <IconMinimize size={14} /> : <IconMaximize size={14} />}
          <span className="corner-btn-text">{isFullscreen ? 'Exit Fullscreen' : 'Expand 3D'}</span>
        </button>
      )}

      {/* Floating Bottom-Center Mini Toolbar */}
      <MiniToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomOut={handleZoomOut}
        onZoomIn={handleZoomIn}
        onResetCamera={() => sceneRef.current?.resetCameraHome(true)}
        showLabels={showLabels}
        onToggleLabels={onToggleLabels}
        packId={pack.id}
        flowMode={flowMode}
        onSelectFlowMode={onSelectFlowMode}
        isolate={isolate}
        onToggleIsolate={onToggleIsolate}
        showInfo={showInfo}
        onToggleInfo={onToggleInfo}
        explode={explode}
        onExplodeChange={onExplodeChange}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />
    </div>
  );
};

