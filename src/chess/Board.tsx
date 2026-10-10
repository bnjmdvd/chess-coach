import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FILES, fileOf, isLightSquare, parseArrow, parseFen, parseMark, rankOf, sqAt } from './util';
import { usePrefs } from '../state/store';

export interface BoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  /** Legal destinations per origin square. If set, the user can move pieces. */
  dests?: Map<string, string[]>;
  onMove?: (from: string, to: string, promotion?: string) => void;
  onSquareClick?: (sq: string) => void;
  highlights?: string[];
  arrows?: string[];
  lastMove?: [string, string] | null;
  checkSquare?: string | null;
  stars?: string[];
  /** Transient marks like ["e4:good", "d5:bad"]. */
  flashes?: string[];
  /** Squares that are part of the answer selection (squares steps). */
  selected?: string[];
  /** Disable interaction temporarily (e.g. while the opponent "thinks"). */
  locked?: boolean;
}

const MARK_COLORS: Record<string, string> = {
  green: 'var(--mark-green)', red: 'var(--mark-red)', blue: 'var(--mark-blue)', yellow: 'var(--mark-yellow)',
};
const ARROW_COLORS: Record<string, string> = {
  green: '#15781b', red: '#c0392b', blue: '#1f5fbf', yellow: '#d4a017',
};

export function Board(props: BoardProps) {
  const { fen, orientation = 'white', dests, onMove, onSquareClick, locked } = props;
  const prefs = usePrefs();
  const pieces = useMemo(() => parseFen(fen), [fen]);
  const [sel, setSel] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ from: string; x: number; y: number; piece: string } | null>(null);
  const [promo, setPromo] = useState<{ from: string; to: string; color: 'w' | 'b' } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  useEffect(() => { setSel(null); setPromo(null); }, [fen]);

  const flip = orientation === 'black';
  const toXY = (sq: string) => {
    const f = fileOf(sq), r = rankOf(sq);
    return flip ? { x: 7 - f, y: r } : { x: f, y: 7 - r };
  };
  const sqFromPoint = useCallback((cx: number, cy: number): string | null => {
    const el = ref.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = Math.floor(((cx - rect.left) / rect.width) * 8);
    const y = Math.floor(((cy - rect.top) / rect.height) * 8);
    if (x < 0 || x > 7 || y < 0 || y > 7) return null;
    return flip ? sqAt(7 - x, y) : sqAt(x, 7 - y);
  }, [flip]);

  const canMoveFrom = (sq: string) => !locked && !!dests?.get(sq)?.length;
  const targets = sel && dests ? dests.get(sel) ?? [] : [];

  const tryMove = (from: string, to: string) => {
    if (!dests?.get(from)?.includes(to)) return false;
    const p = pieces[from];
    if (p && p[1] === 'P' && (rankOf(to) === 7 || rankOf(to) === 0)) {
      setPromo({ from, to, color: p[0] as 'w' | 'b' });
    } else {
      onMove?.(from, to);
    }
    setSel(null);
    return true;
  };

  const handleSquare = (sq: string) => {
    if (locked) return;
    if (onSquareClick) onSquareClick(sq);
    if (!dests) return;
    if (sel && sel !== sq && tryMove(sel, sq)) return;
    if (canMoveFrom(sq)) setSel(sel === sq ? null : sq);
    else setSel(null);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (locked || promo) return;
    const sq = sqFromPoint(e.clientX, e.clientY);
    if (!sq) return;
    if (dests && canMoveFrom(sq)) {
      e.preventDefault();
      (e.target as Element).setPointerCapture?.(e.pointerId);
      dragStart.current = { x: e.clientX, y: e.clientY, moved: false };
      setDrag({ from: sq, x: e.clientX, y: e.clientY, piece: pieces[sq] });
      if (sel && sel !== sq && tryMove(sel, sq)) { setDrag(null); dragStart.current = null; return; }
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag || !dragStart.current) return;
    if (Math.hypot(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y) > 4) dragStart.current.moved = true;
    setDrag({ ...drag, x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const sq = sqFromPoint(e.clientX, e.clientY);
    if (drag && dragStart.current?.moved) {
      if (!(sq && tryMove(drag.from, sq))) setSel(null);
    } else if (sq) {
      handleSquare(sq);
    }
    setDrag(null);
    dragStart.current = null;
  };

  const marks = useMemo(() => {
    const m: Record<string, string> = {};
    for (const h of props.highlights ?? []) { const { sq, color } = parseMark(h); m[sq] = MARK_COLORS[color] ?? MARK_COLORS.green; }
    return m;
  }, [props.highlights]);
  const flashes = useMemo(() => {
    const m: Record<string, string> = {};
    for (const f of props.flashes ?? []) { const [sq, kind] = f.split(':'); m[sq] = kind; }
    return m;
  }, [props.flashes]);

  const squares: React.ReactNode[] = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const sq = flip ? sqAt(7 - x, y)! : sqAt(x, 7 - y)!;
      const light = isLightSquare(sq);
      const isLast = props.lastMove && (props.lastMove[0] === sq || props.lastMove[1] === sq);
      const cls = ['sq', light ? 'light' : 'dark'];
      if (isLast) cls.push('last');
      if (sel === sq) cls.push('sel');
      if (props.selected?.includes(sq)) cls.push('picked');
      if (flashes[sq]) cls.push('flash-' + flashes[sq]);
      if (props.checkSquare === sq) cls.push('check');
      squares.push(
        <div key={sq} className={cls.join(' ')} style={{ left: `${x * 12.5}%`, top: `${y * 12.5}%` }} data-square={sq}>
          {marks[sq] && <div className="mark" style={{ background: marks[sq] }} />}
          {prefs.coords && x === 0 && <span className="coord rank">{sq[1]}</span>}
          {prefs.coords && y === 7 && <span className="coord file">{sq[0]}</span>}
          {targets.includes(sq) && <div className={pieces[sq] ? 'target capture' : 'target'} />}
          {props.stars?.includes(sq) && <div className="star">★</div>}
        </div>,
      );
    }
  }

  // Slide animation for the last move's piece.
  const anim = props.lastMove ? (() => {
    const a = toXY(props.lastMove[0]), b = toXY(props.lastMove[1]);
    return { sq: props.lastMove[1], dx: (a.x - b.x) * 100, dy: (a.y - b.y) * 100 };
  })() : null;

  const rect = ref.current?.getBoundingClientRect();
  return (
    <div className="board-wrap">
      <div
        className={`board theme-${prefs.boardTheme}${locked ? ' locked' : ''}`}
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onContextMenu={(e) => e.preventDefault()}
        role="grid"
        aria-label="Chessboard"
        data-fen={fen}
      >
        {squares}
        {Object.entries(pieces).map(([sq, p]) => {
          const { x, y } = toXY(sq);
          const dragging = drag?.from === sq && dragStart.current?.moved;
          const animate = anim && anim.sq === sq;
          return (
            <img
              key={sq + p + (animate ? fen : '')}
              src={`${import.meta.env.BASE_URL}pieces/${p}.svg`}
              alt={p}
              draggable={false}
              className={`piece${animate ? ' slide' : ''}${canMoveFrom(sq) ? ' movable' : ''}`}
              style={{
                left: `${x * 12.5}%`, top: `${y * 12.5}%`, opacity: dragging ? 0.25 : 1,
                ...(animate ? ({ '--dx': `${anim.dx}%`, '--dy': `${anim.dy}%` } as React.CSSProperties) : {}),
              }}
            />
          );
        })}
        <svg className="arrows" viewBox="0 0 8 8">
          <defs>
            {Object.entries(ARROW_COLORS).map(([name, c]) => (
              <marker key={name} id={`ah-${name}`} markerWidth="4" markerHeight="4" refX="2.05" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill={c} />
              </marker>
            ))}
          </defs>
          {(props.arrows ?? []).map((a, i) => {
            const { from, to, color } = parseArrow(a);
            const p = toXY(from), q = toXY(to);
            const x1 = p.x + 0.5, y1 = p.y + 0.5, x2 = q.x + 0.5, y2 = q.y + 0.5;
            const len = Math.hypot(x2 - x1, y2 - y1) || 1;
            const shorten = 0.35;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2 - ((x2 - x1) / len) * shorten} y2={y2 - ((y2 - y1) / len) * shorten}
                stroke={ARROW_COLORS[color] ?? ARROW_COLORS.green} strokeWidth="0.16" strokeLinecap="round"
                opacity="0.8" markerEnd={`url(#ah-${ARROW_COLORS[color] ? color : 'green'})`} />
            );
          })}
        </svg>
        {promo && (
          <div className="promo" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
            <div className="promo-box">
              <div className="promo-title">Promote to:</div>
              {['q', 'r', 'b', 'n'].map((t) => (
                <button key={t} onClick={() => { onMove?.(promo.from, promo.to, t); setPromo(null); }}>
                  <img src={`${import.meta.env.BASE_URL}pieces/${promo.color}${t.toUpperCase()}.svg`} alt={t} />
                </button>
              ))}
              <button className="promo-cancel" onClick={() => setPromo(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
      {drag && dragStart.current?.moved && rect && (
        <img
          className="drag-piece"
          src={`${import.meta.env.BASE_URL}pieces/${drag.piece}.svg`}
          alt=""
          style={{ width: rect.width / 8, height: rect.width / 8, left: drag.x - rect.width / 16, top: drag.y - rect.width / 16 }}
        />
      )}
    </div>
  );
}

export { FILES };
