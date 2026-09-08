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
