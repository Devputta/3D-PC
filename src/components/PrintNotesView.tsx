/**
 * Boardwalk — Printable Study Notes View
 *
 * Dedicated print layout displayed during window.print().
 * Formats every component and lesson in the active pack with technical specifications,
 * failure modes, engineering connections, and the user's personal revision notes.
 */

import React from 'react';
import { getLessonNote, getNote } from '../lib/storage.ts';
import { Pack } from '../packs/types.ts';

interface PrintNotesViewProps {
  pack: Pack;
}

export function PrintNotesView({ pack }: PrintNotesViewProps) {
  const printDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="print-study-notes" aria-label="Printable Study Notes">
      <header className="print-header">
        <div className="print-header-top">
          <h1 className="print-title">BOARDWALK STUDY GUIDE: {pack.name.toUpperCase()}</h1>
          <span className="print-date">Generated: {printDate}</span>
        </div>
        <p className="print-subtitle">
          Interactive 3D PC & Networking Architecture Workbench — Comprehensive Component Guides,
          Engineering Specifications, Failure Modes, and Personal Revision Notes.
        </p>
      </header>

      {/* SECTION 1: COMPONENTS */}
      <section className="print-main-section">
        <h2 className="print-group-heading">1. HARDWARE COMPONENTS & PERSONAL NOTES</h2>

        <div className="print-parts-list">
          {pack.parts.map((part) => {
            const userNote = getNote(pack.id, part.id, 'part');

            return (
              <article key={part.id} className="print-part-card">
                <div className="print-part-header">
                  <span className="print-part-num">PART #{part.number}</span>
                  <h3 className="print-part-name">{part.name}</h3>
                </div>

                <p className="print-part-summary">
                  <strong>Technical Summary:</strong> {part.summary}
                </p>

                <div className="print-part-body">
                  <p>{part.body[0]}</p>
                  <p>{part.body[1]}</p>
                </div>

                <div className="print-specs-section">
                  <h4 className="print-section-title">Key Specifications</h4>
                  <table className="print-specs-table">
                    <tbody>
                      {part.specs.map((spec) => (
                        <tr key={spec.label}>
                          <td className="print-spec-label">{spec.label}</td>
                          <td className="print-spec-val">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="print-fails-section">
                  <h4 className="print-section-title">Failure Modes & Diagnostics</h4>
                  <p className="print-fails-text">{part.fails}</p>
                </div>

                <div className="print-notes-section">
                  <h4 className="print-section-title">Personal Study Notes</h4>
                  <div className="print-notes-box">
                    {userNote ? userNote : <em className="no-notes-text">No personal notes recorded for this component.</em>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: LESSONS */}
      {pack.lessons && pack.lessons.length > 0 && (
        <section className="print-main-section print-lessons-section">
          <h2 className="print-group-heading">2. LESSON MODULES & PERSONAL NOTES</h2>

          <div className="print-parts-list">
            {pack.lessons.map((lesson) => {
              const lessonNote = getLessonNote(pack.id, lesson.id);

              return (
                <article key={lesson.id} className="print-part-card">
                  <div className="print-part-header">
                    <span className="print-part-num">LESSON #{lesson.number}</span>
                    <h3 className="print-part-name">{lesson.title}</h3>
                  </div>

                  <p className="print-part-summary">
                    <strong>Learning Goal:</strong> {lesson.goal}
                  </p>

                  <div className="print-part-body">
                    <p>{lesson.overview?.description}</p>
                  </div>

                  {lesson.overview?.facts && (
                    <div className="print-specs-section">
                      <h4 className="print-section-title">Core Principles</h4>
                      <ul className="print-facts-list">
                        {lesson.overview.facts.map((fact, idx) => (
                          <li key={idx}>{fact.text}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lesson.connections && lesson.connections.length > 0 && (
                    <div className="print-specs-section">
                      <h4 className="print-section-title">Hardware Interfaces & Signals</h4>
                      <table className="print-specs-table">
                        <tbody>
                          {lesson.connections.map((conn, idx) => (
                            <tr key={idx}>
                              <td className="print-spec-label">{conn.from} ➔ {conn.to}</td>
                              <td className="print-spec-val">{conn.label}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="print-notes-section">
                    <h4 className="print-section-title">Personal Lesson Notes</h4>
                    <div className="print-notes-box">
                      {lessonNote ? lessonNote : <em className="no-notes-text">No personal notes recorded for this lesson.</em>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <footer className="print-footer">
        <p>Boardwalk 3D PC & Networking Architecture Explorer • End of Study Guide</p>
      </footer>
    </div>
  );
}
