import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../chess/Board';
import { botMove, engine, LEVELS, type EngineLine } from '../chess/engine';
import { PIECE_NAME } from '../chess/util';
import { CLASS_INFO, cctSummary, reviewMove, threatenedPieces, type MoveReview } from '../play/coach';
import { logToday, update, useData, type Prefs } from '../state/store';
import { Rich } from '../ui/Rich';
import { sound } from '../ui/sound';
import type { Nav } from '../App';

const SAVE_KEY = 'chess-coach:game';

interface GameSetup { color: 'white' | 'black'; level: number; coach: Prefs['coach'] }
interface Saved extends GameSetup { pgn: string; reviews: MoveReview[] }

function loadSaved(): Saved | null {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}
function save(s: Saved | null) {
  try { if (s) localStorage.setItem(SAVE_KEY, JSON.stringify(s)); else localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

export function PlayView({ nav }: { nav: Nav }) {
  const [game, setGame] = useState<Saved | null>(loadSaved);
  const [gameId, setGameId] = useState(0);
  if (!game) return <Setup onStart={(s) => { const g = { ...s, pgn: '', reviews: [] }; save(g); setGameId((n) => n + 1); setGame(g); }} nav={nav} />;
  return <Game key={gameId} initial={game} onNew={() => { save(null); setGame(null); }} />;
}

function Setup({ onStart, nav }: { onStart: (s: GameSetup) => void; nav: Nav }) {
  const data = useData();
  const p = data.prefs;
  const rulesDone = !!data.lessons['checkmate']?.learned;
  const recent = data.games.slice(-5).reverse();
  const set = (fn: (p: Prefs) => void) => update((d) => fn(d.prefs));
  return (
    <div className="card narrow">
      <h1>Play against the computer</h1>
      {!rulesDone && (
        <div className="notice warn">
          You haven't finished the rules lessons yet. You can still play: legal moves are shown as dots, and the coach will help. <button className="link" onClick={() => nav('session')}>Or do today's session first.</button>
        </div>
      )}
      <p className="muted">Playing real games is where lessons turn into skill. Start easy: winning a few builds confidence, then move up a level when you're winning most games.</p>
      <h3>Opponent strength</h3>
      <div className="levels">
        {LEVELS.map((L, i) => (
          <button key={i} className={`level ${p.engineLevel === i + 1 ? 'on' : ''}`} onClick={() => set((x) => { x.engineLevel = i + 1; })}>
            <strong>{i + 1}. {L.name}</strong><span className="muted small">{L.elo}</span>
          </button>
        ))}
      </div>
      <h3>Your coach</h3>
      <div className="seg vertical">
        {([
          ['guided', 'Guided', 'Warns you about threats, stops you before mistakes and lets you take moves back. Best for learning.'],
          ['feedback', 'Feedback', 'Comments on each mistake after you make it, but the game goes on.'],
          ['off', 'Silent', 'No help during the game: a full review at the end.'],
        ] as const).map(([k, t, d]) => (
          <button key={k} className={p.coach === k ? 'on' : ''} onClick={() => set((x) => { x.coach = k; })}>
            <strong>{t}</strong> <span className="muted small">{d}</span>
          </button>
        ))}
      </div>
      <h3>Your color</h3>
      <div className="seg">
        {(['white', 'black', 'random'] as const).map((c) => (
          <button key={c} className={p.playColor === c ? 'on' : ''} onClick={() => set((x) => { x.playColor = c; })}>{c[0].toUpperCase() + c.slice(1)}</button>
        ))}
      </div>
      <div className="actions">
        <button className="btn primary big" onClick={() => onStart({
          color: p.playColor === 'random' ? (Math.random() < 0.5 ? 'white' : 'black') : p.playColor,
          level: p.engineLevel, coach: p.coach,
        })}>Start game</button>
      </div>
      {recent.length > 0 && (
        <>
          <h3>Recent games</h3>
          <ul className="games-list">
            {recent.map((g, i) => (
              <li key={i}>
                <span className={`result ${g.result}`}>{g.result === 'win' ? 'Won' : g.result === 'loss' ? 'Lost' : 'Draw'}</span>
                <span>vs {LEVELS[g.level - 1]?.name} as {g.color}</span>
                <span className="muted small">{g.reason} · {g.moves} moves · {g.blunders} blunders</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

type CoachMsg = { kind: 'info' | 'warn' | 'bad' | 'good'; text: string } | null;

function Game({ initial, onNew }: { initial: Saved; onNew: () => void }) {
  const chess = useRef<Chess>(null as unknown as Chess);
  if (!chess.current) {
    chess.current = new Chess();
    if (initial.pgn) try { chess.current.loadPgn(initial.pgn); } catch { /* corrupt save: new game */ }
  }
  const c = chess.current;
  const me = initial.color[0] as 'w' | 'b';
  const [fen, setFen] = useState(c.fen());
  const [reviews, setReviewsState] = useState<MoveReview[]>(initial.reviews);
  const reviewsRef = useRef(initial.reviews);
  const setReviews = (r: MoveReview[]) => { reviewsRef.current = r; setReviewsState(r); };
  const [msg, setMsg] = useState<CoachMsg>(null);
  const [pending, setPending] = useState<MoveReview | null>(null);
  const [thinking, setThinking] = useState(false);
  const [hintArrow, setHintArrow] = useState<string | null>(null);
  const [hintStep, setHintStep] = useState(0);
  const [over, setOver] = useState<{ result: 'win' | 'loss' | 'draw'; reason: string } | null>(null);
  const [viewPly, setViewPly] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const pre = useRef<{ fen: string; p: Promise<EngineLine[]> } | null>(null);
  const alive = useRef(true);
  const coach = initial.coach;
  const level = LEVELS[initial.level - 1];

  useEffect(() => { alive.current = true; return () => { alive.current = false; engine.clear(); }; }, []);

  const persist = (revs = reviewsRef.current) => save({ ...initial, pgn: c.pgn(), reviews: revs });
  const lastMove = (): [string, string] | null => {
    const h = c.history({ verbose: true });
    const m = h[h.length - 1];
    return m ? [m.from, m.to] : null;
  };
  const startPre = () => { pre.current = { fen: c.fen(), p: engine.analyse(c.fen(), { depth: 12 }) }; };

  const checkOver = (revs: MoveReview[]): boolean => {
    if (!c.isGameOver()) return false;
    let result: 'win' | 'loss' | 'draw' = 'draw';
    let reason = 'Draw';
    if (c.isCheckmate()) { result = c.turn() === me ? 'loss' : 'win'; reason = 'Checkmate'; }
    else if (c.isStalemate()) reason = 'Stalemate';
    else if (c.isThreefoldRepetition()) reason = 'Repetition';
    else if (c.isInsufficientMaterial()) reason = 'Insufficient material';
    else reason = '50-move rule';
    finish(result, reason, revs);
    return true;
  };

  const finish = (result: 'win' | 'loss' | 'draw', reason: string, revs: MoveReview[]) => {
    setOver({ result, reason });
    (result === 'win' ? sound.done : sound.bad)();
    update((d) => {
      d.games.push({
        date: Date.now(), color: initial.color, level: initial.level, result, reason, pgn: c.pgn(),
        moves: Math.ceil(c.history().length / 2),
        mistakes: revs.filter((r) => r.cls === 'mistake').length,
        blunders: revs.filter((r) => r.cls === 'blunder').length,
      });
      if (result === 'win' && initial.level === d.prefs.engineLevel) {
        const recent = d.games.filter((g) => g.level === initial.level).slice(-3);
        if (recent.length === 3 && recent.every((g) => g.result === 'win') && d.prefs.engineLevel < LEVELS.length) d.prefs.engineLevel++;
      }
    });
    logToday((l) => { l.games++; });
    save(null);
  };

  const botTurn = async () => {
    setThinking(true);
    const t0 = Date.now();
    const uci = await botMove(c.fen(), initial.level);
    await new Promise((r) => setTimeout(r, Math.max(0, 450 - (Date.now() - t0))));
    if (!alive.current) return;
    const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    (m.captured ? sound.capture : sound.move)();
    setFen(c.fen());
    setThinking(false);
    persist();
    if (checkOver(reviewsRef.current)) return;
    startPre();
    if (coach === 'guided') {
      const danger = threatenedPieces(c.fen(), me);
      if (c.inCheck()) setMsg({ kind: 'warn', text: 'You are in **check**! Move the king, block, or capture the checking piece.' });
      else if (danger.length) {
        const d = danger[0];
        setMsg({ kind: 'warn', text: `Watch out: your ${PIECE_NAME[d.piece]} on **${d.sq}** is ${d.why}.` });
      } else if (m.captured) setMsg({ kind: 'info', text: `Your opponent captured on ${m.to}. Can you capture back? Remember: Checks, Captures, Threats.` });
      else setMsg(null);
    }
  };

  // Start: bot moves first if learner is Black, or resume.
  useEffect(() => {
    if (c.isGameOver()) return;
    if (c.turn() !== me) botTurn(); else startPre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMove = async (from: string, to: string, promotion?: string) => {
    const fenBefore = c.fen();
    let m;
    try { m = c.move({ from, to, promotion: promotion ?? 'q' }); } catch { return; }
    (m.captured ? sound.capture : sound.move)();
    setFen(c.fen());
    setHintArrow(null); setHintStep(0); setMsg(null);
    setThinking(true);
    const before = pre.current?.fen === fenBefore ? (await pre.current.p)[0] : (await engine.analyse(fenBefore, { depth: 12 }))[0];
    const r = await reviewMove(fenBefore, m.san, c.history().length - 1, before);
    if (!alive.current) return;
    const revs = [...reviewsRef.current, r];
    setReviews(revs);
    persist(revs);
    setThinking(false);
    if (checkOver(revs)) return;
    const serious = r.cls === 'mistake' || r.cls === 'blunder';
    if (coach === 'guided' && serious) {
      setPending(r);
      sound.bad();
      return;
    }
    if (coach === 'feedback' && (serious || r.cls === 'inaccuracy')) setMsg({ kind: serious ? 'bad' : 'warn', text: `**${CLASS_INFO[r.cls].label}.** ${r.message}` });
    else if (coach !== 'off' && r.cls === 'best' && (m.captured || m.san.includes('+')) && Math.random() < 0.5) setMsg({ kind: 'good', text: `**${m.san}**: strong move!` });
    botTurn();
  };

  const takeBack = () => {
    c.undo();
    const revs = reviews.slice(0, -1);
    setReviews(revs); persist(revs);
    setFen(c.fen()); setPending(null);
    setMsg({ kind: 'info', text: 'Taken back. Look again: what can your opponent capture or attack after your move?' });
    startPre();
  };
  const keepGoing = () => { setPending(null); botTurn(); };
  const undoPair = () => {
    if (thinking || c.history().length < 2) return;
    c.undo(); if (c.turn() !== me) c.undo();
    const n = c.history().length;
    const revs = reviews.filter((r) => r.ply < n);
    setReviews(revs); persist(revs); setFen(c.fen()); setMsg(null); setHintArrow(null); setHintStep(0);
    startPre();
  };
  const hint = async () => {
    if (hintStep === 0) { setMsg({ kind: 'info', text: `Run your checklist:\n\n${cctSummary(c.fen())}` }); setHintStep(1); return; }
    const lines = pre.current?.fen === c.fen() ? await pre.current.p : await engine.analyse(c.fen(), { depth: 12 });
    if (lines[0]?.pv[0]) { setHintArrow(lines[0].pv[0].slice(0, 4) + ':blue'); setMsg({ kind: 'info', text: 'The blue arrow shows the engine\'s favourite move. Can you see why it\'s good?' }); }
    setHintStep(2);
  };
  const resign = () => { if (confirm('Resign this game?')) finish('loss', 'Resigned', reviewsRef.current); };

  // Post-game navigation.
  const history = useMemo(() => c.history({ verbose: true }), [fen, over]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = useMemo(() => {
    if (viewPly === null) return { fen, last: lastMove(), arrows: hintArrow ? [hintArrow] : [] };
    const r = reviews.find((x) => x.ply === viewPly);
    if (r) {
      const t = new Chess(r.fenBefore);
      const bm = r.bestSan ? t.move(r.bestSan) : null;
      const played = new Chess(r.fenBefore).move(r.san);
      return { fen: r.fenBefore, last: null, arrows: [`${played.from}${played.to}:red`, ...(bm && bm.san !== r.san ? [`${bm.from}${bm.to}:green`] : [])] };
    }
    const h = history[viewPly];
    return { fen: h.after, last: [h.from, h.to] as [string, string], arrows: [] };
  }, [viewPly, fen, reviews, history, hintArrow]); // eslint-disable-line react-hooks/exhaustive-deps

  const dests = useMemo(() => {
    if (over || pending || thinking || viewPly !== null || c.turn() !== me) return undefined;
    const m = new Map<string, string[]>();
    for (const mv of c.moves({ verbose: true })) m.set(mv.from, [...(m.get(mv.from) ?? []), mv.to]);
    return m;
  }, [fen, over, pending, thinking, viewPly]); // eslint-disable-line react-hooks/exhaustive-deps

  const kingSq = (() => {
    if (viewPly !== null || !c.inCheck()) return null;
    for (const row of c.board()) for (const p of row) if (p?.type === 'k' && p.color === c.turn()) return p.square;
    return null;
  })();

  const counts = { inaccuracy: 0, mistake: 0, blunder: 0, best: 0, good: 0 };
  reviews.forEach((r) => counts[r.cls]++);
  const keyMoments = reviews.filter((r) => r.cls === 'mistake' || r.cls === 'blunder');

  return (
    <div className="stage play">
      <div className="stage-board">
        <div className="player-tag"><span className={`dot ${initial.color === 'white' ? 'black' : 'white'}`} /> Computer · {level.name} ({level.elo}) {thinking && c.turn() !== me && <em className="muted"> thinking…</em>}</div>
        <Board
          fen={shown.fen}
          orientation={flipped ? (initial.color === 'white' ? 'black' : 'white') : initial.color}
          dests={dests}
          onMove={onMove}
          lastMove={shown.last}
          checkSquare={kingSq}
          arrows={shown.arrows}
          locked={thinking}
        />
        <div className="player-tag"><span className={`dot ${initial.color}`} /> You · coach: {coach}</div>
      </div>
      <div className="stage-panel">
        {pending && (
          <div className="coach-card bad">
            <strong>Hold on: that's a {CLASS_INFO[pending.cls].label.toLowerCase()}.</strong>
            <Rich text={pending.message} />
            <div className="actions">
              <button className="btn primary" onClick={takeBack} autoFocus>Take it back</button>
              <button className="btn ghost" onClick={keepGoing}>Play it anyway</button>
            </div>
          </div>
        )}
        {!pending && msg && <div className={`coach-card ${msg.kind}`}><Rich text={msg.text} /></div>}
        {over && (
          <div className="coach-card good">
            <h2>{over.result === 'win' ? 'You won! 🎉' : over.result === 'loss' ? 'Game over' : 'Draw'}</h2>
            <p>{over.reason}. {over.result === 'loss' ? 'Every loss is a lesson: look at the key moments below.' : ''}</p>
            <div className="summary-counts">
              <span>{counts.best + counts.good} good</span>
              <span className="c-inacc">{counts.inaccuracy} inaccuracies</span>
              <span className="c-mist">{counts.mistake} mistakes</span>
              <span className="c-blun">{counts.blunder} blunders</span>
            </div>
            {keyMoments.length > 0 && (
              <>
                <strong>Key moments</strong>
                <ul className="moments">
                  {keyMoments.map((r) => (
                    <li key={r.ply}>
                      <button className={`link ${viewPly === r.ply ? 'on' : ''}`} onClick={() => setViewPly(r.ply)}>
                        Move {Math.floor(r.ply / 2) + 1}: {r.san}{CLASS_INFO[r.cls].symbol}
                      </button>
                      {viewPly === r.ply && <Rich text={`${r.message} (red: your move, green: better)`} className="small" />}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="actions">
              <button className="btn primary" onClick={onNew}>New game</button>
              {viewPly !== null && <button className="btn ghost" onClick={() => setViewPly(null)}>Final position</button>}
            </div>
          </div>
        )}
        <MoveList history={history.map((h) => h.san)} reviews={reviews} onPick={over ? setViewPly : undefined} current={viewPly} />
        {!over && (
          <div className="actions">
            {coach !== 'off' && <button className="btn ghost" onClick={hint} disabled={thinking || !!pending || c.turn() !== me}>{hintStep === 0 ? 'Hint' : 'Show best move'}</button>}
            {coach === 'guided' && <button className="btn ghost" onClick={undoPair} disabled={thinking || !!pending || c.history().length < 2}>Take back</button>}
            <button className="btn ghost" onClick={() => setFlipped(!flipped)}>Flip</button>
            <button className="btn ghost danger" onClick={resign}>Resign</button>
          </div>
        )}
        {!over && coach !== 'off' && c.history().length < 2 && !msg && (
          <div className="coach-card info"><Rich text={'Before every move, run your checklist: **Checks, Captures, Threats**. What can you attack, and what is your opponent threatening?'} /></div>
        )}
      </div>
    </div>
  );
}

function MoveList({ history, reviews, onPick, current }: { history: string[]; reviews: MoveReview[]; onPick?: (ply: number) => void; current: number | null }) {
  const byPly = new Map(reviews.map((r) => [r.ply, r]));
  const rows = [];
  for (let i = 0; i < history.length; i += 2) {
    const cell = (ply: number) => {
      if (ply >= history.length) return <span />;
      const r = byPly.get(ply);
      return (
        <button className={`mv ${r ? 'c-' + r.cls : ''} ${current === ply ? 'on' : ''}`} onClick={() => onPick?.(ply)} disabled={!onPick}>
          {history[ply]}{r ? CLASS_INFO[r.cls].symbol : ''}
        </button>
      );
    };
    rows.push(<div className="mv-row" key={i}><span className="mv-n">{i / 2 + 1}.</span>{cell(i)}{cell(i + 1)}</div>);
  }
  return <div className="movelist">{rows.length ? rows : <span className="muted small">No moves yet.</span>}</div>;
}
