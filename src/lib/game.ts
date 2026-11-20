export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function emptyBoard(): Board {
  return Array<Cell>(9).fill(null);
}

export function getWinner(board: Board): { player: Player; line: readonly number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return { player: v, line };
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return board.every(Boolean) && !getWinner(board);
}

function minimax(board: Board, turn: Player, ai: Player, depth: number): number {
  const win = getWinner(board);
  if (win) return win.player === ai ? 10 - depth : depth - 10;
  if (board.every(Boolean)) return 0;

  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = turn;
    scores.push(minimax(board, turn === "X" ? "O" : "X", ai, depth + 1));
    board[i] = null;
  }
  return turn === ai ? Math.max(...scores) : Math.min(...scores);
}

/** Best move for `ai` using minimax (unbeatable). */
export function bestMove(board: Board, ai: Player): number {
  const work = [...board];
  let best = -Infinity;
  let moves: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (work[i]) continue;
    work[i] = ai;
    const score = minimax(work, ai === "X" ? "O" : "X", ai, 1);
    work[i] = null;
    if (score > best) {
      best = score;
      moves = [i];
    } else if (score === best) {
      moves.push(i);
    }
  }
  return moves[Math.floor(Math.random() * moves.length)];
}

export function randomMove(board: Board): number {
  const open = board.flatMap((c, i) => (c ? [] : [i]));
  return open[Math.floor(Math.random() * open.length)];
}
