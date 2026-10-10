import type { Lesson, MoveStep, Unit } from '../types';

/**
 * Tactics unit. Puzzle positions come from realistic games (mostly openings played
 * out to the middlegame) and every solution, including the opponent's replies, was
 * checked with Stockfish.
 */

/** A verified tactical puzzle (the validator re-checks it with the engine). */
const pz = (
  theme: string,
  fen: string,
  solution: string[],
  prompt: string,
  explanation: string,
  extra: Partial<MoveStep> = {},
): MoveStep => ({ type: 'move', fen, solution, prompt, explanation, puzzle: true, theme, ...extra });

// ---------------------------------------------------------------------------
// 1. Forks
// ---------------------------------------------------------------------------

const forks: Lesson = {
  id: 'forks',
  title: 'Forks',
  objective: 'You will be able to win material by attacking two enemy pieces with one move.',
  minutes: 9,
  steps: [
    {
      type: 'explain',
      title: 'One move, two targets',
      text:
        'A **fork** is a move that attacks two (or more) enemy pieces at once. Your opponent can only save one of them.\n\n' +
        'Watch this classic trick from the opening. Black gives up a knight for a moment, then a pawn fork wins it back.',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4',
      orientation: 'black',
      demo: {
        moves: ['Nxe4', 'Nxe4', 'd5'],
        captions: [
          'Black takes the e4 pawn, giving up the knight for a moment.',
          'White takes the knight.',
          'The d5 pawn attacks the bishop and the knight: a fork! Black wins one of them back.',
        ],
      },
    },
    {
      type: 'explain',
      title: 'Knight forks',
      text:
        'Knights are champion forkers: they jump, so their attacks cannot be blocked.\n\n' +
        'The best forks come with **check**. Here Nc6+ checks the king and attacks the rook on a7. The king must move, and then the knight takes the rook.',
      fen: '6r1/r1b1k1p1/5p2/NRP1pn1p/p7/P1B3P1/5P1P/3R2K1 w - - 0 28',
      arrows: ['a5c6', 'c6e7:red', 'c6a7:red'],
    },
    {
      type: 'squares',
      prompt: 'White to move. Click the square where your knight would **check the king and attack the rook** at the same time.',
      fen: '6B1/1pk3b1/p1n2Npp/6P1/5r2/P6P/8/1KR5 w - - 0 41',
      answer: ['d5'],
      mode: 'one',
      hints: ['Your knight is on f6. Look for a square a knight\'s jump away from both c7 and f4.'],
      explanation: 'From d5 the knight attacks c7 (the king) and f4 (the rook).',
    },
    pz('fork', '6B1/1pk3b1/p1n2Npp/6P1/5r2/P6P/8/1KR5 w - - 0 41', ['Nd5+', 'Kb8', 'Nxf4'],
      'White to move. Now play the fork and win the rook.',
      'Nd5+ checks the king and hits the rook. After the king steps away, Nxf4 wins a whole rook.',
      { highlights: ['d5', 'c7:red', 'f4:red'] }),
    pz('fork', '2r5/1pB2p2/6kp/p1pN2pb/P6b/2P2P2/1P4P1/2K4R w - - 7 37', ['Ne7+', 'Kg7', 'Nxc8'],
      'White to move. Find a knight check that also attacks a rook.',
      'Ne7+ forks the king on g6 and the rook on c8. The king must move, and Nxc8 wins the rook.',
      { hints: ['Look for a knight check.', 'From e7 the knight would attack g6 and c8.'] }),
    {
      type: 'explain',
      title: 'Pawn forks',
      text:
        'The cheapest piece makes the best forker: when a pawn attacks two pieces, you win at least a piece for a pawn.\n\n' +
        'Here e4-e5 attacks the bishop on d6 and the knight on f6. Look for pawn forks whenever two enemy pieces stand side by side, one square apart.',
      fen: '2r3k1/rqp2ppp/p2bpn2/1p6/3PP3/5N1P/PP1BQPP1/R3K2R w KQ - 9 20',
      arrows: ['e4e5', 'e5d6:red', 'e5f6:red'],
    },
    pz('fork', '2r3k1/rqp2ppp/p2bpn2/1p6/3PP3/5N1P/PP1BQPP1/R3K2R w KQ - 9 20', ['e5', 'Nd5', 'exd6'],
      'White to move. Fork two black pieces with a pawn.',
      'e5 attacks the bishop and the knight. Black saves the knight, and exd6 wins the bishop.',
      { highlights: ['d6:red', 'f6:red'] }),
    pz('fork', '4k2r/p1r1qpp1/bp2p2p/n1pP4/2P5/2N1P3/P1Q1BPPP/3R1RK1 w k - 3 18', ['d6', 'Qd8', 'dxc7'],
      'White to move. Use a pawn to attack two pieces at once.',
      'd6 forks the queen on e7 and the rook on c7. The queen must run, and dxc7 wins the rook.',
      { hints: ['Which pawn can step forward between two black pieces?'] }),
    {
      type: 'explain',
      title: 'Queen forks',
      text:
        'The queen attacks in eight directions, so she forks easily. The typical queen fork is a **check plus an attack on an undefended piece**.\n\n' +
        'Here ...Qg6+ checks the white king and also attacks the loose bishop on c6.',
      fen: '6k1/3RRpp1/p1B4p/1p5q/5n1P/1P6/P4P2/6K1 b - - 8 38',
      orientation: 'black',
      arrows: ['h5g6', 'g6g1:red', 'g6c6:red'],
    },
    pz('fork', '6k1/5pp1/p6p/1pq5/5n2/1P2R2P/P2R1P2/6KB b - - 3 34', ['Qc1+', 'Kh2', 'Qxd2'],
      'Black to move. Find a queen check that also attacks an undefended white piece.',
      '...Qc1+ checks the king and attacks the rook on d2, which nothing defends. After Kh2, ...Qxd2 wins the rook.',
      { hints: ['Which white piece is undefended?', 'A queen check on the first rank also hits d2.'] }),
    pz('fork', '3krn2/1pp1qpp1/p2pb3/4r1P1/3NPQ1R/P5P1/1PP5/1K1B3R b - - 10 29', ['Ng6', 'Qf2', 'Nxh4'],
      'Black to move. Win material with a fork.',
      '...Ng6 attacks the queen on f4 and the rook on h4 at the same time. The queen escapes, and ...Nxh4 wins the rook.'),
  ],
  keyIdeas: [
    'A fork attacks two or more pieces with one move.',
    'Knights, pawns and queens are the best forkers.',
    'Forks with check are the strongest: the king must move first.',
    'Look for loose (undefended) pieces and pieces on the same knight-jump pattern.',
  ],
  checkpoint: [
    pz('fork', 'r2rn1k1/p3qppp/bp6/4p3/P2N4/1P2PN2/1Q3PPP/R1R3K1 w - - 0 19', ['Nc6', 'Qd7', 'Nxd8'],
      'White to move. Win material with a fork.',
      'Nc6 attacks the queen on e7 and the rook on d8. The queen moves away, and Nxd8 wins the rook.'),
    pz('fork', 'rnb2rk1/pp4pp/4pq2/3p4/5P2/P1NPQ2N/1P4PP/R4RK1 b - - 2 18', ['d4', 'Qe4', 'dxc3'],
      'Black to move. Fork two white pieces.',
      '...d4 attacks the queen on e3 and the knight on c3. The queen moves, and ...dxc3 wins the knight.'),
    pz('fork', 'r3kb1r/p4ppp/q1b1p3/1p2N1P1/1n1Q3P/P3B3/4PP2/3RKB1R b Kkq - 0 18', ['Nc2+', 'Kd2', 'Nxd4'],
      'Black to move. Win the white queen.',
      '...Nc2+ checks the king and attacks the queen on d4. After the king moves, ...Nxd4 wins the queen.'),
    pz('fork', '5rk1/p3bpp1/b1p1p3/1r1qN3/p2PN2p/2P1Q2P/PP3PP1/3R1RK1 w - - 9 23', ['c4', 'Qxe5', 'dxe5'],
      'White to move. A pawn move wins a lot of material.',
      'c4 forks the queen on d5 and the rook on b5. Black\'s best is ...Qxe5, giving the queen for a knight: dxe5.'),
  ],
  practice: [
    pz('fork', 'r2qk2r/3b1p1p/p1nbpnp1/1p1p4/3PP3/2NB1N2/PP1B1PPP/2RQ1RK1 w kq - 1 16', ['e5', 'Be7', 'exf6'],
      'White to move. Win a piece with a pawn fork.',
      'e5 attacks the bishop on d6 and the knight on f6. The bishop retreats, and exf6 wins the knight.'),
    pz('fork', '3q2k1/3r2p1/1p3p1p/p1p1p2b/1nP1P2P/1PB2P2/P3B1P1/R3Q1K1 b - - 1 29', ['Nc2', 'Qc1', 'Nxa1'],
      'Black to move. Find the knight fork.',
      '...Nc2 attacks the queen on e1 and the rook on a1. The queen escapes, and ...Nxa1 wins the rook.'),
    pz('fork', '2r1r3/6kp/1p1P1qp1/p1n1pp2/3R4/2P1R2P/P1B1QPP1/6K1 w - - 0 38', ['d7', 'Nxd7', 'Rxd7+'],
      'White to move. Your passed pawn can fork two rooks.',
      'd7 attacks both rooks. Black takes with ...Nxd7, and Rxd7+ wins the knight with check: a knight for a pawn.'),
    pz('fork', '8/6k1/4r1p1/pN2rp2/P3p2R/1P6/3R1K2/8 b - - 5 37', ['e3+', 'Ke2', 'exd2+'],
      'Black to move. Win a rook with a pawn.',
      '...e3+ forks the king on f2 and the rook on d2. After the king moves, ...exd2+ wins the rook.'),
    pz('fork', '2r3k1/2qrnppp/p1p1p3/2P5/2NP4/7P/P2Q1PP1/1R1R2K1 w - - 2 31', ['Nb6', 'Rdd8', 'Nxc8'],
      'White to move. Fork two rooks with your knight.',
      'Nb6 attacks the rooks on c8 and d7. Only one can be saved, and Nxc8 wins the other.'),
    pz('fork', 'r1q2rk1/pb2b2p/1p3pp1/2nN3n/3N4/P3PQB1/1P3PPP/2R1KB1R b K - 0 17', ['Nd3+', 'Ke2', 'Nxc1+'],
      'Black to move. White\'s king hasn\'t castled. Punish it with a fork.',
      '...Nd3+ checks the king and attacks the rook on c1. After Ke2, ...Nxc1+ wins the rook.'),
    pz('fork', '8/2p2p1p/2k2rp1/4n3/3R3P/2P1B3/P4P2/4K3 b - - 5 38', ['Nf3+', 'Kf1', 'Nxd4'],
      'Black to move. Win the white rook.',
      '...Nf3+ checks the king and attacks the rook on d4. After the king moves, ...Nxd4 wins it.'),
  ],
  reflect: 'What should you look for in a position to spot a possible fork?',
};

// ---------------------------------------------------------------------------
// 2. Pins
// ---------------------------------------------------------------------------

const pins: Lesson = {
  id: 'pins',
  title: 'Pins',
  objective: 'You will be able to recognize pinned pieces and win material by attacking them.',
  minutes: 9,
  steps: [
    {
      type: 'explain',
      title: 'What is a pin?',
      text:
        'A **pin** is when a piece cannot move because a more valuable piece stands behind it on the same line.\n\n' +
        'Here the bishop on b5 pins the knight on c6 to the king on e8. The knight is not even allowed to move: that would put its own king in check. A pin to the king is an **absolute pin**.',
      fen: 'r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
      arrows: ['b5e8:red'],
      highlights: ['c6:yellow'],
    },
    {
      type: 'squares',
      prompt: 'Black to move. Click the black piece that is **pinned**.',
      fen: 'rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4',
      answer: ['f6'],
      mode: 'one',
      hints: ['Look along the lines from White\'s bishop on g5.'],
      explanation: 'The bishop on g5 pins the knight on f6 to the queen on d8.',
    },
    {
      type: 'explain',
      title: 'Absolute and relative pins',
      text:
        'This pin is **relative**: the queen, not the king, is behind the knight. The knight may legally move, but then Bxd8 wins the queen.\n\n' +
        'Pinned pieces are weak: they can\'t move freely, and they are poor defenders.',
      fen: 'rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4',
      orientation: 'black',
      arrows: ['g5d8:red'],
      highlights: ['f6:yellow'],
    },
    {
      type: 'choice',
      prompt: 'Black to move. Is Black allowed to move the knight on f6?',
      fen: 'rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4',
      orientation: 'black',
      options: [
        { text: 'Yes, but usually White then takes the queen on d8', correct: true, feedback: 'Right. A relative pin is legal to break, but it costs you what is behind.' },
        { text: 'No, it is against the rules', feedback: 'That is only true for an absolute pin, when the king is behind the pinned piece.' },
        { text: 'Yes, and it is completely safe', feedback: 'If the knight moves, Bxd8 captures the queen.' },
      ],
    },
    {
      type: 'explain',
      title: 'Attack the pinned piece',
      text:
        'A pinned piece is a sitting duck. Attack it again, ideally with a **pawn**: it cannot run away.\n\n' +
        'Here the white rook on d4 pins the bishop on f4 to the queen on h4. Now g2-g3 attacks the bishop with a pawn, and Black will lose it.',
      fen: '3r1rk1/p4ppp/8/3Bn3/3R1b1q/1N6/PP3PP1/3Q1RK1 w - - 0 21',
      arrows: ['d4h4:red', 'g2g3'],
      highlights: ['f4:yellow'],
    },
    pz('pin', '3r1rk1/p4ppp/8/3Bn3/3R1b1q/1N6/PP3PP1/3Q1RK1 w - - 0 21', ['g3', 'Qg5', 'Rxf4'],
      'White to move. The bishop on f4 is pinned to the queen. Attack it with a pawn and win it.',
      'g3 attacks the pinned bishop. The queen has to save itself, and Rxf4 wins the bishop.',
      { highlights: ['f4:red', 'h4:red'] }),
    {
      type: 'explain',
      title: 'Pinned pieces don\'t defend',
      text:
        'A piece that is pinned to its queen or king only **looks** like a defender. If it captures or moves, the piece behind it falls.\n\n' +
        'So when you count attackers and defenders, don\'t count a pinned defender!',
    },
    pz('pin', 'R1bqr1k1/6p1/2pB2n1/2Q2p1p/1P4n1/2NB4/1KP5/8 w - - 4 37', ['Bxf5', 'Bxf5', 'Rxd8'],
      'White to move. The black bishop on c8 is pinned to the queen. Take the pawn it seems to defend.',
      'Bxf5 grabs a pawn. If the pinned bishop takes back (...Bxf5), it leaves the c8-square and Rxd8 wins the queen.',
      { hints: ['Which pawn does the c8-bishop defend?', 'Bxf5: if ...Bxf5, what does the a8-rook see?'] }),
    pz('pin', '3r1rk1/p1b1qppp/5n2/2p1nb2/1p6/PP2PN1P/1B1NBPP1/R2Q1RK1 b - - 0 20', ['Nxf3+', 'Nxf3', 'Rxd1'],
      'Black to move. White\'s knight on d2 is pinned to the queen. Use it.',
      '...Nxf3+ forces a recapture. If the pinned knight on d2 takes back, ...Rxd1 wins the queen.',
      { hints: ['Look at the d-file: rook, knight, queen.'] }),
    pz('pin', 'r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6', ['Nxd5', 'Bxd8', 'Bb4+'],
      'Black to move. White just took on d5, thinking your knight on f6 is pinned. Prove that the pin is only relative.',
      '...Nxd5! gives up the queen for a moment. After Bxd8, ...Bb4+ forces Qd2, then ...Bxd2+ and ...Kxd8: Black ends up a whole piece ahead. A relative pin can be broken when you win more than you lose.',
      { hints: ['Can the knight on f6 take on d5 anyway?', 'If White takes your queen, which bishop check wins the white queen back?'] }),
  ],
  keyIdeas: [
    'A pin stops a piece from moving because a more valuable piece is behind it.',
    'Pinned to the king (absolute): it cannot move at all.',
    'Attack a pinned piece, especially with a pawn.',
    'A pinned piece is a fake defender.',
  ],
  checkpoint: [
    pz('pin', '5rk1/1bp3pp/1r2p3/q4p2/p2P4/P1nBPP2/2Q3PP/R1B1R1K1 w - - 3 28', ['Bd2'],
      'White to move. The black knight on c3 is attacked by your queen. Pin it and win it.',
      'Bd2 pins the knight on c3 to the queen on a5. The knight is attacked by the queen and the bishop and cannot move, and White can add more attackers (Rac1): it will fall.'),
    pz('pin', '1n6/2p2kpp/b5r1/p4p2/8/2PP1BPP/5N2/R5K1 w - - 2 31', ['Bh5'],
      'White to move. Pin a black piece to its king and win it.',
      'Bh5 pins the rook on g6 to the king on f7. The rook cannot move, so White wins it for the bishop.'),
    pz('pin', '3r1rk1/p3qppp/3B4/2p2b2/1p2n3/1P2P2P/P2NBPP1/R2Q1RK1 b - - 2 22', ['Rxd6', 'Nxe4', 'Rxd1'],
      'Black to move. White\'s knight on d2 stands between your rook and the white queen. Win material.',
      '...Rxd6 wins the bishop. If the knight on d2 takes on e4, it unpins itself from the queen and ...Rxd1 wins the queen.'),
  ],
  practice: [
    pz('pin', '2bq1nk1/5rp1/2pB4/2Q2p1p/1P4n1/2NB4/1KP5/R7 w - - 2 36', ['Ra8'],
      'White to move. Pin a black piece to the queen.',
      'Ra8 pins the bishop on c8 to the queen on d8. The bishop cannot move without losing the queen, and White wins it.'),
  ],
  reflect: 'Why is a pawn the perfect piece to attack a pinned piece with?',
};

export const tacticsUnit: Unit = {
  id: 'tactics',
  title: 'Tactics',
  description: 'Learn the tricks that win material and games: forks, pins, skewers, discovered attacks and more.',
  lessons: [forks, pins],
};
