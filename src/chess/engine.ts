import { Chess } from 'chess.js';

export interface EngineLine {
  depth: number;
  /** Score from the side to move's perspective. */
  cp: number | null;
  mate: number | null;
  pv: string[]; // UCI moves
}

type Job = { cmd: string[]; multipv: number; resolve: (l: EngineLine[]) => void };

/** Serial job queue around the Stockfish web worker. */
class Engine {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private queue: Job[] = [];
  private busy = false;
  private lines: EngineLine[] = [];
  private onDone: (() => void) | null = null;
  private skill = 20;

  private init() {
    if (this.ready) return this.ready;
    this.worker = new Worker(`${import.meta.env.BASE_URL}engine/stockfish-19-lite-single.js`);
    let initialized = false;
    this.ready = new Promise((resolve) => {
      this.worker!.onmessage = (e: MessageEvent) => {
        const line = String(e.data);
        if (line === 'uciok') this.worker!.postMessage('isready');
        else if (line === 'readyok' && !initialized) { initialized = true; resolve(); }
        else this.handle(line);
      };
      this.worker!.postMessage('uci');
    });
    return this.ready;
  }

  private handle(line: string) {
    if (line.startsWith('info') && line.includes(' pv ') && !line.includes('bound')) {
      const depth = line.match(/\bdepth (\d+)/);
      const mpv = line.match(/\bmultipv (\d+)/);
      const score = line.match(/\bscore (cp|mate) (-?\d+)/);
      const pv = line.match(/ pv (.+)$/);
      if (depth && score && pv) {
        this.lines[Number(mpv?.[1] ?? 1) - 1] = {
          depth: Number(depth[1]),
          cp: score[1] === 'cp' ? Number(score[2]) : null,
          mate: score[1] === 'mate' ? Number(score[2]) : null,
          pv: pv[1].trim().split(/\s+/),
        };
      }
    } else if (line.startsWith('bestmove')) {
      this.onDone?.();
    }
  }

  private async pump() {
    if (this.busy) return;
    const job = this.queue.shift();
    if (!job) return;
    this.busy = true;
    await this.init();
    this.lines = [];
    const done = new Promise<void>((r) => (this.onDone = r));
    for (const c of job.cmd) this.worker!.postMessage(c);
    await done;
    this.onDone = null;
    job.resolve(this.lines.filter(Boolean).slice(0, job.multipv));
    this.busy = false;
    this.pump();
  }

  analyse(fen: string, opts: { depth?: number; movetime?: number; multipv?: number; skill?: number } = {}): Promise<EngineLine[]> {
    const multipv = opts.multipv ?? 1;
    const skill = opts.skill ?? 20;
    const cmd: string[] = [];
    if (skill !== this.skill) { cmd.push(`setoption name Skill Level value ${skill}`); this.skill = skill; }
    cmd.push(`setoption name MultiPV value ${multipv}`, `position fen ${fen}`,
      opts.movetime ? `go movetime ${opts.movetime}` : `go depth ${opts.depth ?? 12}`);
    return new Promise((resolve) => { this.queue.push({ cmd, multipv, resolve }); this.pump(); });
  }

  /** Drop queued (not running) jobs, e.g. when leaving a screen. */
  clear() {
    this.queue.forEach((j) => j.resolve([]));
    this.queue = [];
  }
}

export const engine = new Engine();

/** Numeric score for comparisons (mate dominates). Perspective: side to move. */
export function scoreOf(l: { cp: number | null; mate: number | null } | undefined): number {
  if (!l) return 0;
  if (l.mate != null) return l.mate > 0 ? 100000 - l.mate * 10 : -100000 - l.mate * 10;
  return l.cp ?? 0;
}

export function uciToMove(chess: Chess, uci: string) {
  try {
    return chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  } catch {
    return null;
  }
}

/** Opponent strength levels. Weak levels mix in random moves, the way real beginners play. */
export const LEVELS = [
  { name: 'Newcomer', elo: '~400', random: 0.75, depth: 1, skill: 0 },
  { name: 'Beginner', elo: '~600', random: 0.5, depth: 2, skill: 0 },
  { name: 'Novice', elo: '~800', random: 0.32, depth: 4, skill: 0 },
  { name: 'Casual', elo: '~1000', random: 0.18, depth: 6, skill: 2 },
  { name: 'Improver', elo: '~1200', random: 0.08, depth: 8, skill: 5 },
  { name: 'Club', elo: '~1500', random: 0.03, depth: 10, skill: 9 },
  { name: 'Strong', elo: '~1800', random: 0, depth: 12, skill: 14 },
  { name: 'Expert', elo: '2000+', random: 0, depth: 16, skill: 20 },
];

export async function botMove(fen: string, level: number): Promise<string> {
  const L = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, level - 1))];
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });
  if (Math.random() < L.random) {
    // Random, but beginners do notice free captures and mates sometimes.
    const mates = moves.filter((m) => m.san.endsWith('#'));
    if (mates.length && Math.random() < 0.5) return mates[0].lan;
    const caps = moves.filter((m) => m.captured);
    const pool = caps.length && Math.random() < 0.4 ? caps : moves;
    return pool[Math.floor(Math.random() * pool.length)].lan;
  }
  const [best] = await engine.analyse(fen, { depth: L.depth, skill: L.skill });
  return best?.pv[0] ?? moves[Math.floor(Math.random() * moves.length)].lan;
}
