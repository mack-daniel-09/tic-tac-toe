"use client";

import { useEffect, useState } from "react";
import { preload } from "react-dom";
import {
  Bot,
  Gamepad2,
  Menu,
  Palette,
  RotateCcw,
  Trash2,
  Trophy,
  User,
  Users,
} from "lucide-react";

import { PieceView } from "@/components/piece";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { celebrate } from "@/lib/celebrate";
import {
  bestMove,
  emptyBoard,
  getWinner,
  isDraw,
  randomMove,
  type Board,
  type Player,
} from "@/lib/game";
import { gifUrl, THEMES, type Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";

type Mode = "pvp" | "easy" | "hard";
type Score = { X: number; O: number; draw: number };

const MODES: { value: Mode; label: string; icon: typeof Users }[] = [
  { value: "pvp", label: "2 Players", icon: Users },
  { value: "easy", label: "vs CPU (Easy)", icon: User },
  { value: "hard", label: "vs CPU (Hard)", icon: Bot },
];

const CPU: Player = "O";

/** Matches Tailwind's `md` breakpoint, where settings move into their own column. */
const DESKTOP_QUERY = "(min-width: 48rem)";

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Player>("X");
  const [starter, setStarter] = useState<Player>("X");
  const [mode, setMode] = useState<Mode>("pvp");
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draw: 0 });
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  const winner = getWinner(board);
  const draw = isDraw(board);
  const over = Boolean(winner) || draw;
  const vsCpu = mode !== "pvp";
  const cpuThinking = vsCpu && turn === CPU && !over;

  function play(index: number) {
    if (board[index] || over) return;
    const next = [...board];
    next[index] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");

    const w = getWinner(next);
    if (w) {
      setScore((s) => ({ ...s, [w.player]: s[w.player] + 1 }));
      // Celebrate any win in 2-player mode; only the human's wins vs the CPU.
      if (!vsCpu || w.player !== CPU) void celebrate(theme);
    } else if (isDraw(next)) {
      setScore((s) => ({ ...s, draw: s.draw + 1 }));
    }
  }

  // CPU move
  useEffect(() => {
    if (!cpuThinking) return;
    const id = setTimeout(() => {
      play(mode === "hard" ? bestMove(board, CPU) : randomMove(board));
    }, 450);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpuThinking, board, mode]);

  // Close the mobile menu if the screen grows into the two-column layout.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function newRound() {
    // Alternate who starts each round.
    const nextStarter: Player = starter === "X" ? "O" : "X";
    setStarter(nextStarter);
    setTurn(nextStarter);
    setBoard(emptyBoard());
  }

  function resetAll(nextMode: Mode = mode) {
    setMode(nextMode);
    setBoard(emptyBoard());
    setTurn("X");
    setStarter("X");
    setScore({ X: 0, O: 0, draw: 0 });
  }

  const nameOf = (p: Player) =>
    vsCpu ? (p === CPU ? "CPU" : "You") : theme.pieces[p].name;

  const status = winner
    ? `${nameOf(winner.player)} ${vsCpu && winner.player !== CPU ? "win" : "wins"}!`
    : draw
      ? "It's a draw!"
      : cpuThinking
        ? "CPU is thinking…"
        : vsCpu
          ? "Your turn"
          : `${theme.pieces[turn].name}'s turn`;

  // Fetch this theme's animated GIFs ahead of time so a win switches to them instantly.
  for (const piece of Object.values(theme.pieces)) {
    if (piece.kind === "gif") preload(gifUrl(piece.code), { as: "image" });
  }

  const scoreBoard = (
    <ScoreBoard
      theme={theme}
      score={score}
      nameOf={nameOf}
      activePlayer={over ? null : turn}
    />
  );

  const settings = (showScore: boolean) => (
    <SettingsPanel
      scoreBoard={showScore ? scoreBoard : null}
      theme={theme}
      onTheme={setTheme}
      mode={mode}
      onMode={(m) => {
        resetAll(m);
        setMenuOpen(false);
      }}
    />
  );

  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center px-4 text-foreground transition-colors duration-500",
        // Phones: exactly one screen tall (room at the top for the menu button).
        "h-dvh pt-14 pb-3",
        // Desktop: normal flow.
        "md:h-auto md:min-h-dvh md:py-4",
        // Very short screens: give up on fitting and let the page scroll.
        "[@media(max-height:540px)]:h-auto [@media(max-height:540px)]:min-h-dvh",
        theme.dark && "dark",
        theme.background,
      )}
    >
      <div className="flex w-full max-w-md flex-col gap-4 max-md:max-h-full max-md:min-h-0 md:max-w-3xl md:flex-row md:items-stretch md:justify-center">
        {/* Left column: the game */}
        <Card
          className={cn(
            "w-full max-w-md bg-card/80 shadow-2xl backdrop-blur-md md:flex-1",
            "max-md:max-h-full max-md:min-h-0 max-md:gap-3 max-md:py-3",
            "[@media(max-height:540px)]:max-h-none",
          )}
        >
          <CardHeader className="shrink-0 text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight sm:gap-3 sm:text-3xl">
              <span className="size-7 sm:size-8">
                <PieceView piece={theme.pieces.X} />
              </span>
              Tic-Tac-Toe
              <span className="size-7 sm:size-8">
                <PieceView piece={theme.pieces.O} />
              </span>
            </CardTitle>
            <CardDescription>Get three in a row to win.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 max-md:min-h-0 max-md:flex-1 max-md:gap-3">
            {/* Mobile: score sits on the game card (desktop shows it in the settings column) */}
            <div className="shrink-0 md:hidden">{scoreBoard}</div>

            {/* Turn indicator: the active player's chip glows in their colour; result once the game ends. */}
            <div aria-live="polite" className="flex h-12 shrink-0 items-center justify-center gap-2">
              <span className="sr-only">{status}</span>
              {over ? (
                <Badge
                  aria-hidden
                  variant={winner ? "default" : "secondary"}
                  className="h-9 gap-2 px-4 text-base"
                >
                  {winner && <Trophy />}
                  {status}
                </Badge>
              ) : (
                (["X", "O"] as const).map((p) => {
                  const active = turn === p;
                  return (
                    <div
                      key={p}
                      aria-hidden
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all duration-300",
                        active
                          ? cn("scale-105 shadow-md", theme.turn[p].chip)
                          : "scale-95 border-transparent bg-muted/40 opacity-45",
                      )}
                    >
                      <span className="size-6 shrink-0">
                        <PieceView piece={theme.pieces[p]} />
                      </span>
                      <span className="flex min-w-0 flex-col leading-tight">
                        <span className={cn("truncate text-sm font-semibold", theme.accent[p])}>
                          {nameOf(p)}
                        </span>
                        <span className="truncate text-[0.7rem] text-muted-foreground">
                          {active ? (cpuThinking ? "Thinking…" : "Your move") : "Waiting"}
                        </span>
                      </span>
                      {active && (
                        <span className={cn("relative ml-auto flex size-2.5 shrink-0", theme.accent[p])}>
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
                          <span className="relative inline-flex size-2.5 rounded-full bg-current" />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Phones: the board takes whatever height is left (up to 20rem) and stays square. */}
            <div className="flex justify-center max-md:h-80 max-md:min-h-36 max-md:shrink max-md:[container-type:size]">
            <div
              className={cn(
                "mx-auto grid aspect-square w-full max-w-xs grid-cols-3 grid-rows-3 gap-2 rounded-2xl p-1.5 ring-2 ring-transparent transition-shadow duration-300 max-md:size-[min(100cqw,100cqh)] max-md:max-w-none",
                // Board glows in the current player's colour.
                !over && theme.turn[turn].ring,
              )}
            >
              {board.map((cell, i) => {
                const inWin = winner?.line.includes(i);
                const canPlay = !cell && !over && !cpuThinking;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => play(i)}
                    disabled={!canPlay}
                    aria-label={
                      cell ? `Cell ${i + 1}: ${theme.pieces[cell].name}` : `Cell ${i + 1}: empty`
                    }
                    className={cn(
                      "group relative flex aspect-square min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-xl border bg-background/60 p-[18%] shadow-sm transition-all duration-200 outline-none select-none",
                      "focus-visible:ring-3 focus-visible:ring-ring/50",
                      canPlay && "cursor-pointer hover:scale-[1.04] hover:bg-muted",
                      inWin && "scale-105 border-primary bg-primary/15 ring-2 ring-primary/50",
                      over && !inWin && "opacity-50",
                    )}
                  >
                    {cell ? (
                      <span
                        key={`${theme.id}-${cell}`}
                        className={cn(
                          // One full spin as the piece lands.
                          "size-full animate-in duration-500 ease-out zoom-in-0 spin-in-360",
                          inWin && "animate-bounce",
                        )}
                      >
                        {/* Still while playing; animates only on the winning line. */}
                        <PieceView piece={theme.pieces[cell]} animated={inWin} />
                      </span>
                    ) : (
                      canPlay && (
                        // Ghost preview of the current player's piece on hover.
                        <span className="size-full opacity-0 transition-opacity group-hover:opacity-25">
                          <PieceView piece={theme.pieces[turn]} />
                        </span>
                      )
                    )}
                  </button>
                );
              })}
            </div>
            </div>
          </CardContent>

          <CardFooter className="shrink-0 justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={() => resetAll()}>
              <Trash2 />
              Reset score
            </Button>
            <Button size="sm" onClick={newRound}>
              <RotateCcw />
              New Game
            </Button>
          </CardFooter>
        </Card>

        {/* Right column (desktop): settings */}
        <Card
          role="region"
          aria-label="Settings"
          className="hidden w-80 shrink-0 bg-card/80 shadow-2xl backdrop-blur-md md:flex"
        >
          <CardContent>{settings(true)}</CardContent>
        </Card>
      </div>

      {/* Mobile: settings live in a full-screen menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Open settings"
              className="fixed top-3 right-3 z-40 bg-background/80 shadow-md backdrop-blur md:hidden"
            />
          }
        >
          <Menu />
        </SheetTrigger>
        <SheetContent
          side="right"
          className={cn(
            // Full-screen. Only animate the slide/fade: transitioning the theme's
            // gradient colours while open can leave the menu stuck mid-way.
            "overflow-y-auto transition-[opacity,translate] data-[side=right]:w-full data-[side=right]:sm:max-w-none",
            theme.dark && "dark",
            theme.background,
          )}
        >
          {/* Kept for screen readers only; the menu shows no visible heading. */}
          <SheetTitle className="sr-only">Settings</SheetTitle>
          <div className="px-4 pt-14 pb-6">{settings(false)}</div>
        </SheetContent>
      </Sheet>
    </main>
  );
}

function ScoreBoard({
  theme,
  score,
  nameOf,
  activePlayer,
}: {
  theme: Theme;
  score: Score;
  nameOf: (p: Player) => string;
  activePlayer: Player | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <ScoreTile
        theme={theme}
        player="X"
        label={nameOf("X")}
        value={score.X}
        active={activePlayer === "X"}
      />
      <ScoreTile label="Draws" value={score.draw} />
      <ScoreTile
        theme={theme}
        player="O"
        label={nameOf("O")}
        value={score.O}
        active={activePlayer === "O"}
      />
    </div>
  );
}

function SettingsPanel({
  scoreBoard,
  theme,
  onTheme,
  mode,
  onMode,
}: {
  /** Shown as the first section when provided (desktop only). */
  scoreBoard: React.ReactNode;
  theme: Theme;
  onTheme: (t: Theme) => void;
  mode: Mode;
  onMode: (m: Mode) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {scoreBoard && (
        <SettingsSection icon={Trophy} title="Score">
          {scoreBoard}
        </SettingsSection>
      )}

      <SettingsSection icon={Palette} title="Theme">
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTheme(t)}
              aria-pressed={theme.id === t.id}
              title={`${t.name}: ${t.pieces.X.name} vs ${t.pieces.O.name}`}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-lg border bg-background/50 px-1 py-1.5 text-[0.7rem] font-medium transition-all outline-none",
                "hover:-translate-y-0.5 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                theme.id === t.id && "border-primary ring-2 ring-primary/40",
              )}
            >
              <span className="flex items-center gap-0.5">
                <span className="size-5">
                  <PieceView piece={t.pieces.X} />
                </span>
                <span className="size-5">
                  <PieceView piece={t.pieces.O} />
                </span>
              </span>
              {t.name}
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection icon={Gamepad2} title="Game mode">
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Game mode">
          {MODES.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={mode === value ? "default" : "outline"}
              size="sm"
              className="h-auto flex-col gap-1 py-2 whitespace-normal"
              aria-pressed={mode === value}
              onClick={() => onMode(value)}
            >
              <Icon />
              <span className="text-xs leading-tight">{label}</span>
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Changing mode resets the score.</p>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Trophy;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h3 className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Icon className="size-3.5" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function ScoreTile({
  label,
  value,
  theme,
  player,
  active,
}: {
  label: string;
  value: number;
  theme?: Theme;
  player?: Player;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background/50 px-2 py-2 transition-colors",
        active && "border-primary bg-primary/10",
      )}
    >
      <div className="flex items-center justify-center gap-1 truncate text-xs text-muted-foreground">
        {theme && player && (
          <span className="size-4 shrink-0">
            <PieceView piece={theme.pieces[player]} />
          </span>
        )}
        <span className={cn("truncate", theme && player && theme.accent[player])}>{label}</span>
      </div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
