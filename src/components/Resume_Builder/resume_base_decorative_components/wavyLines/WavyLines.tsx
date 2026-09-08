import type { ThemeTokens } from "@/types/resume_theme";

type WavyLinesProps = {
  tokens: ThemeTokens;
  rows?: number;
  color?: string;
  opacity?: number;
};

// A stack of thin horizontal wavy lines - a quiet decorative sign-off at the bottom
// of a sidebar/panel, same spirit as DotGrid and Blob. Pure decoration, no data
// behind it. Each row is one repeating sine-like path tiled across the panel width.
export default function WavyLines({ tokens, rows = 5, color, opacity = 0.2 }: WavyLinesProps) {
  const strokeColor = color ?? tokens.accent;
  return (
    <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 4, opacity, pointerEvents: "none" }}>
      {Array.from({ length: rows }).map((_, index) => (
        <svg key={index} width="100%" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
          <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}

// Fragmentation-safe alternative to <WavyLines/>: styles to spread onto the panel the
// lines should sign off. Same reasoning as railBorderStyle() in Rail.tsx - an element
// lives in exactly ONE fragment, so when a paginator splits the panel the decoration
// appears on a single page (and, pinned by `marginTop:auto` in a flex column, lands
// mid-panel once that column becomes block flow). A BACKGROUND is painted per-fragment
// by the browser, so anchoring it to `bottom` puts it at the foot of EVERY page the
// panel spans.
//
// The SVG is inlined as a data URI rather than fetched, so it needs no network request
// and cannot be blocked by a CSP that forbids external images.
export function wavyLinesBackgroundStyle({
  tokens,
  rows = 5,
  color,
  opacity = 0.2,
  rowHeight = 10,
  rowGap = 4,
}: WavyLinesProps & { rowHeight?: number; rowGap?: number }): React.CSSProperties {
  const strokeColor = color ?? tokens.accent;
  const bandHeight = rows * rowHeight + (rows - 1) * rowGap;
  // One SVG holding every row, sized to the whole band. Percentage width lets it
  // stretch to the panel; the viewBox keeps the wave proportions.
  const paths = Array.from({ length: rows })
    .map((_, index) => {
      const y = index * (rowHeight + rowGap) + rowHeight / 2;
      return `<path d='M0,${y} Q50,${y - 5} 100,${y} T200,${y}' fill='none' stroke='${strokeColor}' stroke-width='1.5'/>`;
    })
    .join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 ${bandHeight}' preserveAspectRatio='none' opacity='${opacity}'>${paths}</svg>`;

  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    backgroundPosition: "left bottom",
    backgroundSize: `100% ${bandHeight}px`,
    backgroundRepeat: "no-repeat",
  };
}
