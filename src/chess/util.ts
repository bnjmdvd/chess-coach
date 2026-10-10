import { Chess, type Move } from 'chess.js';

export const FILES = 'abcdefgh';
export const SQUARE_RE = /^[a-h][1-8]$/;

export const isSquare = (s: string) => SQUARE_RE.test(s);
export const fileOf = (sq: string) => FILES.indexOf(sq[0]);
export const rankOf = (sq: string) => Number(sq[1]) - 1;
export const sqAt = (file: number, rank: number) =>
  file >= 0 && file < 8 && rank >= 0 && rank < 8 ? FILES[file] + (rank + 1) : null;
export const isLightSquare = (sq: string) => (fileOf(sq) + rankOf(sq)) % 2 === 1;

export type PieceCode = string; // 'wK', 'bP', ...

/** Parse the placement part of a FEN into a square -> piece map. Tolerates kingless positions. */
export function parseFen(fen: string): Record<string, PieceCode> {
  const out: Record<string, PieceCode> = {};
  const rows = fen.trim().split(/\s+/)[0].split('/');
  if (rows.length !== 8) throw new Error(`Bad FEN (need 8 ranks): ${fen}`);
  rows.forEach((row, i) => {
    const rank = 7 - i;
    let file = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) file += Number(ch);
      else {
        if (!/[prnbqkPRNBQK]/.test(ch)) throw new Error(`Bad FEN char '${ch}': ${fen}`);
        const sq = sqAt(file, rank);
        if (!sq) throw new Error(`Bad FEN (rank overflow): ${fen}`);
        out[sq] = (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase();
        file++;
      }
    }
    if (file !== 8) throw new Error(`Bad FEN (rank ${rank + 1} has ${file} files): ${fen}`);
  });
  return out;
}

export function sideToMove(fen?: string): 'white' | 'black' {
  return fen && fen.trim().split(/\s+/)[1] === 'b' ? 'black' : 'white';
}

/** "e4:red" -> {sq:'e4', color:'red'} */
export function parseMark(s: string): { sq: string; color: string } {
  const [sq, color = 'green'] = s.split(':');
  return { sq, color };
}
/** "e2e4:red" -> {from, to, color} */
export function parseArrow(s: string): { from: string; to: string; color: string } {
  const [m, color = 'green'] = s.split(':');
  return { from: m.slice(0, 2), to: m.slice(2, 4), color };
}

export function tryMove(chess: Chess, san: string): Move | null {
  try {
    return chess.move(san);
  } catch {
    return null;
  }
}

export const PIECE_VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
export const PIECE_NAME: Record<string, string> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
};
