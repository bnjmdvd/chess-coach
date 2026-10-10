import { allLessons, curriculum, lessonById } from '../content';
import { lessonStrength } from '../state/srs';
import { streak, todayKey, useData } from '../state/store';
import { LEVELS } from '../chess/engine';
import type { Nav } from '../App';

export function ProgressView({ nav }: { nav: Nav }) {
  const data = useData();
  const totalMin = Math.round(data.days.reduce((s, d) => s + d.seconds, 0) / 60);
  const reviews = data.days.reduce((s, d) => s + d.reviews, 0);
  const correct = data.days.reduce((s, d) => s + d.correct, 0);
  const mastered = allLessons.filter((l) => data.lessons[l.id]?.mastered).length;
  const learned = allLessons.filter((l) => data.lessons[l.id]?.learned).length;
  const wins = data.games.filter((g) => g.result === 'win').length;

  // Last 28 days activity heatmap.
  const days = Array.from({ length: 28 }, (_, k) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - k));
    const log = data.days.find((x) => x.day === todayKey(d));
    return { d, min: Math.round((log?.seconds ?? 0) / 60), done: (log?.sessionsCompleted ?? 0) > 0 };
  });

  return (
    <div className="progress-view">
      <h1>Your progress</h1>
      <div className="stats">
        <div className="stat"><span className="stat-n">🔥 {streak(data)}</span><span className="stat-l">day streak</span></div>
        <div className="stat"><span className="stat-n">{mastered}<small>/{allLessons.length}</small></span><span className="stat-l">lessons mastered ({learned} done)</span></div>
        <div className="stat"><span className="stat-n">{totalMin}</span><span className="stat-l">minutes practised</span></div>
        <div className="stat"><span className="stat-n">{reviews ? Math.round((correct / reviews) * 100) : 0}%</span><span className="stat-l">recall rate ({reviews} answers)</span></div>
      </div>

      <div className="card">
        <h3>Last 4 weeks</h3>
        <div className="heat">
          {days.map(({ d, min, done }, k) => (
            <div key={k} className={`heat-cell ${done ? 'done' : min > 0 ? 'some' : ''}`} title={`${d.toLocaleDateString()}: ${min} min${done ? ', session completed' : ''}`} />
          ))}
        </div>
        <p className="muted small">Filled = daily session completed. Consistency matters more than volume.</p>
      </div>

      <div className="card">
        <h3>Skills</h3>
        <p className="muted small">Memory strength combines your checkpoint scores with how well your reviews are holding up over time.</p>
        <div className="skills">
          {curriculum.map((u) => {
            const ls = u.lessons;
            const s = ls.length ? ls.reduce((a, l) => a + lessonStrength(data, l), 0) / ls.length : 0;
            return (
              <div key={u.id} className="skill-row">
                <span>{u.title}</span>
                <span className="strength wide"><span style={{ width: `${s * 100}%` }} /></span>
                <span className="muted small">{Math.round(s * 100)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3>Games</h3>
        {data.games.length === 0 ? (
          <p className="muted">No games yet. <button className="link" onClick={() => nav('play')}>Play your first game</button></p>
        ) : (
          <>
            <p>{data.games.length} games · {wins} wins · current level: <strong>{LEVELS[data.prefs.engineLevel - 1]?.name}</strong></p>
            <p className="muted small">Blunders per game (last 10): {data.games.slice(-10).map((g) => g.blunders).join(' · ')}. The goal is to watch this number shrink.</p>
          </>
        )}
      </div>

      {data.journal.length > 0 && (
        <div className="card">
          <h3>Your notes</h3>
          <ul className="journal">
            {data.journal.slice().reverse().slice(0, 12).map((j, k) => (
              <li key={k}>
                <span className="muted small">{new Date(j.date).toLocaleDateString()} · {lessonById.get(j.lessonId)?.title}</span>
                <em className="small">{j.prompt}</em>
                <p>{j.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
