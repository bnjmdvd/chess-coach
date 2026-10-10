import type { Lesson, Unit } from '../types';

// ---------------------------------------------------------------------------
// Positions (all reached from real opening lines and checked with chess.js / Stockfish)
// ---------------------------------------------------------------------------

/** French Advance: 1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2 Bd7 8.g3 */
const FRENCH_BAD_B = 'r3kbnr/pp1b1ppp/1qn1p3/3pP3/2pP4/P1P2NP1/1P1N1P1P/R1BQKB1R b KQkq - 0 8';
/** Italian Game, slow build-up: ...10.Re1 Re8 */
const ITALIAN_SLOW = 'r1bqr1k1/bpp2pp1/p1np1n1p/4p3/4P3/1BPP1N1P/PP1N1PP1/R1BQR1K1 w - - 2 11';
/** Ruy Lopez, Chigorin: the black knight has gone to a5 */
const RUY_NA5 = 'r1b2rk1/2q1bppp/p2p1n2/np2p3/3PP3/5N1P/PPBN1PP1/R1BQR1K1 b - - 0 13';
/** French Advance with ...Nge7 */
const FRENCH_NE7 = 'r3kb1r/pp1bnppp/1qn1p3/3pP3/3P4/2N2N2/PP2BPPP/R1BQ1RK1 b kq - 2 9';
/** Exchange French: the e-file is open */
const EXCH_FRENCH = 'r4rk1/ppqn1ppp/2pb1n2/3p2B1/3P2b1/2PB1N2/PPQN1PPP/R4RK1 w - - 2 11';
/** Exchange French, White's rook already on e1 */
const EXCH_FRENCH_B = 'r4rk1/ppqn1pp1/2pb1n1p/3p4/3P2bB/2PB1N2/PPQN1PPP/R3R1K1 b - - 1 12';
/** Queen's Gambit Declined, Exchange Variation */
const QGD_EXCH = 'r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPN2/PPQ2PPP/R4RK1 w - - 8 11';
/** Ruy Lopez Exchange, queens traded */
const RUY_EXCH_END = 'r5nr/2p2kpp/pp1bbp2/2p5/P3P3/1NN1BP2/1PP3PP/R2R2K1 w - - 1 14';
/** Italian Game after both sides castle: the e-file is open */
const ITALIAN_OO = 'r1bq1rk1/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2Q1RK1 w - - 2 11';
/** Italian Game before castling */
const ITALIAN_CASTLE = 'r1bqk2r/ppp2ppp/2n5/3n4/2BP4/5N2/PP1N1PPP/R2QK2R w KQkq - 0 10';
/** Giuoco Pianissimo, Black still to castle */
const PIANISSIMO = 'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 b kq - 1 6';
/** Rook endings */
const ROOK_7TH_A = '2r3k1/1p3ppp/p7/8/8/1P4P1/P4P1P/3R2K1 w - - 0 1';
const ROOK_7TH_B = '4r1k1/pp3ppp/2p5/8/8/6P1/PP3P1P/3R2K1 w - - 0 1';
const TWO_ROOKS = 'r4rk1/pp3ppp/2p5/8/8/2P5/PP3PPP/3RR1K1 w - - 0 1';
/** Caro-Kann Panov: White has an isolated d-pawn */
const IQP_WHITE = 'r1bq1rk1/pp2bppp/2n1p3/3n4/3P4/2NB1N2/PP3PPP/R1BQ1RK1 w - - 4 10';
/** Tarrasch Defence: Black has an isolated d-pawn */
const IQP_BLACK = 'r1bq1rk1/pp3ppp/2n2n2/2bp4/8/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 10';
const IQP_BLACK_2 = 'r1bq1rk1/pp2bppp/2n2n2/3p4/N7/5NP1/PP2PPBP/R1BQ1RK1 w - - 2 11';
/** Ruy Lopez Exchange: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.O-O */
const RUY_EXCH = 'r1bqkbnr/1pp2ppp/p1p5/4p3/4P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 5';
/** Nimzo-Indian: White has doubled c-pawns */
const NIMZO_DBL = 'r1bq1rk1/pp3ppp/2n1pn2/2pp4/2PP4/P1PBPN2/5PPP/R1BQ1RK1 b - - 0 9';
/** Najdorf Sicilian with ...e5: the d5 square */
const NAJDORF = 'rn1q1rk1/1p2bppp/p2pbn2/4p3/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 6 10';
/** Sveshnikov Sicilian after 9.Bxf6 gxf6 */
const SVESHNIKOV = 'r1bqkb1r/5p1p/p1np1p2/1p2p3/4P3/N1N5/PPP2PPP/R2QKB1R w KQkq - 0 10';
/** English Opening, Botvinnik set-up: the d4 square */
const ENGLISH = 'r1bq1rk1/ppp1npbp/2np2p1/4p3/2P1P3/2NP2P1/PP2NPBP/R1BQ1RK1 b - - 2 8';
/** King's Indian Defence, closed centre */
const KID = 'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 1 9';
/** Two Knights Defence after 4.Ng5 */
const TWO_KNIGHTS = 'r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4';
/** Legal's trap position: 1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 */
const LEGAL_5 = 'rn1qkbnr/ppp2p1p/3p2p1/4N3/2B1P1b1/2N5/PPPP1PPP/R1BQK2R b KQkq - 0 5';

const FILE = (f: string) => [1, 2, 3, 4, 5, 6, 7, 8].map((r) => f + r);

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

const howToThink: Lesson = {
  id: 'how-to-think',
  title: 'How to Think Before You Move',
  objective: 'You will be able to use a simple four-step routine to choose your moves.',
  minutes: 10,
  steps: [
    {
      type: 'explain',
      title: 'A routine for every move',
      text:
        'Strong players don\'t just "see" good moves. They follow a routine, every move:\n\n' +
        '- **1. Their idea:** what does my opponent\'s last move want?\n' +
        '- **2. Candidates:** list a few possible moves, forcing moves first.\n' +
        '- **3. Compare:** imagine the best reply to each one.\n' +
        '- **4. Blunder check:** is the move I picked safe?',
    },
    {
      type: 'explain',
      title: 'Step 1: what do they want?',
      text:
        'Every move has a purpose. Before thinking about your own plans, ask: **what does that move threaten?**\n\n' +
        'Here White has just played **Ng5**. The knight and the bishop on c4 both aim at f7, which only your king defends.',
      fen: TWO_KNIGHTS,
      orientation: 'black',
      arrows: ['g5f7:red', 'c4f7:red'],
    },
    {
      type: 'choice',
      prompt: 'Black to move. White just played Ng5. What is White threatening?',
      fen: TWO_KNIGHTS,
      orientation: 'black',
      options: [
        { text: 'Nxf7, attacking your queen and rook at once', correct: true, feedback: 'Right. A knight on f7 would fork the queen on d8 and the rook on h8.' },
        { text: 'Nothing: Ng5 is just a developing move', feedback: 'Every move has a purpose. Look at the two white pieces aiming at f7.' },
        { text: 'To capture your pawn on e5', feedback: 'A knight on g5 cannot reach e5. Look at f7 instead.' },
      ],
    },
    {
      type: 'move',
      fen: TWO_KNIGHTS,
      orientation: 'black',
      prompt: 'Black to move. Stop the threat on f7.',
      solution: ['d5'],
      hints: ['Can you block the bishop\'s line to f7?', 'A pawn move in the center blocks the c4-bishop.'],
      wrong: {
        h6: 'This ignores the threat: Nxf7 forks your queen and rook.',
        Qe7: 'The queen guards f7, but Bxf7+ still wins a pawn and chases your king.',
        Bc5: 'Bxf7+ wins a pawn with check, and your king loses the right to castle.',
      },
      explanation: '...d5 blocks the bishop\'s line to f7 and fights for the center. Answering your opponent\'s threat is always step 1.',
    },
    {
      type: 'explain',
      title: 'Step 2: candidate moves',
      text:
        'Now look for your own ideas. List two or three **candidate moves** before choosing one.\n\n' +
        'Start with **forcing moves**: checks, captures and threats. They limit your opponent\'s answers, so they are the easiest to calculate and the most likely to win something.',
    },
    {
      type: 'move',
      fen: 'r1b1kb1r/3q2pp/2p1pp1n/p1p5/2N5/2N1PQ2/RB1P1PPP/5RK1 w - - 2 15',
      prompt: 'White to move. Go through checks, captures and threats. One threat wins material.',
      solution: ['Nb6', 'Qb7', 'Nxa8'],
      hints: ['There are no good checks or captures. What can your knights attack?', 'A knight on b6 would attack three black pieces.'],
      explanation: 'Nb6 attacks the queen on d7, the rook on a8 and the bishop on c8. The queen must move, and the rook falls. A threat was the winning candidate.',
      puzzle: true,
      theme: 'fork',
    },
    {
      type: 'explain',
      title: 'Step 3: compare',
      text:
        'For each candidate, ask: **what is their best reply?** Don\'t hope for a bad answer; expect the best one.\n\n' +
        'A move that wins a pawn but loses a piece to the reply is worse than a quiet move that keeps everything safe.',
    },
    {
      type: 'choice',
      prompt: 'Black to move. You are comparing three candidates. Which one is best?',
      fen: 'r1bqkb1r/1p1n1ppp/p4n2/2P1p3/Q1p1P3/2N1BN2/PP3PPP/R3KB1R b KQkq - 1 8',
      orientation: 'black',
      options: [
        { text: '...Qc7', correct: true, feedback: 'Yes. It attacks c5 a second time and keeps everything defended.' },
        { text: '...Bxc5, winning a pawn', feedback: 'Compare with White\'s best reply: Bxc5! Your knight on d7 cannot take back, because it is pinned to your king by the queen on a4.' },
        { text: '...Be7, developing', feedback: 'White replies Nxe5, and the pinned knight on d7 cannot recapture. You just lose a pawn.' },
      ],
      explanation: 'The knight on d7 is pinned by the queen on a4. Both "natural" moves fail to White\'s best reply.',
    },
    {
      type: 'explain',
      title: 'Step 4: the blunder check',
      text:
        'Before you touch a piece, picture the board after your move. Do the **blunder check** you learned: what checks, captures and threats will your opponent have?\n\n' +
        'Most beginner games are decided by a piece left hanging. Ten seconds of checking saves many games.',
    },
    {
      type: 'move',
      fen: 'r2q1rk1/pb1nbpp1/1p2pn2/2PP4/7p/PP2P2P/1B1NBPP1/2RQK1NR b K - 0 14',
      orientation: 'black',
      prompt: 'Black to move. You can capture on c5 or d5 in several ways. Blunder-check each capture and play the only safe one.',
      solution: ['Nxc5'],
      hints: ['Picture ...Nxd5. Which white pawn move would then attack two of your pieces?', 'After ...Nxd5, c6! forks the bishop on b7 and the knight on d7.'],
      wrong: {
        Nxd5: 'Blunder! c6 attacks your bishop on b7 and your knight on d7 at the same time.',
        exd5: 'Blunder! c6 forks your bishop on b7 and your knight on d7.',
      },
      explanation: '...Nxc5 takes a pawn safely and removes White\'s c-pawn. Captures on d5 fail to the pawn fork c6. The blunder check finds that in seconds.',
    },
    {
      type: 'choice',
      prompt: 'You find no good checks, captures or threats. What should you do?',
      options: [
        { text: 'Improve your worst piece or follow a plan', correct: true, feedback: 'Exactly. A quiet improving move is perfect when nothing forcing works.' },
        { text: 'Play a random pawn move', feedback: 'Pawn moves can never be taken back and may create weaknesses.' },
        { text: 'Offer a trade of queens no matter what', feedback: 'Trades should have a reason. Improve your position instead.' },
      ],
    },
  ],
  keyIdeas: [
    'First ask: what does my opponent\'s move want?',
    'List candidates, starting with checks, captures and threats.',
    'Compare candidates by imagining the best reply.',
    'Blunder-check your move before you play it.',
  ],
  checkpoint: [
    {
      type: 'choice',
      prompt: 'Your opponent has just moved. What is the **first** question to ask?',
      options: [
        { text: 'What does their move threaten?', correct: true, feedback: 'Yes. Deal with their idea before chasing your own.' },
        { text: 'Which of my pieces can attack?', feedback: 'That comes next. First make sure you are not walking into their threat.' },
        { text: 'Can I trade queens?', feedback: 'Start with their threat: what does their move want?' },
      ],
    },
    {
      type: 'move',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
      orientation: 'black',
      prompt: 'Black to move. What does White threaten? Stop it with the best move.',
      solution: ['g6'],
      accept: ['Qe7', 'Qf6'],
      hints: ['The queen and bishop both aim at f7.', 'Can you block the queen and attack it at the same time?'],
      wrong: {
        Nf6: 'Qxf7 is checkmate! Your knight attacks the queen but does not stop the threat.',
        d6: 'Qxf7 is checkmate. You must guard f7 or block the queen.',
      },
      explanation: 'White threatens Qxf7 checkmate. ...g6 blocks the queen\'s path to f7 and attacks the queen at the same time. (...Qe7 or ...Qf6 also guard f7.)',
    },
    {
      type: 'move',
      fen: '4rrk1/p2q1p2/1p4p1/2pNpbnB/2P5/1Q1P3P/PP3PP1/R3R1K1 w - - 0 20',
      prompt: 'White to move. Look at the checks first. One of them wins material.',
      solution: ['Nf6+', 'Kg7', 'Nxd7'],
      hints: ['Which knight check also attacks other black pieces?'],
      explanation: 'Nf6+ checks the king and also attacks the queen on d7 and the rook on e8. After the king moves, Nxd7 wins the queen.',
      puzzle: true,
      theme: 'fork',
    },
    {
      type: 'choice',
      prompt: 'Black to move. Black is thinking about ...Nxb4, grabbing a pawn. Blunder check: what is wrong with it?',
      fen: 'r1b1k2r/ppq1bppp/2n1pn2/2Pp4/1P1P4/2N2N2/P2BBPPP/R2QK2R b KQkq - 0 11',
      orientation: 'black',
      options: [
        { text: 'Nb5 attacks the queen, and then Bxb4 wins the knight', correct: true, feedback: 'Right. The knight on b4 is only safe while the c3-knight blocks the bishop on d2.' },
        { text: 'Nothing: it wins a pawn for free', feedback: 'Imagine White\'s best reply. Nb5 hits your queen and opens the d2-bishop\'s line to b4.' },
        { text: 'White can capture the knight with the queen', feedback: 'The white queen cannot reach b4. Look at what Nb5 does instead.' },
      ],
      explanation: 'After ...Nxb4? Nb5! the queen must move, and Bxb4 wins a piece for a pawn.',
    },
  ],
  practice: [
    {
      type: 'move',
      fen: 'r1bqkb1r/1p1n1ppp/p4n2/2P1p3/Q1p1P3/2N1BN2/PP3PPP/R3KB1R b KQkq - 1 8',
      orientation: 'black',
      prompt: 'Black to move. The pawn on c5 looks free. Blunder-check first, then play the best move.',
      solution: ['Qc7'],
      hints: ['Your knight on d7 is pinned by the queen on a4.'],
      wrong: {
        Bxc5: 'Blunder! Bxc5, and your pinned knight on d7 cannot take back.',
        Be7: 'Nxe5 wins a pawn, because the pinned knight on d7 cannot recapture.',
      },
      explanation: '...Qc7 adds a second attacker on c5 and keeps e5 covered. The pin on d7 makes the natural moves fail.',
    },
    {
      type: 'choice',
      prompt: 'Which moves should you look at **first** when choosing your move?',
      options: [
        { text: 'Checks, captures and threats', correct: true, feedback: 'Yes. Forcing moves come first: they are easiest to calculate and often win.' },
        { text: 'Pawn moves on the edge', feedback: 'Those are rarely urgent. Look at forcing moves first.' },
        { text: 'Moves that retreat your pieces', feedback: 'Sometimes needed, but first check the forcing moves.' },
      ],
    },
    {
      type: 'move',
      fen: TWO_KNIGHTS,
      orientation: 'black',
      prompt: 'Black to move. White\'s last move was Ng5. Deal with the threat.',
      solution: ['d5'],
      hints: ['Which square are the knight and bishop both aiming at?'],
      wrong: {
        h6: 'Nxf7 forks your queen and rook.',
      },
      explanation: '...d5 blocks the c4-bishop\'s path to f7, so Nxf7 no longer works well.',
    },
    {
      type: 'choice',
      prompt: 'You found a move that wins a pawn. What should you do **before** playing it?',
      options: [
        { text: 'Imagine the position after it and look for their checks, captures and threats', correct: true, feedback: 'That is the blunder check.' },
        { text: 'Play it quickly before they notice', feedback: 'Your opponent always gets a reply. Check what it will be.' },
        { text: 'Nothing: winning a pawn is always good', feedback: 'Many pawn grabs lose a piece to the reply. Check first.' },
      ],
    },
  ],
  reflect: 'Which of the four steps do you skip most often in your own games?',
};

const pieceActivity: Lesson = {
  id: 'piece-activity',
  title: 'Active Pieces',
  objective: 'You will be able to spot your worst piece and give it a better square.',
  minutes: 8,
  steps: [
    {
      type: 'explain',
      title: 'A piece is worth its squares',
      text:
        'Piece values are a starting point, but a piece is really only as strong as the squares it reaches.\n\n' +
        'An **active** piece controls many squares and joins the fight. A **passive** piece is stuck: parked on the edge or blocked by its own pawns. The knight on d5 controls 8 squares; the one on a1 only 2.',
      fen: '8/8/8/3N4/8/8/8/N7 w - - 0 1',
      highlights: ['b4', 'b6', 'c3', 'c7', 'e3', 'e7', 'f4', 'f6', 'b3:red', 'c2:red'],
    },
    {
      type: 'squares',
      prompt: 'Click **every** square the knight on e4 controls.',
      fen: '8/8/8/8/4N3/8/8/8 w - - 0 1',
      answer: ['c3', 'c5', 'd2', 'd6', 'f2', 'f6', 'g3', 'g5'],
      mode: 'all',
      hints: ['A knight jumps in an L: two squares one way, then one square to the side.'],
      explanation: 'Eight squares in every direction. A centralized knight reaches both sides of the board.',
    },
    {
      type: 'squares',
      prompt: 'Now click every square the knight in the corner on **h1** controls.',
      fen: '8/8/8/8/8/8/8/7N w - - 0 1',
      answer: ['f2', 'g3'],
      mode: 'all',
      explanation: 'Only two squares! Coaches say "a knight on the rim is dim": keep knights near the center.',
    },
    {
      type: 'explain',
      title: 'Bad bishops',
      text:
        'A bishop is **bad** when its own pawns stand on its color and block its diagonals.\n\n' +
        'Here Black\'s pawns on e6, d5 and c4 all stand on light squares, the same color as the d7-bishop. They block its diagonals: it can defend, but it attacks almost nothing.',
      fen: FRENCH_BAD_B,
      orientation: 'black',
      highlights: ['d7:red', 'e6:yellow', 'd5:yellow', 'c4:yellow'],
    },
    {
      type: 'choice',
      prompt: 'Look at the same position. Which black piece is doing the **least**?',
      fen: FRENCH_BAD_B,
      orientation: 'black',
      options: [
        { text: 'The bishop on d7', correct: true, feedback: 'Yes. Its own pawns wall it in: it has no targets at all.' },
        { text: 'The queen on b6', feedback: 'The queen is busy: it presses on b2 and d4.' },
        { text: 'The knight on c6', feedback: 'The knight is useful: it attacks the d4 pawn and covers e5.' },
      ],
      explanation: 'Before you plan, ask: which of my pieces is worst? That piece is usually the one to improve.',
    },
    {
      type: 'explain',
      title: 'Improve your worst piece',
      text:
        'When there is no tactic on the board, a great plan is to find your **worst piece** and give it a better job.\n\n' +
        'In this Italian Game, White\'s knight on d2 blocks the bishop on c1. The plan: d2-f1-g3, where the knight eyes f5 and h5 and helps guard the king.',
      fen: ITALIAN_SLOW,
      arrows: ['d2f1', 'f1g3', 'g3f5:blue'],
      highlights: ['d2:red', 'c1:yellow'],
    },
    {
      type: 'move',
      fen: RUY_NA5,
      orientation: 'black',
      prompt: 'Black to move. Your knight on a5 is stuck on the edge. Bring it back toward the center.',
      solution: ['Nc6'],
      highlights: ['a5:red', 'c6'],
      hints: ['Which central square can the knight reach in one jump?', 'From c6 it would attack d4 and help guard e5.'],
      explanation: 'On c6 the knight attacks d4 and guards e5. A knight on the edge has few squares; one move brings it back into the game.',
    },
    {
      type: 'move',
      fen: FRENCH_NE7,
      orientation: 'black',
      prompt: 'Black to move. Your knight on e7 is blocking your bishop and doing little. Find it an active square.',
      solution: ['Nf5'],
      hints: ['White\'s d4 pawn is your main target.', 'From f5 the knight would hit d4.'],
      wrong: {
        Ng6: 'On g6 the knight is out of play: it attacks nothing and White can chase it with h4-h5.',
      },
      explanation: 'On f5 the knight joins the knight on c6 and the queen on b6 in attacking d4, and it frees the f8-bishop. Same piece, much better job.',
    },
    {
      type: 'choice',
      prompt: 'What is the best way to use a quiet moment when no tactics are available?',
      options: [
        { text: 'Find your worst piece and improve it', correct: true, feedback: 'Exactly. Small improvements add up, and soon tactics appear.' },
        { text: 'Move a pawn on the edge, just to pass', feedback: 'Random pawn moves can create weaknesses. Use the time to improve a piece.' },
        { text: 'Bring the queen out alone to look for threats', feedback: 'A lone queen can be chased around. Bring the whole team into play first.' },
      ],
    },
  ],
  keyIdeas: [
    'A piece is worth the squares it controls.',
    'Knights belong near the center, not on the rim.',
    'A bishop blocked by its own pawns is a bad bishop.',
    'No tactic? Find your worst piece and improve it.',
  ],
  checkpoint: [
    {
      type: 'choice',
      prompt: 'White to move. Which white piece is the worst?',
      fen: ITALIAN_SLOW,
      options: [
        { text: 'The knight on d2', correct: true, feedback: 'Right. It blocks the c1-bishop and the queen, and controls little.' },
        { text: 'The bishop on b3', feedback: 'That bishop is active: it aims straight at f7, next to Black\'s king.' },
        { text: 'The knight on f3', feedback: 'That knight is well placed: it attacks e5 and guards the king.' },
      ],
    },
    {
      type: 'move',
      fen: ITALIAN_SLOW,
      prompt: 'White to move. Start improving your worst piece: the knight on d2. Head for g3.',
      solution: ['Nf1'],
      hints: ['The knight needs a stepping stone between d2 and g3.'],
      wrong: {
        Nc4: 'On c4 the knight can be chased by ...b5, and it still blocks nothing useful. Aim for g3 via f1.',
      },
      explanation: 'Nf1 clears the way for the c1-bishop and the queen, and next Ng3 puts the knight on an active square near the center and the king.',
    },
    {
      type: 'squares',
      prompt: 'Click every square the knight on **b1** controls.',
      fen: '8/8/8/8/8/8/8/1N6 w - - 0 1',
      answer: ['a3', 'c3', 'd2'],
      mode: 'all',
      explanation: 'Only three squares from b1. That is why you develop knights toward the center early.',
    },
    {
      type: 'choice',
      prompt: 'Which bishop is "bad"?',
      options: [
        { text: 'A bishop whose own pawns sit on its color and block it', correct: true, feedback: 'Yes. Its own pawns take away its diagonals.' },
        { text: 'Any bishop that has not moved yet', feedback: 'An undeveloped bishop is passive for now, but it is not "bad" until its own pawns block it.' },
        { text: 'A bishop on a long diagonal', feedback: 'That is usually a great bishop!' },
      ],
    },
  ],
  practice: [
    {
      type: 'move',
      fen: RUY_NA5,
      orientation: 'black',
      prompt: 'Black to move. Improve the piece that stands on the edge of the board.',
      solution: ['Nc6'],
      hints: ['The knight on a5 controls very few squares.'],
      explanation: 'Nc6 brings the knight back to the center, where it attacks d4 and guards e5.',
    },
    {
      type: 'move',
      fen: FRENCH_NE7,
      orientation: 'black',
      prompt: 'Black to move. Find an active square for the knight on e7.',
      solution: ['Nf5'],
      hints: ['Look for a square where the knight attacks a white pawn.'],
      explanation: 'From f5 the knight piles up on d4 together with the c6-knight and the queen, and the f8-bishop is free again.',
    },
    {
      type: 'choice',
      prompt: 'White to move. How many squares can the bishop on **c1** move to right now?',
      fen: ITALIAN_SLOW,
      options: [
        { text: '0', correct: true, feedback: 'Right. The b2-pawn and the d2-knight block both of its diagonals. Moving the knight (Nf1) frees it.' },
        { text: '2', feedback: 'Look again: b2 is a white pawn and d2 is a white knight. The bishop cannot move at all.' },
        { text: '4', feedback: 'That would be true if the d2-knight moved away. Right now the bishop is completely blocked.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'Which knight is better placed: one on **d5** or one on **h5**?',
      options: [
        { text: 'd5', correct: true, feedback: 'Yes. In the center a knight controls up to 8 squares.' },
        { text: 'h5', feedback: 'On the edge a knight controls only 4 squares at most. A knight on the rim is dim.' },
        { text: 'They are equal', feedback: 'Count the squares: 8 from d5, only 4 from h5.' },
      ],
    },
  ],
  reflect: 'In your last game, which of your pieces never really joined the fight? Where should it have gone?',
};

const openFiles: Lesson = {
  id: 'open-files',
  title: 'Rooks and Open Files',
  objective: 'You will be able to put your rooks on open files and use them to invade.',
  minutes: 8,
  steps: [
    {
      type: 'explain',
      title: 'Rooks need open files',
      text:
        'Rooks are long-range pieces, but pawns block them. A file with **no pawns at all** is an **open file**.\n\n' +
        'Here both e-pawns have been traded, so the e-file is open. A rook placed there can travel all the way into the enemy camp.',
      fen: EXCH_FRENCH,
      highlights: FILE('e').map((s) => s + ':yellow'),
    },
    {
      type: 'move',
      fen: EXCH_FRENCH,
      prompt: 'White to move. Put a rook on the open e-file.',
      solution: ['Rfe1'],
      accept: ['Rae1'],
      highlights: ['e1'],
      hints: ['Either rook can slide to e1.'],
      explanation: 'The rook on e1 now controls the whole open file. Whoever owns an open file can use it to invade.',
    },
    {
      type: 'squares',
      prompt: 'Click any square on the **open file** in this position.',
      fen: RUY_EXCH_END,
      answer: FILE('d'),
      mode: 'one',
      hints: ['Look for a file with no white or black pawns on it.'],
      explanation: 'The d-file has no pawns on it. White\'s rook on d1 already owns it.',
    },
    {
      type: 'explain',
      title: 'Half-open files',
      text:
        'If only your **opponent\'s** pawn stands on a file, that file is **half-open** for you. Your rooks can press against that pawn.\n\n' +
        'Here White has no c-pawn, so the c-file is half-open for White: the target is the black pawn on c6. Black\'s half-open file is the e-file, aiming at e3.',
      fen: QGD_EXCH,
      highlights: ['c6:red', 'e3:blue'],
      arrows: ['c1c6:red', 'e8e3:blue'],
    },
    {
      type: 'squares',
      prompt: 'White\'s d-file is half-open here. Click the black pawn that White\'s rooks would attack on that file.',
      fen: NAJDORF,
      answer: ['d6'],
      mode: 'one',
      explanation: 'The d6 pawn is alone on the d-file. White rooks on d1 and d2 can pile up against it.',
    },
    {
      type: 'move',
      fen: EXCH_FRENCH_B,
      orientation: 'black',
      prompt: 'Black to move. White\'s rook already sits on the open e-file. Challenge it with one of your rooks.',
      solution: ['Rfe8'],
      accept: ['Rae8'],
      hints: ['Put a rook on e8, facing White\'s rook.'],
      explanation: 'Never let your opponent own an open file for free. With your own rook on e8, the file is contested and White cannot invade.',
    },
    {
      type: 'explain',
      title: 'Doubling and the 7th rank',
      text:
        'Two rooks on the same file are **doubled**, and they are twice as strong.\n\n' +
        'The best target for a rook on an open file is the opponent\'s second rank (your **7th rank**). There it attacks pawns that are still on their starting squares, and it can trap the king on the back rank.',
      fen: ROOK_7TH_A,
      arrows: ['d1d7'],
      highlights: ['b7:red', 'f7:red'],
    },
    {
      type: 'move',
      fen: ROOK_7TH_A,
      prompt: 'White to move. Use the open d-file to invade the 7th rank.',
      solution: ['Rd7'],
      hints: ['How far up the d-file can your rook go safely?'],
      wrong: {
        'Rd8+': 'This check just trades rooks: ...Rxd8. Stop one square earlier.',
      },
      explanation: 'On d7 the rook attacks b7 and f7, and Black must defend passively. A rook on the 7th rank is a classic advantage.',
    },
    {
      type: 'move',
      fen: TWO_ROOKS,
      prompt: 'White to move. Both central files are open. Send a rook to the 7th rank.',
      solution: ['Re7'],
      accept: ['Rd7'],
      hints: ['Which rook can reach the 7th rank right now?'],
      explanation: 'The rook on the 7th rank attacks b7 and f7 at once. Black is forced to defend instead of attacking.',
    },
  ],
  keyIdeas: [
    'An open file has no pawns; a half-open file has only the opponent\'s pawn.',
    'Put your rooks on open and half-open files.',
    'Challenge your opponent\'s rook on an open file.',
    'A rook on the 7th rank attacks pawns and traps the king.',
  ],
  checkpoint: [
    {
      type: 'squares',
      prompt: 'Click any square on the **open file**.',
      fen: ITALIAN_OO,
      answer: FILE('e'),
      mode: 'one',
      explanation: 'Both e-pawns are gone, so the e-file is open. A white rook on e1 would control it.',
    },
    {
      type: 'move',
      fen: ROOK_7TH_B,
      prompt: 'White to move. Invade with your rook.',
      solution: ['Rd7'],
      hints: ['The d-file is open all the way to the 7th rank.'],
      wrong: {
        'Rd8': 'Black simply trades: ...Rxd8. Stop on the 7th rank instead.',
      },
      explanation: 'Rd7 attacks b7 and f7. The rook on the 7th rank ties Black down.',
    },
    {
      type: 'choice',
      prompt: 'A file with only your **opponent\'s** pawn on it is called…',
      options: [
        { text: 'A half-open file', correct: true, feedback: 'Yes. Your rooks can attack that lonely pawn.' },
        { text: 'An open file', feedback: 'An open file has no pawns at all.' },
        { text: 'A closed file', feedback: 'A closed file has pawns of both colors.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'White to move. Where do White\'s rooks belong in this position?',
      fen: QGD_EXCH,
      options: [
        { text: 'On the c-file, pressing against c6', correct: true, feedback: 'Right: the c-file is half-open for White, and c6 is the target.' },
        { text: 'On the d-file, behind the d4 pawn', feedback: 'White\'s own d4 pawn blocks that file.' },
        { text: 'On the a-file and h-file', feedback: 'Those files are closed by pawns. Rooks belong on open or half-open files.' },
      ],
    },
  ],
  practice: [
    {
      type: 'move',
      fen: EXCH_FRENCH,
      prompt: 'White to move. Claim the open file with a rook.',
      solution: ['Rae1'],
      accept: ['Rfe1'],
      explanation: 'A rook on e1 controls the open e-file. Rooks are strongest on open files.',
    },
    {
      type: 'move',
      fen: EXCH_FRENCH_B,
      orientation: 'black',
      prompt: 'Black to move. Contest the open file.',
      solution: ['Rfe8'],
      accept: ['Rae8'],
      explanation: 'By putting a rook on e8, Black stops White from owning the e-file.',
    },
    {
      type: 'squares',
      prompt: 'Click the **half-open file** for Black: click the white pawn Black\'s rooks would attack.',
      fen: QGD_EXCH,
      answer: ['e3'],
      mode: 'one',
      explanation: 'Black has no e-pawn, so the e-file is half-open for Black. The e3 pawn is the target.',
    },
    {
      type: 'move',
      fen: TWO_ROOKS,
      prompt: 'White to move. Use an open file to reach the 7th rank.',
      solution: ['Re7'],
      accept: ['Rd7'],
      explanation: 'On the 7th rank your rook attacks the pawns on b7 and f7.',
    },
  ],
  reflect: 'Why is a rook on an open file stronger than a rook behind its own pawns?',
};

const pawnStructure: Lesson = {
  id: 'pawn-structure',
  title: 'Pawn Structure',
  objective: 'You will be able to recognize doubled, isolated and passed pawns and know which are weak.',
  minutes: 9,
  steps: [
    {
      type: 'explain',
      title: 'Pawns are the skeleton',
      text:
        'Pawns never move backward, so pawn weaknesses are usually **permanent**. Good players look at the pawns first to understand a position.\n\n' +
        'Three kinds to know: **doubled**, **isolated** and **passed** pawns.',
      fen: RUY_EXCH,
    },
    {
      type: 'explain',
      title: 'Doubled pawns',
      text:
        'Two pawns of the same color on one file are **doubled**. After Bxc6 dxc6, Black has doubled c-pawns.\n\n' +
        'Doubled pawns cannot protect each other, and the front one blocks the back one. In an endgame they are often a real weakness.',
      fen: RUY_EXCH,
      orientation: 'black',
      highlights: ['c7:red', 'c6:red'],
    },
    {
      type: 'squares',
      prompt: 'Click White\'s **doubled pawns**.',
      fen: NIMZO_DBL,
      answer: ['c3', 'c4'],
      mode: 'all',
      hints: ['Look for two white pawns on the same file.'],
      explanation: 'White has pawns on c3 and c4. In return White got the bishop pair, a typical trade-off.',
    },
    {
      type: 'explain',
      title: 'Isolated pawns',
      text:
        'A pawn with no friendly pawns on the files next to it is **isolated**. No pawn can ever defend it, so pieces must guard it.\n\n' +
        'White\'s d4 pawn has no c-pawn or e-pawn beside it. The square in front of it, d5, is a perfect home for a black piece.',
      fen: IQP_WHITE,
      highlights: ['d4:red', 'd5:yellow'],
    },
    {
      type: 'squares',
      prompt: 'Click Black\'s **isolated pawn**.',
      fen: IQP_BLACK,
      answer: ['d5'],
      mode: 'one',
      hints: ['Find a black pawn with no black pawns on the files next to it.'],
      explanation: 'The d5 pawn has no c-pawn or e-pawn beside it. Only pieces can defend it.',
    },
    {
      type: 'explain',
      title: 'Passed pawns',
      text:
        'A **passed pawn** has no enemy pawns in front of it or on the files beside it. No pawn can stop it, so only pieces can.\n\n' +
        'Passed pawns get stronger as pieces come off the board. The white pawn on b5 is passed.',
      fen: '6k1/5p2/6p1/1P5p/7P/6P1/5PK1/8 w - - 0 1',
      highlights: ['b5'],
      arrows: ['b5b8'],
    },
    {
      type: 'squares',
      prompt: 'Click White\'s **passed pawn**.',
      fen: '4k3/1p3p2/p5p1/3P3p/7P/6P1/5PK1/8 w - - 0 1',
      answer: ['d5'],
      mode: 'one',
      hints: ['Check each white pawn: is there a black pawn ahead of it, on its file or a file next to it?'],
      explanation: 'No black pawn stands on the c-, d- or e-file, so nothing can block or capture the d-pawn on its way.',
    },
    {
      type: 'squares',
      prompt: 'Same position. Now click **all** of Black\'s passed pawns.',
      fen: '4k3/1p3p2/p5p1/3P3p/7P/6P1/5PK1/8 w - - 0 1',
      answer: ['a6', 'b7'],
      mode: 'all',
      explanation: 'White has no pawns on the queenside, so Black\'s a- and b-pawns are both passed.',
    },
    {
      type: 'explain',
      title: 'Pawn islands',
      text:
        'Groups of pawns separated by empty files are called **pawn islands**. Fewer islands usually means a healthier structure, because pawns in a group can protect each other.\n\n' +
        'Black has two islands here (a-b and f-g-h).',
      fen: '6k1/pp3ppp/8/8/8/8/P1P2PPP/6K1 w - - 0 1',
      highlights: ['a7:blue', 'b7:blue', 'f7:blue', 'g7:blue', 'h7:blue'],
    },
    {
      type: 'choice',
      prompt: 'Same position. How many pawn islands does **White** have?',
      fen: '6k1/pp3ppp/8/8/8/8/P1P2PPP/6K1 w - - 0 1',
      options: [
        { text: '3', correct: true, feedback: 'Yes: a2, c2, and f2-g2-h2. The a- and c-pawns are both isolated.' },
        { text: '2', feedback: 'Count again: the a2 and c2 pawns are separated by the empty b-file.' },
        { text: '5', feedback: 'Islands are groups, not single pawns. f2, g2 and h2 form one island.' },
      ],
    },
    {
      type: 'move',
      fen: '6k1/ppp5/8/PPP5/8/8/8/6K1 w - - 0 1',
      prompt: 'White to move. The kings are far away. Break through and create a passed pawn!',
      solution: ['b6', 'axb6', 'c6', 'bxa5', 'cxb7'],
      hints: ['Sacrifice the middle pawn first.', 'b6! Whatever Black takes with, push the pawn next to it.'],
      explanation: 'After b6 and c6, one white pawn always gets through: here the c-pawn captures on b7 and queens next move. Black\'s king is too far away to help.',
      puzzle: true,
      theme: 'breakthrough',
    },
  ],
  keyIdeas: [
    'Doubled pawns cannot protect each other.',
    'Isolated pawns have no pawn neighbors; the square in front of them is a great outpost for the enemy.',
    'Passed pawns have no enemy pawns in their way: push them!',
    'Fewer pawn islands usually means a healthier structure.',
  ],
  checkpoint: [
    {
      type: 'squares',
      prompt: 'Click White\'s **isolated pawn**.',
      fen: IQP_WHITE,
      answer: ['d4'],
      mode: 'one',
      explanation: 'White has no c- or e-pawn, so the d4 pawn is isolated.',
    },
    {
      type: 'squares',
      prompt: 'Click Black\'s **doubled pawns**.',
      fen: RUY_EXCH,
      answer: ['c6', 'c7'],
      mode: 'all',
      explanation: 'The pawns on c6 and c7 are on the same file: doubled.',
    },
    {
      type: 'squares',
      prompt: 'Click White\'s **passed pawn**.',
      fen: '8/5pk1/6p1/1P5p/7P/6P1/5PK1/8 w - - 0 1',
      answer: ['b5'],
      mode: 'one',
      explanation: 'No black pawn on the a-, b- or c-file can stop the b-pawn.',
    },
    {
      type: 'choice',
      prompt: 'Which of these is usually a **strength** for its owner?',
      options: [
        { text: 'A passed pawn', correct: true, feedback: 'Yes. A passed pawn can become a queen, so your opponent must watch it.' },
        { text: 'An isolated pawn', feedback: 'An isolated pawn can give active play, but it is a long-term weakness: no pawn can defend it.' },
        { text: 'Doubled pawns', feedback: 'Doubled pawns cannot protect each other and are usually a weakness.' },
      ],
    },
  ],
  practice: [
    {
      type: 'squares',
      prompt: 'Click the **isolated pawn**.',
      fen: IQP_BLACK_2,
      answer: ['d5'],
      mode: 'one',
      explanation: 'Black\'s d5 pawn has no c- or e-pawn beside it.',
    },
    {
      type: 'choice',
      prompt: 'How many pawn islands does **Black** have here?',
      fen: IQP_WHITE,
      options: [
        { text: '2', correct: true, feedback: 'Right: a7-b7 and e6-f7-g7-h7.' },
        { text: '1', feedback: 'The empty c- and d-files split Black\'s pawns into two groups.' },
        { text: '3', feedback: 'e6, f7, g7 and h7 are one group because they stand on neighboring files.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'Why are doubled pawns usually weak?',
      options: [
        { text: 'They cannot protect each other, and the front one blocks the back one', correct: true, feedback: 'Exactly.' },
        { text: 'They are worth less than one point each', feedback: 'Every pawn is worth about 1 point. The problem is that they cannot help each other.' },
        { text: 'They can never move', feedback: 'They can move. They just cannot defend each other.' },
      ],
    },
    {
      type: 'squares',
      prompt: 'Click White\'s **doubled pawns**.',
      fen: NIMZO_DBL,
      answer: ['c3', 'c4'],
      mode: 'all',
      explanation: 'The c3 and c4 pawns stand on the same file.',
    },
  ],
  reflect: 'Why can a weak pawn be a problem for a whole game, while a badly placed piece can be fixed in one move?',
};

const outposts: Lesson = {
  id: 'outposts-and-weak-squares',
  title: 'Outposts and Weak Squares',
  objective: 'You will be able to find squares the enemy pawns can no longer guard and plant a knight there.',
  minutes: 8,
  steps: [
    {
      type: 'explain',
      title: 'What is an outpost?',
      text:
        'An **outpost** is a square in or near the enemy half that **no enemy pawn can ever attack**. A piece placed there is very hard to remove.\n\n' +
        'Here Black\'s c-pawn is gone and the e-pawn has already passed e6. No black pawn can ever attack **d5**.',
      fen: NAJDORF,
      highlights: ['d5'],
      arrows: ['c3d5'],
    },
    {
      type: 'move',
      fen: NAJDORF,
      prompt: 'White to move. Put a knight on the outpost.',
      solution: ['Nd5'],
      highlights: ['d5'],
      hints: ['Which of your knights can jump to d5?'],
      explanation: 'The knight on d5 can never be chased by a pawn. Black can only remove it by trading a piece for it.',
    },
    {
      type: 'explain',
      title: 'Weak squares',
      text:
        'Every pawn move leaves squares behind that the pawn can never guard again. A square your pawns can no longer guard is a **weak square** (or **hole**).\n\n' +
        'Knights love these squares, because knights need stable posts close to the enemy.',
      fen: SVESHNIKOV,
      highlights: ['d5:yellow', 'f5:yellow'],
    },
    {
      type: 'squares',
      prompt: 'Same position. Click the two **holes** in Black\'s pawn structure on the 5th rank: squares no black pawn can ever attack.',
      fen: SVESHNIKOV,
      answer: ['d5', 'f5'],
      mode: 'all',
      hints: ['Black has no c-pawn and no g-pawn any more.'],
      explanation: 'With the c-pawn and g-pawn gone and the e-pawn on e5, no black pawn can ever attack d5 or f5.',
    },
    {
      type: 'move',
      fen: SVESHNIKOV,
      prompt: 'White to move. Occupy the best outpost.',
      solution: ['Nd5'],
      hints: ['The c3-knight is one jump away from a hole.'],
      explanation: 'Nd5 plants the knight in the hole. From there it hits f6, c7 and e7, and no pawn can ever kick it out.',
    },
    {
      type: 'explain',
      title: 'In front of an isolated pawn',
      text:
        'Remember isolated pawns? The square right in front of one is always an outpost for the other side: no pawn can attack it.\n\n' +
        'Black\'s d5 pawn is isolated, so **d4** is a dream square for a white knight. A piece there also blocks the pawn.',
      fen: IQP_BLACK_2,
      highlights: ['d5:red', 'd4'],
      arrows: ['f3d4'],
    },
    {
      type: 'move',
      fen: IQP_BLACK_2,
      prompt: 'White to move. Plant a knight in front of the isolated pawn.',
      solution: ['Nd4'],
      hints: ['Which knight can reach d4?'],
      explanation: 'The knight on d4 blocks the isolated pawn and can never be chased by a pawn.',
    },
    {
      type: 'squares',
      prompt: 'Black to move. Find the outpost for **Black**: a square in the center that no white pawn can ever attack.',
      fen: ENGLISH,
      orientation: 'black',
      answer: ['d4'],
      mode: 'one',
      hints: ['White\'s c-pawn and e-pawn have both moved to the 4th rank.'],
      explanation: 'White\'s pawns on c4 and e4 can never come back to attack d4. It is a perfect outpost for a black knight.',
    },
    {
      type: 'move',
      fen: ENGLISH,
      orientation: 'black',
      prompt: 'Black to move. Jump into the outpost.',
      solution: ['Nd4'],
      hints: ['The c6-knight is one jump away.'],
      explanation: 'The knight on d4 can never be chased by a pawn. If White trades it with Nxd4, Black recaptures with ...exd4 and gains space.',
    },
  ],
  keyIdeas: [
    'An outpost is a square no enemy pawn can ever attack.',
    'Pawn moves leave weak squares (holes) behind.',
    'Knights love outposts close to the enemy.',
    'The square in front of an isolated pawn is a natural outpost.',
  ],
  checkpoint: [
    {
      type: 'squares',
      prompt: 'Click the outpost square for White, in front of Black\'s isolated pawn.',
      fen: IQP_BLACK,
      answer: ['d4'],
      mode: 'one',
      explanation: 'No black pawn can ever attack d4, so it is a perfect home for a white piece.',
    },
    {
      type: 'move',
      fen: NAJDORF,
      prompt: 'White to move. Plant a knight on the outpost.',
      solution: ['Nd5'],
      explanation: 'No black pawn can attack d5. The knight is safe there for the rest of the game.',
    },
    {
      type: 'move',
      fen: ENGLISH,
      orientation: 'black',
      prompt: 'Black to move. Place a knight on your outpost.',
      solution: ['Nd4'],
      explanation: 'White\'s c- and e-pawns have advanced past d4, so the knight can never be chased away by a pawn.',
    },
    {
      type: 'choice',
      prompt: 'Why are knights especially good on outposts?',
      options: [
        { text: 'They need stable squares close to the enemy to be effective', correct: true, feedback: 'Yes. Knights are short-range pieces: on a safe forward square they are as strong as a rook in some positions.' },
        { text: 'Knights cannot be captured on outposts', feedback: 'Pieces can still capture them, just not pawns.' },
        { text: 'Bishops are not allowed on outposts', feedback: 'Any piece may use an outpost; knights just benefit the most.' },
      ],
    },
  ],
  practice: [
    {
      type: 'squares',
      prompt: 'Click the outpost square for White\'s knight.',
      fen: NAJDORF,
      answer: ['d5'],
      mode: 'one',
      explanation: 'Black\'s c-pawn is gone and the e-pawn is on e5, so no black pawn can ever attack d5.',
    },
    {
      type: 'move',
      fen: SVESHNIKOV,
      prompt: 'White to move. Find the strong knight move.',
      solution: ['Nd5'],
      explanation: 'Nd5 occupies the hole on d5. No black pawn can ever attack it there.',
    },
    {
      type: 'move',
      fen: IQP_BLACK_2,
      prompt: 'White to move. Blockade the isolated pawn with a knight.',
      solution: ['Nd4'],
      explanation: 'The d4 square in front of the isolated d5 pawn is a perfect outpost.',
    },
    {
      type: 'choice',
      prompt: 'What makes a square a **weak square** (hole)?',
      options: [
        { text: 'None of your pawns can ever guard it again', correct: true, feedback: 'Right. Pawns cannot move backward, so the weakness is permanent.' },
        { text: 'An enemy piece attacks it right now', feedback: 'That can change next move. A hole is a square your pawns can never guard again.' },
        { text: 'It is on the edge of the board', feedback: 'Edge squares are not automatically weak. It is about which pawns can still guard them.' },
      ],
    },
  ],
  reflect: 'Before you push a pawn, which squares will it never be able to guard again?',
};

const kingSafety: Lesson = {
  id: 'king-safety',
  title: 'King Safety',
  objective: 'You will be able to keep your king safe and spot weaknesses around the enemy king.',
  minutes: 8,
  steps: [
    {
      type: 'explain',
      title: 'The pawn shield',
      text:
        'After castling, your king hides behind a **pawn shield**: the pawns in front of it. Here both kings sit behind three unmoved pawns.\n\n' +
        'Every move of those pawns opens a door. Move them only for a good reason.',
      fen: ITALIAN_OO,
      highlights: ['f2', 'g2', 'h2', 'f7', 'g7', 'h7'],
    },
    {
      type: 'choice',
      prompt: 'White to move. Which pawn move would weaken White\'s king the **most**?',
      fen: ITALIAN_OO,
      options: [
        { text: 'g4', correct: true, feedback: 'Yes. g4 rips open the shield: f3 and h3 lose their pawn guard and the king is exposed on the g-file.' },
        { text: 'h3', feedback: 'h3 is a small, often useful move: it gives the king an escape square. g4 is far more weakening.' },
        { text: 'a3', feedback: 'a3 is far from the king. It does not touch the pawn shield.' },
      ],
    },
    {
      type: 'explain',
      title: 'Don\'t leave the king in the center',
      text:
        'Once pawns are traded in the center, files open and the king on e1 or e8 becomes a target.\n\n' +
        'Here the e-file is already open. Castling now tucks the king away and brings the rook toward the center.',
      fen: ITALIAN_CASTLE,
      highlights: FILE('e').slice(1, 7).map((s) => s + ':yellow'),
    },
    {
      type: 'move',
      fen: ITALIAN_CASTLE,
      prompt: 'White to move. Get your king to safety.',
      solution: ['O-O'],
      goal: 'castle',
      hints: ['One move puts the king behind its pawns and the rook in play.'],
      explanation: 'Castling hides the king behind the f2-g2-h2 shield and connects the rooks. Do it before the center opens fully.',
    },
    {
      type: 'explain',
      title: 'Holes near the king',
      text:
        'When a pawn in front of the king moves, it leaves holes behind. After ...g6, the squares **f6** and **h6** can no longer be guarded by any black pawn.\n\n' +
        'If the bishop that guards those squares disappears, enemy pieces can land there right next to the king.',
      fen: '6k1/5pbp/6p1/8/8/8/5PPP/6K1 w - - 0 1',
      highlights: ['f6:red', 'h6:red'],
    },
    {
      type: 'squares',
      prompt: 'White has played **g3**. Click the two squares on the 3rd rank next to that pawn that no white pawn can guard any more.',
      fen: '6k1/5ppp/8/8/8/6P1/5P1P/6K1 w - - 0 1',
      answer: ['f3', 'h3'],
      mode: 'all',
      hints: ['Pawns guard diagonally forward. Which squares were guarded by the g-pawn on g2?'],
      explanation: 'The g-pawn used to guard f3 and h3 from g2. Now no pawn can cover them: they are holes next to the king.',
    },
    {
      type: 'choice',
      prompt: 'Your opponent\'s king is still in the center and the e-file is open, while your king is castled. What should you do?',
      options: [
        { text: 'Open lines and bring rooks and pieces toward the king', correct: true, feedback: 'Yes. A king stuck in the center is a target: hit it before it escapes.' },
        { text: 'Trade queens immediately', feedback: 'Trading queens takes the pressure off the enemy king. Attack first.' },
        { text: 'Close the center with pawn moves', feedback: 'That helps the enemy king! Keep lines open while it is stuck.' },
      ],
    },
    {
      type: 'explain',
      title: 'Count attackers and defenders',
      text:
        'Before you attack a king, count: how many of your pieces can reach the squares around it, and how many enemy pieces defend them?\n\n' +
        'If you have more attackers than they have defenders, an attack is likely to work. If not, bring more pieces first.',
      fen: ITALIAN_OO,
    },
  ],
  keyIdeas: [
    'Castle early, before the center opens.',
    'Move the pawns in front of your king only for a good reason.',
    'Pawn moves near the king leave holes behind.',
    'Attack a king that is stuck in the center.',
  ],
  checkpoint: [
    {
      type: 'move',
      fen: PIANISSIMO,
      orientation: 'black',
      prompt: 'Black to move. Bring your king to safety.',
      solution: ['O-O'],
      goal: 'castle',
      hints: ['You have developed enough pieces to castle.'],
      explanation: 'Castling tucks the king behind the f7-g7-h7 shield and activates the rook.',
    },
    {
      type: 'choice',
      prompt: 'Black to move. Which move weakens Black\'s king the most?',
      fen: ITALIAN_OO,
      orientation: 'black',
      options: [
        { text: '...g5', correct: true, feedback: 'Right. ...g5 leaves f6 and h6 unguarded and opens lines toward the king.' },
        { text: '...h6', feedback: 'A small step that gives the king an escape square. ...g5 is far more weakening.' },
        { text: '...a6', feedback: 'That pawn is far from the king.' },
      ],
    },
    {
      type: 'squares',
      prompt: 'Black has played **...g6**. Click the two squares on the 6th rank beside that pawn that no black pawn can guard any more.',
      fen: '6k1/5p1p/6p1/8/8/8/5PPP/6K1 w - - 0 1',
      answer: ['f6', 'h6'],
      mode: 'all',
      explanation: 'From g7 the pawn used to guard f6 and h6. Those squares are now holes next to Black\'s king.',
    },
    {
      type: 'choice',
      prompt: 'When is it a good idea to start an attack on the enemy king?',
      options: [
        { text: 'When more of my pieces can reach the king than the enemy has defenders', correct: true, feedback: 'Yes. Count attackers and defenders first.' },
        { text: 'As soon as my queen is out', feedback: 'A queen alone rarely mates. Bring more pieces first.' },
        { text: 'Only when the enemy king is castled', feedback: 'A king in the center is often the best target of all.' },
      ],
    },
  ],
  practice: [
    {
      type: 'move',
      fen: ITALIAN_CASTLE,
      prompt: 'White to move. The center is open. Make your king safe.',
      solution: ['O-O'],
      goal: 'castle',
      explanation: 'With open lines in the center, the king belongs behind its pawn shield.',
    },
    {
      type: 'choice',
      prompt: 'Which pawn move usually gives your castled king a helpful escape square without weakening it much?',
      options: [
        { text: 'h3 (or ...h6 for Black)', correct: true, feedback: 'Yes. This "luft" stops back-rank mates and only slightly loosens the shield.' },
        { text: 'g4 (or ...g5)', feedback: 'This tears open the pawn shield.' },
        { text: 'f3 and g4 together', feedback: 'That leaves big holes around your king.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'Why is a king in the center dangerous in the middlegame?',
      options: [
        { text: 'Center files open after pawn trades, and rooks and queens attack along them', correct: true, feedback: 'Exactly. That is why we castle early.' },
        { text: 'The king cannot move in the center', feedback: 'It can move, but it is exposed to attacks along open files and diagonals.' },
        { text: 'Kings in the center are worth fewer points', feedback: 'Value is not the issue: safety is.' },
      ],
    },
  ],
  reflect: 'Think of a game where your king got attacked. Which pawn move or delay made it possible?',
};

const makingAPlan: Lesson = {
  id: 'making-a-plan',
  title: 'Making a Plan',
  objective: 'You will be able to read a quiet position and pick a sensible plan.',
  minutes: 9,
  steps: [
    {
      type: 'explain',
      title: 'When there is no tactic',
      text:
        'Most moves in a game are quiet. Then you need a **plan**: a goal for the next few moves.\n\n' +
        'Look at the position with these questions:\n' +
        '- Are both kings safe?\n' +
        '- Are there weak pawns or weak squares?\n' +
        '- Which is my worst piece?\n' +
        '- Are there open files for my rooks?',
      fen: NAJDORF,
    },
    {
      type: 'choice',
      prompt: 'White to move. Black has a hole on d5 and a backward pawn on d6. What is a good plan for White?',
      fen: NAJDORF,
      options: [
        { text: 'Bring a knight to d5 and keep control of that square', correct: true, feedback: 'Yes. Owning the outpost on d5 is White\'s main idea in this structure.' },
        { text: 'Push the g-pawn and h-pawn at random', feedback: 'Pawn moves without a target only create weaknesses.' },
        { text: 'Trade every piece as fast as possible', feedback: 'Trading pieces without a reason gives up White\'s pressure on d5.' },
      ],
    },
    {
      type: 'explain',
      title: 'Pawns point the way',
      text:
        'Pawn chains point to where you should play. In this King\'s Indian, White\'s chain e4-d5 points to the **queenside**, and Black\'s chain e5-d6 points to the **kingside**.\n\n' +
        'So White expands with b4 and c5, while Black prepares ...f5. Attack where your pawns point.',
      fen: KID,
      arrows: ['e4d5:blue', 'b2b4', 'c4c5', 'f7f5:red'],
    },
    {
      type: 'move',
      fen: KID,
      prompt: 'White to move. Start the queenside plan: gain space with a pawn so that c4-c5 can follow.',
      solution: ['b4'],
      accept: ['Rb1', 'a3'],
      hints: ['Which pawn supports c5?'],
      explanation: 'b4 grabs space and prepares c5, attacking the base of Black\'s chain on d6. Rb1 or a3 to prepare it are also fine.',
    },
    {
      type: 'choice',
      prompt: 'Black to move in the same structure. Which plan fits **Black\'s** pawn chain?',
      fen: 'r1bq1rk1/ppp1npbp/3p1np1/3Pp3/1PP1P3/2N2N2/P3BPPP/R1BQ1RK1 b - - 0 9',
      orientation: 'black',
      options: [
        { text: 'Prepare ...f5 and attack on the kingside', correct: true, feedback: 'Yes. Black\'s chain points to the kingside, so that is where Black plays.' },
        { text: 'Fight on the queenside with ...b5', feedback: 'That is where White is stronger. Play where your own chain points.' },
        { text: 'Wait and move the king back and forth', feedback: 'Waiting lets White\'s queenside plan run freely.' },
      ],
    },
    {
      type: 'explain',
      title: 'Plans with weaknesses',
      text:
        'A weakness gives you a target. Against an isolated pawn, the classic plan is: **block** it with a piece in front of it, then **attack** it, and trade pieces so it has fewer defenders.\n\n' +
        'Here White first plants a knight on d4, then brings rooks to the d-file.',
      fen: IQP_BLACK_2,
      highlights: ['d5:red', 'd4'],
      arrows: ['f3d4', 'f1d1:blue'],
    },
    {
      type: 'move',
      fen: IQP_BLACK_2,
      prompt: 'White to move. Begin the plan against the isolated pawn.',
      solution: ['Nd4'],
      hints: ['Block first: put a piece in front of the pawn.'],
      explanation: 'The knight on d4 blocks the pawn, cannot be chased by pawns, and eyes c6 and e6. Next come the rooks.',
    },
    {
      type: 'choice',
      prompt: 'White to move. Queens are off. What is White\'s long-term advantage in this endgame?',
      fen: RUY_EXCH_END,
      options: [
        { text: 'White\'s 4 healthy kingside pawns can make a passed pawn; Black\'s doubled c-pawns cannot do the same on the queenside', correct: true, feedback: 'Right. That is why White traded on c6 early in this opening.' },
        { text: 'White has more pieces', feedback: 'Material is equal. Look at the pawn structure.' },
        { text: 'Black\'s king is unsafe', feedback: 'With queens off, the kings are fairly safe. The pawns tell the story here.' },
      ],
    },
    {
      type: 'move',
      fen: ROOK_7TH_A,
      prompt: 'White to move. Pick the plan: use your open file and play its first move.',
      solution: ['Rd7'],
      hints: ['Where is a rook strongest?'],
      explanation: 'The rook on the 7th rank attacks b7 and f7 and keeps Black passive. A clear plan beats random moves.',
    },
  ],
  keyIdeas: [
    'No tactic? Make a plan: kings, weak pawns, worst piece, open files.',
    'Attack in the direction your pawn chain points.',
    'Against a weak pawn: block it, attack it, trade its defenders.',
    'A simple plan played move by move beats random moves.',
  ],
  checkpoint: [
    {
      type: 'choice',
      prompt: 'Black to move. White has an isolated d-pawn. What is a good plan for Black?',
      fen: IQP_WHITE,
      orientation: 'black',
      options: [
        { text: 'Keep a knight on d5 to block the pawn and trade pieces toward an endgame', correct: true, feedback: 'Yes. Blockade and simplify: the isolated pawn gets weaker as pieces come off.' },
        { text: 'Move the knight away from d5 to attack on the queenside', feedback: 'The knight on d5 is Black\'s best piece. It blocks the pawn and cannot be chased by pawns.' },
        { text: 'Push ...e5 to trade the pawn as soon as possible', feedback: 'Trading the isolated pawn removes White\'s weakness. Keep it on the board and attack it.' },
      ],
    },
    {
      type: 'move',
      fen: SVESHNIKOV,
      prompt: 'White to move. Black has holes on d5 and f5. Start your plan.',
      solution: ['Nd5'],
      explanation: 'Nd5 occupies the hole. With no black pawn able to attack it, the knight dominates the board.',
    },
    {
      type: 'choice',
      prompt: 'White to move. White\'s pawn chain e4-d5 points toward the queenside. Where should White play?',
      fen: KID,
      options: [
        { text: 'On the queenside, with b4 and c5', correct: true, feedback: 'Yes. Attack where your pawns point.' },
        { text: 'On the kingside, with g4 and h4', feedback: 'That weakens White\'s own king. The chain points the other way.' },
        { text: 'Nowhere: just wait', feedback: 'Waiting lets Black start the kingside attack with ...f5 first.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'You have looked for tactics and found none. Which question should you ask next?',
      options: [
        { text: 'Which is my worst piece, and where are the weaknesses?', correct: true, feedback: 'Yes. That leads straight to a plan.' },
        { text: 'Which pawn can I push quickly?', feedback: 'Pawn moves without a reason create weaknesses.' },
        { text: 'How can I get my queen out?', feedback: 'The queen alone rarely achieves anything. Think about the whole team.' },
      ],
    },
  ],
  practice: [
    {
      type: 'move',
      fen: KID,
      prompt: 'White to move. Play the first move of the queenside plan.',
      solution: ['b4'],
      accept: ['Rb1', 'a3'],
      explanation: 'b4 prepares c5, attacking Black\'s pawn chain at its base.',
    },
    {
      type: 'move',
      fen: FRENCH_NE7,
      orientation: 'black',
      prompt: 'Black to move. The plan is to pile up on d4. Bring another piece to attack it.',
      solution: ['Nf5'],
      explanation: 'Nf5 adds a third attacker on d4, with the c6-knight and the b6-queen.',
    },
    {
      type: 'choice',
      prompt: 'Your opponent\'s king is castled and well defended, but they have a weak isolated pawn. What is usually the better plan?',
      options: [
        { text: 'Block and attack the weak pawn', correct: true, feedback: 'Yes. A permanent weakness is a reliable target.' },
        { text: 'Throw all your pawns at the castled king', feedback: 'Against a well-defended king that usually just weakens your own position.' },
        { text: 'Offer a draw', feedback: 'You have a clear target. Play for it!' },
      ],
    },
  ],
  reflect: 'In your next game, pause at a quiet moment and name your plan in one sentence. What did you choose?',
};

const learningFromGames: Lesson = {
  id: 'learning-from-your-games',
  title: 'Learning From Your Games',
  objective: 'You will be able to review your own games and turn mistakes into lessons.',
  minutes: 9,
  steps: [
    {
      type: 'explain',
      title: 'Every game is a lesson',
      text:
        'The fastest way to improve is to learn from **your own** games. Win or lose, spend five minutes looking back at each serious game.\n\n' +
        'Let\'s review a short game together. Imagine you had Black.',
    },
    {
      type: 'explain',
      title: 'The game',
      text: 'Step through the game. Black grabs the white queen, and then something goes very wrong.',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      orientation: 'black',
      demo: {
        moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#'],
        captions: [
          'White opens with the e-pawn.',
          'Black answers in the center.',
          'White develops and attacks e5.',
          'Black defends e5.',
          'White\'s bishop aims at f7.',
          'Black pins the knight to the queen.',
          'White develops.',
          'A slow move: Black ignores what is happening in the center.',
          'White takes on e5 and leaves the queen hanging!',
          'Black grabs the queen without checking White\'s threats.',
          'Check! The king must move.',
          'The only move.',
          'Checkmate by three minor pieces.',
        ],
      },
    },
    {
      type: 'choice',
      prompt: 'Which Black move lost the game?',
      fen: 'rn1qkbnr/ppp2p1p/3p2p1/4N3/2B1P1b1/2N5/PPPP1PPP/R1BQK2R b KQkq - 0 5',
      orientation: 'black',
      options: [
        { text: '5...Bxd1, taking the queen', correct: true, feedback: 'Yes. Grabbing the queen walked into a forced mate: Bxf7+ and Nd5#.' },
        { text: '4...g6', feedback: 'That was a slow move that let Nxe5 happen, but Black could still save the game. The losing move came next.' },
        { text: '3...Bg4', feedback: 'Pinning the knight is a normal developing move. The real problem came later.' },
      ],
      explanation: 'Find the **turning point**: the move after which the game could no longer be saved.',
    },
    {
      type: 'explain',
      title: 'Find the turning point',
      text:
        'When you review, stop at the moment the game changed. Ask: **What was I thinking here? What did I miss?**\n\n' +
        'Then look for a better move, as if it were a puzzle. Here Black should have taken the knight instead of the queen.',
      fen: LEGAL_5,
      orientation: 'black',
    },
    {
      type: 'move',
      fen: LEGAL_5,
      orientation: 'black',
      prompt: 'Black to move. Replay the turning point: find the move that keeps Black in the game.',
      solution: ['dxe5'],
      accept: ['Be6'],
      hints: ['Before grabbing the queen, check White\'s checks after it: Bxf7+!', 'Capture the knight that just took on e5.'],
      wrong: {
        Bxd1: 'This is the game move: Bxf7+ Ke7 Nd5# is checkmate.',
      },
      explanation: '...dxe5 removes the knight. After Qxg4, White has only won a pawn and Black is still in the game.',
    },
    {
      type: 'explain',
      title: 'Name the mistake',
      text:
        'Give each big mistake a label. Most beginner mistakes are one of these:\n\n' +
        '- **Missed threat:** you ignored what their move wanted.\n' +
        '- **Hanging piece:** you left something undefended.\n' +
        '- **Missed tactic:** you had a win and didn\'t see it.\n' +
        '- **No plan:** you drifted with random moves.',
    },
    {
      type: 'choice',
      prompt: 'Which label fits Black\'s 5...Bxd1?',
      options: [
        { text: 'Missed threat: Black didn\'t check White\'s checks after taking the queen', correct: true, feedback: 'Yes. One blunder check would have spotted Bxf7+.' },
        { text: 'No plan', feedback: 'The problem was more concrete: Black missed White\'s mating threat.' },
        { text: 'Hanging piece', feedback: 'Black didn\'t leave a piece hanging; Black walked into a mate.' },
      ],
    },
    {
      type: 'explain',
      title: 'Then use the engine',
      text:
        'After your own review, check the game with a computer. It shows what you missed, but don\'t just read the numbers: replay the better moves and ask **why** they are better.\n\n' +
        'Write down one lesson per game, like "check their checks before grabbing material". Patterns that repeat are what you should study next.',
    },
    {
      type: 'choice',
      prompt: 'What is the best order for reviewing a game?',
      options: [
        { text: 'Review it yourself first, then check with an engine', correct: true, feedback: 'Yes. Your own thinking first, then the engine to find what you missed.' },
        { text: 'Only look at the engine evaluation graph', feedback: 'Numbers alone don\'t teach you much. First work out what you were thinking.' },
        { text: 'Don\'t review: just play the next game', feedback: 'Without review, you tend to repeat the same mistakes.' },
      ],
    },
    {
      type: 'explain',
      title: 'Play games you can learn from',
      text:
        'Very fast games build bad habits: there is no time for the routine. Play **longer games**, like 15 minutes plus 10 seconds per move or slower, so you can think on every move.\n\n' +
        'Play the computer in Play mode, or people near your level, and review every game you lose.',
    },
    {
      type: 'choice',
      prompt: 'Which time control helps a beginner improve the most?',
      options: [
        { text: '15 minutes + 10 seconds per move (or slower)', correct: true, feedback: 'Yes. Enough time to use your thinking routine every move.' },
        { text: '1 minute per game', feedback: 'Bullet is fun, but there is no time to think, so you mostly practice rushing.' },
        { text: '3 minutes per game', feedback: 'Still too fast to check threats and candidates every move.' },
      ],
    },
  ],
  keyIdeas: [
    'Review every serious game, especially losses.',
    'Find the turning point and ask what you missed.',
    'Label the mistake: missed threat, hanging piece, missed tactic or no plan.',
    'Play longer games so you have time to think.',
  ],
  checkpoint: [
    {
      type: 'choice',
      prompt: 'You just lost a game. What is the most useful thing to do next?',
      options: [
        { text: 'Find the turning point and work out what you missed', correct: true, feedback: 'Yes. That is how a loss becomes a lesson.' },
        { text: 'Immediately play another fast game to win back rating', feedback: 'Tilted fast games usually repeat the same mistakes.' },
        { text: 'Blame bad luck and move on', feedback: 'Chess has no dice: every loss has a reason you can learn from.' },
      ],
    },
    {
      type: 'move',
      fen: LEGAL_5,
      orientation: 'black',
      prompt: 'Black to move. In the game, Black grabbed the queen and got mated. Find a safe move instead.',
      solution: ['dxe5'],
      accept: ['Be6'],
      wrong: {
        Bxd1: 'Bxf7+ Ke7 Nd5# is checkmate.',
      },
      explanation: '...dxe5 takes the knight. Black loses a pawn after Qxg4, but avoids the mate.',
    },
    {
      type: 'choice',
      prompt: 'You left your knight undefended and your opponent took it for free. Which label fits?',
      options: [
        { text: 'Hanging piece', correct: true, feedback: 'Yes. A blunder check before each move is the cure.' },
        { text: 'Missed tactic', feedback: 'That is when you had a winning idea and didn\'t see it.' },
        { text: 'No plan', feedback: 'This was a concrete oversight: a piece left undefended.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'When should you use a chess engine to review your game?',
      options: [
        { text: 'After you have gone through the game yourself', correct: true, feedback: 'Right. Think first, then let the engine show what you missed.' },
        { text: 'During the game', feedback: 'That is cheating! Engines are only for review after the game.' },
        { text: 'Never: engines are useless for beginners', feedback: 'Engines are great for finding missed tactics, as long as you also ask why.' },
      ],
    },
  ],
  practice: [
    {
      type: 'choice',
      prompt: 'You keep losing pieces to forks. What should you study next?',
      options: [
        { text: 'Fork puzzles, and checking for forks in your blunder check', correct: true, feedback: 'Yes. Let your mistakes choose what you practice.' },
        { text: 'A new opening', feedback: 'Openings won\'t fix a tactical blind spot.' },
        { text: 'Nothing: it was bad luck', feedback: 'A repeating pattern is not luck. It is your next lesson.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'What should you write down after reviewing a game?',
      options: [
        { text: 'One clear lesson, like "check their checks before grabbing material"', correct: true, feedback: 'Yes. One concrete lesson per game adds up fast.' },
        { text: 'Only the result', feedback: 'The result doesn\'t teach you anything. The lesson does.' },
        { text: 'A list of every move', feedback: 'The app already saves the moves. Write the lesson.' },
      ],
    },
    {
      type: 'choice',
      prompt: 'Who are the best opponents for learning?',
      options: [
        { text: 'Opponents close to your level, in longer games', correct: true, feedback: 'Yes. Close games with time to think teach the most.' },
        { text: 'Much stronger players in 1-minute games', feedback: 'You will lose quickly without learning why.' },
        { text: 'Only much weaker players', feedback: 'Easy wins feel good but don\'t test your skills.' },
      ],
    },
  ],
  reflect: 'Look back at your last lost game. What was the turning point, and which label fits the mistake?',
};

export const strategyUnit: Unit = {
  id: 'strategy',
  title: 'Thinking & Strategy',
  description: 'Learn how strong players think: choose candidate moves, activate pieces, use open files and pawn structure, and make a plan.',
  lessons: [howToThink, pieceActivity, openFiles, pawnStructure, outposts, kingSafety, makingAPlan, learningFromGames],
};
