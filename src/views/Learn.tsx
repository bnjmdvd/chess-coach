import { useState } from 'react';
import { allLessons, curriculum, lessonById } from '../content';
import type { Lesson } from '../content/types';
import { LessonRunner } from '../learn/LessonRunner';
import { ExerciseQueue } from '../learn/ExerciseQueue';
import { cardsOfLesson, interleave, lessonStrength } from '../state/srs';
import { useData, type AppData } from '../state/store';
import type { Nav } from '../App';

/** A lesson is open if learned, or the first unlearned, or right after a learned one. */
export function isUnlocked(d: AppData, lesson: Lesson): boolean {
  const idx = allLessons.indexOf(lesson);
  if (d.lessons[lesson.id]?.learned) return true;
  if (idx === 0) return true;
  if (d.lessons[allLessons[idx - 1].id]?.learned) return true;
  return allLessons.findIndex((l) => !d.lessons[l.id]?.learned) === idx;
}

export function LearnView({ nav }: { nav: Nav }) {
  const data = useData();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="learn">
      <h1>Lessons</h1>
      <p className="muted">The path goes from the absolute basics to strategy. Daily sessions pick the next lesson for you, but you can open any unlocked lesson here. Already know something? <strong>Test out</strong> of it.</p>
      {curriculum.map((unit, ui) => {
        const learned = unit.lessons.filter((l) => data.lessons[l.id]?.learned).length;
        const mastered = unit.lessons.filter((l) => data.lessons[l.id]?.mastered).length;
        return (
          <section key={unit.id} className="unit">
            <div className="unit-head">
              <div>
                <div className="eyebrow">Unit {ui + 1}</div>
                <h2>{unit.title}</h2>
                <p className="muted">{unit.description}</p>
              </div>
              <div className="unit-meta">
                <span>{mastered}/{unit.lessons.length} mastered</span>
                <div className="progress small"><div style={{ width: `${(learned / Math.max(1, unit.lessons.length)) * 100}%` }} /></div>
              </div>
            </div>
            <div className="lesson-grid">
              {unit.lessons.map((l, li) => {
                const p = data.lessons[l.id];
                const unlocked = isUnlocked(data, l);
                const strength = lessonStrength(data, l);
                const status = p?.mastered ? 'mastered' : p?.learned ? 'learned' : unlocked ? 'open' : 'locked';
                return (
                  <div key={l.id} className={`lesson-tile ${status}`}>
                    <button className="lesson-main" onClick={() => setOpen(open === l.id ? null : l.id)}>
                      <span className="lesson-n">{status === 'mastered' ? '★' : status === 'locked' ? '🔒' : li + 1}</span>
                      <span className="lesson-title">{l.title}</span>
                      {p?.learned && (
                        <span className="strength" title={`Memory strength ${Math.round(strength * 100)}%`}>
                          <span style={{ width: `${strength * 100}%` }} />
                        </span>
                      )}
                    </button>
                    {open === l.id && (
                      <div className="lesson-more">
                        <p className="small">{l.objective}</p>
                        {p?.best !== undefined && <p className="muted small">Best checkpoint: {Math.round(p.best * 100)}%</p>}
                        <div className="actions">
                          {unlocked && <button className="btn primary" onClick={() => nav(`lesson/${l.id}`)}>{p?.learned ? 'Revisit lesson' : 'Start lesson'}</button>}
                          {p?.learned && <button className="btn ghost" onClick={() => nav(`drill/${l.id}`)}>Practise</button>}
                          <button className="btn ghost" onClick={() => nav(`testout/${l.id}`)}>{p?.learned ? 'Retake checkpoint' : 'Test out'}</button>
                        </div>
                        {!unlocked && <p className="muted small">Locked until you finish the previous lesson. You can still test out if you already know this.</p>}
                      </div>
                    )}
                  </div>
                );
              })}
              {unit.lessons.length === 0 && <p className="muted">Coming soon.</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function LessonView({ id, nav, testOut }: { id: string; nav: Nav; testOut?: boolean }) {
  const lesson = lessonById.get(id);
  if (!lesson) return <div className="card narrow"><h1>Lesson not found</h1><button className="btn" onClick={() => nav('learn')}>Back to lessons</button></div>;
  return <LessonRunner lesson={lesson} testOut={testOut} onExit={() => nav('learn')} onFinish={() => nav('learn')} />;
}

/** All exercises of one lesson (checkpoint + practice pool), counted as reviews. */
export function DrillView({ id, nav }: { id: string; nav: Nav }) {
  const lesson = lessonById.get(id);
  const [done, setDone] = useState<string | null>(null);
  if (!lesson) return null;
  if (done) {
    return (
      <div className="card narrow center-card">
        <h1>Practice complete</h1>
        <p>{done}</p>
        <div className="actions center"><button className="btn primary" onClick={() => nav('learn')}>Back to lessons</button></div>
      </div>
    );
  }
  return (
    <ExerciseQueue
      ids={interleave(cardsOfLesson(lesson).map((c) => c.id))}
      title={`Practise: ${lesson.title}`}
      onExit={() => nav('learn')}
      onFinish={(s) => setDone(`${s.firstTry} of ${s.total} solved cleanly on the first try.`)}
    />
  );
}
