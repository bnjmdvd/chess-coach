/**
 * Curriculum content schema.
 *
 * Authoring conventions
 * - Squares are lowercase algebraic: "e4".
 * - Moves are SAN as produced by chess.js: "Nf3", "exd5", "O-O", "e8=Q", "Qh7#".
 * - `arrows`: ["e2e4", "g1f3:red"]  (from+to, optional ":color")
 * - `highlights`: ["e4", "d5:red"]   (square, optional ":color")
 *   Colors: green (default) | red | blue | yellow
 * - `text` supports **bold**, *italic*, line breaks ("\n\n" = new paragraph) and
 *   "- " bullet lines. Keep paragraphs short: 1–3 sentences.
 * - Interactive positions ("move", "challenge") must be fully legal FENs (both kings present).
 *   Display-only positions ("explain", "squares", "choice") may omit kings.
 */

export type Color = 'white' | 'black';

export interface Visual {
  /** Position to show. Omit for text-only (an empty board is shown for 'squares'). */
  fen?: string;
  /** Board orientation. Defaults to the side to move in `fen` (white if no fen). */
  orientation?: Color;
  arrows?: string[];
  highlights?: string[];
}

/** Worked example / explanation. Can auto-play a short demo sequence. */
export interface ExplainStep extends Visual {
  type: 'explain';
  title?: string;
  text: string;
  /** Optional demo: SAN moves played from `fen` one at a time with Next/Prev. */
  demo?: { moves: string[]; captions?: string[] };
}

/**
 * Make a move (or sequence) on the board.
 * `solution` alternates learner move, opponent reply, learner move, ...
 * The learner always plays the side to move in `fen`.
 */
export interface MoveStep extends Visual {
  type: 'move';
  fen: string;
  prompt: string;
  solution: string[];
  /**
   * How the learner's move is judged (applies to each learner move):
   * - exact (default): must equal the solution move (or one in `accept`)
   * - mate: any checkmating move is accepted (use for mate-in-1 or the final move)
   * - check / capture / castle / promote: any move with that property
   * - any: any legal move (for "try moving the knight" exercises; pair with `piece`)
   */
  goal?: 'exact' | 'mate' | 'check' | 'capture' | 'castle' | 'promote' | 'any';
  /** Restrict 'any'/'capture'/... goals to moves made by the piece on this square. */
  piece?: string;
  /** Alternative SAN moves accepted for the FIRST learner move. */
  accept?: string[];
  /** Hint ladder: gentle nudge first, more specific later. 1–3 hints. */
  hints?: string[];
  /** Shown after success: WHY it works. */
  explanation: string;
  /** Feedback for specific tempting wrong first moves (SAN -> message). */
  wrong?: Record<string, string>;
  /** True for real tactical puzzles: the validator checks the solution with the engine. */
  puzzle?: boolean;
  /** Theme tag for puzzle banks, e.g. "fork", "mate-in-1". */
  theme?: string;
}

/**
 * Star-collecting mini game for learning how a piece moves (lichess "learn" style).
 * A single white piece moves freely (no turns, no opponent). Visit every star.
 */
export interface StarsStep {
  type: 'stars';
  prompt: string;
  piece: 'R' | 'B' | 'Q' | 'N' | 'K';
  start: string;
  stars: string[];
  /** Squares with black pawns that block (can't be captured, can't be jumped except by knight). */
  blockers?: string[];
  /** Minimum number of moves needed (shown as a target). */
  par?: number;
  explanation?: string;
}

/** Click on square(s). */
export interface SquaresStep extends Visual {
  type: 'squares';
  prompt: string;
  /** Correct squares. */
  answer: string[];
  /** 'one' = click any single correct square; 'all' = find all of them (wrong clicks count as errors). */
  mode: 'one' | 'all';
  hints?: string[];
  explanation: string;
}

export interface ChoiceStep extends Visual {
  type: 'choice';
  prompt: string;
  options: { text: string; correct?: boolean; feedback: string }[];
  explanation?: string;
}

/**
 * Play a position out against the engine (engine plays the other side at full strength).
 * Great for "deliver mate with K+Q vs K" or "promote this pawn".
 */
export interface ChallengeStep {
  type: 'challenge';
  fen: string;
  orientation?: Color;
  prompt: string;
  goal: 'mate' | 'promote' | 'draw' | 'hold';
  /** Max learner moves allowed (mate/promote) or moves to survive (hold/draw). */
  maxMoves?: number;
  hints?: string[];
  explanation: string;
}

export type Step = ExplainStep | MoveStep | StarsStep | SquaresStep | ChoiceStep | ChallengeStep;
export type ExerciseStep = Exclude<Step, ExplainStep>;

export interface Lesson {
  /** Globally unique, kebab-case, stable forever (progress is keyed by it). */
  id: string;
  title: string;
  /** One-sentence learning objective, learner-facing: "You will be able to ..." */
  objective: string;
  /** Estimated minutes for the teaching part. */
  minutes: number;
  /** Teaching sequence: explain -> worked example -> guided practice (faded help). */
  steps: Step[];
  /** 2–4 short takeaways shown in the recap. */
  keyIdeas: string[];
  /** Mastery check (3–6 exercises, no explain steps). Also seeds spaced repetition. */
  checkpoint: ExerciseStep[];
  /** Extra practice pool (more exercises, used in sessions and reviews). */
  practice?: ExerciseStep[];
  /** Optional reflection prompt for the recap (self-explanation). */
  reflect?: string;
}

export interface Unit {
  id: string;
  title: string;
  /** Learner-facing one-liner. */
  description: string;
  lessons: Lesson[];
}
