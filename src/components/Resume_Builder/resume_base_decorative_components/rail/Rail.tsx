import type { ThemeTokens } from "@/types/resume_theme";

type RailProps = {
  tokens: ThemeTokens;
  x?: number;
  top?: number;
  bottom?: number;
  color?: string;
};

// A vertical line threading a column's section icons together.
//
// Rendered as an absolutely-positioned element, which means it lives in exactly ONE
// box: when a paginator (Paged.js) splits the surrounding content across pages, the
// rail stays with a single fragment and continuation pages lose it. Templates that
// need the rail to survive pagination should use railBorderStyle() on the wrapper
// instead - a border is drawn per-fragment by the browser, so it repeats naturally.
export default function Rail({ tokens, x = 13, top = 14, bottom = 14, color }: RailProps) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", top, bottom, left: x, width: 2, background: color ?? tokens.surface.border }}
    />
  );
}

// Fragmentation-safe alternative to <Rail/>: styles to spread onto the wrapper that
// would have contained the rail. A border is drawn on every fragment of a split
// element, so the line survives pagination - an absolutely-positioned <Rail/> lives
// in one fragment only and vanishes from continuation pages.
//
// Drawn as a BACKGROUND GRADIENT, not a border. A border-left always sits on the
// box's own edge and always consumes width, so placing it at x meant shifting the
// wrapper (margin) and pushing content back (padding) - which cost x + border + x
// = 28px of content width. That narrowing is what made the column's text wrap and
// left the line no longer centred on the icons.
//
// A gradient paints at any offset and takes no width at all: the 2px stripe lands at
// x..x+2, centred on the 28px icons' midpoint at 14, and the content keeps every
// pixel it had. Backgrounds repeat on each fragment of a split element, so the rail
// still survives pagination - which is the whole point of not using <Rail/>.
export function railBorderStyle(tokens: ThemeTokens, x = 13, color?: string, inset = 14): React.CSSProperties {
  const stripe = color ?? tokens.surface.border;
  const width = 2;
  return {
    backgroundImage: `linear-gradient(to right, transparent ${x}px, ${stripe} ${x}px, ${stripe} ${x + width}px, transparent ${x + width}px)`,
    // Inset top and bottom to match <Rail/>'s own top/bottom of 14, so the line
    // starts and ends level with the first and last icon rather than running to
    // the very edge of the column.
    backgroundPosition: `0 ${inset}px`,
    backgroundSize: `100% calc(100% - ${inset * 2}px)`,
    backgroundRepeat: "no-repeat",
  };
}
