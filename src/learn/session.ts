import { allLessons, lessonById } from '../content';
import type { Lesson } from '../content/types';
import { cardsOfLesson, dueCards, interleave, newPracticeCards, shuffle } from '../state/srs';
import { MASTERY, type AppData } from '../state/store';

/**
 * A daily session follows a research-backed shape:
 * 1. Warm-up: spaced, interleaved retrieval of earlier material (due reviews)
 * 2. New learning: one lesson (or a re-mastery attempt of a shaky one)
 * 3. Practice: fresh exercises from today's lesson mixed with earlier topics
 * 4. Recap: summary, preview of the next lesson, and a nudge to stop (spacing beats cramming)
 */
export interface SessionPlan {
  reviews: string[];
  lessonId: string | null;
  lessonMode: 'new' | 'retry' | null;
  /** Catch-up day: too many reviews piled up, so no new lesson. */
  catchUp: boolean;
  practiceCount: number;
  estMinutes: number;
}

const CAPS = {
  10: { reviews: 5, practice: 3 },
  20: { reviews: 8, practice: 5 },
  30: { reviews: 12, practice: 8 },
} as const;

export function nextNewLesson(d: AppData): Lesson | null {
  return allLessons.find((l) => !d.lessons[l.id]?.learned) ?? null;
}

/** Most recent learned-but-not-mastered lesson that deserves another try (max 3 attempts). */
export function lessonToRetry(d: AppData): Lesson | null {
  const shaky = allLessons.filter((l) => {
    const p = d.lessons[l.id];
    return p?.learned && !p.mastered && (p.best ?? 0) < MASTERY && p.attempts < 3;
  });
  return shaky.at(-1) ?? null;
}

export function planSession(d: AppData): SessionPlan {
  const cap = CAPS[d.prefs.sessionMinutes] ?? CAPS[20];
  const due = dueCards(d);
  const catchUp = due.length > cap.reviews * 3;
  const reviews = interleave(shuffle(due.slice(0, catchUp ? cap.reviews * 2 : cap.reviews)));
  const retry = lessonToRetry(d);
  // Retry a shaky lesson only if it was attempted on an earlier day (sleep consolidates learning first).
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const retryOk = retry && (d.lessons[retry.id]?.learned ?? 0) < today.getTime();
  const lesson = catchUp ? null : retryOk ? retry : nextNewLesson(d);
  const lessonMode = lesson ? (retryOk && lesson === retry ? 'retry' : 'new') : null;
  const practiceAvail = newPracticeCards(d).length + (lesson && lessonMode === 'new' ? (lesson.practice?.length ?? 0) : 0);
  const practiceCount = Math.min(cap.practice, practiceAvail);
  const est = reviews.length * 0.6 + (lesson ? (lessonMode === 'retry' ? 3 : lesson.minutes + lesson.checkpoint.length * 0.6) : 0) + practiceCount * 0.7;
  return { reviews, lessonId: lesson?.id ?? null, lessonMode, catchUp, practiceCount, estMinutes: Math.max(3, Math.round(est)) };
}

/** Choose practice cards after the lesson: ~half from today's lesson, rest interleaved from earlier ones. */
export function pickPractice(d: AppData, lessonId: string | null, count: number): string[] {
  const fresh = newPracticeCards(d);
  const fromToday = lessonId ? cardsOfLesson(lessonById.get(lessonId)!).filter((c) => c.kind === 'practice' && !d.cards[c.id]).map((c) => c.id) : [];
  const older = fresh.filter((id) => !fromToday.includes(id));
  const nToday = Math.min(fromToday.length, Math.ceil(count / 2));
  const picked = [...fromToday.slice(0, nToday), ...shuffle(older.slice(0, 12)).slice(0, count - nToday)];
  if (picked.length < count) picked.push(...fromToday.slice(nToday, nToday + count - picked.length));
  return interleave(picked);
}
