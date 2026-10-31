/**
 * Boardwalk — Far-Left Vertical Icon Rail
 *
 * Compact 56px vertical navigation rail:
 * Collapse arrow, Home, Learn, Pack switcher (Hardware ⇋ Networking), Quiz, Build, Settings, Language, and credit pill.
 */

import React from 'react';
import { useI18n } from '../i18n/index.tsx';
import { Pack } from '../packs/types.ts';
import {
  IconBook,
  IconChevronLeft,
  IconChevronRight,
  IconCpu,
  IconFileText,
  IconHome,
  IconNetwork,
  IconQuiz,
  IconSettings,
  IconWrench
} from './Icons.tsx';

interface NavRailProps {
  pack: Pack;
  mode: 'explore' | 'journey' | 'quiz' | 'build';
  onModeChange: (mode: 'explore' | 'journey' | 'quiz' | 'build') => void;
  onHomeClick: () => void;
  onSwitchPack: () => void;
  onOpenSettings: () => void;
  onOpenNotes?: () => void;
  isNotesOpen?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const NavRail: React.FC<NavRailProps> = ({
  pack,
  mode,
  onModeChange,
  onHomeClick,
  onSwitchPack,
  onOpenSettings,
  onOpenNotes,
  isNotesOpen = false,
  isCollapsed,
  onToggleCollapse
}) => {
  const { language, setLanguage, t } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <aside className={`nav-rail ${isCollapsed ? 'nav-rail-collapsed' : ''}`} aria-label="Main Navigation Rail">
      {/* Collapse / Expand Toggle Button */}
      <button
        type="button"
        className="rail-icon-btn rail-collapse-btn"
        onClick={onToggleCollapse}
        title={isCollapsed ? t.rail.expand : t.rail.collapse}
        aria-label={isCollapsed ? t.rail.expand : t.rail.collapse}
      >
        {isCollapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
      </button>

      {!isCollapsed && (
        <>
          <div className="rail-nav-group">
            {/* Home / Reset view */}
            <button
              type="button"
              className={`rail-icon-btn ${mode === 'explore' ? 'rail-icon-btn-active' : ''}`}
              onClick={onHomeClick}
              title={t.rail.home}
              aria-label={t.rail.home}
            >
              <IconHome size={17} />
              <span className="rail-tooltip">{t.rail.home}</span>
            </button>

            {/* Learn / Journey */}
            <button
              type="button"
              className={`rail-icon-btn ${mode === 'journey' ? 'rail-icon-btn-active' : ''}`}
              onClick={() => onModeChange('journey')}
              title={t.rail.learn}
              aria-label={t.rail.learn}
            >
              <IconBook size={17} />
              <span className="rail-tooltip">{t.rail.learn}</span>
            </button>

            {/* Pack Switcher (Hardware ⇋ Networking) */}
            <button
              type="button"
              className="rail-icon-btn rail-pack-switch-btn"
              onClick={onSwitchPack}
              title={pack.id === 'hardware' ? t.rail.packSwitchHardware : t.rail.packSwitchNetworking}
              aria-label={pack.id === 'hardware' ? t.rail.packSwitchHardware : t.rail.packSwitchNetworking}
            >
              {pack.id === 'hardware' ? <IconCpu size={17} /> : <IconNetwork size={17} />}
              <span className="rail-pack-indicator">{pack.id === 'hardware' ? 'PC' : 'NET'}</span>
              <span className="rail-tooltip">
                {pack.id === 'hardware' ? t.rail.packSwitchHardware : t.rail.packSwitchNetworking}
              </span>
            </button>

            {/* Quiz Mode */}
            <button
              type="button"
              className={`rail-icon-btn ${mode === 'quiz' ? 'rail-icon-btn-active' : ''}`}
              onClick={() => onModeChange('quiz')}
              title={t.rail.quiz}
              aria-label={t.rail.quiz}
            >
              <IconQuiz size={17} />
              <span className="rail-tooltip">{t.rail.quiz}</span>
            </button>

            {/* Build Mode */}
            <button
              type="button"
              className={`rail-icon-btn ${mode === 'build' ? 'rail-icon-btn-active' : ''}`}
              onClick={() => onModeChange('build')}
              title={t.rail.build}
              aria-label={t.rail.build}
            >
              <IconWrench size={17} />
              <span className="rail-tooltip">{t.rail.build}</span>
            </button>

            {/* Study Notes */}
            {onOpenNotes && (
              <button
                type="button"
                className={`rail-icon-btn ${isNotesOpen ? 'rail-icon-btn-active' : ''}`}
                onClick={onOpenNotes}
                title={t.sheet.personalNotes}
                aria-label={t.sheet.personalNotes}
              >
                <IconFileText size={17} />
                <span className="rail-tooltip">{t.sheet.personalNotes}</span>
              </button>
            )}
          </div>

          <div className="rail-bottom-group">
            {/* Settings & Tools */}
            <button
              type="button"
              className="rail-icon-btn"
              onClick={onOpenSettings}
              title={t.rail.settings}
              aria-label={t.rail.settings}
            >
              <IconSettings size={17} />
              <span className="rail-tooltip">{t.rail.settings}</span>
            </button>

            {/* Language Switcher Button ("EN" / "हि") */}
            <button
              type="button"
              className="rail-lang-btn"
              onClick={toggleLanguage}
              title={t.rail.language}
              aria-label={t.rail.language}
            >
              <span className="rail-lang-text">{language === 'en' ? 'हि' : 'EN'}</span>
              <span className="rail-tooltip">{t.rail.language}</span>
            </button>

            {/* Credit Pill */}
            <div className="rail-credit-pill" title="Boardwalk Architecture Explorer">
              v2
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
