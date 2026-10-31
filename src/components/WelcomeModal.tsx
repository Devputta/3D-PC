/**
 * Boardwalk — Welcome Modal
 *
 * Compact ~320px wide blueprint card in bottom-right corner or center.
 * Features visible X close, Esc key listener, click-outside listener,
 * and "Don't show again" checkbox persisted to localStorage (`boardwalk_hide_welcome`).
 */

import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { IconCircuitLogo, IconX } from './Icons.tsx';

const WELCOME_STORAGE_KEY = 'boardwalk_hide_welcome';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function isWelcomeSuppressed(): boolean {
  try {
    return localStorage.getItem(WELCOME_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Esc key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowAgain]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    // Defer attaching listener slightly so initial click doesn't trigger it
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dontShowAgain]);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
      } catch {
        // Fallback
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="welcome-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-modal-card" ref={cardRef}>
        {/* Header bar */}
        <div className="welcome-header">
          <div className="welcome-brand">
            <IconCircuitLogo size={18} />
            <span id="welcome-title" className="welcome-brand-text">
              {t.welcome.title}
            </span>
          </div>
          <button
            type="button"
            className="welcome-close-btn"
            onClick={handleClose}
            title={t.welcome.closeBtn}
            aria-label={t.welcome.closeBtn}
          >
            <IconX size={14} />
          </button>
        </div>

        {/* Content body */}
        <div className="welcome-content">
          <h3 className="welcome-heading">{t.welcome.welcomeMsg}</h3>
          <p className="welcome-description">{t.welcome.description}</p>
        </div>

        {/* Footer actions */}
        <div className="welcome-footer">
          <label className="welcome-checkbox-label">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="blueprint-checkbox"
            />
            <span>{t.welcome.dontShowAgain}</span>
          </label>

          <button
            type="button"
            className="blueprint-btn blueprint-btn-primary welcome-action-btn"
            onClick={handleClose}
          >
            {t.welcome.startBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
