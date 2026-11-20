import type { Theme } from "@/lib/themes";

/** Fire a themed confetti celebration (side cannons + emoji burst). */
export async function celebrate(theme: Theme) {
  const confetti = (await import("canvas-confetti")).default;
  const colors = theme.confettiColors;
  const emojiShapes = theme.confettiEmoji.map((text) =>
    confetti.shapeFromText({ text, scalar: 2.5 }),
  );

  // Big emoji burst from the middle.
  confetti({
    particleCount: 40,
    spread: 100,
    startVelocity: 40,
    origin: { y: 0.55 },
    shapes: emojiShapes,
    scalar: 2.5,
    flat: true,
    disableForReducedMotion: true,
  });

  // Colourful cannons from both sides for ~1.5s.
  const end = Date.now() + 1500;
  (function frame() {
    const common = { particleCount: 4, spread: 60, colors, disableForReducedMotion: true };
    confetti({ ...common, angle: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...common, angle: 120, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
