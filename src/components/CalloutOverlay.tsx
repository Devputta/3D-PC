/**
 * Boardwalk — 3D Callout Cards & Progressive Disclosure Overlay
 *
 * Implements strict progressive disclosure rules:
 * - Only 4 to 6 callout cards shown on the 3D model at a time, strictly relevant to the current lesson (max 5).
 * - All other parts show just a small teal dot (#14b8a6) with NO card.
 * - Hovering any dot reveals its card on demand.
 * - Callout cards have max 2 lines: bold uppercase title (2-3 words) and one short sentence under 8 words.
 * - Collision avoidance: cards placed around model edges, nudged apart vertically so they never overlap.
 * - 1px dotted SVG leader lines that never cross each other.
 * - Flow mode: shows numbered step badges (1, 2, 3, 4) on flow path stops.
 */

import React, { useMemo, useState } from 'react';
import { FlowMode, FlowStep, Lesson, Pack } from '../packs/types.ts';
import { CalloutProjection } from '../scene/BoardScene.ts';
import { IconCpu, IconNetwork } from './Icons.tsx';

interface CalloutOverlayProps {
  pack: Pack;
  lesson?: Lesson;
  projections: CalloutProjection[];
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  showLabels: boolean;
  containerWidth: number;
  containerHeight: number;
  flowMode?: FlowMode;
  currentFlowStep?: FlowStep | null;
}

interface ProcessedCard {
  partId: string;
  title: string;
  line: string;
  dotX: number;
  dotY: number;
  cardX: number;
  cardY: number;
  anchorX: number;
  anchorY: number;
  cardWidth: number;
  isHoverRevealed: boolean;
  isSelected: boolean;
}

// Fallback short 2-line info if lesson has no callout for a hovered dot
const FALLBACK_CALLOUTS: Record<string, { title: string; line: string }> = {
  motherboard: { title: 'MAIN BOARD', line: 'Anchors components and routes copper signals.' },
  cpu: { title: 'CPU SOCKET', line: 'LGA1700 land-grid processor mount.' },
  cooler: { title: 'CPU COOLER', line: 'Heat pipes and aluminium fin stack.' },
  ram: { title: 'RAM SLOTS', line: 'Dual-channel DDR5 DIMM sockets.' },
  gpu: { title: 'PCIE X16', line: 'Direct graphics expansion card slot.' },
  ssd: { title: 'M.2 NVME', line: 'PCIe 4.0 storage drive socket.' },
  power: { title: '24-PIN ATX', line: 'Main power supply DC harness.' },
  chipset: { title: 'CHIPSET', line: 'Controls SATA and peripheral buses.' },
  vrm: { title: 'VRM POWER', line: 'Steps down 12V for CPU core.' },
  battery: { title: 'CMOS CELL', line: 'CR2032 3V real-time clock battery.' },
  io: { title: 'REAR I/O', line: 'External USB, LAN, and audio ports.' },
  sata: { title: 'SATA PORTS', line: '6 Gbps serial drive connectors.' },
  laptop: { title: 'CLIENT LAPTOP', line: 'Initiates outbound TCP sockets.' },
  switch: { title: 'LAN SWITCH', line: 'Forwards frames using MAC addresses.' },
  router: { title: 'WI-FI ROUTER', line: 'NAT gateway and DHCP server.' },
  dns: { title: 'DNS RESOLVER', line: 'Translates domain names to IP addresses.' },
  firewall: { title: 'SPI FIREWALL', line: 'Inspects and drops unauthorized packets.' },
  webserver: { title: 'WEB SERVER', line: 'Serves HTTPS web traffic.' }
};

// Flow mode stop badges
const DATA_FLOW_BADGES: Record<string, number> = {
  ssd: 1,
  ram: 2,
  cpu: 3,
  gpu: 4,
  io: 5
};

const POWER_FLOW_BADGES: Record<string, number> = {
  power: 1,
  motherboard: 2,
  vrm: 2,
  gpu: 3,
  sata: 4,
  ssd: 4,
  cooler: 4
};

const CARD_WIDTH = 154;
const CARD_HEIGHT = 42;
const MIN_SEPARATION = 48; // Vertical spacing between cards

export const CalloutOverlay: React.FC<CalloutOverlayProps> = ({
  pack,
  lesson,
  projections,
  selectedPartId,
  onSelectPart,
  showLabels,
  containerWidth,
  containerHeight,
  flowMode = 'parts',
  currentFlowStep
}) => {
  const [hoveredDotPartId, setHoveredDotPartId] = useState<string | null>(null);

  // Progressive disclosure: active callouts for current lesson (max 5)
  const defaultLessonCallouts = useMemo(() => {
    if (!lesson || !lesson.callouts || lesson.callouts.length === 0) {
      // Default to 4 main parts if lesson callouts not defined
      const defaultIds = pack.id === 'hardware' ? ['cpu', 'ram', 'gpu', 'ssd'] : ['laptop', 'switch', 'router', 'webserver'];
      return defaultIds.map((id) => ({
        partId: id,
        title: FALLBACK_CALLOUTS[id]?.title || id.toUpperCase(),
        line: FALLBACK_CALLOUTS[id]?.line || 'Hardware component.'
      }));
    }
    // Strict maximum 5 callouts per lesson
    return lesson.callouts.slice(0, 5);
  }, [lesson, pack.id]);

  const defaultCalloutMap = useMemo(() => {
    return Object.fromEntries(defaultLessonCallouts.map((c) => [c.partId, c]));
  }, [defaultLessonCallouts]);

  // Compute collision-avoided callout cards positioned around model edges
  const positionedCards = useMemo(() => {
    if (!showLabels || flowMode !== 'parts') return [];

    const width = containerWidth || 800;
    const height = containerHeight || 600;
    const midX = width / 2;

    // Collect all cards to render (lesson callouts + any hovered non-callout dot)
    const rawCards: Array<{
      partId: string;
      title: string;
      line: string;
      dotX: number;
      dotY: number;
      isHoverRevealed: boolean;
      isSelected: boolean;
    }> = [];

    for (const p of projections) {
      if (!p.visible) continue;

      const isDefault = !!defaultCalloutMap[p.partId];
      const isHovered = hoveredDotPartId === p.partId;

      if (isDefault || isHovered) {
        const info = defaultCalloutMap[p.partId] || FALLBACK_CALLOUTS[p.partId] || {
          partId: p.partId,
          title: p.partId.toUpperCase(),
          line: 'System component.'
        };

        rawCards.push({
          partId: p.partId,
          title: info.title.toUpperCase(),
          line: info.line,
          dotX: p.x,
          dotY: p.y,
          isHoverRevealed: !isDefault && isHovered,
          isSelected: selectedPartId === p.partId
        });
      }
    }

    // Split cards into Left and Right columns based on dot position
    const leftList = rawCards.filter((c) => c.dotX < midX);
    const rightList = rawCards.filter((c) => c.dotX >= midX);

    // Collision avoidance: sort vertically by dotY, then nudge apart
    const processColumn = (list: typeof rawCards, isLeft: boolean): ProcessedCard[] => {
      list.sort((a, b) => a.dotY - b.dotY);

      const topLimit = 48;
      const bottomLimit = Math.max(height - 68, topLimit + 40);

      const results: ProcessedCard[] = [];
      let currentY = topLimit;

      for (const card of list) {
        // Initial card target Y centered with dot
        let targetY = card.dotY - CARD_HEIGHT / 2;
        targetY = Math.max(targetY, currentY);

        const isCompact = width < 600;
        const actualCardWidth = isCompact ? Math.min(CARD_WIDTH, Math.max(120, width * 0.34)) : CARD_WIDTH;

        // Edge X placement with safe container bounds
        let cardX: number;
        if (isLeft) {
          cardX = Math.max(10, Math.min(card.dotX - actualCardWidth - 20, width * 0.3 - actualCardWidth));
          if (cardX + actualCardWidth > midX - 10) {
            cardX = Math.max(10, midX - actualCardWidth - 14);
          }
        } else {
          cardX = Math.min(width - actualCardWidth - 10, Math.max(card.dotX + 20, width * 0.7));
          if (cardX < midX + 10) {
            cardX = Math.min(width - actualCardWidth - 10, midX + 14);
          }
        }

        const anchorX = isLeft ? cardX + actualCardWidth : cardX;
        const anchorY = targetY + CARD_HEIGHT / 2;

        results.push({
          ...card,
          cardX,
          cardY: targetY,
          anchorX,
          anchorY,
          cardWidth: actualCardWidth
        });

        currentY = targetY + MIN_SEPARATION;
      }

      // If bottom overflows, shift cards upwards
      if (results.length > 0) {
        let maxAllowed = bottomLimit;
        for (let i = results.length - 1; i >= 0; i--) {
          if (results[i].cardY > maxAllowed) {
            results[i].cardY = maxAllowed;
            results[i].anchorY = results[i].cardY + CARD_HEIGHT / 2;
          }
          maxAllowed = results[i].cardY - MIN_SEPARATION;
        }
      }

      return results;
    };

    const leftCards = processColumn(leftList, true);
    const rightCards = processColumn(rightList, false);

    return [...leftCards, ...rightCards];
  }, [
    showLabels,
    flowMode,
    containerWidth,
    containerHeight,
    projections,
    defaultCalloutMap,
    hoveredDotPartId,
    selectedPartId
  ]);

  return (
    <div className="callout-overlay-container" aria-hidden="true">
      {/* 1px Dotted SVG Leader Lines (never cross because sorted strictly by Y on left & right) */}
      {showLabels && flowMode === 'parts' && (
        <svg
          className="leader-lines-svg"
          width={containerWidth || '100%'}
          height={containerHeight || '100%'}
        >
          {positionedCards.map((item) => (
            <g key={`line-${item.partId}`}>
              <line
                x1={item.dotX}
                y1={item.dotY}
                x2={item.anchorX}
                y2={item.anchorY}
                stroke={item.isSelected ? '#1f3a5f' : '#14b8a6'}
                strokeWidth={item.isSelected ? '1.5' : '1'}
                strokeDasharray="3 3"
                opacity={item.isSelected ? 0.95 : 0.7}
              />
              {/* 1px square terminal node on card anchor */}
              <rect
                x={item.anchorX - 2}
                y={item.anchorY - 2}
                width="4"
                height="4"
                fill={item.isSelected ? '#1f3a5f' : '#14b8a6'}
              />
            </g>
          ))}
        </svg>
      )}

      {/* 3D Hotspot Dots on All Model Anchors */}
      {projections.map((p) => {
        if (!p.visible) return null;
        const isSelected = selectedPartId === p.partId;
        const hasCard = !!defaultCalloutMap[p.partId];
        const isHovered = hoveredDotPartId === p.partId;

        // In flow mode, show numbered badge on path stops
        if (flowMode !== 'parts') {
          const badgeMap = flowMode === 'data' ? DATA_FLOW_BADGES : POWER_FLOW_BADGES;
          const badgeNum = badgeMap[p.partId];
          const isFlowActive = currentFlowStep?.activeParts.includes(p.partId);

          if (!badgeNum) return null;

          return (
            <div
              key={`badge-${p.partId}`}
              className="flow-stop-badge"
              data-active={isFlowActive}
              style={{
                transform: `translate3d(${p.x}px, ${p.y}px, 0)`
              }}
              title={`Stop ${badgeNum}: ${p.partId.toUpperCase()}`}
            >
              <span>{badgeNum}</span>
            </div>
          );
        }

        return (
          <button
            key={`dot-${p.partId}`}
            type="button"
            className="blueprint-hotspot-dot"
            data-selected={isSelected}
            data-has-card={hasCard}
            data-hovered={isHovered}
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, 0)`
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(p.partId);
            }}
            onMouseEnter={() => setHoveredDotPartId(p.partId)}
            onMouseLeave={() => setHoveredDotPartId(null)}
            aria-label={`Select ${p.partId}`}
            title={`Select ${p.partId}`}
          >
            <span className="dot-inner" />
            <span className="dot-ping" />
          </button>
        );
      })}

      {/* Floating Blueprint Callout Cards (Strict 2 lines max, no paragraphs) */}
      {showLabels &&
        flowMode === 'parts' &&
        positionedCards.map((item) => (
          <div
            key={`card-${item.partId}`}
            className="floating-callout-card"
            data-selected={item.isSelected}
            data-hover-revealed={item.isHoverRevealed}
            style={{
              transform: `translate3d(${item.cardX}px, ${item.cardY}px, 0)`,
              width: `${item.cardWidth}px`
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(item.partId);
            }}
            onMouseEnter={() => setHoveredDotPartId(item.partId)}
            onMouseLeave={() => setHoveredDotPartId(null)}
          >
            <div className="card-header">
              <span className="card-icon">
                {pack.id === 'hardware' ? <IconCpu size={11} /> : <IconNetwork size={11} />}
              </span>
              <span className="card-title">{item.title}</span>
            </div>
            <div className="card-desc">{item.line}</div>
          </div>
        ))}
    </div>
  );
};
