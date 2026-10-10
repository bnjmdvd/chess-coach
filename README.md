# Chess Coach

Learn chess from absolute zero, one short session a day.

A static web app (Vite + React + TypeScript) with a full curriculum, from the board and the pieces up to tactics, endgames and strategy. Each day's session is planned for you, a coach gives feedback as you go, and spaced repetition brings lessons back before you forget them. The Stockfish engine runs in your browser, so there is no server and no account.

## How it teaches

| Principle | In the app |
| --- | --- |
| Small steps, one idea per lesson | 50+ short lessons in 8 units: board & pieces, rules, checkmates, safety, tactics, openings, endgames, strategy |
| Worked examples, then faded guidance | Each lesson goes explanation → demo → guided exercises (arrows/highlights) → unscaffolded exercises |
| Active practice | More than half of all steps are interactive: make moves, collect stars, click squares, answer questions, play positions out against the engine |
| Immediate, explanatory feedback | Every answer explains *why*; tempting wrong moves get specific feedback; for puzzles the engine shows the refutation |
| Hint ladder | Gentle nudge → specific hint → highlights the piece → shows the move (hints lower the review grade) |
| Retrieval practice and mastery | Each lesson ends with a checkpoint without scaffolds; 80% to master; retries use fresh questions |
| Spaced repetition | SM-2 scheduler graded from behaviour (first try / hints / speed), not self-report |
| Interleaving | Warm-ups and practice mix topics from different lessons |
| Session structure | Warm-up review → new lesson → mixed practice → recap; "catch-up days" when reviews pile up |
| Metacognition | Confidence rating (low confidence schedules reviews sooner) and a "say it in your own words" journal |
| Transfer to real games | Play mode with 8 bot levels and a coach: threat warnings, "take it back?" on blunders, Checks-Captures-Threats hints, post-game key moments |

## Your data

Progress is saved automatically in the browser's local storage. It survives closing the tab and restarting the computer, but it is per browser. Use **Settings → Download backup / Restore** to keep a copy or move between browsers. On Safari, **File → Add to Dock** turns it into an app and protects the data from Safari's 7-day cleanup.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # outputs dist/
npm run validate     # checks every lesson: legal positions, solutions, and engine-verified puzzles
npm run validate -- --unit tactics --no-engine
```

Content lives in `src/content/units/*.ts`, following the schema in `src/content/types.ts`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project → Import** the repository. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. Done. Each push redeploys.

Or, from this folder: `npx vercel` (and `npx vercel --prod`).

## Credits

- [Stockfish](https://stockfishchess.org/) via [stockfish.js](https://github.com/nmrugg/stockfish.js) (GPLv3)
- [chess.js](https://github.com/jhlywa/chess.js) (BSD-2)
- Pieces: "cburnett" set by Colin M.L. Burnett (CC BY-SA 3.0 / GPLv2+)
