/**
 * Spaced repetition (SM-2 family) with outcome-based grading.
 *
 * Grades come from behaviour, not self-report, because beginners misjudge their
 * own knowledge: a first-try correct answer without hints is "good", fast ones are
 * "easy", correct after hints/mistakes is "hard", and a failure is "again".
 */
import { allLessons, lessonById } from '../content';
import type { ExerciseStep, Lesson } from '../content/types';
import type { AppData } from './store';

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  due: number;      // epoch ms
  interval: number; // days
  ease: number;
  reps: number;
  lapses: number;
  last: number;
}

const DAY = 86_400_000;

export interface CardRef { id: string; lesson: Lesson; step: ExerciseStep; kind: 'checkpoint' | 'practice' }

export function cardId(lessonId: string, kind: 'checkpoint' | 'practice', i: number) {
  return `${lessonId}/${kind === 'checkpoint' ? 'c' : 'p'}${i}`;
}

export function cardsOfLesson(lesson: Lesson): CardRef[] {
  return [
    ...lesson.checkpoint.map((step, i) => ({ id: cardId(lesson.id, 'checkpoint', i), lesson, step, kind: 'checkpoint' as const })),
    ...(lesson.practice ?? []).map((step, i) => ({ id: cardId(lesson.id, 'practice', i), lesson, step, kind: 'practice' as const })),
  ];
}

export function resolveCard(id: string): CardRef | null {
  const [lessonId, k] = id.split('/');
  const lesson = lessonById.get(lessonId);
  if (!lesson || !k) return null;
  const i = Number(k.slice(1));
  const step = k[0] === 'c' ? lesson.checkpoint[i] : lesson.practice?.[i];
  return step ? { id, lesson, step, kind: k[0] === 'c' ? 'checkpoint' : 'practice' } : null;
}

/** Grade from what happened in an exercise. */
export function gradeFrom(r: { correct: boolean; mistakes: number; hints: number; ms: number }): Grade {
  if (!r.correct) return 'again';
  if (r.mistakes > 0 || r.hints > 0) return 'hard';
  if (r.ms < 8000) return 'easy';
  return 'good';
}

const fuzz = (days: number) => (days < 3 ? days : days * (0.92 + Math.random() * 0.16));
const endOfToday = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); };
/** Due "tomorrow" = start of tomorrow, so a review tomorrow morning counts. */
const daysFromToday = (days: number) => {
  const d = new Date(); d.setHours(4, 0, 0, 0);
  return d.getTime() + Math.round(days) * DAY;
};

export function schedule(prev: CardState | undefined, grade: Grade, now = Date.now()): CardState {
  const c: CardState = prev ? { ...prev } : { due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0, last: now };
  c.last = now;
  if (grade === 'again') {
    c.lapses++;
    c.reps = 0;
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.interval = 1;
  } else if (grade === 'hard') {
    c.ease = Math.max(1.3, c.ease - 0.15);
    c.interval = c.reps === 0 ? 1 : Math.max(1, c.interval * 1.2);
    c.reps++;
  } else {
    const bonus = grade === 'easy' ? 1.3 : 1;
    if (grade === 'easy') c.ease += 0.1;
    c.interval = c.reps === 0 ? (grade === 'easy' ? 3 : 1) : c.reps === 1 ? 3 * bonus : c.interval * c.ease * bonus;
    c.reps++;
  }
  c.interval = Math.min(fuzz(c.interval), 365);
  c.due = daysFromToday(c.interval);
  return c;
}

export function dueCards(d: AppData, now = endOfToday()): string[] {
  return Object.entries(d.cards)
    .filter(([id, c]) => c.due <= now && resolveCard(id))
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}

/** Practice cards from learned lessons never seen yet, most recent lessons first. */
export function newPracticeCards(d: AppData): string[] {
  const learned = allLessons.filter((l) => d.lessons[l.id]?.learned).reverse();
  return learned.flatMap((l) => cardsOfLesson(l).filter((c) => c.kind === 'practice' && !d.cards[c.id]).map((c) => c.id));
}

/** Mastery estimate per lesson 0..1 from card stability and checkpoint score. */
export function lessonStrength(d: AppData, lesson: Lesson): number {
  const p = d.lessons[lesson.id];
  if (!p?.learned) return 0;
  const cards = cardsOfLesson(lesson).map((c) => d.cards[c.id]).filter(Boolean) as CardState[];
  const best = p.best ?? 0;
  if (!cards.length) return best * 0.6;
  // Interval of 21+ days ~ long-term memory.
  const stab = cards.reduce((s, c) => s + Math.min(1, c.interval / 21), 0) / cards.length;
  const overdue = cards.filter((c) => c.due < Date.now()).length / cards.length;
  return Math.max(0, Math.min(1, 0.45 * best + 0.55 * stab - 0.15 * overdue));
}

/** Interleave ids from different lessons so consecutive items rarely share a lesson. */
export function interleave(ids: string[]): string[] {
  const groups = new Map<string, string[]>();
  for (const id of ids) {
    const k = id.split('/')[0];
    groups.set(k, [...(groups.get(k) ?? []), id]);
  }
  const out: string[] = [];
  const queues = [...groups.values()].sort((a, b) => b.length - a.length);
  while (queues.some((q) => q.length)) {
    for (const q of queues) if (q.length) out.push(q.shift()!);
    queues.sort((a, b) => b.length - a.length);
  }
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
