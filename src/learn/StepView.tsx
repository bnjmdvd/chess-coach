import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Chess, type Move } from 'chess.js';
import { Board } from '../chess/Board';
import { judgeMove } from '../chess/judge';
import { freeMoves, minStarMoves } from '../chess/freeMoves';
import { engine, scoreOf, uciToMove } from '../chess/engine';
import { PIECE_NAME, sideToMove } from '../chess/util';
import type {
  ChallengeStep, ChoiceStep, ExplainStep, MoveStep, SquaresStep, StarsStep, Step,
} from '../content/types';
import { Rich, RichInline } from '../ui/Rich';
import { sound } from '../ui/sound';
import { shuffle } from '../state/srs';

export interface StepResult {
  correct: boolean;
  mistakes: number;
  hints: number;
  ms: number;
}

export interface StepProps {
  step: Step;
  /** 'learn' = teaching flow; 'test' = checkpoint/review (no auto hints). */
  mode: 'learn' | 'test';
  onDone: (r: StepResult) => void;
  /** Rendered above the prompt (progress, lesson title...). */
  header?: ReactNode;
  continueLabel?: string;
}

type Feedback = { kind: 'right' | 'wrong' | 'hint' | 'info'; text: string } | null;

const PRAISE = ['Exactly right!', 'Well spotted!', 'Correct!', 'Nice work!', 'That\'s it!', 'Excellent!'];
const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

function kingSquare(chess: Chess): string | null {
  if (!chess.inCheck()) return null;
  const turn = chess.turn();
  for (const row of chess.board()) for (const p of row) if (p && p.type === 'k' && p.color === turn) return p.square;
  return null;
}

function destsOf(chess: Chess, onlyFrom?: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const mv of chess.moves({ verbose: true })) {
    if (onlyFrom && mv.from !== onlyFrom) continue;
    m.set(mv.from, [...(m.get(mv.from) ?? []), mv.to]);
  }
  return m;
}

// ---------------------------------------------------------------- layout

export function Stage({ board, children }: { board: ReactNode; children: ReactNode }) {
  if (!board) return <div className="stage solo"><div className="stage-panel">{children}</div></div>;
  return (
    <div className="stage">
      <div className="stage-board">{board}</div>
      <div className="stage-panel">{children}</div>
    </div>
  );
}

function FeedbackBox({ fb }: { fb: Feedback }) {
  if (!fb) return null;
  const icon = { right: '✓', wrong: '✗', hint: '💡', info: '•' }[fb.kind];
  return (
    <div className={`feedback fb-${fb.kind}`} role="status" aria-live="polite">
      <span className="fb-icon" aria-hidden>{icon}</span>
      <Rich text={fb.text} />
    </div>
  );
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="actions">{children}</div>;
}

function useTimer() {
  const start = useRef(Date.now());
  return () => Date.now() - start.current;
}

// ---------------------------------------------------------------- dispatcher

export function StepView(props: StepProps) {
  const { step } = props;
  switch (step.type) {
    case 'explain': return <ExplainView {...props} step={step} />;
    case 'move': return <MoveView {...props} step={step} />;
    case 'stars': return <StarsView {...props} step={step} />;
    case 'squares': return <SquaresView {...props} step={step} />;
    case 'choice': return <ChoiceView {...props} step={step} />;
    case 'challenge': return <ChallengeView {...props} step={step} />;
  }
}

// ---------------------------------------------------------------- explain

function ExplainView({ step, onDone, header, continueLabel }: StepProps & { step: ExplainStep }) {
  const [i, setI] = useState(0); // demo moves played
  const positions = useMemo(() => {
    if (!step.demo || !step.fen) return null;
    const c = new Chess(step.fen);
    const out: { fen: string; last: [string, string] | null }[] = [{ fen: c.fen(), last: null }];
    for (const san of step.demo.moves) {
      const m = c.move(san);
      out.push({ fen: c.fen(), last: [m.from, m.to] });
    }
    return out;
  }, [step]);
  const fen = positions ? positions[i].fen : step.fen ?? '8/8/8/8/8/8/8/8 w - - 0 1';
  const demoDone = !positions || i === positions.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!positions) return;
      if (e.key === 'ArrowRight') setI((x) => Math.min(positions.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [positions]);

  const go = (n: number) => {
    setI(n);
    if (positions && n > i) {
      const prev = positions[n - 1].fen, next = positions[n].fen;
      (prev.split(' ')[0].replace(/\d/g, '').length > next.split(' ')[0].replace(/\d/g, '').length ? sound.capture : sound.move)();
    }
  };

  return (
    <Stage
      board={
        <Board
          fen={fen}
          orientation={step.orientation ?? sideToMove(step.fen)}
          arrows={i === 0 ? step.arrows : []}
          highlights={i === 0 ? step.highlights : []}
          lastMove={positions?.[i].last}
        />
      }
    >
      {header}
      {step.title && <h2 className="step-title">{step.title}</h2>}
      <Rich text={step.text} />
      {positions && (
        <div className="demo">
          <div className="demo-moves">
            {step.demo!.moves.map((m, k) => (
              <button key={k} className={`demo-move${k + 1 === i ? ' cur' : ''}${k + 1 > i ? ' future' : ''}`} onClick={() => go(k + 1)}>
                {m}
              </button>
            ))}
          </div>
          {i > 0 && step.demo!.captions?.[i - 1] && <div className="demo-caption"><RichInline text={step.demo!.captions[i - 1]} /></div>}
          <div className="demo-nav">
            <button className="btn ghost" disabled={i === 0} onClick={() => go(i - 1)} aria-label="Previous move">◀</button>
            <button className="btn" disabled={demoDone} onClick={() => go(i + 1)}>
              {i === 0 ? '▶ Play the moves' : 'Next move ▶'}
            </button>
          </div>
        </div>
      )}
      <Actions>
        <button className={`btn ${demoDone ? 'primary' : 'ghost'}`} onClick={() => onDone({ correct: true, mistakes: 0, hints: 0, ms: 0 })} autoFocus>
          {continueLabel ?? 'Continue'}
        </button>
      </Actions>
    </Stage>
  );
}

// ---------------------------------------------------------------- move

function MoveView({ step, mode, onDone, header, continueLabel }: StepProps & { step: MoveStep }) {
  const elapsed = useTimer();
  const chess = useRef(new Chess(step.fen));
  const [fen, setFen] = useState(step.fen);
  const [ply, setPly] = useState(0);
  const [last, setLast] = useState<[string, string] | null>(null);
  const [fb, setFb] = useState<Feedback>(null);
  const [locked, setLocked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [flashes, setFlashes] = useState<string[]>([]);
  const learner = sideToMove(step.fen);
  const hints = step.hints ?? [];

  const expected = useMemo(() => {
    const c = new Chess(fen);
    try { return c.move(step.solution[ply]); } catch { return null; }
  }, [fen, ply, step.solution]);

  const finish = (text: string) => {
    setSolved(true);
    setLocked(true);
    sound.good();
    setFb({ kind: 'right', text });
  };

  const onMove = (from: string, to: string, promotion?: string) => {
    const c = chess.current;
    let move: Move;
    try { move = c.move({ from, to, promotion: promotion ?? 'q' }); } catch { return; }
    (move.captured ? sound.capture : sound.move)();
    setFen(c.fen());
    setLast([from, to]);
    const verdict = c.isCheckmate() ? (move.san === step.solution[ply] ? 'correct' : 'alternative') : judgeMove(step, ply, move, c);
    if (verdict === 'wrong') {
      setMistakes((n) => n + 1);
      sound.bad();
      setFlashes([`${to}:bad`]);
      let text = step.wrong?.[move.san] ?? (mode === 'learn' && mistakes >= 1 && hints[0] && hintLevel === 0
        ? `Not quite. Here's a nudge: ${hints[0]}` : 'Not quite. Have another look and try again.');
      if (mode === 'learn' && mistakes >= 1 && hintLevel === 0 && hints.length) setHintLevel(1);
      setFb({ kind: 'wrong', text });
      setLocked(true);
      const after = c.fen();
      const showRefutation = step.puzzle && !step.wrong?.[move.san] && !c.isGameOver();
      const refutation = showRefutation ? engine.analyse(after, { depth: 10 }) : null;
      setTimeout(async () => {
        if (refutation) {
          const [line] = await refutation;
          const probe = new Chess(after);
          const r = line?.pv[0] ? uciToMove(probe, line.pv[0]) : null;
          if (r) {
            const what = r.captured ? ` capturing your ${PIECE_NAME[r.captured]}` : probe.isCheckmate() ? ', and that\'s checkmate' : '';
            text = `${move.san} doesn't work: your opponent answers **${r.san}**${what}. Try again.`;
            setFb({ kind: 'wrong', text });
          }
        }
        c.undo();
        setFen(c.fen());
        setLast(null);
        setFlashes([]);
        setLocked(false);
      }, showRefutation ? 1400 : 1100);
      return;
    }
    setFlashes([`${to}:good`]);
    const nextPly = ply + 1;
    if (verdict === 'alternative' || nextPly >= step.solution.length) {
      finish(`${verdict === 'alternative' && move.san !== step.solution[ply] ? 'That works too! ' : praise() + ' '}${step.explanation}`);
      return;
    }
    // Opponent reply.
    setLocked(true);
    setFb({ kind: 'info', text: `${praise()} Now watch the reply...` });
    setTimeout(() => {
      const reply = c.move(step.solution[nextPly]);
      (reply.captured ? sound.capture : sound.move)();
      setFen(c.fen());
      setLast([reply.from, reply.to]);
      setFlashes([]);
      setPly(nextPly + 1);
      setLocked(false);
      setFb({ kind: 'info', text: `Your opponent played **${reply.san}**. Keep going: what's your next move?` });
    }, 700);
  };

  const onHint = () => {
    const n = hintLevel + 1;
    setHintLevel(n);
    if (n <= hints.length) setFb({ kind: 'hint', text: hints[n - 1] });
    else if (n === hints.length + 1 && expected) setFb({ kind: 'hint', text: `Move the ${PIECE_NAME[expected.piece]} on **${expected.from}**.` });
    else if (expected) { setRevealed(true); setFb({ kind: 'hint', text: `The move is **${expected.san}**. Play it on the board.` }); }
  };

  const hintArrows = expected && revealed ? [`${expected.from}${expected.to}:blue`] : [];
  const hintMarks = expected && hintLevel > hints.length ? [`${expected.from}:blue`] : [];
  const showScaffold = ply === 0 && !last;

  return (
    <Stage
      board={
        <Board
          fen={fen}
          orientation={step.orientation ?? learner}
          dests={solved ? undefined : destsOf(chess.current, step.goal === 'any' ? step.piece : undefined)}
          onMove={onMove}
          locked={locked}
          lastMove={last}
          checkSquare={kingSquare(chess.current)}
          arrows={[...(showScaffold ? step.arrows ?? [] : []), ...hintArrows]}
          highlights={[...(showScaffold ? step.highlights ?? [] : []), ...hintMarks]}
          flashes={flashes}
        />
      }
    >
      {header}
      <div className="to-move"><span className={`dot ${learner}`} /> {learner === 'white' ? 'White' : 'Black'} to move</div>
      <Rich text={step.prompt} className="prompt" />
      <FeedbackBox fb={fb} />
      <Actions>
        {!solved && !revealed && <button className="btn ghost" onClick={onHint} disabled={locked}>{hintLevel > hints.length ? 'Show the move' : 'Hint'}</button>}
        {solved && (
          <button className="btn primary" autoFocus onClick={() => onDone({ correct: !revealed, mistakes, hints: hintLevel, ms: elapsed() })}>
            {continueLabel ?? 'Continue'}
          </button>
        )}
      </Actions>
    </Stage>
  );
}

// ---------------------------------------------------------------- stars

function StarsView({ step, onDone, header, continueLabel }: StepProps & { step: StarsStep }) {
  const elapsed = useTimer();
  const [pos, setPos] = useState(step.start);
  const [left, setLeft] = useState(step.stars);
  const [moves, setMoves] = useState(0);
  const [last, setLast] = useState<[string, string] | null>(null);
  const par = useMemo(() => step.par ?? minStarMoves(step.piece, step.start, step.stars, step.blockers), [step]);
  const done = left.length === 0;

  const fen = useMemo(() => {
    const grid: string[][] = Array.from({ length: 8 }, () => Array(8).fill(''));
    const put = (sq: string, ch: string) => { grid[8 - Number(sq[1])]['abcdefgh'.indexOf(sq[0])] = ch; };
    for (const b of step.blockers ?? []) put(b, 'p');
    put(pos, step.piece);
    const rows = grid.map((r) => {
      let s = '', n = 0;
      for (const c of r) { if (c) { if (n) s += n; n = 0; s += c; } else n++; }
      return s + (n ? n : '');
    });
    return rows.join('/') + ' w - - 0 1';
  }, [pos, step]);

  const dests = useMemo(() => (done ? undefined : new Map([[pos, freeMoves(step.piece, pos, step.blockers)]])), [pos, done, step]);

  const onMove = (from: string, to: string) => {
    setPos(to);
    setLast([from, to]);
    setMoves((m) => m + 1);
    if (left.includes(to)) {
      const rest = left.filter((s) => s !== to);
      setLeft(rest);
      if (rest.length === 0) sound.done(); else sound.good();
    } else sound.move();
  };
  const reset = () => { setPos(step.start); setLeft(step.stars); setMoves(0); setLast(null); };
  const name = PIECE_NAME[step.piece.toLowerCase()];

  return (
    <Stage board={<Board fen={fen} dests={dests} onMove={onMove} stars={left} lastMove={last} />}>
      {header}
      <Rich text={step.prompt} className="prompt" />
      <div className="stars-meta">
        <span>★ {step.stars.length - left.length} / {step.stars.length}</span>
        <span>Moves: {moves}</span>
        <span className="muted">Best possible: {par}</span>
      </div>
      {!done && moves === 0 && <FeedbackBox fb={{ kind: 'info', text: `Drag the ${name}, or click it and then click a square. Dots show where it can go.` }} />}
      {done && (
        <FeedbackBox fb={{
          kind: 'right',
          text: (moves <= par ? `Perfect: ${moves} moves, the minimum possible! ` : `All stars collected in ${moves} moves (the minimum is ${par}). Try again for a perfect score, or move on. `) + (step.explanation ?? ''),
        }} />
      )}
      <Actions>
        <button className="btn ghost" onClick={reset} disabled={moves === 0}>Restart</button>
        {done && (
          <button className="btn primary" autoFocus onClick={() => onDone({ correct: true, mistakes: Math.max(0, moves - par), hints: 0, ms: elapsed() })}>
            {continueLabel ?? 'Continue'}
          </button>
        )}
      </Actions>
    </Stage>
  );
}

// ---------------------------------------------------------------- squares

function SquaresView({ step, mode, onDone, header, continueLabel }: StepProps & { step: SquaresStep }) {
  const elapsed = useTimer();
  const [found, setFound] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [fb, setFb] = useState<Feedback>(null);
  const [flashes, setFlashes] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const done = step.mode === 'one' ? found.length > 0 : found.length === step.answer.length;
  const hints = step.hints ?? [];

  const click = (sq: string) => {
    if (done) return;
    if (step.answer.includes(sq)) {
      if (found.includes(sq)) return;
      const nf = [...found, sq];
      setFound(nf);
      setFlashes([`${sq}:good`]);
      const complete = step.mode === 'one' || nf.length === step.answer.length;
      if (complete) { sound.good(); setFb({ kind: 'right', text: `${praise()} ${step.explanation}` }); }
      else { sound.move(); setFb({ kind: 'info', text: `Yes! ${step.answer.length - nf.length} more to find.` }); }
    } else {
      setMistakes((m) => m + 1);
      sound.bad();
      setFlashes([`${sq}:bad`]);
      const nudge = mode === 'learn' && mistakes >= 1 && hints[0] ? ` Hint: ${hints[0]}` : '';
      setFb({ kind: 'wrong', text: `That's **${sq}**, not the one we're looking for.${nudge}` });
      setTimeout(() => setFlashes([]), 700);
    }
  };

  const onHint = () => {
    const n = hintLevel + 1;
    setHintLevel(n);
    if (n <= hints.length) setFb({ kind: 'hint', text: hints[n - 1] });
    else { setRevealed(true); setFb({ kind: 'hint', text: 'The answer squares are shown in blue. Click them to continue.' }); }
  };

  return (
    <Stage
      board={
        <Board
          fen={step.fen ?? '8/8/8/8/8/8/8/8 w - - 0 1'}
          orientation={step.orientation ?? sideToMove(step.fen)}
          onSquareClick={click}
          arrows={step.arrows}
          highlights={[...(step.highlights ?? []), ...(revealed ? step.answer.filter((s) => !found.includes(s)).map((s) => `${s}:blue`) : [])]}
          selected={found}
          flashes={flashes}
        />
      }
    >
      {header}
      <Rich text={step.prompt} className="prompt" />
      {step.mode === 'all' && !done && <div className="muted small">Find all {step.answer.length}: {found.length} found.</div>}
      <FeedbackBox fb={fb} />
      <Actions>
        {!done && <button className="btn ghost" onClick={onHint}>{hintLevel >= hints.length ? 'Show answer' : 'Hint'}</button>}
        {done && (
          <button className="btn primary" autoFocus onClick={() => onDone({ correct: !revealed, mistakes, hints: hintLevel, ms: elapsed() })}>
            {continueLabel ?? 'Continue'}
          </button>
        )}
      </Actions>
    </Stage>
  );
}

// ---------------------------------------------------------------- choice

function ChoiceView({ step, onDone, header, continueLabel }: StepProps & { step: ChoiceStep }) {
  const elapsed = useTimer();
  const options = useMemo(() => {
    // Keep "all/none of the above"-style options last; shuffle the rest.
    const fixed = step.options.filter((o) => /of the above|it depends|doesn't matter/i.test(o.text));
    return [...shuffle(step.options.filter((o) => !fixed.includes(o))), ...fixed];
  }, [step]);
  const [tried, setTried] = useState<number[]>([]);
  const [fb, setFb] = useState<Feedback>(null);
  const [done, setDone] = useState(false);

  const pick = (i: number) => {
    if (done || tried.includes(i)) return;
    setTried([...tried, i]);
    const o = options[i];
    if (o.correct) {
      sound.good();
      setDone(true);
      setFb({ kind: 'right', text: [o.feedback, step.explanation].filter(Boolean).join('\n\n') });
    } else {
      sound.bad();
      setFb({ kind: 'wrong', text: o.feedback || 'Not quite. Try another answer.' });
    }
  };
  const mistakes = tried.filter((i) => !options[i].correct).length;

  return (
    <Stage
      board={step.fen
        ? <Board fen={step.fen} orientation={step.orientation ?? sideToMove(step.fen)} arrows={step.arrows} highlights={step.highlights} />
        : null}
    >
      {header}
      <Rich text={step.prompt} className="prompt" />
      <div className="choices">
        {options.map((o, i) => {
          const state = tried.includes(i) ? (o.correct ? 'right' : 'wrong') : done ? 'dim' : '';
          return (
            <button key={i} className={`choice ${state}`} onClick={() => pick(i)} disabled={done || tried.includes(i)}>
              <span className="choice-key">{String.fromCharCode(65 + i)}</span>
              <span><RichInline text={o.text} /></span>
            </button>
          );
        })}
      </div>
      <FeedbackBox fb={fb} />
      {done && (
        <Actions>
          <button className="btn primary" autoFocus onClick={() => onDone({ correct: mistakes === 0, mistakes, hints: 0, ms: elapsed() })}>
            {continueLabel ?? 'Continue'}
          </button>
        </Actions>
      )}
    </Stage>
  );
}

// ---------------------------------------------------------------- challenge (vs engine)

function ChallengeView({ step, onDone, header, continueLabel }: StepProps & { step: ChallengeStep }) {
  const elapsed = useTimer();
  const chess = useRef(new Chess(step.fen));
  const [fen, setFen] = useState(step.fen);
  const [last, setLast] = useState<[string, string] | null>(null);
  const [thinking, setThinking] = useState(false);
  const [fb, setFb] = useState<Feedback>(null);
  const [status, setStatus] = useState<'playing' | 'won' | 'failed'>('playing');
  const [mistakes, setMistakes] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [arrow, setArrow] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const learner = sideToMove(step.fen);
  const lc = learner[0];
  const hints = step.hints ?? [];
  const max = step.maxMoves;
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; engine.clear(); }; }, []);

  const fail = (text: string) => { setStatus('failed'); sound.bad(); setMistakes((m) => m + 1); setFb({ kind: 'wrong', text }); };
  const win = (text: string) => { setStatus('won'); sound.done(); setFb({ kind: 'right', text: `${text} ${step.explanation}` }); };

  const onMove = async (from: string, to: string, promotion?: string) => {
    const c = chess.current;
    let move: Move;
    try { move = c.move({ from, to, promotion: promotion ?? 'q' }); } catch { return; }
    (move.captured ? sound.capture : sound.move)();
    setArrow(null);
    setFen(c.fen()); setLast([from, to]);
    const n = count + 1;
    setCount(n);
    if (c.isCheckmate()) return win('Checkmate!');
    if (step.goal === 'promote' && move.promotion) return win('Promoted!');
    if (c.isStalemate()) return step.goal === 'draw' || step.goal === 'hold' ? win('Stalemate: that\'s a draw.') : fail('**Stalemate!** The king has no legal move but is not in check, so the game is a draw. Leave the king a square to move to.');
    if (c.isDraw()) return step.goal === 'draw' || step.goal === 'hold' ? win('The game is drawn.') : fail('The game ended in a draw. Try again.');
    if ((step.goal === 'mate' || step.goal === 'promote') && max && n >= max) return fail(`You've used all ${max} moves. Try again: think about the method from the lesson.`);

    setThinking(true);
    const [best] = await engine.analyse(c.fen(), { depth: 14 });
    if (!alive.current) return;
    setThinking(false);
    // Engine's view (side to move = defender/attacker). For hold goals: did the learner's move lose?
    if ((step.goal === 'hold' || step.goal === 'draw') && best && scoreOf(best) > 450) {
      return fail('That move lets your opponent win. Try again and remember the defensive method.');
    }
    // Promotion races: fail only once the win is gone (engine sees a draw or better for itself).
    if (step.goal === 'promote' && best && scoreOf(best) > -50) {
      return fail('Your opponent can now stop the pawn (or win). Try again.');
    }
    const reply = best?.pv[0] ? uciToMove(c, best.pv[0]) : null;
    if (!reply) return;
    (reply.captured ? sound.capture : sound.move)();
    setFen(c.fen()); setLast([reply.from, reply.to]);
    if (c.isCheckmate()) return fail('You got checkmated. Try again!');
    if (c.isStalemate() || c.isDraw()) return step.goal === 'draw' || step.goal === 'hold' ? win('Draw secured.') : fail('The game is a draw. Try again.');
    if (reply.captured && step.goal !== 'hold' && step.goal !== 'draw' && (reply.captured === 'q' || reply.captured === 'r' || reply.captured === 'p')) {
      const piecesLeft = c.board().flat().filter((p) => p && p.color === lc && p.type !== 'k').length;
      if (piecesLeft === 0) return fail(`Your opponent captured your ${PIECE_NAME[reply.captured]}. Now there's nothing left to win with. Keep your pieces protected!`);
    }
    if ((step.goal === 'hold' || step.goal === 'draw') && max && n >= max) return win(`You held for ${max} moves!`);
  };

  const reset = () => {
    chess.current = new Chess(step.fen);
    setFen(step.fen); setLast(null); setStatus('playing'); setCount(0); setArrow(null);
    setFb({ kind: 'info', text: 'Position reset. You can do it!' });
  };
  const undo = () => {
    const c = chess.current;
    if (c.history().length < 2) return;
    c.undo(); c.undo();
    setFen(c.fen()); setLast(null); setCount((x) => Math.max(0, x - 1)); setMistakes((m) => m + 1); setArrow(null);
  };
  const onHint = async () => {
    const n = hintLevel + 1;
    setHintLevel(n);
    if (n <= hints.length) { setFb({ kind: 'hint', text: hints[n - 1] }); return; }
    const [best] = await engine.analyse(chess.current.fen(), { depth: 16 });
    if (best?.pv[0]) { setArrow(best.pv[0].slice(0, 4) + ':blue'); setFb({ kind: 'hint', text: 'The blue arrow shows a strong move.' }); }
  };

  const goalText = {
    mate: `Checkmate your opponent${max ? ` within ${max} moves` : ''}.`,
    promote: `Promote your pawn${max ? ` within ${max} moves` : ''}.`,
    draw: 'Hold the draw.',
    hold: `Don't lose${max ? ` for ${max} moves` : ''}.`,
  }[step.goal];

  return (
    <Stage
      board={
        <Board
          fen={fen}
          orientation={step.orientation ?? learner}
          dests={status === 'playing' && !thinking ? destsOf(chess.current) : undefined}
          onMove={onMove}
          locked={thinking}
          lastMove={last}
          checkSquare={kingSquare(chess.current)}
          arrows={arrow ? [arrow] : []}
        />
      }
    >
      {header}
      <div className="to-move"><span className={`dot ${learner}`} /> You play {learner === 'white' ? 'White' : 'Black'} vs the computer</div>
      <Rich text={step.prompt} className="prompt" />
      <div className="stars-meta">
        <span>Goal: {goalText}</span>
        {max && <span>Moves: {count}{step.goal === 'mate' || step.goal === 'promote' ? ` / ${max}` : ''}</span>}
      </div>
      {thinking && <div className="muted small">Computer is thinking…</div>}
      <FeedbackBox fb={fb} />
      <Actions>
        {status === 'playing' && <button className="btn ghost" onClick={onHint} disabled={thinking}>Hint</button>}
        {status === 'playing' && <button className="btn ghost" onClick={undo} disabled={thinking || chess.current.history().length < 2}>Take back</button>}
        {status !== 'won' && <button className="btn ghost" onClick={reset} disabled={thinking}>Restart</button>}
        {status === 'won' && (
          <button className="btn primary" autoFocus onClick={() => onDone({ correct: true, mistakes, hints: hintLevel, ms: elapsed() })}>
            {continueLabel ?? 'Continue'}
          </button>
        )}
        {status === 'failed' && mistakes >= 3 && (
          <button className="btn ghost" onClick={() => onDone({ correct: false, mistakes, hints: hintLevel, ms: elapsed() })}>Skip for now</button>
        )}
      </Actions>
    </Stage>
  );
}
