import { cn } from "@/lib/utils";
import { gifUrl, stillUrl, type Piece } from "@/lib/themes";

/**
 * Renders a game piece. Emoji pieces are still images unless `animated`
 * is set (used only for the winning line).
 */
export function PieceView({
  piece,
  animated = false,
  className,
}: {
  piece: Piece;
  animated?: boolean;
  className?: string;
}) {
  if (piece.kind === "icon") {
    const Icon = piece.icon;
    return <Icon aria-hidden className={cn("size-full", piece.className, className)} />;
  }
  return (
    // Animated GIFs: next/image would strip the animation unless unoptimized,
    // and these are tiny, cacheable, already-optimized assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={animated ? gifUrl(piece.code) : stillUrl(piece.code)}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("size-full object-contain", className)}
    />
  );
}
