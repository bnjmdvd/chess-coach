import { useSyncExternalStore } from 'react';
import type { CardState } from './srs';

export interface Prefs {
  boardTheme: 'green' | 'brown' | 'blue';
  coords: boolean;
  sound: boolean;
  /** Target daily session length. */
  sessionMinutes: 10 | 20 | 30;
  /** Coach behaviour in Play mode. */
  coach: 'guided' | 'feedback' | 'off';
  engineLevel: number;
  playColor: 'white' | 'black' | 'random';
}

export interface LessonProgress {
  started?: number;
  /** Teaching part finished. */
  learned?: number;
  /** Best checkpoint score 0..1. */
  best?: number;
  attempts: number;
  /** Checkpoint passed (>= MASTERY). */
  mastered?: number;
  confidence?: number;
}

export interface DayLog {
  day: string; // YYYY-MM-DD (local)
  seconds: number;
  reviews: number;
  correct: number;
  lessons: string[];
  games: number;
  sessionsCompleted: number;
}

export interface GameRecord {
  date: number;
  color: 'white' | 'black';
  level: number;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  pgn: string;
  moves: number;
  mistakes: number;
  blunders: number;
}

export interface JournalEntry { date: number; lessonId: string; prompt: string; text: string }

export interface AppData {
  version: 1;
  createdAt: number;
  prefs: Prefs;
  lessons: Record<string, LessonProgress>;
  cards: Record<string, CardState>;
  days: DayLog[];
  games: GameRecord[];
  journal: JournalEntry[];
  /** Session in progress, so closing the tab doesn't lose your place. */
  activeSession?: { day: string; plan: unknown; phase: number };
}

export const MASTERY = 0.8;
const KEY = 'chess-coach:v1';

const defaults = (): AppData => ({
  version: 1,
  createdAt: Date.now(),
  prefs: { boardTheme: 'green', coords: true, sound: true, sessionMinutes: 20, coach: 'guided', engineLevel: 1, playColor: 'white' },
  lessons: {},
  cards: {},
  days: [],
  games: [],
  journal: [],
});

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as AppData;
      const base = defaults();
      return { ...base, ...d, prefs: { ...base.prefs, ...d.prefs } };
    }
  } catch { /* storage unavailable or corrupt: start fresh */ }
  return defaults();
}

let data: AppData = load();
const listeners = new Set<() => void>();
let saveError = false;

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    saveError = false;
  } catch {
    saveError = true;
  }
}

export function getData() { return data; }
export function hasSaveError() { return saveError; }

/** Immutable-ish update: mutate a draft copy, then persist and notify. */
export function update(fn: (d: AppData) => void) {
  const draft = structuredClone(data);
  fn(draft);
  data = draft;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useData(): AppData {
  return useSyncExternalStore(subscribe, () => data);
}
export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, () => data.prefs);
}

// Keep tabs in sync.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) { data = load(); listeners.forEach((l) => l()); }
});

/** Ask the browser not to evict our storage (Chrome/Firefox honour this; Safari via Add to Dock). */
export async function requestPersistence(): Promise<boolean | null> {
  try {
    if (!navigator.storage?.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

export function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `chess-coach-backup-${todayKey()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  update((d) => { (d as AppData & { lastBackup?: number }).lastBackup = Date.now(); });
}

export async function importData(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text) as AppData;
  if (parsed?.version !== 1 || typeof parsed.lessons !== 'object') throw new Error('This file is not a Chess Coach backup.');
  update((d) => { Object.assign(d, defaults(), parsed, { prefs: { ...defaults().prefs, ...parsed.prefs } }); });
}

export function resetAll() {
  update((d) => { Object.assign(d, defaults()); delete d.activeSession; });
}

// ---- day log helpers ----
export function todayKey(date = new Date()) {
  const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), dd = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function logToday(fn: (log: DayLog) => void) {
  update((d) => {
    const key = todayKey();
    let log = d.days.find((x) => x.day === key);
    if (!log) {
      log = { day: key, seconds: 0, reviews: 0, correct: 0, lessons: [], games: 0, sessionsCompleted: 0 };
      d.days.push(log);
    }
    fn(log);
  });
}

/** Consecutive days (ending today or yesterday) with a completed session or any practice. */
export function streak(d: AppData = data): number {
  const active = new Set(d.days.filter((x) => x.sessionsCompleted > 0 || x.reviews > 0 || x.lessons.length > 0).map((x) => x.day));
  const cur = new Date();
  if (!active.has(todayKey(cur))) cur.setDate(cur.getDate() - 1);
  let n = 0;
  while (active.has(todayKey(cur))) { n++; cur.setDate(cur.getDate() - 1); }
  return n;
}

export function lastBackup(): number | undefined {
  return (data as AppData & { lastBackup?: number }).lastBackup;
}
