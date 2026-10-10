import type { Unit } from '../types';

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
/** 1.e4 e5 2.Nf3 d6 3.Bb5+ */
const BB5_CHECK = 'rnbqkbnr/ppp2ppp/3p4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 3';
/** 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qe5+ */
const QE5_CHECK = 'rnb1kbnr/ppp1pppp/8/4q3/8/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 4';
/** 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 */
const ITALIAN = 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4';
/** 1.e4 Nf6 2.e5 d5 */
const ALEKHINE_D5 = 'rnbqkb1r/ppp1pppp/5n2/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3';

export const rulesUnit: Unit = {
  id: 'rules',
  title: 'The Rules of the Game',
  description: 'Check, checkmate, the special moves and how games are drawn: everything you need to play a real game.',
  lessons: [
    // ─────────────────────────────────────────────────────────────── check
    {
      id: 'check',
      title: 'Check',
      objective: 'You will be able to recognize when a king is in check and give check yourself.',
      minutes: 6,
      steps: [
        {
          type: 'explain',
          title: 'Attack and check',
          text:
            'A piece **attacks** a square if it could capture there on its next move.\n\n' +
            'When a king is attacked, he is **in check**. Here the white bishop on b5 attacks the black king along the diagonal, so Black is in check.',
          fen: BB5_CHECK,
          arrows: ['b5e8:red'],
          highlights: ['e8:red'],
        },
        {
          type: 'explain',
          title: 'Check must be answered',
          text:
            'A player in check must get out of it **right away**. Ignoring a check is not allowed.\n\n' +
            'And you may never make a move that puts or leaves your own king in check. That is why a king can never step onto an attacked square: you saw this rule in the king lesson.',
          fen: BB5_CHECK,
          arrows: ['b5e8:red'],
        },
        {
          type: 'squares',
          prompt: 'White is in check. Click the piece that is giving check.',
          fen: QE5_CHECK,
          answer: ['e5'],
          mode: 'one',
          hints: ['Follow the lines that lead to the white king on e1.'],
          explanation: 'The black queen on e5 attacks the king straight down the open e-file.',
        },
        {
          type: 'move',
          prompt: 'White to move. Give check with your rook.',
          fen: '6k1/5pp1/7p/8/8/8/5PPP/1R4K1 w - - 0 1',
          solution: ['Rb8+'],
          goal: 'check',
          piece: 'b1',
          highlights: ['b8'],
          hints: ['The rook needs to land on the same rank or file as the black king.'],
          explanation: 'On b8 the rook attacks along the 8th rank all the way to the king on g8. That is check.',
        },
        {
          type: 'move',
          prompt: 'White to move. Give check with your knight.',
          fen: '6k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1',
          solution: ['Nf6+'],
          goal: 'check',
          piece: 'd5',
          hints: ['Find a square from which the knight could jump onto g8.'],
          explanation: 'From f6 (or e7) the knight attacks g8. Knight checks are sneaky: they come from an L-shape, not a line.',
        },
        {
          type: 'choice',
          prompt: 'Is the white king in check?',
          fen: 'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
          options: [
            { text: 'No, the knight on c3 is in the way', correct: true, feedback: 'Right. The bishop aims at e1, but the knight blocks the diagonal.' },
            { text: 'Yes, the bishop on b4 attacks the king', feedback: 'Look at c3: the white knight stands between the bishop and the king, so the king is not attacked.' },
          ],
          explanation: 'A piece only gives check if nothing stands between it and the king (unless it is a knight).',
        },
        {
          type: 'squares',
          prompt: 'Click every square where the white rook could move to give check.',
          fen: '4k3/8/8/8/8/8/R7/6K1 w - - 0 1',
          answer: ['a8', 'e2'],
          mode: 'all',
          hints: ['The rook must reach the black king\'s rank (the 8th) or its file (the e-file).'],
          explanation: 'On a8 the rook attacks along the 8th rank; on e2 it attacks up the e-file. Both are check.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Give check with your queen.',
          fen: '3q2k1/5ppp/8/8/8/7P/5PP1/6K1 b - - 0 1',
          solution: ['Qd1+'],
          goal: 'check',
          explanation: 'The d-file is open, so the queen reaches d1 and attacks the king along the first rank.',
        },
        {
          type: 'choice',
          prompt: 'Are you ever allowed to make a move that leaves your own king in check?',
          options: [
            { text: 'No, never', correct: true, feedback: 'Right. Such a move is illegal.' },
            { text: 'Yes, if you capture something valuable', feedback: 'No capture is worth it: a move that leaves your king in check is simply illegal.' },
          ],
        },
      ],
      keyIdeas: [
        'A king that is attacked is in check.',
        'You must get out of check immediately.',
        'You may never move into check or leave your king in check.',
      ],
      checkpoint: [
        {
          type: 'squares',
          prompt: 'White is in check. Click the piece giving check.',
          fen: '5rk1/pbp2ppp/1p6/7q/8/5nP1/PPPQ1P1P/5RK1 w - - 0 1',
          answer: ['f3'],
          mode: 'one',
          explanation: 'The knight on f3 attacks g1 with its L-shaped jump. The queen on h5 and the bishop on b7 look dangerous, but neither attacks the king.',
        },
        {
          type: 'move',
          prompt: 'White to move. Give check with your bishop.',
          fen: 'rnbqkbnr/ppp2ppp/3p4/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
          solution: ['Bb5+'],
          goal: 'check',
          piece: 'f1',
          explanation: 'Black moved the d-pawn, opening the diagonal from b5 to e8. Bb5 gives check.',
        },
        {
          type: 'choice',
          prompt: 'Your king is in check, but you could capture your opponent\'s queen. May you capture the queen instead of dealing with the check?',
          options: [
            { text: 'No, unless capturing the queen also ends the check', correct: true, feedback: 'Right. Getting out of check always comes first.' },
            { text: 'Yes, the queen is worth 9 points', feedback: 'When you are in check, only moves that end the check are legal.' },
          ],
        },
        {
          type: 'squares',
          prompt: 'Click every square where the white bishop could move to give check.',
          fen: '4k3/8/8/8/8/8/4B3/6K1 w - - 0 1',
          answer: ['b5', 'h5'],
          mode: 'all',
          explanation: 'From b5 the bishop attacks e8 through c6 and d7; from h5 it attacks e8 through g6 and f7.'
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'White to move. Give check with your rook.',
          fen: '6k1/5pp1/7p/8/8/8/5PPP/1R4K1 w - - 0 1',
          solution: ['Rb8+'],
          goal: 'check',
          explanation: 'The rook on b8 attacks the king along the open 8th rank.',
        },
        {
          type: 'choice',
          prompt: 'A black knight could jump onto the square where the white king stands. Is the white king in check?',
          options: [
            { text: 'Yes', correct: true, feedback: 'Right. Any attack on the king is check, including a knight\'s jump.' },
            { text: 'No, knights cannot give check', feedback: 'Every piece except the king can give check, the knight included.' },
          ],
        },
        {
          type: 'squares',
          prompt: 'Black is in check. Click the piece giving check.',
          fen: BB5_CHECK,
          answer: ['b5'],
          mode: 'one',
          explanation: 'The bishop on b5 attacks e8 along the diagonal, through c6 and d7.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Give check with your knight.',
          fen: '6k1/5ppp/8/8/3n4/8/5PPP/6K1 b - - 0 1',
          solution: ['Ne2+'],
          goal: 'check',
          piece: 'd4',
          explanation: 'From e2 (or f3) the knight attacks g1.',
        },
      ],
      reflect: 'In your own words, what is the difference between attacking a piece and giving check?',
    },
    // ─────────────────────────────────────────────────────────────── escaping check
    {
      id: 'escaping-check',
      title: 'Getting Out of Check',
      objective: 'You will be able to escape a check in all three ways: moving the king, blocking, or capturing the checking piece.',
      minutes: 8,
      steps: [
        {
          type: 'explain',
          title: 'Three ways out',
          text:
            'When you are in check, you have exactly three ways out:\n\n' +
            '- **Move** the king to a safe square\n' +
            '- **Block** the check by putting a piece in between\n' +
            '- **Capture** the piece that gives check\n\n' +
            'Remember them as *move, block, capture*.',
          fen: QE5_CHECK,
          arrows: ['e5e1:red'],
        },
        {
          type: 'move',
          prompt: 'White is in check from the rook. Escape by **moving** your king.',
          fen: '6k1/5ppp/8/8/8/7P/5PP1/4r1K1 w - - 0 1',
          solution: ['Kh2'],
          highlights: ['h2'],
          hints: ['f1 is attacked by the rook. Look the other way.'],
          explanation: 'The rook controls the whole first rank, so the king steps up to h2. Your h-pawn move earlier made room for him.',
        },
        {
          type: 'move',
          prompt: 'White is in check from the bishop on c5. Escape by **blocking** with your bishop.',
          fen: '6k1/5ppp/8/2b5/4P3/5P2/6PP/2B3K1 w - - 0 1',
          solution: ['Be3'],
          highlights: ['e3', 'd4', 'f2'],
          wrong: {
            Kh1: 'That escapes too (moving the king), but this time practise blocking: put a piece between the bishop and your king.',
            Kf1: 'That escapes too (moving the king), but this time practise blocking: put a piece between the bishop and your king.',
          },
          explanation: 'Your bishop lands on e3, between the attacker and the king. The check is blocked.',
        },
        {
          type: 'move',
          prompt: 'White is in check from the knight on f3. Escape by **capturing** the knight.',
          fen: '6k1/5ppp/8/8/8/5n2/5PPP/3Q2K1 w - - 0 1',
          solution: ['gxf3'],
          goal: 'capture',
          accept: ['Qxf3'],
          wrong: {
            Kh1: 'Moving the king works, but you can do better: capture the knight and win a piece.',
            Kf1: 'Moving the king works, but you can do better: capture the knight and win a piece.',
          },
          explanation: 'Capturing the checking piece ends the check and wins material. A knight check can never be blocked, because the knight jumps.',
        },
        {
          type: 'explain',
          title: 'Which way is best?',
          text:
            'Often you have a choice. Capturing the attacker is usually best, because it wins material.\n\n' +
            'When you block, prefer a piece that is safe on its new square, and avoid walking your king into the open.',
          fen: BB5_CHECK,
          arrows: ['b5e8:red', 'c7c6'],
        },
        {
          type: 'move',
          prompt: 'Black is in check from the bishop. Block with a pawn, so that the pawn also attacks the bishop.',
          fen: BB5_CHECK,
          solution: ['c6'],
          hints: ['Which pawn can step onto the diagonal between b5 and e8?'],
          wrong: {
            Ke7: 'That escapes, but your king walks toward the middle, where he is easy to attack.',
            Nc6: 'That blocks, but now the knight is stuck: if it ever moves, the check comes back. The c-pawn blocks and attacks the bishop.',
            Bd7: 'That blocks, but the pawn move c6 also attacks the bishop.',
          },
          explanation: 'The pawn on c6 blocks the check and attacks the bishop, which now has to move.',
        },
        {
          type: 'move',
          prompt: 'White is in check on the back rank. Find the only move.',
          fen: '6k1/4Rppp/8/8/8/8/5PPP/4r1K1 w - - 0 1',
          solution: ['Rxe1'],
          explanation: 'The king is boxed in by his own pawns and nothing can block, but your rook can capture the checking rook.',
        },
        {
          type: 'move',
          prompt: 'White is in check from the rook on a1. Find the only move.',
          fen: '6k1/5ppp/8/8/8/3B4/2P2PPP/r5K1 w - - 0 1',
          solution: ['Bf1'],
          hints: ['The king cannot move and nothing can capture the rook. Can something block?'],
          explanation: 'The bishop drops back to f1 and blocks the rook\'s line. Without it, this would be checkmate.',
        },
        {
          type: 'choice',
          prompt: 'A knight is giving check. Which way out is impossible?',
          options: [
            { text: 'Blocking', correct: true, feedback: 'Right. The knight jumps, so there is nothing to block.' },
            { text: 'Moving the king', feedback: 'You can always try to step out of the knight\'s reach.' },
            { text: 'Capturing the knight', feedback: 'If one of your pieces attacks the knight, you can capture it.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White is in check. Get out of check and win material.',
          fen: '6k1/5ppp/8/8/4P2r/5P2/PP3BP1/7K w - - 0 1',
          solution: ['Bxh4'],
          wrong: { Kg1: 'That escapes, but you can capture the rook instead and win 5 points.' },
          explanation: 'The bishop captures the checking rook. Always look for a capture first.',
        },
      ],
      keyIdeas: [
        'Three ways out of check: move, block, capture.',
        'A knight check cannot be blocked.',
        'Capturing the checking piece is often best because it wins material.',
      ],
      checkpoint: [
        {
          type: 'move',
          prompt: 'White is in check from the bishop on b4. Block it with a pawn.',
          fen: 'rnbqk2r/p1pp1ppp/1p2pn2/8/1b1P4/3BPN2/PPP2PPP/RNBQK2R w KQkq - 2 5',
          solution: ['c3'],
          wrong: {
            Kf1: 'That escapes, but the king leaves his home square. Block with a pawn instead.',
            Nbd2: 'That blocks, but the c-pawn can block and attack the bishop at the same time.',
          },
          explanation: 'c3 blocks the diagonal and attacks the bishop.',
        },
        {
          type: 'move',
          prompt: 'Black is in check from the knight. Get out of check.',
          fen: '4q1rk/5Npp/8/8/8/8/5PPP/6K1 b - - 0 1',
          solution: ['Qxf7'],
          explanation: 'The king has no squares and a knight check cannot be blocked, so the queen captures the knight.',
        },
        {
          type: 'move',
          prompt: 'White is in check from the queen. Find the only move.',
          fen: '6k1/5ppp/8/8/8/5P2/6qP/R5K1 w - - 0 1',
          solution: ['Kxg2'],
          explanation: 'The queen is right next to your king and nothing protects her, so the king captures her.',
        },
        {
          type: 'choice',
          prompt: 'Which of these is NOT a way to get out of check?',
          options: [
            { text: 'Giving check back to the enemy king', correct: true, feedback: 'Right. A counter-check does not help: your king would still be in check, so it is illegal.' },
            { text: 'Moving the king to a safe square', feedback: 'That is one of the three ways out.' },
            { text: 'Blocking with a piece', feedback: 'That is one of the three ways out (except against a knight).' },
            { text: 'Capturing the checking piece', feedback: 'That is one of the three ways out.' },
          ],
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'White is in check from the queen. Block the check without losing material.',
          fen: QE5_CHECK,
          solution: ['Be2'],
          accept: ['Nge2', 'Nce2', 'Qe2'],
          wrong: { Ne4: 'That blocks, but the queen simply captures the knight on e4.' },
          explanation: 'The bishop on e2 blocks the e-file and is protected by the king, queen and knight.',
        },
        {
          type: 'move',
          prompt: 'Black is in check from the rook. Get out of check.',
          fen: '1R4k1/5p1p/6p1/8/8/8/5PPP/6K1 b - - 0 1',
          solution: ['Kg7'],
          explanation: 'Nothing can block or capture the rook, but the king can step up to g7, made free by the g-pawn.',
        },
        {
          type: 'choice',
          prompt: 'A black queen gives check from the square next to your king, and a black bishop protects her. Can your king capture the queen?',
          options: [
            { text: 'No, he would be moving into check', correct: true, feedback: 'Right. After capturing, the bishop would attack your king, so the capture is illegal.' },
            { text: 'Yes, kings can capture', feedback: 'Kings can capture, but never a protected piece: that would mean moving into check.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White is in check. Escape by capturing the checking piece.',
          fen: '6k1/5ppp/8/8/8/5n2/5PPP/3Q2K1 w - - 0 1',
          solution: ['gxf3'],
          goal: 'capture',
          accept: ['Qxf3'],
          explanation: 'The knight cannot be blocked, but it can be captured.',
        },
      ],
      reflect: 'When you are in check, in which order would you look for the three ways out, and why?',
    },
    // ─────────────────────────────────────────────────────────────── checkmate
    {
      id: 'checkmate',
      title: 'Checkmate',
      objective: 'You will be able to tell checkmate from check and deliver a simple checkmate in one move.',
      minutes: 8,
      steps: [
        {
          type: 'explain',
          title: 'Check with no way out',
          text:
            '**Checkmate** (or just **mate**) is a check with no way out: the king cannot move to safety, the check cannot be blocked, and the checking piece cannot be captured.\n\n' +
            'Checkmate ends the game at once. Whoever delivers it wins. This is the goal of chess.',
          fen: '4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1',
          arrows: ['e8g8:red'],
          highlights: ['g8:red'],
        },
        {
          type: 'explain',
          title: 'Checking for mate',
          text: 'Watch the rook give check, then test the three ways out one by one.',
          fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
          demo: {
            moves: ['Re8#'],
            captions: [
              'Check! Move? f8 and h8 are covered by the rook, and f7, g7, h7 are taken by Black\'s own pawns. Block? Nothing can reach f8. Capture? Nothing attacks e8. Checkmate!',
            ],
          },
        },
        {
          type: 'choice',
          prompt: 'Black is in check. Is it checkmate?',
          fen: '4R1k1/5pp1/7p/8/8/8/5PPP/6K1 b - - 0 1',
          options: [
            { text: 'No, the king can escape to h7', correct: true, feedback: 'Right. The pawn on h6 gave the king a little escape square.' },
            { text: 'Yes, it is checkmate', feedback: 'Test every king move. With the h-pawn on h6, the square h7 is free and safe.' },
          ],
          explanation: 'Before you shout mate, check every escape square, block and capture.',
        },
        {
          type: 'choice',
          prompt: 'Black is in check. Is it checkmate?',
          fen: '6k1/6Q1/5K2/8/8/8/8/8 b - - 0 1',
          options: [
            { text: 'Yes', correct: true, feedback: 'Right. Every square around the black king is covered, and the queen is protected by the white king.' },
            { text: 'No, the king can capture the queen', feedback: 'The white king on f6 protects the queen. Capturing her would mean moving into check.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Black is in check. Is it checkmate?',
          fen: '6k1/6Q1/8/5K2/8/8/8/8 b - - 0 1',
          options: [
            { text: 'No, the king can capture the queen', correct: true, feedback: 'Right. Nothing protects the queen on g7.' },
            { text: 'Yes', feedback: 'Look at the white king: on f5 he is too far away to protect the queen, so Black plays Kxg7.' },
          ],
          explanation: 'A queen right next to the king needs protection, otherwise the king simply captures her.',
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: '6k1/pp3ppp/8/8/1n6/8/5PPP/3R2K1 w - - 0 1',
          solution: ['Rd8#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          highlights: ['d8'],
          hints: ['Black\'s king is trapped behind his own pawns.', 'Get your rook to the 8th rank.'],
          explanation: 'The rook checks along the back rank, and the king\'s own pawns block every escape. This is called a **back-rank mate**.',
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: '6k1/Q7/5K2/8/8/8/8/8 w - - 0 1',
          solution: ['Qg7#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          hints: ['Bring the queen right next to the king, where your own king protects her.'],
          wrong: { 'Qa8+': 'Check, but the king escapes to h7.', 'Qf7+': 'Check, but the king escapes to h8.' },
          explanation: 'On g7 the queen attacks every square around the black king, and your king protects her.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Checkmate in one move.',
          fen: 'r5k1/5ppp/8/8/2N5/8/5PPP/6K1 b - - 0 1',
          solution: ['Ra1#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          hints: ['White\'s king is stuck behind his own pawns too.'],
          explanation: 'A back-rank mate for Black: the rook checks along the first rank and nothing can block or capture it.',
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: 'r1bq1rk1/ppp2pp1/4p3/7Q/8/3B4/PPP2PPP/5RK1 w - - 0 1',
          solution: ['Qh7#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          wrong: { 'Bh7+': 'Check, but the king escapes to h8. Use the bishop as a helper instead.' },
          explanation: 'The queen checks from h7, protected by the bishop on d3. The king is boxed in by his own rook and pawns.',
        },
      ],
      keyIdeas: [
        'Checkmate is check with no escape: no move, no block, no capture.',
        'Checkmate wins the game immediately.',
        'To check for mate, test every king square, every block and every capture.',
      ],
      checkpoint: [
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: '5k2/8/5K2/8/8/8/8/R7 w - - 0 1',
          solution: ['Ra8#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'Your king covers e7, f7 and g7; the rook checks along the 8th rank. No escape.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Checkmate in one move.',
          fen: '6k1/1b3ppp/8/6q1/8/8/5PPP/R2Q2K1 b - - 0 1',
          solution: ['Qxg2#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'The queen captures on g2, protected by the bishop on b7. The king cannot capture her and has no safe squares.',
        },
        {
          type: 'choice',
          prompt: 'Black is in check. Is it checkmate?',
          fen: '4R1k1/3n1ppp/8/8/8/8/5PPP/6K1 b - - 0 1',
          options: [
            { text: 'No, the knight can block on f8', correct: true, feedback: 'Right. Nd7-f8 blocks the rook\'s line.' },
            { text: 'Yes, it is a back-rank mate', feedback: 'The king cannot move, but look for a block: the knight on d7 can jump to f8.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: 'r5rk/6pp/8/6N1/8/8/5PPP/6K1 w - - 0 1',
          solution: ['Nf7#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'The knight checks from f7, and the king is surrounded by his own pieces. A knight check cannot be blocked.',
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: '7k/1Q6/6K1/8/8/8/8/8 w - - 0 1',
          solution: ['Qg7#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'With your king on g6 covering g7 and h7, several queen moves mate: g7, h7, or a check along the 8th rank.',
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move.',
          fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
          solution: ['Re8#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'A back-rank mate: the king is trapped behind his own pawns.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Checkmate in one move.',
          fen: '8/8/8/8/8/8/4pkPP/7K b - - 0 1',
          solution: ['e1=Q#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'The pawn becomes a new queen (or rook) on e1 and checks along the first rank. Your king covers g1, and White\'s own pawns fill g2 and h2.',
        },
        {
          type: 'choice',
          prompt: 'Which statement about checkmate is true?',
          options: [
            { text: 'It ends the game immediately', correct: true, feedback: 'Right. The king is never actually captured: the game is over.' },
            { text: 'The king is then captured on the next move', feedback: 'Kings are never captured. Checkmate itself ends the game.' },
            { text: 'The player with more material wins anyway', feedback: 'Material does not matter once the king is mated.' },
          ],
        },
      ],
      reflect: 'Why is a queen next to the enemy king only checkmate when she is protected?',
    },
    // ─────────────────────────────────────────────────────────────── stalemate
    {
      id: 'stalemate',
      title: 'Stalemate',
      objective: 'You will be able to recognize stalemate and avoid stalemating your opponent when you are winning.',
      minutes: 6,
      steps: [
        {
          type: 'explain',
          title: 'No moves, but no check',
          text:
            '**Stalemate** happens when the player to move is *not* in check but has no legal move.\n\n' +
            'The game ends immediately as a **draw**: nobody wins. Here Black is to move. The king is not in check, but every square around him is covered.',
          fen: '7k/8/6Q1/8/8/8/2K5/8 b - - 0 1',
          highlights: ['g8:red', 'g7:red', 'h7:red'],
        },
        {
          type: 'choice',
          prompt: 'Black to move. What is the result?',
          fen: 'k7/2Q5/1K6/8/8/8/8/8 b - - 0 1',
          options: [
            { text: 'Stalemate: a draw', correct: true, feedback: 'Right. Black is not in check, but a7, b7 and b8 are all covered.' },
            { text: 'Checkmate: White wins', feedback: 'Is the black king attacked right now? No. No check means it cannot be checkmate.' },
            { text: 'Nothing special, play goes on', feedback: 'Try to find a legal move for Black. There is none.' },
          ],
          explanation: 'No legal moves plus no check equals stalemate.',
        },
        {
          type: 'choice',
          prompt: 'Black to move. What is the result?',
          fen: 'k7/1Q6/1K6/8/8/8/8/8 b - - 0 1',
          options: [
            { text: 'Checkmate: White wins', correct: true, feedback: 'Right. The king is in check, and the queen is protected.' },
            { text: 'Stalemate: a draw', feedback: 'The queen on b7 attacks the king, so Black is in check. Check with no way out is checkmate.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Black to move. What is the result?',
          fen: 'k7/2Q5/1K6/7p/8/8/8/8 b - - 0 1',
          options: [
            { text: 'Play goes on: Black can move the pawn', correct: true, feedback: 'Right. The king is stuck, but the pawn can still move to h4.' },
            { text: 'Stalemate: a draw', feedback: 'Stalemate means no legal moves at all. Black\'s pawn can move.' },
          ],
          explanation: 'Stalemate counts every piece. As long as anything can move, the game goes on.',
        },
        {
          type: 'explain',
          title: 'The beginner\'s trap',
          text:
            'Stalemate is painful when you are winning. You have a whole extra queen, and suddenly the game is a draw.\n\n' +
            'When your opponent has only a king left, ask before every move: *after this move, does his king have a legal move?*',
          fen: '7k/3Q4/5K2/8/8/8/8/8 w - - 0 1',
          demo: {
            moves: ['Qf7'],
            captions: ['White plays Qf7?? Black is not in check and has no legal move: stalemate. A sure win became a draw.'],
          },
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move, and do not stalemate!',
          fen: '7k/3Q4/5K2/8/8/8/8/8 w - - 0 1',
          solution: ['Qg7#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          wrong: { Qf7: 'Stalemate! Black is not in check and has no legal moves. The game is a draw.' },
          hints: ['You need a check: a quiet move would leave Black with no moves.', 'Your king on f6 protects g7.'],
          explanation: 'Qg7 is check, protected by the king: checkmate. A quiet move like Qf7 would leave Black no moves without check: stalemate.',
        },
        {
          type: 'choice',
          prompt: 'White to move plays Kf6. What happens?',
          fen: '5k2/5P2/4K3/8/8/8/8/8 w - - 0 1',
          options: [
            { text: 'Stalemate', correct: true, feedback: 'Right. Black is not in check, and e7, e8, g7, g8 are all covered. The pawn is protected.' },
            { text: 'Black must take the pawn', feedback: 'After Kf6 the king protects the pawn, so Black cannot take it. And Black has no other move.' },
            { text: 'Checkmate', feedback: 'The black king is not in check, so it cannot be checkmate.' },
          ],
          explanation: 'Even with a king and pawn, watch out: taking away the last square without giving check is stalemate.',
        },
        {
          type: 'choice',
          prompt: 'You are losing badly. Is stalemate good or bad for you?',
          options: [
            { text: 'Good: a draw is much better than a loss', correct: true, feedback: 'Right. Stalemate can be a great rescue for the losing side.' },
            { text: 'Bad: stalemate counts as a loss', feedback: 'Stalemate is a draw, not a loss, so it is a gift for the losing side.' },
          ],
        },
      ],
      keyIdeas: [
        'Stalemate: the player to move is not in check and has no legal move.',
        'Stalemate is a draw.',
        'When winning, make sure the enemy king always has a move unless you are giving checkmate.',
      ],
      checkpoint: [
        {
          type: 'choice',
          prompt: 'Black to move. What is the result?',
          fen: '7k/8/6Q1/8/8/8/2K5/8 b - - 0 1',
          options: [
            { text: 'Stalemate: a draw', correct: true, feedback: 'Right. No check, no legal moves.' },
            { text: 'Checkmate', feedback: 'The black king is not attacked, so it is not checkmate.' },
            { text: 'Black plays Kg8', feedback: 'g8 is attacked by the queen along the g-file. Black has no legal move.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move. Be careful not to stalemate.',
          fen: 'k7/8/1K6/8/8/8/8/2Q5 w - - 0 1',
          solution: ['Qc8#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          wrong: { Qc7: 'Stalemate! Black is not in check and has no moves.' },
          explanation: 'Qc8 checks along the 8th rank; your king covers a7 and b7. Checkmate, not stalemate.',
        },
        {
          type: 'choice',
          prompt: 'What is the difference between checkmate and stalemate?',
          options: [
            { text: 'In checkmate the king is in check; in stalemate he is not', correct: true, feedback: 'Exactly. In both cases there is no legal move.' },
            { text: 'In stalemate the king has more squares', feedback: 'In both cases the player has no legal move at all.' },
            { text: 'There is no difference', feedback: 'A big difference: checkmate wins, stalemate is a draw.' },
          ],
        },
      ],
      practice: [
        {
          type: 'choice',
          prompt: 'Black to move. Is this stalemate?',
          fen: '5k2/5P2/5K2/8/8/8/8/8 b - - 0 1',
          options: [
            { text: 'Yes', correct: true, feedback: 'Right. Black is not in check and every square is covered.' },
            { text: 'No, Black can take the pawn', feedback: 'The pawn is protected by the white king, so taking it would be moving into check.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move, without stalemating.',
          fen: '7k/Q7/6K1/8/8/8/8/8 w - - 0 1',
          solution: ['Qg7#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'With your king on g6, the queen can mate on g7, h7 or along the 8th rank. Every quiet move risks stalemate.',
        },
        {
          type: 'choice',
          prompt: 'Who wins a game that ends in stalemate?',
          options: [
            { text: 'Nobody: it is a draw', correct: true, feedback: 'Right.' },
            { text: 'The player who made the last move', feedback: 'Stalemate is a draw, whoever caused it.' },
            { text: 'The player with more material', feedback: 'Material does not count: stalemate is always a draw.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Checkmate in one move. Two queen moves would be stalemate!',
          fen: 'k7/2K5/8/8/8/8/8/1Q6 w - - 0 1',
          solution: ['Qa1#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          wrong: {
            Qb6: 'Stalemate! Black is not in check and has no legal move.',
            Qg1: 'Stalemate! The queen covers a7, so Black has no legal move, but he is not in check.',
          },
          explanation: 'Check along the a-file (or b-file) with the king covering b7 and b8 is checkmate. Quiet moves that take a7 away are stalemate.',
        },
      ],
      reflect: 'What question will you ask yourself before each move when your opponent has only a king left?',
    },
    // ─────────────────────────────────────────────────────────────── castling
    {
      id: 'castling',
      title: 'Castling',
      objective: 'You will be able to castle on both sides and know when castling is not allowed.',
      minutes: 8,
      steps: [
        {
          type: 'explain',
          title: 'King and rook together',
          text:
            '**Castling** is a special move of the king and a rook together: the only move where you move two pieces at once.\n\n' +
            'The king moves **two squares** toward a rook, and that rook jumps over to the square right on the other side of the king.',
          fen: ITALIAN,
          demo: {
            moves: ['O-O'],
            captions: ['White castles: the king goes from e1 to g1, and the rook from h1 to f1.'],
          },
        },
        {
          type: 'explain',
          title: 'Why castle?',
          text:
            'Castling tucks your king into the corner, safe behind a wall of pawns, and brings your rook toward the center where it can join the game.\n\n' +
            'In most games both players castle within the first ten moves.',
          fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
          highlights: ['g1', 'f1', 'f2:blue', 'g2:blue', 'h2:blue'],
        },
        {
          type: 'move',
          prompt: 'White to move. Castle **kingside** (toward the h1-rook).',
          fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5',
          solution: ['O-O'],
          goal: 'castle',
          hints: ['Move the king two squares to the right, onto g1.'],
          wrong: {
            Kf1: 'The king moved just one square. That is not castling, and now you have lost the right to castle.',
            Ke2: 'That is a normal king move, not castling, and it leaves your king in the middle.',
          },
          explanation: 'King to g1, rook to f1: your king is safe and your rook is ready for action.',
        },
        {
          type: 'squares',
          prompt: 'White castles kingside here. Click the two squares where the king and the rook end up.',
          fen: ITALIAN,
          answer: ['g1', 'f1'],
          mode: 'all',
          explanation: 'Kingside castling always puts the king on g1 and the rook on f1 (g8 and f8 for Black).',
        },
        {
          type: 'explain',
          title: 'Castling queenside',
          text:
            'You can also castle **queenside**, toward the a1-rook. The king still moves two squares: from e1 to c1. The rook jumps to d1.\n\n' +
            'The queen, bishop and knight must all have left the back rank first, so this takes longer.',
          fen: 'r3kbnr/pppqpppp/2n5/3p1b2/3P1B2/2N5/PPPQPPPP/R3KBNR w KQkq - 6 5',
          demo: {
            moves: ['O-O-O'],
            captions: ['The king goes from e1 to c1, and the rook from a1 to d1.'],
          },
        },
        {
          type: 'move',
          prompt: 'Black to move. Castle **queenside**.',
          fen: 'r3kbnr/pppqpppp/2n5/3p1b2/3P1B2/2N1P3/PPPQ1PPP/R3KBNR b KQkq - 0 5',
          solution: ['O-O-O'],
          goal: 'castle',
          hints: ['Move the king two squares toward the a8-rook, onto c8.'],
          wrong: { Kd8: 'The king moved one square: that is not castling. Move the king two squares to c8.' },
          explanation: 'King to c8, rook to d8. The rook now stands on the d-file, ready to support the center.',
        },
        {
          type: 'explain',
          title: 'When you may not castle',
          text:
            'You may castle only if:\n\n' +
            '- Neither the king nor that rook has moved yet in the game\n' +
            '- No pieces stand between them\n' +
            '- Your king is not in check\n' +
            '- The king does not pass through or land on an attacked square',
          fen: ITALIAN,
          highlights: ['e1', 'h1', 'f1:yellow', 'g1:yellow'],
        },
        {
          type: 'choice',
          prompt: 'White would like to castle kingside. Is it allowed?',
          fen: 'rnbqk2r/p1pp1ppp/1p2pn2/8/1b1P4/3BPN2/PPP2PPP/RNBQK2R w KQkq - 2 5',
          options: [
            { text: 'No, White is in check', correct: true, feedback: 'Right. The bishop on b4 gives check, and you cannot castle out of check.' },
            { text: 'Yes, f1 and g1 are empty', feedback: 'They are empty, but look at the bishop on b4: White is in check, so castling is not allowed.' },
          ],
          explanation: 'Deal with the check first (here c3 is good). You can still castle later, because the king has not moved.',
        },
        {
          type: 'choice',
          prompt: 'White would like to castle kingside. Is it allowed?',
          fen: 'rn1qkb1r/p1pp1ppp/bp2pn2/8/4P3/5NP1/PPPP1PBP/RNBQK2R w KQkq - 3 5',
          options: [
            { text: 'No, the king would pass through f1, which is attacked', correct: true, feedback: 'Right. The bishop on a6 controls f1, and the king may not cross an attacked square.' },
            { text: 'Yes, White is not in check', feedback: 'Not being in check is not enough. The king passes f1 on the way, and the bishop on a6 attacks it.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Earlier in this game, White moved the king to e2 and later back to e1. Can White still castle?',
          options: [
            { text: 'No, never again', correct: true, feedback: 'Right. Once the king has moved, castling is gone for the rest of the game.' },
            { text: 'Yes, the king is back on e1', feedback: 'It does not matter that he came back. A king that has moved can never castle.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Castle on the side where it is allowed.',
          fen: 'r2q1rk1/ppp2ppp/b7/8/3P4/4PNQ1/PPP2PPP/R3K2R w KQ - 0 1',
          solution: ['O-O-O'],
          goal: 'castle',
          hints: ['Look at the bishop on a6. Which square does it attack?'],
          explanation: 'The bishop on a6 attacks f1, so kingside castling is illegal. Queenside castling is fine.',
        },
      ],
      keyIdeas: [
        'Castling: the king moves two squares toward a rook, and the rook jumps to the other side.',
        'Kingside: king to g1 (g8). Queenside: king to c1 (c8).',
        'Not allowed if the king or rook has moved, if you are in check, or if the king crosses or lands on an attacked square.',
      ],
      checkpoint: [
        {
          type: 'move',
          prompt: 'Black to move. Castle kingside.',
          fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
          solution: ['O-O'],
          goal: 'castle',
          explanation: 'Black\'s king goes to g8 and the rook to f8, just like White did.',
        },
        {
          type: 'choice',
          prompt: 'White would like to castle kingside. Is it allowed?',
          fen: 'rnbqk2r/ppp2ppp/3p1n2/2b1p3/2B1PP2/5N2/PPPP2PP/RNBQK2R w KQkq - 2 5',
          options: [
            { text: 'No, g1 is attacked by the bishop on c5', correct: true, feedback: 'Right. The king may not land on an attacked square.' },
            { text: 'Yes, nothing stands between king and rook', feedback: 'The path is clear, but follow the bishop on c5 along the diagonal: it attacks g1.' },
          ],
        },
        {
          type: 'squares',
          prompt: 'White castles queenside here. Click the two squares where the king and the rook end up.',
          fen: 'r3kbnr/pppqpppp/2n5/3p1b2/3P1B2/2N5/PPPQPPPP/R3KBNR w KQkq - 6 5',
          answer: ['c1', 'd1'],
          mode: 'all',
          explanation: 'Queenside castling puts the king on c1 and the rook on d1.',
        },
        {
          type: 'choice',
          prompt: 'Your h1-rook moved to h3 and back to h1 earlier. Your king has never moved. Which castling is still possible?',
          options: [
            { text: 'Only queenside', correct: true, feedback: 'Right. The h1-rook has moved, but the a1-rook has not.' },
            { text: 'Both sides', feedback: 'The h1-rook moved, so kingside castling is gone for good.' },
            { text: 'Neither', feedback: 'The king and the a1-rook have not moved, so queenside castling is still possible.' },
          ],
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'White to move. Castle kingside.',
          fen: ITALIAN,
          solution: ['O-O'],
          goal: 'castle',
          explanation: 'King to g1, rook to f1. Safe king, active rook.',
        },
        {
          type: 'move',
          prompt: 'White to move. Castle queenside.',
          fen: 'r3kbnr/pppqpppp/2n5/3p1b2/3P1B2/2N5/PPPQPPPP/R3KBNR w KQkq - 6 5',
          solution: ['O-O-O'],
          goal: 'castle',
          explanation: 'King to c1, rook to d1.',
        },
        {
          type: 'choice',
          prompt: 'In this position b1 is attacked by the black bishop. Can White castle queenside?',
          fen: '6k1/5ppp/8/5b2/8/8/P4PPP/R3K3 w Q - 0 1',
          options: [
            { text: 'Yes', correct: true, feedback: 'Right. Only the king\'s squares (e1, d1, c1) must be safe. The rook may pass an attacked square.' },
            { text: 'No, b1 is attacked', feedback: 'The rule is about the king\'s path only: e1, d1 and c1. The rook may cross b1.' },
          ],
        },
        {
          type: 'squares',
          prompt: 'Black castles kingside here. Click the two squares where the king and the rook end up.',
          fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5',
          answer: ['g8', 'f8'],
          mode: 'all',
          explanation: 'Black\'s king lands on g8 and the rook on f8.',
        },
      ],
      reflect: 'Why do you think most strong players castle early in the game?',
    },
    // ─────────────────────────────────────────────────────────────── promotion
    {
      id: 'promotion',
      title: 'Promotion',
      objective: 'You will be able to promote a pawn that reaches the last rank, including by capturing.',
      minutes: 6,
      steps: [
        {
          type: 'explain',
          title: 'A pawn becomes a queen',
          text:
            'When a pawn reaches the last rank, it must be **promoted**: it turns into a queen, rook, bishop or knight of the same color. It cannot stay a pawn or become a king.\n\n' +
            'Almost always you choose a **queen**, the strongest piece.',
          fen: '8/4P3/7k/8/8/8/8/6K1 w - - 0 1',
          demo: { moves: ['e8=Q'], captions: ['The pawn steps onto e8 and is replaced by a brand-new queen.'] },
        },
        {
          type: 'move',
          prompt: 'White to move. Promote your pawn.',
          fen: '8/1P6/7k/8/8/8/8/6K1 w - - 0 1',
          solution: ['b8=Q'],
          goal: 'promote',
          hints: ['Push the pawn to b8 and choose a queen.'],
          explanation: 'From 1 point to 9 in a single move. That is why pawns close to promotion are so dangerous.',
        },
        {
          type: 'choice',
          prompt: 'You already have your queen. Can you promote a pawn to a second queen?',
          options: [
            { text: 'Yes', correct: true, feedback: 'Right. You can have two queens, or even more.' },
            { text: 'No, only to a piece you have lost', feedback: 'There is no such rule. You may choose a queen even if your first queen is still on the board.' },
          ],
        },
        {
          type: 'explain',
          title: 'Promoting by capturing',
          text:
            'A pawn can also reach the last rank by capturing diagonally. It captures and promotes in the same move.\n\n' +
            'Here the e7-pawn could step to e8, but the rook on d8 would simply take the new queen. Capturing on d8 is much better.',
          fen: '3r4/4P3/7k/8/8/8/8/6K1 w - - 0 1',
          arrows: ['e7d8', 'e7e8:red'],
        },
        {
          type: 'move',
          prompt: 'White to move. Promote by capturing the rook.',
          fen: '3r4/4P3/7k/8/8/8/8/6K1 w - - 0 1',
          solution: ['exd8=Q'],
          wrong: { 'e8=Q': 'The rook on d8 takes your new queen right away. Capture the rook while promoting instead.' },
          explanation: 'You remove the rook and get a queen in the same move.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Black pawns promote on the first rank. Promote your pawn.',
          fen: '8/8/7k/8/8/6K1/p7/8 b - - 0 1',
          solution: ['a1=Q'],
          goal: 'promote',
          explanation: 'Black\'s pawns move down the board, so they promote on rank 1.',
        },
        {
          type: 'move',
          prompt: 'White to move. Promote with checkmate.',
          fen: '7k/4P3/6K1/8/8/8/8/8 w - - 0 1',
          solution: ['e8=Q#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          hints: ['Your king on g6 already covers g7 and h7.'],
          explanation: 'The new queen checks along the 8th rank, and your king covers the escape squares. A new rook would mate too.',
        },
      ],
      keyIdeas: [
        'A pawn reaching the last rank is promoted to a queen, rook, bishop or knight.',
        'Choose a queen almost every time.',
        'A pawn can capture and promote in the same move.',
      ],
      checkpoint: [
        {
          type: 'move',
          prompt: 'White to move. Promote your pawn without losing the new piece.',
          fen: '2r5/1P6/8/8/8/k7/8/6K1 w - - 0 1',
          solution: ['bxc8=Q'],
          wrong: { 'b8=Q': 'The rook on c8 takes your new queen. Capture the rook as you promote.' },
          explanation: 'Capturing on c8 removes the rook and creates a queen in one move.',
        },
        {
          type: 'move',
          prompt: 'Black to move. Promote your pawn.',
          fen: '8/8/8/8/8/5k2/3p4/6K1 b - - 0 1',
          solution: ['d1=Q+'],
          goal: 'promote',
          explanation: 'The d-pawn reaches d1 and becomes a queen, even giving check.',
        },
        {
          type: 'choice',
          prompt: 'Which piece can a pawn NOT be promoted to?',
          options: [
            { text: 'A king', correct: true, feedback: 'Right. Each side has exactly one king, always.' },
            { text: 'A knight', feedback: 'A knight is allowed. Only a king (or staying a pawn) is not.' },
            { text: 'A second queen', feedback: 'Two queens are allowed.' },
          ],
        },
        {
          type: 'move',
          prompt: 'Black to move. Promote with checkmate.',
          fen: '8/8/8/8/8/6k1/4p3/6K1 b - - 0 1',
          solution: ['e1=Q#'],
          goal: 'mate',
          puzzle: true,
          theme: 'mate-in-1',
          explanation: 'The new queen checks along the first rank, and your king on g3 covers f2, g2 and h2.',
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'Black to move. Promote your pawn without losing the new piece.',
          fen: '8/6pk/7p/8/8/8/1p6/2R3K1 b - - 0 1',
          solution: ['bxc1=Q+'],
          wrong: { 'b1=Q': 'The rook on c1 takes your new queen. Capture the rook while promoting.' },
          explanation: 'The pawn captures the rook and becomes a queen at the same time.',
        },
        {
          type: 'move',
          prompt: 'White to move. Promote your pawn.',
          fen: '8/6P1/8/8/8/k7/8/6K1 w - - 0 1',
          solution: ['g8=Q'],
          goal: 'promote',
          explanation: 'The pawn reaches g8 and becomes a queen.',
        },
        {
          type: 'squares',
          prompt: 'Black to move. Click the square where this black pawn will be promoted.',
          fen: '8/8/8/8/8/2p5/8/8 b - - 0 1',
          answer: ['c1'],
          mode: 'one',
          explanation: 'Black pawns move down the board and promote on the first rank: this one on c1.',
        },
        {
          type: 'choice',
          prompt: 'Your pawn reaches the last rank. Which piece do you choose almost every time?',
          options: [
            { text: 'A queen', correct: true, feedback: 'Right: the most powerful piece.' },
            { text: 'A rook', feedback: 'A rook is strong, but a queen can do everything a rook can, and more.' },
            { text: 'A knight', feedback: 'A knight is very rarely the right choice. A queen is worth 9.' },
          ],
        },
      ],
      reflect: 'Why are pawns that are close to the last rank so valuable?',
    },
    // ─────────────────────────────────────────────────────────────── en passant
    {
      id: 'en-passant',
      title: 'En Passant',
      objective: 'You will be able to spot and play the en passant capture, and know when it is no longer allowed.',
      minutes: 6,
      steps: [
        {
          type: 'explain',
          title: 'Capturing "in passing"',
          text:
            '**En passant** (French for "in passing") is a special pawn capture.\n\n' +
            'When an enemy pawn moves **two squares** forward and lands right **beside** your pawn, your pawn may capture it as if it had moved only one square.',
          fen: 'rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2',
          demo: {
            moves: ['d5', 'exd6'],
            captions: [
              'Black pushes the d-pawn two squares. It lands on d5, right next to the white pawn on e5.',
              'White captures en passant: the pawn moves diagonally to d6, and the black pawn on d5 is removed.',
            ],
          },
        },
        {
          type: 'squares',
          prompt: 'Black has just played d7-d5. If White captures en passant, where does the white pawn land?',
          fen: ALEKHINE_D5,
          answer: ['d6'],
          mode: 'one',
          hints: ['Imagine the black pawn had moved only one square, to d6.'],
          explanation: 'The pawn lands on d6, the square the black pawn skipped over.',
        },
        {
          type: 'move',
          prompt: 'White to move. Black just played d7-d5. Capture the d5-pawn en passant.',
          fen: ALEKHINE_D5,
          solution: ['exd6'],
          highlights: ['d5', 'd6'],
          wrong: { exf6: 'That captures the knight, a normal capture. The task is to take the d5-pawn en passant: your pawn goes to d6.' },
          explanation: 'Your e5-pawn moves to d6 and the d5-pawn disappears, exactly as if it had stopped on d6.',
        },
        {
          type: 'explain',
          title: 'Now or never',
          text:
            'En passant is only allowed on the **very next move**, right after the enemy pawn has moved two squares.\n\n' +
            'If you play something else first, the chance is gone for good.',
          fen: 'rnbqkb1r/pppnpppp/8/3pP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4',
          highlights: ['d5:red', 'e5'],
        },
        {
          type: 'choice',
          prompt: 'Black played d7-d5 a move ago, and both sides have moved since. Can White capture en passant now?',
          fen: 'rnbqkb1r/pppnpppp/8/3pP3/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4',
          options: [
            { text: 'No, the chance has passed', correct: true, feedback: 'Right. En passant must be played immediately or never.' },
            { text: 'Yes, the pawns are still side by side', feedback: 'Being side by side is not enough. En passant is only allowed right after the two-square move.' },
          ],
        },
        {
          type: 'move',
          prompt: 'Black to move. White just played e2-e4. Capture en passant.',
          fen: 'rnbqkbnr/ppp1pppp/8/8/2PpP3/5N2/PP1P1PPP/RNBQKB1R b KQkq e3 0 3',
          solution: ['dxe3'],
          wrong: { d3: 'That pushes the pawn forward. Capture the e4-pawn en passant: your pawn goes diagonally to e3.' },
          explanation: 'Black\'s d4-pawn moves to e3 and the white e4-pawn is removed.',
        },
        {
          type: 'choice',
          prompt: 'Which move by the opponent makes en passant possible?',
          options: [
            { text: 'A pawn moving two squares and landing beside your pawn', correct: true, feedback: 'Right. Only that exact situation.' },
            { text: 'Any pawn move next to your pawn', feedback: 'A one-square move does not allow en passant. It must be the two-square first move.' },
            { text: 'Any piece landing beside your pawn', feedback: 'En passant only works against pawns.' },
          ],
        },
      ],
      keyIdeas: [
        'En passant: capture a pawn that just moved two squares past your pawn, as if it moved one.',
        'Your pawn lands on the square the enemy pawn skipped over.',
        'Only allowed on the very next move.',
      ],
      checkpoint: [
        {
          type: 'move',
          prompt: 'White to move. Black just played e7-e5. Capture en passant.',
          fen: 'rnbqkb1r/pp1p1ppp/5n2/2pPp3/2P5/8/PP2PPPP/RNBQKBNR w KQkq e6 0 4',
          solution: ['dxe6'],
          wrong: { d6: 'That pushes the pawn. Capture en passant instead: d5 takes on e6.' },
          explanation: 'The d5-pawn captures diagonally to e6, removing the e5-pawn that just passed it.',
        },
        {
          type: 'move',
          prompt: 'Black to move. White just played d2-d4. Capture en passant.',
          fen: 'rnbqkb1r/pppp1ppp/5n2/8/2PPp3/2N2N2/PP2PPPP/R1BQKB1R b KQkq d3 0 4',
          solution: ['exd3'],
          wrong: { exf3: 'That captures the knight, a normal capture. The task is the en passant capture of the d4-pawn.' },
          explanation: 'The e4-pawn captures to d3, and the white d4-pawn is removed.',
        },
        {
          type: 'choice',
          prompt: 'Can a pawn capture en passant if the enemy pawn moved only one square?',
          options: [
            { text: 'No', correct: true, feedback: 'Right. En passant only answers a two-square pawn move.' },
            { text: 'Yes', feedback: 'After a one-square move the pawns are not "passing" each other. En passant needs a two-square move.' },
          ],
        },
      ],
      practice: [
        {
          type: 'squares',
          prompt: 'White just played e2-e4. If Black captures en passant with the d4-pawn, where does it land?',
          fen: 'rnbqkbnr/ppp1pppp/8/8/2PpP3/5N2/PP1P1PPP/RNBQKB1R b KQkq e3 0 3',
          answer: ['e3'],
          mode: 'one',
          explanation: 'It lands on e3, the square the white pawn jumped over.',
        },
        {
          type: 'move',
          prompt: 'White to move. Black just played d7-d5. Capture en passant.',
          fen: ALEKHINE_D5,
          solution: ['exd6'],
          explanation: 'e5 takes d6 en passant, removing the pawn on d5.',
        },
        {
          type: 'choice',
          prompt: 'After en passant, which square is emptied?',
          options: [
            { text: 'The square of the captured pawn, beside yours', correct: true, feedback: 'Right. Your pawn lands behind it, and the captured pawn disappears from its square.' },
            { text: 'The square your pawn lands on', feedback: 'Your pawn lands on an empty square. The captured pawn is removed from the square next to where you started.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Black just played d7-d5. Capture en passant.',
          fen: 'rnbqkbnr/pp2pppp/8/2ppP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3',
          solution: ['exd6'],
          wrong: { e6: 'That pushes the pawn. Capture en passant: e5 takes on d6.' },
          explanation: 'The e5-pawn captures on d6 and the d5-pawn disappears.',
        },
      ],
      reflect: 'Why do you think the en passant rule exists? (Hint: think about what the two-square move would let a pawn escape.)',
    },
    // ─────────────────────────────────────────────────────────────── draws
    {
      id: 'draws',
      title: 'Draws',
      objective: 'You will be able to name the five ways a game can end in a draw and recognize them on the board.',
      minutes: 7,
      steps: [
        {
          type: 'explain',
          title: 'Nobody wins',
          text:
            'Not every game has a winner. A **draw** means the game ends with no winner. There are five ways:\n\n' +
            '- Stalemate\n- Repetition\n- Insufficient material\n- The 50-move rule\n- Agreement',
          fen: '7k/8/6Q1/8/8/8/2K5/8 b - - 0 1',
        },
        {
          type: 'explain',
          title: 'Repetition',
          text:
            'If the exact same position appears **three times** with the same player to move, the game is a draw by **repetition**.\n\n' +
            'It often comes from **perpetual check**: one side gives check again and again, and the other king can never escape. Here White is behind in material but saves the game.',
          fen: '8/6pk/8/p7/8/2b5/rr3PPP/3Q2K1 w - - 0 1',
          demo: {
            moves: ['Qh5+', 'Kg8', 'Qe8+', 'Kh7', 'Qh5+', 'Kg8', 'Qe8+', 'Kh7', 'Qh5+'],
            captions: [
              'Check from h5.', 'The only move.', 'Check again from e8.', 'The only move.',
              'The first position again.', 'Forced.', 'Again.', 'Forced.',
              'The same position for the third time: a draw by repetition.',
            ],
          },
        },
        {
          type: 'move',
          prompt: 'White to move. You are behind in material. Start a perpetual check to save the game.',
          fen: '8/6pk/8/p7/8/2b5/rr3PPP/3Q2K1 w - - 0 1',
          solution: ['Qh5+', 'Kg8', 'Qe8+', 'Kh7', 'Qh5+'],
          goal: 'check',
          hints: ['Look for a check that leaves the black king only one square.', 'Qh5+ and Qe8+ take turns.'],
          explanation: 'The king shuttles between g8 and h7 while your queen checks from h5 and e8. Black cannot escape, so the game is drawn.',
        },
        {
          type: 'explain',
          title: 'Insufficient material',
          text:
            'If neither side has enough pieces left to checkmate, the game is a draw by **insufficient material**.\n\n' +
            'King against king is a draw. So is king and bishop against king, and king and knight against king: a lone bishop or knight cannot checkmate.',
          fen: '8/8/4k3/8/8/2N5/8/4K3 w - - 0 1',
        },
        {
          type: 'choice',
          prompt: 'Only these pieces are left. Which one is a draw by insufficient material?',
          options: [
            { text: 'King and knight against king', correct: true, feedback: 'Right. A lone knight cannot force checkmate.' },
            { text: 'King and rook against king', feedback: 'A rook and king can force checkmate. You will learn how in the next unit.' },
            { text: 'King and pawn against king', feedback: 'The pawn may promote to a queen, so the game goes on.' },
          ],
          explanation: 'A single rook, a queen, or a pawn (which can promote) is enough to play for a win. A lone bishop or knight is not.',
        },
        {
          type: 'explain',
          title: 'The 50-move rule and agreement',
          text:
            'If **50 moves** go by for each player with no capture and no pawn move, a player can claim a draw. It stops endless games where nobody makes progress.\n\n' +
            'And at any time, the two players can simply **agree** to a draw. You never have to accept a draw offer.',
          fen: '8/8/4k3/8/3K4/8/8/8 w - - 0 1',
        },
        {
          type: 'choice',
          prompt: 'Black to move. How does this game end?',
          fen: 'k7/2Q5/1K6/8/8/8/8/8 b - - 0 1',
          options: [
            { text: 'Draw by stalemate', correct: true, feedback: 'Right. Black is not in check and has no legal move.' },
            { text: 'White wins by checkmate', feedback: 'Black is not in check, so this is not checkmate.' },
            { text: 'Draw by insufficient material', feedback: 'White has a queen, which is plenty to mate. The draw here is stalemate.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Only kings and one white bishop are left. What happens?',
          fen: '8/8/4k3/8/8/2B5/8/4K3 w - - 0 1',
          options: [
            { text: 'Draw: insufficient material', correct: true, feedback: 'Right. A bishop alone cannot checkmate.' },
            { text: 'White plays on for a win', feedback: 'With only a bishop, checkmate is impossible, so the game is drawn.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'You are a whole queen ahead, and your opponent offers a draw. Must you accept?',
          options: [
            { text: 'No, you can decline and play on', correct: true, feedback: 'Right. A draw by agreement needs both players to agree.' },
            { text: 'Yes, a draw offer must be accepted', feedback: 'You can always say no and keep playing for the win.' },
          ],
        },
      ],
      keyIdeas: [
        'Five draws: stalemate, repetition, insufficient material, 50-move rule, agreement.',
        'Perpetual check forces a draw by repetition.',
        'A lone bishop or knight cannot checkmate.',
      ],
      checkpoint: [
        {
          type: 'choice',
          prompt: 'The same position has now appeared three times, with the same player to move. What happens?',
          options: [
            { text: 'The game is a draw', correct: true, feedback: 'Right: draw by repetition.' },
            { text: 'The player giving the checks wins', feedback: 'Repeating checks do not win. They lead to a draw by repetition.' },
            { text: 'Nothing, play continues as normal', feedback: 'Threefold repetition is one of the five ways to draw.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Which of these endings is NOT a draw by insufficient material?',
          options: [
            { text: 'King and queen against king', correct: true, feedback: 'Right. A queen and king can checkmate easily.' },
            { text: 'King against king', feedback: 'Two lone kings can never checkmate: that is a draw.' },
            { text: 'King and bishop against king', feedback: 'A lone bishop cannot checkmate: that is a draw.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. You are behind in material. Draw by perpetual check.',
          fen: '8/6pk/8/p7/8/2b5/rr3PPP/3Q2K1 w - - 0 1',
          solution: ['Qh5+', 'Kg8', 'Qe8+', 'Kh7', 'Qh5+'],
          goal: 'check',
          explanation: 'Checks from h5 and e8 chase the king back and forth forever.',
        },
        {
          type: 'choice',
          prompt: 'What does the 50-move rule count?',
          options: [
            { text: 'Moves without any capture or pawn move', correct: true, feedback: 'Right. Any capture or pawn move resets the count.' },
            { text: 'The total number of moves in the game', feedback: 'Games can last far longer than 50 moves. The rule counts moves with no capture and no pawn move.' },
          ],
        },
      ],
      practice: [
        {
          type: 'choice',
          prompt: 'Only the two kings and a white knight are left. What is the result?',
          fen: '8/8/4k3/8/8/2N5/8/4K3 w - - 0 1',
          options: [
            { text: 'Draw: insufficient material', correct: true, feedback: 'Right. A lone knight cannot force checkmate.' },
            { text: 'White wins', feedback: 'A king and knight cannot force checkmate, so it is a draw.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'You are losing badly. Which of these could still save you with a draw?',
          options: [
            { text: 'A perpetual check', correct: true, feedback: 'Right. Endless checks lead to a draw by repetition.' },
            { text: 'Capturing a pawn', feedback: 'A pawn is nice, but it does not end the game. Look for perpetual check or stalemate.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Name the draw: Black to move has no legal moves but is not in check.',
          options: [
            { text: 'Stalemate', correct: true, feedback: 'Right.' },
            { text: 'Repetition', feedback: 'Repetition is about the same position appearing three times. No legal moves without check is stalemate.' },
            { text: 'Checkmate', feedback: 'Checkmate needs the king to be in check, and it is a win, not a draw.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'Which of these is NOT a draw?',
          options: [
            { text: 'Checkmate', correct: true, feedback: 'Right. Checkmate is a win for the side that delivers it.' },
            { text: 'Threefold repetition', feedback: 'Repeating the same position three times is a draw.' },
            { text: 'Agreement', feedback: 'Both players agreeing ends the game in a draw.' },
          ],
        },
      ],
      reflect: 'If you are losing, which kinds of draws could you aim for? If you are winning, which should you avoid?',
    },
    // ─────────────────────────────────────────────────────────────── notation
    {
      id: 'chess-notation',
      title: 'Reading Chess Notation',
      objective: 'You will be able to read and play moves written in algebraic notation, like Nf3, exd5, O-O and Qxf7#.',
      minutes: 9,
      steps: [
        {
          type: 'explain',
          title: 'Writing moves down',
          text:
            'Chess players write moves in **notation**. Each piece has a capital letter: **K** king, **Q** queen, **R** rook, **B** bishop, **N** knight (K was already taken).\n\n' +
            'A move is the piece letter plus the square it goes to. **Nf3** means "knight to f3". Pawns have no letter: **e4** means "pawn to e4".',
          fen: START,
          arrows: ['g1f3', 'e2e4:blue'],
        },
        {
          type: 'squares',
          prompt: 'In the move **Nf3**, where does the knight go? Click the square.',
          fen: START,
          answer: ['f3'],
          mode: 'one',
          explanation: 'N = knight, f3 = the destination square.',
        },
        {
          type: 'move',
          prompt: 'Play the move **e4**.',
          fen: START,
          solution: ['e4'],
          wrong: { e3: 'That is e3. The move e4 means the pawn goes to e4.' },
          explanation: 'No letter means a pawn: the e-pawn goes to e4.',
        },
        {
          type: 'move',
          prompt: 'After 1. e4 e5, play **Nf3**.',
          fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
          solution: ['Nf3'],
          wrong: {
            f3: 'That moves the f-pawn. The capital N means a knight.',
            Nh3: 'The knight should go to f3, not h3.',
          },
          explanation: 'Knight to f3. Notice how the move numbers work: "1. e4 e5" means White\'s first move e4 and Black\'s reply e5.',
        },
        {
          type: 'explain',
          title: 'Captures, check and mate',
          text:
            'An **x** means a capture: **Bxf7** = the bishop captures on f7.\n\n' +
            'For a pawn capture, write the file the pawn came from: **exd5** = the e-pawn captures on d5.\n\n' +
            'A **+** at the end means check, and **#** means checkmate.',
          fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
          arrows: ['e4d5'],
        },
        {
          type: 'choice',
          prompt: 'What does **Bxe5** mean?',
          options: [
            { text: 'A bishop captures on e5', correct: true, feedback: 'Right: B = bishop, x = captures, e5 = the square.' },
            { text: 'A bishop moves to e5 without capturing', feedback: 'The x means a capture took place.' },
            { text: 'Something on e5 captures a bishop', feedback: 'The letter in front is the piece that moves. The square is where it lands.' },
          ],
        },
        {
          type: 'move',
          prompt: 'After 1. e4 d5, play **exd5**.',
          fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
          solution: ['exd5'],
          explanation: 'The e-pawn captures on d5.',
        },
        {
          type: 'move',
          prompt: 'After 1. e4 e5 2. Nf3 Nc6, play **Bb5**.',
          fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
          solution: ['Bb5'],
          wrong: { Bc4: 'That is Bc4. Bb5 means the bishop goes to b5.' },
          explanation: 'Bishop to b5. This position is a famous opening called the Ruy Lopez.',
        },
        {
          type: 'explain',
          title: 'Castling and promotion',
          text:
            '**O-O** means castling kingside and **O-O-O** means castling queenside.\n\n' +
            'Promotion is written with **=**: **e8=Q** means the pawn reaches e8 and becomes a queen.',
          fen: ITALIAN,
          arrows: ['e1g1', 'h1f1'],
        },
        {
          type: 'move',
          prompt: 'Play **O-O**.',
          fen: ITALIAN,
          solution: ['O-O'],
          explanation: 'O-O is kingside castling: king to g1, rook to f1.',
        },
        {
          type: 'explain',
          title: 'Which knight?',
          text:
            'Sometimes two identical pieces could reach the same square. Then you add the file (or rank) the piece comes from.\n\n' +
            'Here both knights can go to d2. **Nbd2** means the knight from the b-file; **Nfd2** means the one from the f-file.',
          fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3',
          arrows: ['b1d2', 'f3d2:blue'],
        },
        {
          type: 'move',
          prompt: 'Play **Nbd2**.',
          fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3',
          solution: ['Nbd2'],
          wrong: { Nfd2: 'That is Nfd2: the knight from f3. Nbd2 means the knight from the b-file.' },
          explanation: 'The "b" tells you which knight: the one on b1.',
        },
        {
          type: 'choice',
          prompt: 'Which notation means "queen captures on f7, checkmate"?',
          options: [
            { text: 'Qxf7#', correct: true, feedback: 'Right: Q, x for the capture, f7, # for mate.' },
            { text: 'Qf7+', feedback: 'That is a queen move to f7 with check, but no capture and no mate.' },
            { text: 'Kxf7#', feedback: 'K is the king. The queen is Q.' },
          ],
        },
      ],
      keyIdeas: [
        'K Q R B N for the pieces; pawns have no letter.',
        'x = capture, + = check, # = checkmate.',
        'O-O = kingside castling, O-O-O = queenside, e8=Q = promotion.',
      ],
      checkpoint: [
        {
          type: 'move',
          prompt: 'After 1. e4 e5 2. Nf3, play Black\'s reply **Nc6**.',
          fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
          solution: ['Nc6'],
          wrong: { c6: 'That moves the c-pawn. The N means a knight.' },
          explanation: 'Knight to c6, defending the e5-pawn.',
        },
        {
          type: 'move',
          prompt: 'After 1. e4 d5 2. exd5, play **Qxd5**.',
          fen: 'rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2',
          solution: ['Qxd5'],
          explanation: 'The queen captures on d5.',
        },
        {
          type: 'choice',
          prompt: 'What does **exd5** mean?',
          options: [
            { text: 'The e-pawn captures on d5', correct: true, feedback: 'Right.' },
            { text: 'Something on e captures a piece called d5', feedback: 'For pawns, the first letter is the file the pawn came from, and d5 is the square.' },
            { text: 'The pawn on d5 captures on e', feedback: 'The pawn comes from the e-file and lands on d5.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'A game record says **O-O-O**. What happened?',
          options: [
            { text: 'Castling queenside', correct: true, feedback: 'Right. Three O\'s: the long way, toward the queen\'s side.' },
            { text: 'Castling kingside', feedback: 'Kingside castling is O-O, with two O\'s.' },
            { text: 'Three pawn moves', feedback: 'O-O-O is the symbol for queenside castling.' },
          ],
        },
        {
          type: 'move',
          prompt: 'Play **Nfd2**.',
          fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3',
          solution: ['Nfd2'],
          wrong: { Nbd2: 'That is Nbd2. Nfd2 means the knight from the f-file goes to d2.' },
          explanation: 'The "f" tells you to move the knight from f3.',
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'Play **d4**.',
          fen: START,
          solution: ['d4'],
          explanation: 'No piece letter means a pawn: the d-pawn goes to d4.',
        },
        {
          type: 'move',
          prompt: 'After 1. e4 e5 2. Nf3 Nc6 3. Bb5, play **a6**.',
          fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
          solution: ['a6'],
          explanation: 'The a-pawn steps to a6, asking the bishop what it wants.',
        },
        {
          type: 'choice',
          prompt: 'What does **Rd8+** mean?',
          options: [
            { text: 'A rook moves to d8 and gives check', correct: true, feedback: 'Right.' },
            { text: 'A rook captures on d8', feedback: 'There is no x, so it is not a capture. The + means check.' },
            { text: 'A rook moves to d8 and gives checkmate', feedback: 'Checkmate is #. The + means check.' },
          ],
        },
        {
          type: 'squares',
          prompt: 'In the move **Bc4**, where does the bishop go? Click the square.',
          fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
          answer: ['c4'],
          mode: 'one',
          explanation: 'B = bishop, c4 = destination.',
        },
        {
          type: 'choice',
          prompt: 'What does **e8=Q** mean?',
          options: [
            { text: 'A pawn reaches e8 and becomes a queen', correct: true, feedback: 'Right.' },
            { text: 'The queen moves to e8', feedback: 'A queen move would be written Qe8. The = sign means promotion.' },
          ],
        },
      ],
      reflect: 'Try to say these moves out loud in plain words: Nf3, exd5, Bxf7+, O-O.',
    },
    // ─────────────────────────────────────────────────────────────── first game
    {
      id: 'your-first-game',
      title: 'Your First Game',
      objective: 'You will be able to start a game sensibly and know what to look for on every move.',
      minutes: 8,
      steps: [
        {
          type: 'explain',
          title: 'Three phases',
          text:
            'A game has three phases:\n\n' +
            '- The **opening**: the first 10 or so moves, when you bring your pieces out\n' +
            '- The **middlegame**: the pieces fight, attack and capture\n' +
            '- The **endgame**: few pieces are left, and the kings join in',
          fen: START,
        },
        {
          type: 'explain',
          title: 'Three goals in the opening',
          text:
            'In the opening, aim for three things:\n\n' +
            '- Put a pawn or two in the **center**\n' +
            '- Bring out your **knights and bishops**\n' +
            '- **Castle** to make your king safe',
          fen: START,
          highlights: ['d4:yellow', 'e4:yellow', 'd5:yellow', 'e5:yellow'],
        },
        {
          type: 'move',
          prompt: 'Make a good first move: put a pawn in the center.',
          fen: START,
          solution: ['e4'],
          accept: ['d4'],
          wrong: {
            a4: 'An edge pawn does not help in the center. Try the e- or d-pawn.',
            h4: 'An edge pawn does not help in the center. Try the e- or d-pawn.',
            f3: 'This does not take the center and weakens your king. Try the e- or d-pawn.',
          },
          explanation: 'e4 and d4 grab the center and open lines for your queen and bishops.',
        },
        {
          type: 'move',
          prompt: 'After 1. e4 e5, bring out a knight toward the center.',
          fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
          solution: ['Nf3'],
          accept: ['Nc3'],
          wrong: {
            Nh3: 'From the edge a knight controls few squares. Head toward the center: f3 or c3.',
            Na3: 'From the edge a knight controls few squares. Head toward the center: f3 or c3.',
          },
          explanation: 'Knights on f3 and c3 aim at the center. Nf3 even attacks the black pawn on e5.',
        },
        {
          type: 'move',
          prompt: 'After 1. e4 e5 2. Nf3 Nc6, bring out your light-squared bishop to an active square.',
          fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
          solution: ['Bc4'],
          accept: ['Bb5'],
          wrong: {
            Bd3: 'On d3 the bishop blocks your own d-pawn. Try c4 or b5.',
            Ba6: 'The b7-pawn simply captures your bishop.',
          },
          hints: ['The bishop on f1 can now leave, because the e-pawn moved.', 'c4 aims at f7, the weakest square near the black king.'],
          explanation: 'On c4 the bishop aims at the center and at f7. Next you can castle.',
        },
        {
          type: 'explain',
          title: 'A model opening',
          text: 'Watch both sides follow the three goals: center, pieces out, castle.',
          fen: START,
          demo: {
            moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'O-O', 'Nf6', 'd3', 'd6'],
            captions: [
              'White takes the center.', 'Black does the same.', 'A knight comes out and attacks e5.', 'Black develops and defends e5.',
              'The bishop comes out.', 'Black mirrors.', 'White castles: the king is safe.', 'Another black piece joins in.',
              'A pawn supports e4 and opens a path for the other bishop.', 'Black supports e5. Both sides are off to a healthy start.',
            ],
          },
        },
        {
          type: 'move',
          prompt: 'After 1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5, make your king safe.',
          fen: ITALIAN,
          solution: ['O-O'],
          goal: 'castle',
          hints: ['Your knight and bishop are out of the way. You can castle.'],
          explanation: 'Castling early tucks your king away before the fighting starts.',
        },
        {
          type: 'explain',
          title: 'Before every move',
          text:
            'Every time your opponent moves, ask: **what does that move do?** Is one of my pieces attacked now? Is my king in danger?\n\n' +
            'Then, before you move, look for checks and captures, for both sides. This habit alone will save you many games.',
          fen: 'rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3',
          arrows: ['c3d5:red'],
        },
        {
          type: 'move',
          prompt: 'Black to move. After 1. e4 d5 2. exd5 Qxd5 3. Nc3, your queen is attacked. Move her to a safe square.',
          fen: 'rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3',
          solution: ['Qa5'],
          accept: ['Qd8', 'Qd6', 'Qd7', 'Qc6', 'Qe6+', 'Qe5+', 'Qf5', 'Qg5', 'Qd4', 'Qc5'],
          wrong: {
            'Qe4+': 'Check, but the knight on c3 simply captures your queen.',
            Qb5: 'The knight on c3 and the bishop on f1 both attack b5.',
            Qc4: 'The bishop on f1 captures your queen.',
            Qxa2: 'You win a pawn, but the rook on a1 (or the knight) captures your queen.',
            Qh5: 'The white queen on d1 attacks h5 along the diagonal.',
            Qxg2: 'You win a pawn, but the bishop on f1 captures your queen.',
          },
          explanation: 'The queen is worth 9: when she is attacked, find a square where nothing can capture her. Qa5 is the most popular choice here.',
        },
        {
          type: 'choice',
          prompt: 'Your opponent just moved a bishop, and now it attacks your queen. What should you do first?',
          options: [
            { text: 'Deal with the threat to the queen', correct: true, feedback: 'Right. Always answer what the opponent\'s move threatens before carrying on with your plan.' },
            { text: 'Carry on with your plan', feedback: 'If you ignore the threat, you lose your queen. Look at what your opponent\'s move does first.' },
            { text: 'Push a pawn on the edge', feedback: 'That ignores the threat. Your queen would be captured.' },
          ],
        },
        {
          type: 'explain',
          title: 'Time to play',
          text:
            'You now know all the rules of chess. The best way to learn is to **play**.\n\n' +
            'Head to **Play** mode and try the computer on an easy level. Use the three opening goals, check what every enemy move does, and don\'t worry about losing: every game teaches you something.',
          fen: START,
        },
      ],
      keyIdeas: [
        'Opening goals: center, develop your knights and bishops, castle.',
        'After every enemy move, ask what it threatens.',
        'Before your move, look for checks and captures for both sides.',
      ],
      checkpoint: [
        {
          type: 'choice',
          prompt: 'Which plan fits the opening best?',
          options: [
            { text: 'Center pawns, knights and bishops out, castle', correct: true, feedback: 'Right: the three opening goals.' },
            { text: 'Bring the queen out early to attack', feedback: 'The queen is easily chased around early on. Develop the knights and bishops first.' },
            { text: 'Push the edge pawns to make room', feedback: 'Edge pawns do little for the center. Focus on center, development and castling.' },
          ],
        },
        {
          type: 'move',
          prompt: 'After 1. d4 d5, bring a knight out toward the center.',
          fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
          solution: ['Nf3'],
          accept: ['Nc3'],
          wrong: { Nh3: 'From the edge the knight controls few squares. Go to f3 or c3.' },
          explanation: 'Knights belong near the center, where they control the most squares.',
        },
        {
          type: 'choice',
          prompt: 'Your opponent has just moved. What is the first question to ask?',
          options: [
            { text: 'What does that move threaten?', correct: true, feedback: 'Right. Spotting threats keeps your pieces and king safe.' },
            { text: 'Which pawn can I push next?', feedback: 'Your own plan comes second. First check what the opponent\'s move threatens.' },
          ],
        },
        {
          type: 'move',
          prompt: 'White to move. Castle to make your king safe.',
          fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5',
          solution: ['O-O'],
          goal: 'castle',
          explanation: 'With the knight and bishop developed, castling is the natural next step.',
        },
      ],
      practice: [
        {
          type: 'move',
          prompt: 'Black to move after 1. e4. Fight for the center with a pawn.',
          fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          solution: ['e5'],
          accept: ['d5', 'c5', 'e6', 'c6', 'd6'],
          wrong: { a5: 'An edge pawn does nothing for the center.', h5: 'An edge pawn does nothing for the center.' },
          explanation: 'Black fights for the center too. e5 is the most classical reply.',
        },
        {
          type: 'choice',
          prompt: 'In which phase of the game do the kings usually become active fighters?',
          options: [
            { text: 'The endgame', correct: true, feedback: 'Right. With few pieces left, the king is safe enough to join in.' },
            { text: 'The opening', feedback: 'In the opening the king should hide, usually by castling.' },
            { text: 'The middlegame', feedback: 'With many pieces still on the board, the king is safest tucked away.' },
          ],
        },
        {
          type: 'choice',
          prompt: 'You lost a game. What is the most useful thing to do?',
          options: [
            { text: 'Look back for the moment it went wrong', correct: true, feedback: 'Right. Every loss shows you something to improve.' },
            { text: 'Stop playing for a while', feedback: 'Losing is part of learning. Find one lesson in the game and play again.' },
          ],
        },
        {
          type: 'move',
          prompt: 'After 1. d4 d5 2. Nf3 Nf6, bring out a bishop to an active square.',
          fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3',
          solution: ['Bf4'],
          accept: ['Bg5'],
          wrong: { Bh6: 'The pawn on g7 simply captures your bishop.', Bd2: 'That is a very passive square. Try f4 or g5.' },
          explanation: 'On f4 the bishop controls a long diagonal and helps the center.',
        },
      ],
      reflect: 'What will you check on every move of your first games?',
    },
  ],
};
