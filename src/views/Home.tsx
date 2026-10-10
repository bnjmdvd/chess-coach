import { useMemo } from 'react';
import { allLessons, unitOfLesson } from '../content';
import { planSession } from '../learn/session';
import { dueCards } from '../state/srs';
import { exportData, lastBackup, streak, todayKey, update, useData } from '../state/store';
import type { Nav } from '../App';

const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);

export function HomeView({ nav }: { nav: Nav }) {
  const data = useData();
  const plan = useMemo(() => planSession(data), [data]);
  const today = data.days.find((d) => d.day === todayKey());
  const doneToday = (today?.sessionsCompleted ?? 0) > 0;
  const inProgress = data.activeSession?.day === todayKey();
  const learned = allLessons.filter((l) => data.lessons[l.id]?.learned).length;
  const mastered = allLessons.filter((l) => data.lessons[l.id]?.mastered).length;
  const due = dueCards(data).length;
  const s = streak(data);
  const isNew = learned === 0 && !inProgress;
  const nextLesson = plan.lessonId ? allLessons.find((l) => l.id === plan.lessonId) : null;
  const backupAge = lastBackup() ? (Date.now() - lastBackup()!) / 86_400_000 : Infinity;
  const showBackup = learned >= 3 && backupAge > 14;

  if (isNew) {
    return (
      <div className="welcome">
        <div className="hero">
          <img src={`${import.meta.env.BASE_URL}pieces/wK.svg`} alt="" className="hero-piece" />
          <div>
            <h1>Learn chess from zero</h1>
            <p className="lead">One short session a day. A patient coach, real practice, and reviews timed to make it stick.</p>
          </div>
        </div>
        <div className="how">
          <div><span className="how-n">1</span><strong>Short daily sessions</strong><p>About 20 minutes: a quick warm-up, one new idea, practice, then a recap.</p></div>
          <div><span className="how-n">2</span><strong>Learn by doing</strong><p>Every concept is followed straight away by hands-on exercises, with hints when you need them.</p></div>
          <div><span className="how-n">3</span><strong>Never forget</strong><p>Spaced repetition brings back each skill right before you'd forget it.</p></div>
        </div>
        <div className="card">
          <strong>How long would you like each session to be?</strong>
          <div className="seg" style={{ marginTop: 8 }}>
            {([10, 20, 30] as const).map((m) => (
              <button key={m} className={data.prefs.sessionMinutes === m ? 'on' : ''} onClick={() => update((d) => { d.prefs.sessionMinutes = m; })}>
                {m} min{m === 20 ? ' (recommended)' : ''}
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="btn primary big" onClick={() => nav('session')}>Start my first session</button>
          </div>
          <p className="muted small">Already know the basics? Go to <button className="link" onClick={() => nav('learn')}>Lessons</button> and use “Test out” to skip ahead.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="card today">
        <div className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        {doneToday && !inProgress ? (
          <>
            <h1>Today's session is done ✓</h1>
            <p>Nice work. Coming back tomorrow will do more for you than cramming now. If you want a bit more:</p>
            <div className="actions">
              <button className="btn" onClick={() => nav('play')}>Play a practice game</button>
              {due > 0 && <button className="btn ghost" onClick={() => nav('review')}>Review {due} due</button>}
              <button className="btn ghost" onClick={() => nav('session')}>Do another session</button>
            </div>
          </>
        ) : (
          <>
            <h1>{inProgress ? 'Pick up where you left off' : plan.catchUp ? 'Catch-up session' : 'Your session for today'}</h1>
            <ul className="plan-mini">
              {plan.reviews.length > 0 && <li>↻ Warm-up: {plan.reviews.length} reviews</li>}
              {nextLesson && <li>♞ {plan.lessonMode === 'retry' ? 'Re-master' : 'New lesson'}: <strong>{nextLesson.title}</strong> <span className="muted">({unitOfLesson.get(nextLesson.id)?.title})</span></li>}
              {plan.practiceCount > 0 && <li>✎ Practice: {plan.practiceCount} exercises</li>}
              {!nextLesson && !plan.catchUp && <li>🎓 You've completed every lesson. Sessions now focus on reviews and practice.</li>}
            </ul>
            <div className="actions">
              <button className="btn primary big" onClick={() => nav('session')}>{inProgress ? 'Resume session' : `Start · ~${plan.estMinutes} min`}</button>
            </div>
          </>
        )}
      </div>

      <div className="stats">
        <div className="stat"><span className="stat-n">🔥 {s}</span><span className="stat-l">day streak</span></div>
        <div className="stat"><span className="stat-n">{mastered}<small>/{allLessons.length}</small></span><span className="stat-l">lessons mastered</span></div>
        <div className="stat"><span className="stat-n">{due}</span><span className="stat-l">reviews due</span></div>
        <div className="stat"><span className="stat-n">{Math.round((today?.seconds ?? 0) / 60)}</span><span className="stat-l">min today</span></div>
      </div>

      {showBackup && (
        <div className="card notice">
          <div>
            <strong>Back up your progress</strong>
            <p className="muted small">Your progress is saved in this browser. A backup file protects it if browser data is ever cleared.</p>
          </div>
          <button className="btn" onClick={exportData}>Download backup</button>
        </div>
      )}
      {isSafari && learned >= 1 && (
        <div className="card notice">
          <div>
            <strong>Tip for Safari</strong>
            <p className="muted small">Safari can clear website data after 7 days without a visit. Choose <em>File → Add to Dock</em> to install Chess Coach as an app and keep your progress safe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
