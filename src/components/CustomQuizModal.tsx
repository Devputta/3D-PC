/**
 * Boardwalk — Custom Quiz & Shareable Link Modal
 *
 * Allows users to pick up to 8 parts from the active pack to build a custom quiz.
 * Encodes the chosen parts into the URL query string (?pack=...&quiz=id1,id2) with NO backend.
 * Provides a one-click clipboard copy of the shareable link and immediate quiz start.
 */

import React, { useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { Pack } from '../packs/types.ts';
import { IconCheck, IconCopy, IconPlay, IconX } from './Icons.tsx';

interface CustomQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: Pack;
  onStartCustomQuiz: (selectedPartIds: string[]) => void;
}

export function CustomQuizModal({
  isOpen,
  onClose,
  pack,
  onStartCustomQuiz
}: CustomQuizModalProps) {
  const { t, isHindi } = useI18n();

  // Initially pre-select up to 4 parts
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    pack.parts.slice(0, Math.min(4, pack.parts.length)).map((p) => p.id)
  );
  const [copied, setCopied] = useState(false);

  // Esc key to close
  React.useEffect(() => {
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

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 8) {
        setSelectedIds([...selectedIds, id]);
      }
    }
    setCopied(false);
  };

  const getShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('pack', pack.id);
    params.set('quiz', selectedIds.join(','));
    return `${base}?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    if (selectedIds.length === 0) return;
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      window.prompt('Copy this link:', url);
    }
  };

  const handleStart = () => {
    if (selectedIds.length === 0) return;
    onStartCustomQuiz(selectedIds);
    // Also push state to URL so user can bookmark or copy from browser bar
    const url = getShareUrl();
    window.history.replaceState(null, '', url);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.customQuiz.modalTitle}
    >
      <div className="blueprint-modal-card" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">{t.customQuiz.modalTitle}</h2>
            <p className="modal-subtitle">{t.customQuiz.modalSubtitle}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t.customQuiz.closeBtn}
            title={t.customQuiz.closeBtn}
          >
            <IconX size={15} />
          </button>
        </div>

        <div className="compare-modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--ink)' }}>
              {t.customQuiz.selectHint}
            </span>
            <span
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: selectedIds.length === 8 ? 'var(--probe-ink)' : 'var(--ink-2)',
                backgroundColor: selectedIds.length === 8 ? 'var(--probe)' : 'var(--mat)',
                padding: '2px 8px',
                borderRadius: '3px'
              }}
            >
              {t.customQuiz.selectedCount(selectedIds.length, 8)}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '8px',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '4px',
              backgroundColor: 'var(--mat)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          >
            {pack.parts.map((part) => {
              const isChecked = selectedIds.includes(part.id);
              const isDisabled = !isChecked && selectedIds.length >= 8;

              return (
                <label
                  key={part.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    backgroundColor: isChecked ? 'var(--mat-2)' : 'transparent',
                    border: '1px solid',
                    borderColor: isChecked ? 'var(--probe)' : 'transparent',
                    borderRadius: '3px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.45 : 1,
                    fontSize: '14px',
                    color: 'var(--ink)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleToggle(part.id)}
                    style={{ accentColor: 'var(--probe)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: isChecked ? 600 : 400 }}>{part.name}</span>
                </label>
              );
            })}
          </div>

          {selectedIds.length === 0 && (
            <p style={{ color: 'var(--bad)', fontSize: '13.5px', marginBottom: '12px' }}>
              {t.customQuiz.noPartsSelected}
            </p>
          )}

          {/* Shareable Link Display */}
          <div
            style={{
              backgroundColor: 'var(--mat)',
              border: '1px solid var(--line)',
              padding: '10px 12px',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          >
            <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--ink-2)', marginBottom: '4px', fontWeight: 600 }}>
              URL query preview (No backend required)
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '12.5px',
                color: 'var(--ink)',
                wordBreak: 'break-all',
                userSelect: 'all'
              }}
            >
              {getShareUrl()}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              className="blueprint-btn blueprint-btn-secondary"
              onClick={handleCopyLink}
              disabled={selectedIds.length === 0}
              style={{ minWidth: '150px' }}
            >
              {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
              <span>{copied ? t.customQuiz.copiedNotice : t.customQuiz.copyLinkBtn}</span>
            </button>
            <button
              type="button"
              className="blueprint-btn blueprint-btn-primary"
              onClick={handleStart}
              disabled={selectedIds.length === 0}
              style={{ minWidth: '160px' }}
            >
              <IconPlay size={13} />
              <span>{t.customQuiz.startCustomQuizBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
