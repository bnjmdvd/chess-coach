import { Chess, type Color, type Square } from 'chess.js';
import { engine, scoreOf, uciToMove, type EngineLine } from '../chess/engine';
import { PIECE_NAME, PIECE_VALUE } from '../chess/util';

export type MoveClass = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export interface MoveReview {
  ply: number;          // index in history (0-based)
  san: string;
  cls: MoveClass;
  /** Drop in winning chances (0..100). */
  drop: number;
  bestSan: string | null;
  message: string;
  fenBefore: string;
}

/** Winning chances 0..100 for the side whose score this is (lichess formula). */
export function winPct(l: { cp: number | null; mate: number | null } | undefined): number {
  if (!l) return 50;
  if (l.mate != null) return l.mate > 0 ? 100 : 0;
  const cp = Math.max(-1500, Math.min(1500, l.cp ?? 0));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

export const CLASS_INFO: Record<MoveClass, { label: string; symbol: string }> = {
  best: { label: 'Best move', symbol: '' },
  good: { label: 'Good move', symbol: '' },
  inaccuracy: { label: 'Inaccuracy', symbol: '?!' },
  mistake: { label: 'Mistake', symbol: '?' },
  blunder: { label: 'Blunder', symbol: '??' },
};

interface LineInfo { san: string; mate: number | null; captured: string | null; to: string; check: boolean }

function describeLine(fen: string, line: EngineLine | undefined): LineInfo | null {
  if (!line?.pv[0]) return null;
  const c = new Chess(fen);
  const m = uciToMove(c, line.pv[0]);
  if (!m) return null;
  return { san: m.san, mate: line.mate != null && line.mate > 0 ? line.mate : null, captured: m.captured ?? null, to: m.to, check: c.inCheck() };
}

/**
 * Review a move just played. `before` is the engine line for the position before the move
 * (mover's perspective); the position after is analysed here.
 */
export async function reviewMove(fenBefore: string, san: string, ply: number, before: EngineLine | undefined): Promise<MoveReview> {
  const c = new Chess(fenBefore);
  const mv = c.move(san);
  const fenAfter = c.fen();
  const best = describeLine(fenBefore, before);
  if (c.isCheckmate()) {
    return { ply, san, cls: 'best', drop: 0, bestSan: best?.san ?? null, message: 'Checkmate!', fenBefore };
  }
  if (c.isDraw() || c.isStalemate()) {
    const wp = winPct(before);
    const cls: MoveClass = wp > 80 ? 'blunder' : wp > 65 ? 'mistake' : 'good';
    return { ply, san, cls, drop: Math.max(0, wp - 50), bestSan: best?.san ?? null,
      message: cls === 'good' ? 'The game is drawn.' : `That ends the game in a draw${c.isStalemate() ? ' by **stalemate**' : ''}, but you were winning! ${best ? `**${best.san}** was better.` : ''}`, fenBefore };
  }
  const [after] = await engine.analyse(fenAfter, { depth: 12 });
  const wBefore = winPct(before);
  const wAfter = 100 - winPct(after);
  const drop = Math.max(0, wBefore - wAfter);
  const isBest = before?.pv[0] === mv.lan;
  const cls: MoveClass = isBest ? 'best' : drop >= 15 ? 'blunder' : drop >= 10 ? 'mistake' : drop >= 5 ? 'inaccuracy' : 'good';

  let message = '';
  if (cls === 'mistake' || cls === 'blunder' || cls === 'inaccuracy') {
    const reply = describeLine(fenAfter, after);
    const parts: string[] = [];
    if (reply?.mate) {
      parts.push(reply.mate === 1 ? `This allows checkmate: **${reply.san}** is mate!` : `This allows a forced checkmate starting with **${reply.san}**.`);
    } else if (reply?.captured) {
      parts.push(`Now your opponent can play **${reply.san}**, capturing your ${PIECE_NAME[reply.captured]} on ${reply.to}.`);
    } else if (reply) {
      parts.push(`Your opponent's best answer is **${reply.san}**${reply.check ? ' (with check)' : ''}, and your position gets worse.`);
    }
    if (best && best.san !== san) {
      if (best.mate) parts.push(best.mate === 1 ? `You had checkmate with **${best.san}**!` : `You missed a forced checkmate starting with **${best.san}**.`);
      else if (best.captured && !reply?.captured) parts.push(`You missed **${best.san}**, which wins material by capturing the ${PIECE_NAME[best.captured]} on ${best.to}.`);
      else parts.push(`A better move was **${best.san}**.`);
    }
    message = parts.join(' ');
  } else if (cls === 'best') message = 'Best move!';
  return { ply, san, cls, drop, bestSan: best?.san ?? null, message, fenBefore };
}

/** Pieces of `color` that are attacked and either undefended or attacked by something cheaper. */
export function threatenedPieces(fen: string, color: Color): { sq: Square; piece: string; why: string }[] {
  const c = new Chess(fen);
  const them: Color = color === 'w' ? 'b' : 'w';
  const out: { sq: Square; piece: string; why: string }[] = [];
  for (const row of c.board()) {
    for (const p of row) {
      if (!p || p.color !== color || p.type === 'k') continue;
      const attackers = c.attackers(p.square, them);
      if (!attackers.length) continue;
      const defenders = c.attackers(p.square, color);
      const cheapest = Math.min(...attackers.map((s) => PIECE_VALUE[c.get(s)!.type]));
      if (!defenders.length) out.push({ sq: p.square, piece: p.type, why: 'attacked and not defended' });
      else if (cheapest < PIECE_VALUE[p.type]) out.push({ sq: p.square, piece: p.type, why: `attacked by a cheaper piece` });
    }
  }
  return out.sort((a, b) => PIECE_VALUE[b.piece] - PIECE_VALUE[a.piece]);
}

/** Checks / Captures / Threats summary for the side to move, used as the first hint. */
export function cctSummary(fen: string): string {
  const c = new Chess(fen);
  const moves = c.moves({ verbose: true });
  const checks = moves.filter((m) => m.san.includes('+') || m.san.includes('#'));
  const captures = moves.filter((m) => m.captured);
  const me = c.turn();
  const danger = threatenedPieces(fen, me);
  const lines = [
    `**Checks:** ${checks.length ? checks.slice(0, 4).map((m) => m.san).join(', ') : 'none'}`,
    `**Captures:** ${captures.length ? captures.slice(0, 5).map((m) => m.san).join(', ') : 'none'}`,
    `**Threats against you:** ${danger.length ? danger.slice(0, 2).map((d) => `your ${PIECE_NAME[d.piece]} on ${d.sq} is ${d.why}`).join('; ') : 'nothing urgent'}`,
  ];
  return lines.map((l) => `- ${l}`).join('\n');
}

export { scoreOf };
