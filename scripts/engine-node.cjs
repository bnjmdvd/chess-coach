// Minimal promise wrapper around stockfish (Node) for content validation.
const path = require('path');
function createEngine() {
  let listeners = [];
  const sf = require('stockfish')('lite-single', (line) => listeners.slice().forEach((l) => l(line)));
  const send = (c) => sf.processCommand(c);
  const waitFor = (pred) => new Promise((res) => {
    const l = (line) => { if (pred(line)) { listeners = listeners.filter((x) => x !== l); res(line); } };
    listeners.push(l);
  });
  let ready = (async () => { const p = waitFor((l) => l === 'uciok'); send('uci'); await p; const q = waitFor((l) => l === 'readyok'); send('isready'); await q; })();
  /** Analyse: returns [{move (uci), cp, mate}] sorted best first, from side-to-move perspective. */
  async function analyse(fen, { depth = 14, multipv = 3 } = {}) {
    await ready;
    const lines = {};
    const collect = (line) => {
      const m = line.match(/ depth (\d+) .*multipv (\d+) score (cp|mate) (-?\d+).* pv (\S+)/);
      if (m) lines[m[2]] = { depth: +m[1], move: m[5], cp: m[3] === 'cp' ? +m[4] : null, mate: m[3] === 'mate' ? +m[4] : null };
    };
    listeners.push(collect);
    const done = waitFor((l) => l.startsWith('bestmove'));
    send('ucinewgame'); send(`setoption name MultiPV value ${multipv}`); send(`position fen ${fen}`); send(`go depth ${depth}`);
    await done;
    listeners = listeners.filter((x) => x !== collect);
    return Object.keys(lines).sort((a, b) => a - b).map((k) => lines[k]);
  }
  return { analyse, quit: () => sf.terminate && sf.terminate() };
}
module.exports = { createEngine };
