import { useMemo, useState } from 'react';
import { lessonById, unitOfLesson } from '../content';
import { LessonRunner, type LessonOutcome } from '../learn/LessonRunner';
import { ExerciseQueue, type QueueSummary } from '../learn/ExerciseQueue';
import { nextNewLesson, pickPractice, planSession, type SessionPlan } from '../learn/session';
import { getData, logToday, streak, todayKey, update, useData } from '../state/store';
import { sound } from '../ui/sound';
import type { Nav } from '../App';
import { plural } from '../ui/plural';

type Phase = 'overview' | 'warmup' | 'lesson' | 'practice' | 'recap';
const ORDER: Phase[] = ['overview', 'warmup', 'lesson', 'practice', 'recap'];

export function SessionView({ nav }: { nav: Nav }) {
  const data = useData();
  // Resume today's session if one was in progress.
  const saved = data.activeSession?.day === todayKey() ? data.activeSession : undefined;
  const [plan] = useState<SessionPlan>(() => (saved?.plan as SessionPlan) ?? planSession(getData()));
  const [phase, setPhaseState] = useState<Phase>(() => (saved ? ORDER[saved.phase] : 'overview'));
  const [warm, setWarm] = useState<QueueSummary | null>(null);
  const [lessonOut, setLessonOut] = useState<LessonOutcome | null>(null);
  const [prac, setPrac] = useState<QueueSummary | null>(null);
  const [practiceIds, setPracticeIds] = useState<string[]>(() =>
    saved && ORDER[saved.phase] === 'practice' ? pickPractice(getData(), plan.lessonId, plan.practiceCount) : []);
  const lesson = plan.lessonId ? lessonById.get(plan.lessonId) ?? null : null;

  const setPhase = (p: Phase) => {
    // Skip empty phases.
    if (p === 'warmup' && !plan.reviews.length) return setPhase('lesson');
    if (p === 'lesson' && !lesson) return setPhase('practice');
    if (p === 'practice') {
      const ids = pickPractice(getData(), plan.lessonId, plan.practiceCount);
      if (!ids.length) return setPhase('recap');
      setPracticeIds(ids);
    }
    if (p === 'recap') {
      logToday((l) => { l.sessionsCompleted++; });
      update((d) => { delete d.activeSession; });
      sound.done();
    } else {
      update((d) => { d.activeSession = { day: todayKey(), plan, phase: ORDER.indexOf(p) }; });
    }
    setPhaseState(p);
    window.scrollTo(0, 0);
  };
  const exit = () => nav('home');

  if (phase === 'overview') {
    const items = [
      { on: plan.reviews.length > 0, title: 'Warm-up review', text: `${plural(plan.reviews.length, 'question')} from earlier lessons, mixed together. Recalling before you learn something new strengthens memory.` },
      { on: !!lesson, title: plan.lessonMode === 'retry' ? 'Re-master a lesson' : 'New lesson', text: lesson ? `${lesson.title}: ${lesson.objective}` : '' },
      { on: plan.practiceCount > 0, title: 'Practice', text: `${plural(plan.practiceCount, 'fresh exercise')} mixing today's lesson with earlier topics.` },
      { on: true, title: 'Recap', text: 'What you did, what\'s next, and when to come back.' },
    ].filter((x) => x.on);
    return (
      <div className="card narrow">
        <div className="eyebrow">Today's session · about {plan.estMinutes} min</div>
        <h1>{plan.catchUp ? 'Catch-up day' : 'Here\'s the plan'}</h1>
        {plan.catchUp && <p>You have quite a few reviews waiting, so today is all about strengthening what you've learned. No new lesson today: a solid foundation first.</p>}
        <ol className="plan">
          {items.map((it, n) => (
            <li key={n}><strong>{it.title}</strong><span className="muted">{it.text}</span></li>
          ))}
        </ol>
        <div className="actions">
          <button className="btn primary big" autoFocus onClick={() => setPhase('warmup')}>Let's go</button>
          <button className="btn ghost" onClick={exit}>Not now</button>
        </div>
      </div>
    );
  }

  if (phase === 'warmup') {
    return (
      <ExerciseQueue
        ids={plan.reviews}
        title="Warm-up"
        onExit={exit}
        onFinish={(s) => { setWarm(s); setPhase('lesson'); }}
      />
    );
  }

  if (phase === 'lesson' && lesson) {
    return (
      <LessonRunner
        lesson={lesson}
        retry={plan.lessonMode === 'retry'}
        onExit={exit}
        onFinish={(o) => { setLessonOut(o); setPhase('practice'); }}
      />
    );
  }

  if (phase === 'practice' && practiceIds.length) {
    return (
      <ExerciseQueue
        ids={practiceIds}
        title="Practice"
        onExit={exit}
        onFinish={(s) => { setPrac(s); setPhase('recap'); }}
      />
    );
  }

  return <Recap warm={warm} lessonOut={lessonOut} prac={prac} nav={nav} />;
}

function Recap({ warm, lessonOut, prac, nav }: { warm: QueueSummary | null; lessonOut: LessonOutcome | null; prac: QueueSummary | null; nav: Nav }) {
  const data = useData();
  const s = streak(data);
  const next = useMemo(() => nextNewLesson(data), [data]);
  const lesson = lessonOut ? lessonById.get(lessonOut.lessonId) : null;
  const canPlay = !!data.lessons['your-first-game']?.learned || !!data.lessons['checkmate']?.learned;
  return (
    <div className="card narrow">
      <div className="eyebrow">Session complete</div>
      <h1>Great session!</h1>
      <div className="streak-big">🔥 {s}-day streak</div>
      <ul className="recap-list">
        {warm && <li>Warm-up: <strong>{warm.firstTry}/{warm.total}</strong> remembered cleanly{warm.again.length ? `. ${warm.again.length} will come back soon` : ''}.</li>}
        {lessonOut && lesson && <li>Lesson <strong>{lesson.title}</strong>: {Math.round(lessonOut.score * 100)}% on the checkpoint{lessonOut.mastered ? ' (mastered ✓)' : '. We\'ll revisit it next session'}.</li>}
        {prac && <li>Practice: <strong>{prac.firstTry}/{prac.total}</strong> solved cleanly.</li>}
      </ul>
      {next && (
        <div className="next-up">
          <span className="eyebrow">Next time</span>
          <strong>{next.title}</strong>
          <span className="muted">{unitOfLesson.get(next.id)?.title}: {next.objective}</span>
        </div>
      )}
      <p className="muted">
        The best time to stop is now: your brain consolidates new skills between sessions, especially during sleep.
        Short daily sessions beat long occasional ones.
      </p>
      <div className="actions">
        <button className="btn primary" onClick={() => nav('home')}>Done for today</button>
        {canPlay && <button className="btn ghost" onClick={() => nav('play')}>Play a practice game</button>}
        <button className="btn ghost" onClick={() => nav('learn')}>Browse lessons</button>
      </div>
    </div>
  );
}
