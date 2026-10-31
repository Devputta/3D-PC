/**
 * Safe localStorage & in-memory fallback wrapper.
 * Every localStorage call is protected in a try/catch block so the app
 * functions seamlessly even if storage is disabled, quota is exceeded,
 * or running in private browsing modes.
 *
 * Supports notes isolation by pack ('hardware' | 'networking') and
 * item type ('part' | 'lesson'), with backwards-compatible legacy restoration.
 */

const LEGACY_NOTES_PREFIX = 'boardwalk_note_';
const BEST_SCORE_KEY = 'boardwalk_quiz_best';
const THEME_KEY = 'boardwalk_theme';

// In-memory fallback if localStorage is disabled or throws
const memoryCache: Record<string, string> = {};

function makeNoteKey(packId: string, targetId: string, type: 'part' | 'lesson' = 'part'): string {
  return `boardwalk_note_${packId}_${type}_${targetId}`;
}

export function getNote(
  packId: string,
  targetId: string,
  type: 'part' | 'lesson' = 'part'
): string {
  if (!packId || !targetId) return '';
  const scopedKey = makeNoteKey(packId, targetId, type);

  try {
    const val = localStorage.getItem(scopedKey);
    if (val !== null) return val;

    // Check memory cache
    if (memoryCache[scopedKey] !== undefined) {
      return memoryCache[scopedKey];
    }

    // Check legacy key for backwards compatibility on default hardware pack
    if (type === 'part' && packId === 'hardware') {
      const legacyVal = localStorage.getItem(LEGACY_NOTES_PREFIX + targetId);
      if (legacyVal !== null) {
        // Migrate to scoped key safely
        try {
          localStorage.setItem(scopedKey, legacyVal);
        } catch {
          // Graceful fallback
        }
        return legacyVal;
      }
    }
  } catch {
    return memoryCache[scopedKey] || '';
  }

  return '';
}

export function clearNotesMemoryCache(): void {
  for (const k of Object.keys(memoryCache)) {
    delete memoryCache[k];
  }
}

export function setNote(
  packId: string,
  targetId: string,
  note: string,
  type: 'part' | 'lesson' = 'part'
): void {
  if (!packId || !targetId) return;
  const scopedKey = makeNoteKey(packId, targetId, type);

  // Always update in-memory cache
  if (note) {
    memoryCache[scopedKey] = note;
  } else {
    delete memoryCache[scopedKey];
  }

  try {
    if (!note) {
      localStorage.removeItem(scopedKey);
      // Also clear legacy key if part
      if (type === 'part') {
        localStorage.removeItem(LEGACY_NOTES_PREFIX + targetId);
      }
    } else {
      localStorage.setItem(scopedKey, note);
      // Keep legacy key updated if part to ensure maximum compatibility
      if (type === 'part') {
        try {
          localStorage.setItem(LEGACY_NOTES_PREFIX + targetId, note);
        } catch {
          // Ignore
        }
      }
    }
  } catch {
    // Quota exceeded or storage disabled; in-memory cache retains note for session
  }
}

// Backwards-compatible component note helpers
export function getPartNote(partId: string, packId = 'hardware'): string {
  return getNote(packId, partId, 'part');
}

export function setPartNote(partId: string, note: string, packId = 'hardware'): void {
  setNote(packId, partId, note, 'part');
}

// Dedicated lesson note helpers
export function getLessonNote(packId: string, lessonId: string): string {
  return getNote(packId, lessonId, 'lesson');
}

export function setLessonNote(packId: string, lessonId: string, note: string): void {
  setNote(packId, lessonId, note, 'lesson');
}

export interface BestScore {
  score: number;
  total: number;
}

export function getBestScore(): BestScore | null {
  try {
    const raw = localStorage.getItem(BEST_SCORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.score === 'number' && typeof parsed?.total === 'number') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setBestScore(score: number, total: number): void {
  try {
    const current = getBestScore();
    // Only update if better percentage or first score
    if (!current || score / total > current.score / current.total) {
      localStorage.setItem(BEST_SCORE_KEY, JSON.stringify({ score, total }));
    }
  } catch {
    // Graceful no-op
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Graceful no-op
  }
}

export function getAllNotes(packId?: string): Record<string, string> {
  const notes: Record<string, string> = {};

  // First copy from in-memory cache
  for (const [key, val] of Object.entries(memoryCache)) {
    if (val) {
      if (packId) {
        if (key.startsWith(`boardwalk_note_${packId}_`)) {
          const suffix = key.replace(`boardwalk_note_${packId}_`, '');
          notes[suffix] = val;
        }
      } else {
        notes[key] = val;
      }
    }
  }

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (packId) {
        const prefix = `boardwalk_note_${packId}_`;
        if (key.startsWith(prefix)) {
          const suffix = key.slice(prefix.length);
          const val = localStorage.getItem(key);
          if (val) notes[suffix] = val;
        } else if (packId === 'hardware' && key.startsWith(LEGACY_NOTES_PREFIX) && !key.startsWith('boardwalk_note_hardware_') && !key.startsWith('boardwalk_note_networking_')) {
          const partId = key.slice(LEGACY_NOTES_PREFIX.length);
          const val = localStorage.getItem(key);
          if (val && !notes[`part_${partId}`]) {
            notes[`part_${partId}`] = val;
            notes[partId] = val;
          }
        }
      } else if (key.startsWith('boardwalk_note_')) {
        const val = localStorage.getItem(key);
        if (val) notes[key] = val;
      }
    }
  } catch {
    // Return collected notes
  }

  return notes;
}

export function exportNotesAsText(
  packName: string,
  parts: Array<{ id: string; name: string; summary?: string }>,
  lessons?: Array<{ id: string; number: number; title: string; goal?: string }>,
  packId = 'hardware'
): string {
  const dateStr = new Date().toLocaleString();
  let text = `========================================================\n`;
  text += `BOARDWALK STUDY NOTES — ${packName.toUpperCase()}\n`;
  text += `Exported: ${dateStr}\n`;
  text += `========================================================\n\n`;

  let partNotesCount = 0;
  text += `--------------------------------------------------------\n`;
  text += `SECTION 1: COMPONENT NOTES\n`;
  text += `--------------------------------------------------------\n\n`;

  for (const part of parts) {
    const note = getNote(packId, part.id, 'part');
    text += `[COMPONENT] ${part.name} (ID: ${part.id})\n`;
    if (part.summary) {
      text += `Summary: ${part.summary}\n`;
    }
    if (note && note.trim()) {
      text += `Notes:\n${note.trim()}\n`;
      partNotesCount++;
    } else {
      text += `Notes: (No notes recorded)\n`;
    }
    text += `\n`;
  }

  let lessonNotesCount = 0;
  if (lessons && lessons.length > 0) {
    text += `--------------------------------------------------------\n`;
    text += `SECTION 2: LESSON NOTES\n`;
    text += `--------------------------------------------------------\n\n`;

    for (const lesson of lessons) {
      const note = getLessonNote(packId, lesson.id);
      text += `[LESSON ${lesson.number}] ${lesson.title}\n`;
      if (lesson.goal) {
        text += `Goal: ${lesson.goal}\n`;
      }
      if (note && note.trim()) {
        text += `Notes:\n${note.trim()}\n`;
        lessonNotesCount++;
      } else {
        text += `Notes: (No notes recorded)\n`;
      }
      text += `\n`;
    }
  }

  text += `========================================================\n`;
  text += `SUMMARY:\n`;
  text += `- Component Notes: ${partNotesCount} of ${parts.length}\n`;
  if (lessons) {
    text += `- Lesson Notes: ${lessonNotesCount} of ${lessons.length}\n`;
  }
  text += `Boardwalk 3D PC & Networking Explorer\n`;
  return text;
}

export function downloadFile(filename: string, content: string, mimeType = 'text/plain'): void {
  try {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  } catch {
    // Fallback if blob download not supported
  }
}
