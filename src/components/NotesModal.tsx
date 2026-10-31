/**
 * Boardwalk — Personal Study Notes Modal
 *
 * Dedicated modal allowing learners to:
 * - Read and write notes for any component OR lesson in the current pack.
 * - Autosave and explicitly save notes isolated by pack and item.
 * - Export all study notes (components + lessons) as a cleanly formatted text file.
 * - Print formatted study notes with window.print().
 * - Accessible with Esc key, click-outside backdrop, and keyboard navigation.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { downloadFile, exportNotesAsText, getLessonNote, getNote, setLessonNote, setNote } from '../lib/storage.ts';
import { Pack } from '../packs/types.ts';
import {
  IconCheck,
  IconCpu,
  IconFileText,
  IconNetwork,
  IconWrench,
  IconX
} from './Icons.tsx';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: Pack;
  initialPartId?: string | null;
  onSelectPartIn3D?: (partId: string) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  pack,
  initialPartId,
  onSelectPartIn3D
}) => {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);

  const [activeTabType, setActiveTabType] = useState<'parts' | 'lessons'>('parts');
  const [activePartId, setActivePartId] = useState<string>(
    () => initialPartId || pack.parts[0]?.id || ''
  );
  const [activeLessonId, setActiveLessonId] = useState<string>(
    () => pack.lessons[0]?.id || ''
  );

  const [currentNote, setCurrentNote] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [exported, setExported] = useState(false);

  // Sync active part or lesson when modal opens or pack changes
  useEffect(() => {
    if (isOpen) {
      const target = initialPartId || pack.parts[0]?.id || '';
      setActivePartId(target);
      setActiveLessonId(pack.lessons[0]?.id || '');
      if (activeTabType === 'parts') {
        setCurrentNote(getNote(pack.id, target, 'part'));
      } else {
        setCurrentNote(getLessonNote(pack.id, pack.lessons[0]?.id || ''));
      }
      setSaveStatus('');
    }
  }, [isOpen, initialPartId, pack]);

  // When switching between Parts and Lessons tab
  const handleTabTypeChange = (nextType: 'parts' | 'lessons') => {
    // Flush current note first
    if (activeTabType === 'parts' && activePartId) {
      setNote(pack.id, activePartId, currentNote, 'part');
    } else if (activeTabType === 'lessons' && activeLessonId) {
      setLessonNote(pack.id, activeLessonId, currentNote);
    }

    setActiveTabType(nextType);
    setSaveStatus('');
    if (nextType === 'parts') {
      setCurrentNote(getNote(pack.id, activePartId, 'part'));
    } else {
      setCurrentNote(getLessonNote(pack.id, activeLessonId));
    }
  };

  // Switching component
  const handleSelectPart = (partId: string) => {
    if (activePartId) {
      setNote(pack.id, activePartId, currentNote, 'part');
    }
    setActivePartId(partId);
    setCurrentNote(getNote(pack.id, partId, 'part'));
    setSaveStatus('');
  };

  // Switching lesson
  const handleSelectLesson = (lessonId: string) => {
    if (activeLessonId) {
      setLessonNote(pack.id, activeLessonId, currentNote);
    }
    setActiveLessonId(lessonId);
    setCurrentNote(getLessonNote(pack.id, lessonId));
    setSaveStatus('');
  };

  // Note change with autosave
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCurrentNote(val);
    if (activeTabType === 'parts') {
      setNote(pack.id, activePartId, val, 'part');
    } else {
      setLessonNote(pack.id, activeLessonId, val);
    }
    setSaveStatus(t.sheet.notesSaved);
  };

  // Manual save confirmation
  const handleSave = () => {
    if (activeTabType === 'parts') {
      setNote(pack.id, activePartId, currentNote, 'part');
    } else {
      setLessonNote(pack.id, activeLessonId, currentNote);
    }
    setSaveStatus('Saved in browser storage');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  // Export all notes as a .txt file
  const handleExportText = () => {
    if (activeTabType === 'parts') {
      setNote(pack.id, activePartId, currentNote, 'part');
    } else {
      setLessonNote(pack.id, activeLessonId, currentNote);
    }
    const content = exportNotesAsText(pack.name, pack.parts, pack.lessons, pack.id);
    const filename = `boardwalk-${pack.id}-notes.txt`;
    downloadFile(filename, content);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  // Print notes
  const handlePrint = () => {
    if (activeTabType === 'parts') {
      setNote(pack.id, activePartId, currentNote, 'part');
    } else {
      setLessonNote(pack.id, activeLessonId, currentNote);
    }
    window.print();
  };

  // Esc key listener
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

  // Click outside backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentPart = pack.parts.find((p) => p.id === activePartId) || pack.parts[0];
  const currentLesson = pack.lessons.find((l) => l.id === activeLessonId) || pack.lessons[0];

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-modal-title"
    >
      <div className="blueprint-modal-card notes-modal-card" ref={cardRef}>
        {/* Header Bar */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="notes-modal-title" className="modal-title">
              {t.sheet.personalNotes.toUpperCase()} — {pack.name.toUpperCase()}
            </h2>
            <p className="modal-subtitle">{t.sheet.notesSavedBrowser}</p>
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

        {/* View Mode Switcher: Components vs Lessons */}
        <div className="notes-type-tabs" role="tablist" aria-label="Notes Category">
          <button
            type="button"
            role="tab"
            aria-selected={activeTabType === 'parts'}
            className={`notes-type-btn ${activeTabType === 'parts' ? 'notes-type-btn-active' : ''}`}
            onClick={() => handleTabTypeChange('parts')}
          >
            {pack.id === 'hardware' ? <IconCpu size={13} /> : <IconNetwork size={13} />}
            <span>Components ({pack.parts.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTabType === 'lessons'}
            className={`notes-type-btn ${activeTabType === 'lessons' ? 'notes-type-btn-active' : ''}`}
            onClick={() => handleTabTypeChange('lessons')}
          >
            <IconFileText size={13} />
            <span>Lessons ({pack.lessons.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="notes-modal-body">
          {/* Ribbon Selector */}
          <div className="notes-part-selector" role="tablist" aria-label={activeTabType === 'parts' ? 'Component selector' : 'Lesson selector'}>
            {activeTabType === 'parts'
              ? pack.parts.map((p) => {
                  const hasNote = !!getNote(pack.id, p.id, 'part');
                  const isSelected = p.id === activePartId;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`notes-part-tab ${isSelected ? 'notes-part-tab-active' : ''}`}
                      onClick={() => handleSelectPart(p.id)}
                    >
                      <span className="notes-part-name">{p.name}</span>
                      {hasNote && <span className="notes-has-badge" title="Note saved">●</span>}
                    </button>
                  );
                })
              : pack.lessons.map((l) => {
                  const hasNote = !!getLessonNote(pack.id, l.id);
                  const isSelected = l.id === activeLessonId;

                  return (
                    <button
                      key={l.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`notes-part-tab ${isSelected ? 'notes-part-tab-active' : ''}`}
                      onClick={() => handleSelectLesson(l.id)}
                    >
                      <span className="notes-part-name">#{l.number} {l.title}</span>
                      {hasNote && <span className="notes-has-badge" title="Note saved">●</span>}
                    </button>
                  );
                })}
          </div>

          {/* Active Note Editor */}
          <div className="notes-editor-pane">
            <div className="notes-pane-header">
              <div className="notes-pane-info">
                <h3 className="notes-part-headline">
                  {activeTabType === 'parts' ? currentPart?.name : `Lesson ${currentLesson?.number}: ${currentLesson?.title}`}
                </h3>
                <p className="notes-part-summary">
                  {activeTabType === 'parts' ? currentPart?.summary : currentLesson?.goal}
                </p>
              </div>

              {activeTabType === 'parts' && currentPart && onSelectPartIn3D && (
                <button
                  type="button"
                  className="notes-view-3d-btn"
                  onClick={() => {
                    onSelectPartIn3D(currentPart.id);
                    onClose();
                  }}
                  title="Inspect component in 3D scene"
                >
                  <IconWrench size={12} />
                  <span>View in 3D</span>
                </button>
              )}
            </div>

            {/* Textarea */}
            <div className="notes-textarea-wrap">
              <textarea
                className="notes-textarea"
                value={currentNote}
                onChange={handleNoteChange}
                placeholder={t.sheet.notesPlaceholder}
                aria-label={
                  activeTabType === 'parts'
                    ? `Study notes for ${currentPart?.name}`
                    : `Study notes for Lesson ${currentLesson?.number}`
                }
                rows={8}
              />
            </div>

            {/* Status and Action Buttons */}
            <div className="notes-pane-footer">
              <div className="notes-status-text">
                {saveStatus && (
                  <span className="save-status-badge">
                    <IconCheck size={12} />
                    <span>{saveStatus}</span>
                  </span>
                )}
              </div>

              <div className="notes-actions-group">
                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={handleExportText}
                  title="Download all notes as a formatted text file"
                >
                  <IconFileText size={13} />
                  <span>{exported ? 'Exported!' : 'Export (.txt)'}</span>
                </button>

                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-secondary"
                  onClick={handlePrint}
                  title={t.sheet.printNotesBtn}
                >
                  <span>{t.sheet.printNotesBtn}</span>
                </button>

                <button
                  type="button"
                  className="blueprint-btn blueprint-btn-primary"
                  onClick={handleSave}
                >
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
