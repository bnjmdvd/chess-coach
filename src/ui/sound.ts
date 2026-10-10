import { getData } from '../state/store';

let ctx: AudioContext | null = null;

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.08, delay = 0) {
  if (!getData().prefs.sound) return;
  try {
    ctx ??= new AudioContext();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch { /* audio unavailable */ }
}

export const sound = {
  move: () => tone(420, 0.07, 'triangle', 0.1),
  capture: () => { tone(300, 0.09, 'square', 0.05); tone(220, 0.1, 'triangle', 0.08, 0.03); },
  good: () => { tone(660, 0.12, 'sine', 0.07); tone(880, 0.18, 'sine', 0.07, 0.09); },
  bad: () => tone(180, 0.18, 'sawtooth', 0.04),
  done: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'sine', 0.06, i * 0.09)); },
};
