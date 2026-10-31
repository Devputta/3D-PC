/**
 * Boardwalk — Bottom Lessons Horizontal Strip
 *
 * Horizontally scrolling row of 8 numbered lesson cards with thumbnails,
 * uppercase titles, active navy border, completed checks, circular scroll buttons,
 * and previous/next lesson step navigation.
 */

import React, { useRef } from 'react';
import { useI18n } from '../i18n/index.tsx';
import { getLocalizedLesson } from '../packs/index.ts';
import { Lesson, Pack } from '../packs/types.ts';
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCpu,
  IconNetwork
} from './Icons.tsx';

interface LessonsStripProps {
  pack: Pack;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  completedLessonIds: Set<string>;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
}

export const LessonsStrip: React.FC<LessonsStripProps> = ({
  pack,
  activeLessonId,
  onSelectLesson,
  completedLessonIds,
  onPrevLesson,
  onNextLesson
}) => {
  const { t, isHindi } = useI18n();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentIndex = pack.lessons.findIndex((l) => l.id === activeLessonId);
  const canPrevLesson = currentIndex > 0;
  const canNextLesson = currentIndex >= 0 && currentIndex < pack.lessons.length - 1;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="lessons-strip-container" aria-label="Course Lessons">
      <div className="lessons-strip-header">
        <span className="lessons-label">{t.lessons.stripTitle}</span>

        {/* Previous / Next Lesson Navigation Controls */}
        <div className="lesson-nav-controls" role="group" aria-label="Lesson step navigation">
          {onPrevLesson && (
            <button
              type="button"
              className="lesson-nav-btn"
              onClick={onPrevLesson}
              disabled={!canPrevLesson}
              title="Previous lesson"
              aria-label="Previous lesson"
            >
              <IconChevronLeft size={11} />
              <span>Prev</span>
            </button>
          )}

          <span className="lesson-counter-pill">
            {currentIndex >= 0 ? `Lesson ${currentIndex + 1} of ${pack.lessons.length}` : ''}
          </span>

          {onNextLesson && (
            <button
              type="button"
              className="lesson-nav-btn"
              onClick={onNextLesson}
              disabled={!canNextLesson}
              title="Next lesson"
              aria-label="Next lesson"
            >
              <span>Next</span>
              <IconChevronRight size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Circular Arrow Scroll Button Left */}
      <button
        type="button"
        className="lessons-scroll-btn scroll-left"
        onClick={scrollLeft}
        title={t.lessons.scrollLeft}
        aria-label={t.lessons.scrollLeft}
      >
        <IconChevronLeft size={14} />
      </button>

      {/* Horizontal Scrollable Row */}
      <div className="lessons-scroll-track" ref={scrollContainerRef}>
        {pack.lessons.map((lesson) => {
          const displayLesson = getLocalizedLesson(lesson, isHindi);
          const isActive = lesson.id === activeLessonId;
          const isCompleted = completedLessonIds.has(lesson.id);

          return (
            <button
              key={lesson.id}
              type="button"
              className={`lesson-card ${isActive ? 'lesson-card-active' : ''}`}
              onClick={() => onSelectLesson(displayLesson)}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Mini Thumbnail */}
              <div className="lesson-thumb">
                {pack.id === 'hardware' ? <IconCpu size={14} /> : <IconNetwork size={14} />}
              </div>

              {/* Lesson Number & Title */}
              <div className="lesson-info">
                <span className="lesson-number">{t.lessons.lessonNumber(displayLesson.number)}</span>
                <span className="lesson-title">{displayLesson.title.toUpperCase()}</span>
              </div>

              {/* Status / Chevron */}
              <div className="lesson-action">
                {isCompleted ? (
                  <span className="lesson-completed-check" title="Completed">
                    <IconCheck size={12} />
                  </span>
                ) : (
                  <span className="lesson-chevron">
                    <IconChevronRight size={12} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Circular Arrow Scroll Button Right */}
      <button
        type="button"
        className="lessons-scroll-btn scroll-right"
        onClick={scrollRight}
        title={t.lessons.scrollRight}
        aria-label={t.lessons.scrollRight}
      >
        <IconChevronRight size={14} />
      </button>
    </section>
  );
};
