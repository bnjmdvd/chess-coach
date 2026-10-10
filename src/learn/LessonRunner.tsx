import { useMemo, useState } from 'react';
import type { ExerciseStep, Lesson } from '../content/types';
import { unitOfLesson } from '../content';
import { StepView, type StepResult } from './StepView';
import { getData, logToday, MASTERY, update } from '../state/store';
import { cardId, gradeFrom, schedule } from '../state/srs';
import { sound } from '../ui/sound';
import { Rich } from '../ui/Rich';

type Phase = 'intro' | 'teach' | 'checkpoint-intro' | 'checkpoint' | 'result' | 'recap';

export interface LessonOutcome { lessonId: string; score: number; mastered: boolean }

/**
 * One lesson: advance organizer -> teaching steps -> checkpoint (retrieval, no scaffolds)
 * -> result (mastery gate) -> recap with key ideas, reflection and confidence rating.
 */
export function LessonRunner({ lesson, onFinish, onExit, testOut = false, retry = false }: {
  lesson: Lesson;
  onFinish: (o: LessonOutcome) => void;
  onExit: () => void;
  /** Skip teaching and go straight to the checkpoint. */
  testOut?: boolean;
  /** Re-mastery attempt: key-idea refresher, then a checkpoint with fresh questions. */
  retry?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>(testOut || retry ? 'checkpoint-intro' : 'intro');
  const [i, setI] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const [attempt, setAttempt] = useState(retry ? 1 : 0);
  const [reflection, setReflection] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const unit = unitOfLesson.get(lesson.id);
  const progress = getData().lessons[lesson.id];

  // On retry, swap in practice items for variety (retrieval of the same idea, not the same answer).
  const checkpoint: { step: ExerciseStep; id: string }[] = useMemo(() => {
    const base = lesson.checkpoint.map((step, k) => ({ step, id: cardId(lesson.id, 'checkpoint', k) }));
    if (attempt === 0 || !lesson.practice?.length) return base;
    const extra = lesson.practice.map((step, k) => ({ step, id: cardId(lesson.id, 'practice', k) }));
    const n = base.length;
    const rot = (attempt * n) % extra.length;
    return [...extra.slice(rot), ...extra.slice(0, rot)].slice(0, n).concat(base).slice(0, n);
  }, [attempt, lesson]);

  const score = results.length ? results.filter((r) => r.correct && r.mistakes === 0 && r.hints === 0).length / results.length : 0;

  const startTeach = () => {
    update((d) => { const p = (d.lessons[lesson.id] ??= { attempts: 0 }); p.started ??= Date.now(); });
    setPhase('teach');
  };

  const finishCheckpoint = (all: StepResult[]) => {
    const s = all.filter((r) => r.correct && r.mistakes === 0 && r.hints === 0).length / all.length;
    const mastered = s >= MASTERY;
    update((d) => {
      const p = (d.lessons[lesson.id] ??= { attempts: 0 });
      p.attempts++;
      p.learned ??= Date.now();
      p.best = Math.max(p.best ?? 0, s);
      if (mastered) p.mastered ??= Date.now();
      checkpoint.forEach(({ id }, k) => { d.cards[id] = schedule(d.cards[id], gradeFrom(all[k])); });
    });
    logToday((l) => {
      if (!l.lessons.includes(lesson.id)) l.lessons.push(lesson.id);
      l.reviews += all.length;
      l.correct += all.filter((r) => r.correct && !r.mistakes).length;
    });
    if (mastered) sound.done();
    setPhase('result');
  };

  const header = (label: string, n: number, total: number) => (
    <div className="step-header">
      <div className="step-header-top">
        <span className="eyebrow">{unit?.title} · {lesson.title}</span>
        <button className="link" onClick={onExit}>Exit</button>
      </div>
      <div className="progress"><div style={{ width: `${(n / total) * 100}%` }} /></div>
      <span className="muted small">{label}</span>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="card narrow center-card">
        <div className="eyebrow">{unit?.title}</div>
        <h1>{lesson.title}</h1>
        <p className="objective"><strong>Goal:</strong> {lesson.objective.replace(/^You will be able to /i, 'You will be able to ')}</p>
        <p className="muted">About {lesson.minutes} min of learning, then a {lesson.checkpoint.length}-question checkpoint.</p>
        {progress?.learned && <p className="muted small">You've done this lesson before. Revisiting is a great way to strengthen it.</p>}
        <div className="actions center">
          <button className="btn primary big" onClick={startTeach} autoFocus>Start lesson</button>
          <button className="btn ghost" onClick={() => setPhase('checkpoint-intro')} title="Skip the teaching if you already know this">I know this: test me</button>
        </div>
        <button className="link" onClick={onExit}>Back</button>
      </div>
    );
  }

  if (phase === 'teach') {
    const step = lesson.steps[i];
    return (
      <StepView
        key={`t${i}`}
        step={step}
        mode="learn"
        header={header(`Step ${i + 1} of ${lesson.steps.length}`, i, lesson.steps.length)}
        onDone={() => {
          if (i + 1 < lesson.steps.length) setI(i + 1);
          else { setI(0); setPhase('checkpoint-intro'); }
        }}
      />
    );
  }

  if (phase === 'checkpoint-intro') {
    return (
      <div className="card narrow center-card">
        <div className="eyebrow">Checkpoint · {lesson.title}</div>
        <h1>{retry && attempt === 1 ? 'Let\'s lock this one in' : 'Show what you know'}</h1>
        {retry && attempt === 1 && (
          <div className="refresher">
            <p>Last time this lesson wasn't fully mastered yet. Quick refresher on the key ideas:</p>
            <ul className="key-ideas">{lesson.keyIdeas.map((k, n) => <li key={n}><Rich text={k} /></li>)}</ul>
            <button className="link" onClick={() => { setI(0); setPhase('teach'); }}>Or redo the full lesson</button>
          </div>
        )}
        <p>{checkpoint.length} questions, no help on the board. Getting it right <em>without</em> hints is what counts. Pulling answers from memory is exactly what makes them stick.</p>
        <p className="muted small">Score {Math.round(MASTERY * 100)}% or more to master this lesson. If you miss some, the app will bring them back for review.</p>
        <div className="actions center">
          <button className="btn primary big" autoFocus onClick={() => { setResults([]); setI(0); setPhase('checkpoint'); }}>Begin checkpoint</button>
        </div>
      </div>
    );
  }

  if (phase === 'checkpoint') {
    const { step } = checkpoint[i];
    return (
      <StepView
        key={`c${attempt}-${i}`}
        step={step}
        mode="test"
        header={header(`Checkpoint ${i + 1} of ${checkpoint.length}`, i, checkpoint.length)}
        onDone={(r) => {
          const all = [...results, r];
          setResults(all);
          if (i + 1 < checkpoint.length) setI(i + 1);
          else finishCheckpoint(all);
        }}
      />
    );
  }

  if (phase === 'result') {
    const mastered = score >= MASTERY;
    const pct = Math.round(score * 100);
    return (
      <div className="card narrow center-card">
        <div className={`score-ring ${mastered ? 'good' : 'mid'}`}>{pct}%</div>
        <h1>{mastered ? 'Lesson mastered!' : 'Good effort. Almost there.'}</h1>
        <p>
          {mastered
            ? `You answered ${results.filter((r) => r.correct && !r.mistakes && !r.hints).length} of ${results.length} cleanly on the first try.`
            : `${results.filter((r) => r.correct && !r.mistakes && !r.hints).length} of ${results.length} on the first try without hints. Mistakes are normal: they show you exactly what to practise. The ones you missed will come back in your reviews.`}
        </p>
        <div className="actions center">
          {!mastered && <button className="btn ghost" onClick={() => { setAttempt(attempt + 1); setI(0); setPhase('checkpoint-intro'); }}>Try again with new questions</button>}
          {!mastered && <button className="btn ghost" onClick={() => { setI(0); setPhase('teach'); }}>Review the lesson</button>}
          <button className="btn primary" autoFocus onClick={() => setPhase('recap')}>Continue</button>
        </div>
      </div>
    );
  }

  // recap
  return (
    <div className="card narrow">
      <div className="eyebrow">Recap · {lesson.title}</div>
      <h1>Key ideas</h1>
      <ul className="key-ideas">
        {lesson.keyIdeas.map((k, n) => <li key={n}><Rich text={k} /></li>)}
      </ul>
      {lesson.reflect && (
        <div className="reflect">
          <label htmlFor="reflect"><strong>Explain it in your own words</strong> (optional, but it really helps memory)</label>
          <p className="muted">{lesson.reflect}</p>
          <textarea id="reflect" rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Type a sentence or two…" />
        </div>
      )}
      <div className="confidence">
        <strong>How confident do you feel about this?</strong>
        <div className="seg">
          {['Shaky', 'Getting there', 'Confident', 'Rock solid'].map((t, n) => (
            <button key={t} className={confidence === n + 1 ? 'on' : ''} onClick={() => setConfidence(n + 1)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="actions">
        <button
          className="btn primary big"
          onClick={() => {
            update((d) => {
              if (reflection.trim() && lesson.reflect) d.journal.push({ date: Date.now(), lessonId: lesson.id, prompt: lesson.reflect, text: reflection.trim() });
              if (confidence) {
                d.lessons[lesson.id].confidence = confidence;
                // Low confidence on a correct answer: review it sooner (metacognitive calibration).
                if (confidence <= 2) lesson.checkpoint.forEach((_, k) => {
                  const c = d.cards[cardId(lesson.id, 'checkpoint', k)];
                  if (c && c.interval > 1) { c.interval = 1; c.due = Math.min(c.due, Date.now() + 86_400_000); }
                });
              }
            });
            onFinish({ lessonId: lesson.id, score, mastered: score >= MASTERY });
          }}
        >
          Finish lesson
        </button>
      </div>
    </div>
  );
}
