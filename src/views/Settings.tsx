import { useEffect, useRef, useState } from 'react';
import { exportData, hasSaveError, importData, lastBackup, requestPersistence, resetAll, update, usePrefs, type Prefs } from '../state/store';

export function SettingsView() {
  const prefs = usePrefs();
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [msg, setMsg] = useState('');
  const file = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => update((d) => { d.prefs[k] = v; });

  useEffect(() => { navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null)); }, []);
  const lb = lastBackup();

  return (
    <div className="card narrow settings">
      <h1>Settings</h1>

      <h3>Daily session length</h3>
      <div className="seg">
        {([10, 20, 30] as const).map((m) => (
          <button key={m} className={prefs.sessionMinutes === m ? 'on' : ''} onClick={() => set('sessionMinutes', m)}>{m} min</button>
        ))}
      </div>

      <h3>Board</h3>
      <div className="seg">
        {(['green', 'brown', 'blue'] as const).map((t) => (
          <button key={t} className={prefs.boardTheme === t ? 'on' : ''} onClick={() => set('boardTheme', t)}>
            <span className={`swatch theme-${t}`} /> {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <label className="toggle"><input type="checkbox" checked={prefs.coords} onChange={(e) => set('coords', e.target.checked)} /> Show coordinates (a–h, 1–8) on the board</label>
      <label className="toggle"><input type="checkbox" checked={prefs.sound} onChange={(e) => set('sound', e.target.checked)} /> Sounds</label>

      <h3>Your data</h3>
      <p className="muted small">
        Progress is saved automatically in this browser, and survives closing the tab or restarting your Mac.
        It is lost only if you clear website data, use a private window, or switch browsers, so keep a backup file.
        {lb ? ` Last backup: ${new Date(lb).toLocaleDateString()}.` : ' No backup yet.'}
      </p>
      {hasSaveError() && <p className="notice warn">Saving failed: your browser may be blocking storage (private mode?).</p>}
      <div className="actions">
        <button className="btn" onClick={exportData}>Download backup</button>
        <button className="btn ghost" onClick={() => file.current?.click()}>Restore from backup…</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (!confirm('Replace your current progress with this backup?')) return;
          try { await importData(f); setMsg('Backup restored ✓'); } catch (err) { setMsg((err as Error).message); }
          e.target.value = '';
        }} />
      </div>
      <p className="muted small">
        Storage protection: {persisted ? 'on ✓ (the browser won\'t clear it automatically)' : 'not granted'}{' '}
        {!persisted && <button className="link" onClick={async () => setPersisted(await requestPersistence())}>Request protection</button>}
        <br />On Safari, use <em>File → Add to Dock</em> for the safest storage.
      </p>
      {msg && <p className="notice">{msg}</p>}

      <h3>Start over</h3>
      <button className="btn ghost danger" onClick={() => { if (confirm('Erase ALL progress? Consider downloading a backup first.')) { resetAll(); setMsg('Progress reset.'); } }}>Reset all progress</button>

      <p className="muted small credits">
        Chess engine: Stockfish (GPLv3). Pieces: Colin M.L. Burnett (CC BY-SA 3.0 / GPL). Rules: chess.js.
      </p>
    </div>
  );
}
