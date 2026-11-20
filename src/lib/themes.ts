import { Circle, Heart, X, Zap, type LucideIcon } from "lucide-react";

import type { Player } from "@/lib/game";

/** A game piece is either a lucide icon or an animated emoji GIF. */
export type Piece =
  | { kind: "icon"; name: string; icon: LucideIcon; className: string }
  | { kind: "gif"; name: string; emoji: string; code: string };

export type Theme = {
  id: string;
  name: string;
  /** Switches shadcn tokens to their dark values. */
  dark: boolean;
  /** Page background. */
  background: string;
  pieces: Record<Player, Piece>;
  /** Accent text colour for each side (score tiles). */
  accent: Record<Player, string>;
  /** Highlight for the player whose turn it is: `chip` for the turn indicator, `ring` for the board glow. */
  turn: Record<Player, { chip: string; ring: string }>;
  confettiColors: string[];
  /** Emoji shapes mixed into the win confetti. */
  confettiEmoji: string[];
};

/** Noto Animated Emoji (CC BY 4.0), served by Google Fonts. */
export function gifUrl(code: string) {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.gif`;
}

/** The same emoji as a still image. */
export function stillUrl(code: string) {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.png`;
}

const gif = (name: string, emoji: string, code: string): Piece => ({
  kind: "gif",
  name,
  emoji,
  code,
});

export const THEMES: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    dark: false,
    background: "bg-linear-to-br from-slate-50 via-white to-slate-200",
    pieces: {
      X: { kind: "icon", name: "X", icon: X, className: "text-sky-600 stroke-[3]" },
      O: { kind: "icon", name: "O", icon: Circle, className: "text-rose-600 stroke-[3]" },
    },
    accent: { X: "text-sky-600", O: "text-rose-600" },
    turn: {
      X: { chip: "border-sky-500 bg-sky-500/15 ring-4 ring-sky-500/25", ring: "ring-sky-500/60" },
      O: { chip: "border-rose-500 bg-rose-500/15 ring-4 ring-rose-500/25", ring: "ring-rose-500/60" },
    },
    confettiColors: ["#0284c7", "#e11d48", "#facc15"],
    confettiEmoji: ["❌", "⭕"],
  },
  {
    id: "neon",
    name: "Neon",
    dark: true,
    background: "bg-linear-to-br from-fuchsia-950 via-slate-950 to-cyan-950",
    pieces: {
      X: {
        kind: "icon",
        name: "Bolt",
        icon: Zap,
        className: "text-cyan-300 fill-cyan-300/30 drop-shadow-[0_0_10px_#67e8f9]",
      },
      O: {
        kind: "icon",
        name: "Heart",
        icon: Heart,
        className: "text-fuchsia-400 fill-fuchsia-400/30 drop-shadow-[0_0_10px_#e879f9]",
      },
    },
    accent: { X: "text-cyan-300", O: "text-fuchsia-400" },
    turn: {
      X: { chip: "border-cyan-400 bg-cyan-400/15 ring-4 ring-cyan-400/25", ring: "ring-cyan-400/60" },
      O: { chip: "border-fuchsia-400 bg-fuchsia-400/15 ring-4 ring-fuchsia-400/25", ring: "ring-fuchsia-400/60" },
    },
    confettiColors: ["#67e8f9", "#e879f9", "#a3e635"],
    confettiEmoji: ["⚡", "💖"],
  },
  {
    id: "elements",
    name: "Elements",
    dark: false,
    background: "bg-linear-to-br from-orange-100 via-rose-50 to-sky-100",
    pieces: { X: gif("Fire", "🔥", "1f525"), O: gif("Wave", "🌊", "1f30a") },
    accent: { X: "text-orange-600", O: "text-sky-600" },
    turn: {
      X: { chip: "border-orange-500 bg-orange-500/15 ring-4 ring-orange-500/25", ring: "ring-orange-500/60" },
      O: { chip: "border-sky-500 bg-sky-500/15 ring-4 ring-sky-500/25", ring: "ring-sky-500/60" },
    },
    confettiColors: ["#f97316", "#ef4444", "#0ea5e9", "#38bdf8"],
    confettiEmoji: ["🔥", "🌊"],
  },
  {
    id: "space",
    name: "Space",
    dark: true,
    background: "bg-linear-to-br from-indigo-950 via-slate-950 to-black",
    pieces: { X: gif("Rocket", "🚀", "1f680"), O: gif("Planet", "🪐", "1fa90") },
    accent: { X: "text-indigo-300", O: "text-amber-300" },
    turn: {
      X: { chip: "border-indigo-400 bg-indigo-400/15 ring-4 ring-indigo-400/25", ring: "ring-indigo-400/60" },
      O: { chip: "border-amber-400 bg-amber-400/15 ring-4 ring-amber-400/25", ring: "ring-amber-400/60" },
    },
    confettiColors: ["#a5b4fc", "#fcd34d", "#f0abfc", "#ffffff"],
    confettiEmoji: ["🚀", "🪐", "⭐"],
  },
  {
    id: "spooky",
    name: "Spooky",
    dark: true,
    background: "bg-linear-to-br from-orange-950 via-zinc-950 to-purple-950",
    pieces: { X: gif("Ghost", "👻", "1f47b"), O: gif("Pumpkin", "🎃", "1f383") },
    accent: { X: "text-purple-300", O: "text-orange-400" },
    turn: {
      X: { chip: "border-purple-400 bg-purple-400/15 ring-4 ring-purple-400/25", ring: "ring-purple-400/60" },
      O: { chip: "border-orange-500 bg-orange-500/15 ring-4 ring-orange-500/25", ring: "ring-orange-500/60" },
    },
    confettiColors: ["#fb923c", "#a855f7", "#84cc16"],
    confettiEmoji: ["👻", "🎃"],
  },
  {
    id: "arcade",
    name: "Arcade",
    dark: true,
    background: "bg-linear-to-br from-emerald-950 via-zinc-950 to-violet-950",
    pieces: { X: gif("Robot", "🤖", "1f916"), O: gif("Alien", "👾", "1f47e") },
    accent: { X: "text-emerald-300", O: "text-violet-300" },
    turn: {
      X: { chip: "border-emerald-400 bg-emerald-400/15 ring-4 ring-emerald-400/25", ring: "ring-emerald-400/60" },
      O: { chip: "border-violet-400 bg-violet-400/15 ring-4 ring-violet-400/25", ring: "ring-violet-400/60" },
    },
    confettiColors: ["#34d399", "#a78bfa", "#f472b6"],
    confettiEmoji: ["🤖", "👾"],
  },
  {
    id: "snacks",
    name: "Snacks",
    dark: false,
    background: "bg-linear-to-br from-pink-100 via-amber-50 to-yellow-100",
    pieces: { X: gif("Pizza", "🍕", "1f355"), O: gif("Donut", "🍩", "1f369") },
    accent: { X: "text-amber-600", O: "text-pink-600" },
    turn: {
      X: { chip: "border-amber-500 bg-amber-500/15 ring-4 ring-amber-500/25", ring: "ring-amber-500/60" },
      O: { chip: "border-pink-500 bg-pink-500/15 ring-4 ring-pink-500/25", ring: "ring-pink-500/60" },
    },
    confettiColors: ["#f59e0b", "#ec4899", "#fde047"],
    confettiEmoji: ["🍕", "🍩"],
  },
  {
    id: "critters",
    name: "Critters",
    dark: false,
    background: "bg-linear-to-br from-lime-100 via-emerald-50 to-orange-100",
    pieces: { X: gif("Fox", "🦊", "1f98a"), O: gif("Frog", "🐸", "1f438") },
    accent: { X: "text-orange-600", O: "text-green-600" },
    turn: {
      X: { chip: "border-orange-500 bg-orange-500/15 ring-4 ring-orange-500/25", ring: "ring-orange-500/60" },
      O: { chip: "border-green-500 bg-green-500/15 ring-4 ring-green-500/25", ring: "ring-green-500/60" },
    },
    confettiColors: ["#f97316", "#22c55e", "#facc15"],
    confettiEmoji: ["🦊", "🐸"],
  },
];
