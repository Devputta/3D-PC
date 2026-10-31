/**
 * Boardwalk — Tools & Settings Modal
 *
 * Provides direct access to:
 * - Hardware Architecture Comparison
 * - Custom Quiz Generator & Link Sharing
 * - Printable Study Notes
 * Features Esc key listener, backdrop click-outside close, and crisp blueprint styling.
 */

import React, { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { IconBook, IconQuiz, IconWrench, IconX } from './Icons.tsx';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompare: () => void;
  onOpenCustomQuiz: () => void;
  onPrintNotes: () => void;
  onOpenNotes: () => void;
  isHardwarePack: boolean;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose,
  onOpenCompare,
  onOpenCustomQuiz,
  onPrintNotes,
  onOpenNotes,
  isHardwarePack
}) => {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tools-modal-title"
    >
      <div className="blueprint-modal-card tools-modal-card" ref={cardRef}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="tools-modal-title" className="modal-title">
              {t.tools.modalTitle}
            </h2>
            <p className="modal-subtitle">{t.tools.modalSubtitle}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title={t.tools.closeBtn}
            aria-label={t.tools.closeBtn}
          >
            <IconX size={15} />
          </button>
        </div>

        <div className="tools-grid">
          {/* Compare Card (Hardware only) */}
          {isHardwarePack && (
            <button
              type="button"
              className="tool-option-card"
              onClick={() => {
                onClose();
                onOpenCompare();
              }}
            >
              <div className="tool-icon-wrap">
                <IconWrench size={18} />
              </div>
              <div className="tool-info">
                <h3 className="tool-card-title">{t.tools.compareTitle}</h3>
                <p className="tool-card-desc">{t.tools.compareDesc}</p>
              </div>
            </button>
          )}

          {/* Custom Quiz Generator */}
          <button
            type="button"
            className="tool-option-card"
            onClick={() => {
              onClose();
              onOpenCustomQuiz();
            }}
          >
            <div className="tool-icon-wrap">
              <IconQuiz size={18} />
            </div>
            <div className="tool-info">
              <h3 className="tool-card-title">{t.tools.quizTitle}</h3>
              <p className="tool-card-desc">{t.tools.quizDesc}</p>
            </div>
          </button>

          {/* Personal Study Notes (Editor & Export) */}
          <button
            type="button"
            className="tool-option-card"
            onClick={() => {
              onClose();
              onOpenNotes();
            }}
          >
            <div className="tool-icon-wrap">
              <IconBook size={18} />
            </div>
            <div className="tool-info">
              <h3 className="tool-card-title">{t.sheet.personalNotes}</h3>
              <p className="tool-card-desc">Write, edit, export, and review your notes for all components.</p>
            </div>
          </button>

          {/* Printable Notes */}
          <button
            type="button"
            className="tool-option-card"
            onClick={() => {
              onClose();
              onPrintNotes();
            }}
          >
            <div className="tool-icon-wrap">
              <IconBook size={18} />
            </div>
            <div className="tool-info">
              <h3 className="tool-card-title">{t.tools.printTitle}</h3>
              <p className="tool-card-desc">{t.tools.printDesc}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
