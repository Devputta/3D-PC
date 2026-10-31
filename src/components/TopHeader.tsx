/**
 * Boardwalk — Top Header Bar
 *
 * Top-left: Logo mark + "LEARN PC & NETWORKS" + tagline "EXPLORE · UNDERSTAND · BUILD".
 * Top-right: Progress card with section name, progress bar, "X/16" counter, live date & time clock.
 */

import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { Pack } from '../packs/types.ts';
import { IconFileText, IconGitHub } from './Icons.tsx';

const REMOTE_LOGO_URL = 'https://raw.githubusercontent.com/Devputta/LOGO/main/logo-flat-transparent%20(1).png';
const LOCAL_LOGO_FALLBACK = '/logo.png';
const GITHUB_REPO_URL = 'https://github.com/Devputta/3D-PC.git';

interface TopHeaderProps {
  pack: Pack;
  completedLessonsCount: number;
  totalLessonsCount: number;
  onOpenSettings: () => void;
  onOpenNotes?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  pack,
  completedLessonsCount,
  totalLessonsCount,
  onOpenNotes
}) => {
  const { t } = useI18n();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [logoSrc, setLogoSrc] = useState(REMOTE_LOGO_URL);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const date = now.getDate().toString().padStart(2, '0');
      const month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentDateTime(`${day} ${date} ${month} ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(
    Math.round((completedLessonsCount / (totalLessonsCount || 16)) * 100),
    100
  );

  return (
    <header className="top-header" role="banner">
      {/* Top Left: Custom Logo + Brand + Tagline */}
      <div className="top-header-left">
        <a href="#home" className="brand-logo-link" title="LEARN PC & NETWORKS Workbench" aria-label="Home">
          <img
            src={logoSrc}
            alt="Boardwalk 3D PC & Networks Logo"
            className="brand-logo-img"
            onError={() => {
              if (logoSrc !== LOCAL_LOGO_FALLBACK) {
                setLogoSrc(LOCAL_LOGO_FALLBACK);
              }
            }}
          />
        </a>
        <div className="brand-titles">
          <h1 className="brand-main-title">{t.header.brandName}</h1>
          <p className="brand-tagline">{t.header.brandTagline}</p>
        </div>
      </div>

      {/* Top Right: Progress Card & Live Clock & Notes & GitHub */}
      <div className="top-header-right">
        <div className="progress-card" role="status" aria-label="Course Progress">
          <div className="progress-info-row">
            <span className="progress-section-label">
              {pack.shortTitle.toUpperCase()} · {t.header.sectionBasics}
            </span>
            <span className="progress-count-text">
              {completedLessonsCount}/{totalLessonsCount}
            </span>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={completedLessonsCount}
              aria-valuemin={0}
              aria-valuemax={totalLessonsCount}
            />
          </div>
        </div>

        {/* Study Notes Button */}
        {onOpenNotes && (
          <button
            type="button"
            className="top-header-notes-btn"
            onClick={onOpenNotes}
            title={t.sheet.personalNotes}
            aria-label={t.sheet.personalNotes}
          >
            <IconFileText size={13} />
            <span>Notes</span>
          </button>
        )}

        {/* GitHub Repository Link */}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="top-header-github-link"
          title="View source code on GitHub"
          aria-label="View source code on GitHub (opens in new tab)"
        >
          <IconGitHub size={15} />
          <span className="github-link-text">GitHub</span>
        </a>

        {/* Live Date and Time */}
        <div className="live-clock-pill" aria-label="System Time">
          <span className="live-clock-dot" />
          <span className="live-clock-text">{currentDateTime}</span>
        </div>
      </div>
    </header>
  );
};
