import { useMemo, useState } from 'react';
import { ExerciseQueue, type QueueSummary } from '../learn/ExerciseQueue';
import { allLessons } from '../content';
import { cardsOfLesson, dueCards, interleave, lessonStrength, shuffle } from '../state/srs';
import { getData, useData } from '../state/store';
import type { Nav } from '../App';
import { plural } from '../ui/plural';

const DAY = 86_400_000;

export function ReviewView({ nav }: { nav: Nav }) {
  const data = useData();
  const [run, setRun] = useState<{ ids: string[]; title: string } | null>(null);
  const [summary, setSummary] = useState<QueueSummary | null>(null);
  const due = dueCards(data);
  const learned = allLessons.filter((l) => data.lessons[l.id]?.learned);

  const forecast = useMemo(() => {
    const start = new Date(); start.setHours(23, 59, 59, 999);
    return Array.from({ length: 7 }, (_, k) => {
      const end = start.getTime() + k * DAY;
      const from = k === 0 ? 0 : end - DAY;
      return Object.values(data.cards).filter((c) => c.due > from && c.due <= end).length;
    });
  }, [data.cards]);

  if (run) {
    return (
      <ExerciseQueue
        ids={run.ids}
        title={run.title}
        onExit={() => setRun(null)}
        onFinish={(s) => { setSummary(s); setRun(null); }}
      />
    );
  }

  const weakest = learned.map((l) => ({ l, s: lessonStrength(data, l) })).sort((a, b) => a.s - b.s).slice(0, 4);
  const startWeak = () => {
    const ids = interleave(shuffle(weakest.flatMap(({ l }) => cardsOfLesson(l).map((c) => c.id))).slice(0, 10));
    setRun({ ids, title: 'Weak spots' });
  };
  const startMixed = () => {
    const ids = interleave(shuffle(learned.flatMap((l) => cardsOfLesson(l).map((c) => c.id)))).slice(0, 10);
    setRun({ ids, title: 'Mixed practice' });
  };
  const max = Math.max(1, ...forecast);

  return (
    <div className="review">
      <h1>Review</h1>
      {summary && (
        <div className="card notice good">
          <strong>Review done: {summary.firstTry}/{summary.total} remembered cleanly.</strong>
          {summary.again.length > 0 && <span className="muted small"> Missed items come back soon. That's how they stick.</span>}
        </div>
      )}
      <div className="card">
        <h2>{due.length ? `${plural(due.length, 'review')} due` : 'All caught up ✓'}</h2>
        <p className="muted">
          Reviews come back at growing intervals: 1 day, 3 days, a week, a month… Each time you recall something just before forgetting it, it lasts longer.
        </p>
        <div className="actions">
          <button className="btn primary" disabled={!due.length} onClick={() => setRun({ ids: interleave(shuffle(due)).slice(0, 20), title: 'Review' })}>
            {due.length ? `Review now (${Math.min(20, due.length)})` : 'Nothing due'}
          </button>
          {learned.length > 0 && <button className="btn ghost" onClick={startWeak}>Practise weak spots</button>}
          {learned.length > 1 && <button className="btn ghost" onClick={startMixed}>Mixed practice</button>}
        </div>
      </div>

      {Object.keys(getData().cards).length > 0 && (
        <div className="card">
          <h3>Coming up this week</h3>
          <div className="forecast">
            {forecast.map((n, k) => (
              <div key={k} className="fc-col">
                <div className="fc-bar"><div style={{ height: `${(n / max) * 100}%` }} /></div>
                <span className="fc-n">{n}</span>
                <span className="fc-d">{k === 0 ? 'Today' : new Date(Date.now() + k * DAY).toLocaleDateString(undefined, { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weakest.length > 0 && (
        <div className="card">
          <h3>Weakest lessons</h3>
          <ul className="weak-list">
            {weakest.map(({ l, s }) => (
              <li key={l.id}>
                <span>{l.title}</span>
                <span className="strength wide"><span style={{ width: `${s * 100}%` }} /></span>
                <button className="link" onClick={() => nav(`lesson/${l.id}`)}>Revisit</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!learned.length && <p className="muted">Finish your first lesson and its questions will start appearing here.</p>}
    </div>
  );
}
