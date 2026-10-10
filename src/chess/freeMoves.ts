import { fileOf, rankOf, sqAt } from './util';

const DIRS: Record<string, [number, number][]> = {
  R: [[1, 0], [-1, 0], [0, 1], [0, -1]],
  B: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
  Q: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
};
const JUMPS: Record<string, [number, number][]> = {
  N: [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]],
  K: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
};

/** Destinations for a lone piece on an otherwise empty board with blocking squares. */
export function freeMoves(piece: string, from: string, blockers: string[] = []): string[] {
  const f = fileOf(from), r = rankOf(from);
  const out: string[] = [];
  const blocked = new Set(blockers);
  if (JUMPS[piece]) {
    for (const [df, dr] of JUMPS[piece]) {
      const s = sqAt(f + df, r + dr);
      if (s && !blocked.has(s)) out.push(s);
    }
    return out;
  }
  for (const [df, dr] of DIRS[piece] ?? []) {
    for (let i = 1; i < 8; i++) {
      const s = sqAt(f + df * i, r + dr * i);
      if (!s || blocked.has(s)) break;
      out.push(s);
    }
  }
  return out;
}

/** Minimum number of moves to visit all stars (any order). Returns Infinity if impossible. */
export function minStarMoves(piece: string, start: string, stars: string[], blockers: string[] = []): number {
  const idx = new Map(stars.map((s, i) => [s, i]));
  const full = (1 << stars.length) - 1;
  const startMask = idx.has(start) ? 1 << idx.get(start)! : 0;
  const seen = new Set<string>([`${start}|${startMask}`]);
  let frontier: [string, number][] = [[start, startMask]];
  for (let d = 0; frontier.length; d++) {
    const next: [string, number][] = [];
    for (const [sq, mask] of frontier) {
      if (mask === full) return d;
      for (const t of freeMoves(piece, sq, blockers)) {
        const m = idx.has(t) ? mask | (1 << idx.get(t)!) : mask;
        const k = `${t}|${m}`;
        if (!seen.has(k)) { seen.add(k); next.push([t, m]); }
      }
    }
    frontier = next;
  }
  return Infinity;
}
