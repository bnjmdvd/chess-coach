import { useEffect, useState } from 'react';
import { HomeView } from './views/Home';
import { SessionView } from './views/Session';
import { DrillView, LearnView, LessonView } from './views/Learn';
import { ReviewView } from './views/Review';
import { PlayView } from './views/Play';
import { ProgressView } from './views/Progress';
import { SettingsView } from './views/Settings';
import { logToday, streak, useData } from './state/store';
import { dueCards } from './state/srs';

export type Route = 'home' | 'session' | 'learn' | 'review' | 'play' | 'progress' | 'settings' | `lesson/${string}` | `testout/${string}` | `drill/${string}`;
export type Nav = (r: Route) => void;

const readHash = (): Route => (location.hash.replace(/^#\/?/, '') || 'home') as Route;

/** Count active practice time (tab visible, user on a learning screen). */
function useActiveTime(route: Route) {
  useEffect(() => {
    if (route === 'home' || route === 'settings' || route === 'progress' || route === 'learn') return;
    let lastInput = Date.now();
    const bump = () => { lastInput = Date.now(); };
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    const t = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInput < 120_000) logToday((l) => { l.seconds += 15; });
    }, 15_000);
    return () => { clearInterval(t); window.removeEventListener('pointerdown', bump); window.removeEventListener('keydown', bump); };
  }, [route]);
}

export default function App() {
  const [route, setRoute] = useState<Route>(readHash);
  const data = useData();
  useEffect(() => {
    const on = () => setRoute(readHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useActiveTime(route);
  const nav: Nav = (r) => { location.hash = '/' + r; window.scrollTo(0, 0); };
  const due = dueCards(data).length;
  const focus = route === 'session' || route.startsWith('lesson/') || route.startsWith('testout/') || route.startsWith('drill/') || route === 'review';

  let view;
  if (route === 'session') view = <SessionView nav={nav} />;
  else if (route === 'learn') view = <LearnView nav={nav} />;
  else if (route.startsWith('lesson/')) view = <LessonView key={route} id={route.slice(7)} nav={nav} />;
  else if (route.startsWith('testout/')) view = <LessonView key={route} id={route.slice(8)} nav={nav} testOut />;
  else if (route.startsWith('drill/')) view = <DrillView key={route} id={route.slice(6)} nav={nav} />;
  else if (route === 'review') view = <ReviewView nav={nav} />;
  else if (route === 'play') view = <PlayView nav={nav} />;
  else if (route === 'progress') view = <ProgressView nav={nav} />;
  else if (route === 'settings') view = <SettingsView />;
  else view = <HomeView nav={nav} />;

  const tabs: [Route, string, string][] = [
    ['home', 'Today', '☀'],
    ['learn', 'Lessons', '♞'],
    ['review', 'Review', '↻'],
    ['play', 'Play', '♟'],
    ['progress', 'Progress', '▲'],
    ['settings', 'Settings', '⚙'],
  ];
  return (
    <div className={`app${focus ? ' focus' : ''}`}>
      <header className="topbar">
        <button className="brand" onClick={() => nav('home')}>
          <img src={`${import.meta.env.BASE_URL}pieces/wN.svg`} alt="" /> Chess Coach
        </button>
        <nav className="tabs">
          {tabs.map(([r, label, icon]) => (
            <button key={r} className={route === r || (r === 'learn' && route.startsWith('lesson')) ? 'on' : ''} onClick={() => nav(r)}>
              <span className="tab-icon" aria-hidden>{icon}</span>
              <span className="tab-label">{label}</span>
              {r === 'review' && due > 0 && <span className="badge">{due}</span>}
            </button>
          ))}
        </nav>
        <div className="streak" title="Daily streak">🔥 {streak(data)}</div>
      </header>
      <main className="main">{view}</main>
    </div>
  );
}
