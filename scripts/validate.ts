/**
 * Content validator: checks every lesson for legal positions, legal solutions,
 * well-formed marks, star-game feasibility, and (with the engine) puzzle soundness.
 *
 *   npx tsx scripts/validate.ts                 # everything, with engine
 *   npx tsx scripts/validate.ts --unit tactics  # one unit
 *   npx tsx scripts/validate.ts --no-engine     # fast structural checks only
 */
import { createRequire } from 'node:module';
import { Chess } from 'chess.js';
import { curriculum } from '../src/content/index';
import type { Lesson, MoveStep, Step } from '../src/content/types';
import { isSquare, parseArrow, parseFen, parseMark, tryMove } from '../src/chess/util';
import { minStarMoves } from '../src/chess/freeMoves';
import { judgeMove } from '../src/chess/judge';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const onlyUnit = args.includes('--unit') ? args[args.indexOf('--unit') + 1] : null;
const useEngine = !args.includes('--no-engine');
const engine = useEngine ? require('./engine-node.cjs').createEngine() : null;

let errors = 0;
let warnings = 0;
const err = (where: string, msg: string) => { errors++; console.log(`  ✗ ERROR ${where}: ${msg}`); };
const warn = (where: string, msg: string) => { warnings++; console.log(`  ⚠ warn  ${where}: ${msg}`); };

type Line = { move: string; cp: number | null; mate: number | null };
const score = (l: Line) => (l.mate != null ? (l.mate > 0 ? 100000 - l.mate : -100000 - l.mate) : l.cp!);
const fmt = (l: Line) => (l.mate != null ? `#${l.mate}` : `${l.cp}cp`);

function legalChess(fen: string, where: string): Chess | null {
  try {
    return new Chess(fen);
  } catch (e) {
    err(where, `illegal FEN "${fen}": ${(e as Error).message}`);
    return null;
  }
}

function checkVisual(s: { fen?: string; arrows?: string[]; highlights?: string[] }, where: string) {
  if (s.fen) {
    try { parseFen(s.fen); } catch (e) { err(where, (e as Error).message); }
  }
  for (const a of s.arrows ?? []) {
    const { from, to, color } = parseArrow(a);
    if (!isSquare(from) || !isSquare(to)) err(where, `bad arrow "${a}"`);
    if (!['green', 'red', 'blue', 'yellow'].includes(color)) err(where, `bad arrow color "${a}"`);
  }
  for (const h of s.highlights ?? []) {
    const { sq, color } = parseMark(h);
    if (!isSquare(sq)) err(where, `bad highlight "${h}"`);
    if (!['green', 'red', 'blue', 'yellow'].includes(color)) err(where, `bad highlight color "${h}"`);
  }
}

const uciOf = (m: { from: string; to: string; promotion?: string }) => m.from + m.to + (m.promotion ?? '');

async function checkPuzzle(step: MoveStep, where: string) {
  const chess = new Chess(step.fen);
  for (let ply = 0; ply < step.solution.length; ply++) {
    const san = step.solution[ply];
    if (ply % 2 === 0) {
      const isFinal = ply + 2 >= step.solution.length;
      const lines: Line[] = await engine.analyse(chess.fen(), { depth: 14, multipv: 3 });
      const probe = new Chess(chess.fen());
      const mv = probe.move(san);
      const solUci = uciOf(mv);
      const best = lines[0];
      let sol = lines.find((l) => l.move === solUci);
      if (!sol) {
        // Not in top lines: evaluate it directly.
        const reply: Line[] = await engine.analyse(probe.fen(), { depth: 13, multipv: 1 });
        if (probe.isCheckmate()) sol = { move: solUci, cp: null, mate: 1 };
        else if (reply[0]) sol = { move: solUci, cp: reply[0].cp != null ? -reply[0].cp : null, mate: reply[0].mate != null ? -reply[0].mate + (reply[0].mate > 0 ? 0 : 1) : null };
      }
      if (!sol) { err(where, `ply ${ply} ${san}: engine gave no evaluation`); return; }
      if (score(sol) < score(best) - 60 && !(sol.mate && sol.mate > 0)) {
        err(where, `ply ${ply}: solution ${san} (${fmt(sol)}) is clearly worse than engine best ${best.move} (${fmt(best)})`);
      }
      if (ply === 0 && score(sol) < 150) warn(where, `solution ${san} only evaluates ${fmt(sol)} — is this really a winning puzzle?`);
      // Ambiguity: another move nearly as good and not accepted.
      for (const l of lines) {
        if (l.move === solUci) continue;
        const alt = new Chess(chess.fen()).move({ from: l.move.slice(0, 2), to: l.move.slice(2, 4), promotion: l.move[4] });
        const altAfter = new Chess(chess.fen()); altAfter.move(alt.san);
        if (isFinal && judgeMove(step, ply, alt, altAfter) === 'correct') continue; // goal accepts it
        if (ply === 0 && step.accept?.includes(alt.san)) continue;
        const bothMate = sol.mate != null && sol.mate > 0 && l.mate != null && l.mate > 0;
        if (bothMate ? l.mate! <= sol.mate! : score(l) >= score(sol) - 80 && score(sol) > 0) {
          warn(where, `ply ${ply}: alternative ${alt.san} (${fmt(l)}) is about as good as ${san} (${fmt(sol)}) — add to accept, use a goal, or change the position`);
        }
      }
    }
    if (!tryMove(chess, san)) { err(where, `illegal solution move ${san}`); return; }
  }
}

async function checkStep(step: Step, where: string, inCheckpoint: boolean) {
  if (inCheckpoint && step.type === 'explain') err(where, 'checkpoint/practice cannot contain explain steps');
  switch (step.type) {
    case 'explain': {
      checkVisual(step, where);
      if (step.text.length > 700) warn(where, `explain text is long (${step.text.length} chars) — split into steps`);
      if (step.demo) {
        if (!step.fen) { err(where, 'demo needs a fen'); break; }
        const c = legalChess(step.fen, where);
        if (!c) break;
        for (const m of step.demo.moves) if (!tryMove(c, m)) { err(where, `illegal demo move ${m}`); break; }
        if (step.demo.captions && step.demo.captions.length !== step.demo.moves.length)
          err(where, `demo captions (${step.demo.captions.length}) must match moves (${step.demo.moves.length})`);
      }
      break;
    }
    case 'move': {
      checkVisual(step, where);
      const c = legalChess(step.fen, where);
      if (!c) break;
      if (!step.solution.length) { err(where, 'empty solution'); break; }
      if (!step.explanation) warn(where, 'missing explanation');
      if (step.piece && !c.get(step.piece as never)) err(where, `piece square ${step.piece} is empty`);
      const start = c.fen();
      for (const a of step.accept ?? []) {
        const m = tryMove(new Chess(start), a);
        if (!m) err(where, `illegal accept move ${a}`);
        else if (m.san !== a) err(where, `accept move "${a}" must be written "${m.san}" (it would never match)`);
      }
      for (const w of Object.keys(step.wrong ?? {})) {
        const t = new Chess(start);
        const m = tryMove(t, w);
        if (!m) err(where, `illegal 'wrong' move ${w}`);
        else if (m.san !== w) err(where, `'wrong' move "${w}" must be written "${m.san}" (it would never match)`);
        else if (judgeMove(step, 0, m, t) !== 'wrong') err(where, `'wrong' move ${w} would be accepted as correct`);
      }
      for (let ply = 0; ply < step.solution.length; ply++) {
        const san = step.solution[ply];
        const m = tryMove(c, san);
        if (!m) { err(where, `illegal solution move #${ply} "${san}" in ${c.fen()}`); break; }
        if (m.san !== san) warn(where, `solution "${san}" should be written "${m.san}"`);
        if (ply % 2 === 0 && judgeMove(step, ply, m, c) === 'wrong') err(where, `solution move ${san} is rejected by its own goal`);
      }
      if (step.goal === 'mate' && !c.isCheckmate()) err(where, `goal is mate but final position is not checkmate`);
      if (step.solution.length % 2 === 0) warn(where, 'solution ends with an opponent move (should end with a learner move)');
      if (step.puzzle && engine) await checkPuzzle(step, where);
      break;
    }
    case 'stars': {
      const all = [step.start, ...step.stars, ...(step.blockers ?? [])];
      for (const s of all) if (!isSquare(s)) err(where, `bad square ${s}`);
      if (step.stars.includes(step.start)) err(where, 'start square has a star');
      const min = minStarMoves(step.piece, step.start, step.stars, step.blockers);
      if (min === Infinity) err(where, 'stars cannot all be reached');
      else if (step.par !== undefined && step.par !== min) err(where, `par is ${step.par} but minimum is ${min}`);
      break;
    }
    case 'squares': {
      checkVisual(step, where);
      if (!step.answer.length) err(where, 'no answer squares');
      for (const s of step.answer) if (!isSquare(s)) err(where, `bad answer square ${s}`);
      break;
    }
    case 'choice': {
      checkVisual(step, where);
      if (!step.options.some((o) => o.correct)) err(where, 'no correct option');
      if (step.options.length < 2) err(where, 'need at least 2 options');
      for (const o of step.options) if (!o.feedback) warn(where, `option "${o.text}" has no feedback`);
      break;
    }
    case 'challenge': {
      const c = legalChess(step.fen, where);
      if (!c) break;
      if (c.isGameOver()) err(where, 'challenge position is already over');
      if (engine && step.goal === 'mate') {
        const [best] = (await engine.analyse(step.fen, { depth: 18, multipv: 1 })) as Line[];
        if (!best || best.mate == null || best.mate <= 0) warn(where, `engine finds no forced mate (${best ? fmt(best) : '?'})`);
        else if (step.maxMoves && best.mate > step.maxMoves) err(where, `maxMoves ${step.maxMoves} < fastest mate ${best.mate}`);
      }
      break;
    }
  }
}

async function checkLesson(lesson: Lesson, unitId: string) {
  const w = `${unitId}/${lesson.id}`;
  if (!/^[a-z0-9-]+$/.test(lesson.id)) err(w, 'id must be kebab-case');
  if (lesson.keyIdeas.length < 2 || lesson.keyIdeas.length > 4) warn(w, `keyIdeas should be 2–4 (has ${lesson.keyIdeas.length})`);
  if (lesson.checkpoint.length < 3 || lesson.checkpoint.length > 6) warn(w, `checkpoint should have 3–6 items (has ${lesson.checkpoint.length})`);
  if (!lesson.steps.some((s) => s.type !== 'explain')) warn(w, 'lesson has no interactive steps (learners need active practice)');
  for (const [i, s] of lesson.steps.entries()) await checkStep(s, `${w} step ${i}`, false);
  for (const [i, s] of lesson.checkpoint.entries()) await checkStep(s, `${w} checkpoint ${i}`, true);
  for (const [i, s] of (lesson.practice ?? []).entries()) await checkStep(s, `${w} practice ${i}`, true);
}

async function main() {
  const ids = new Set<string>();
  for (const unit of curriculum) {
    if (onlyUnit && unit.id !== onlyUnit) continue;
    console.log(`\n■ ${unit.id} — ${unit.title} (${unit.lessons.length} lessons)`);
    for (const lesson of unit.lessons) {
      if (ids.has(lesson.id)) err(lesson.id, 'duplicate lesson id');
      ids.add(lesson.id);
      await checkLesson(lesson, unit.id);
    }
  }
  const exercises = curriculum.flatMap((u) => u.lessons).reduce((n, l) => n + l.steps.length + l.checkpoint.length + (l.practice?.length ?? 0), 0);
  console.log(`\n${ids.size} lessons, ${exercises} steps — ${errors} errors, ${warnings} warnings`);
  engine?.quit();
  process.exit(errors ? 1 : 0);
}
main();
