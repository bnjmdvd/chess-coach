import type { Chess, Move } from 'chess.js';
import type { MoveStep } from '../content/types';

export type Verdict = 'correct' | 'alternative' | 'wrong';

/**
 * Judge a learner move in a MoveStep.
 * `ply` is the index into step.solution of the move the learner just played
 * (0, 2, 4, ...). `after` is the position after the move.
 * - Non-final learner moves must match the solution exactly.
 * - The final learner move may satisfy the step's goal instead.
 * - On the first move, a move listed in `accept` ends the exercise successfully ('alternative').
 */
export function judgeMove(step: MoveStep, ply: number, move: Move, after: Chess): Verdict {
  const expected = step.solution[ply];
  const isFinal = ply >= step.solution.length - 1 || ply + 2 >= step.solution.length;
  if (step.piece && move.from !== step.piece && ply === 0) return 'wrong';
  if (move.san === expected) return 'correct';
  if (ply === 0 && step.accept?.includes(move.san)) return 'alternative';
  if (!isFinal) return 'wrong';
  switch (step.goal ?? 'exact') {
    case 'mate': return after.isCheckmate() ? 'correct' : 'wrong';
    case 'check': return after.inCheck() ? 'correct' : 'wrong';
    case 'capture': return move.captured ? 'correct' : 'wrong';
    case 'castle': return move.san.startsWith('O-O') ? 'correct' : 'wrong';
    case 'promote': return move.promotion ? 'correct' : 'wrong';
    case 'any': return 'correct';
    default: return 'wrong';
  }
}
