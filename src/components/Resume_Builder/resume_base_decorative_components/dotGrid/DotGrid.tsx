import type { ThemeTokens } from "@/types/resume_theme";

type DotGridProps = {
  tokens: ThemeTokens;
  rows?: number;
  cols?: number;
  gap?: number;
  dotSize?: number;
  color?: string;
};

// A small grid of dots tucked beside a photo or header - pure decoration with no data
// behind it, same spirit as Blob and QuoteMark.
export default function DotGrid({ tokens, rows = 4, cols = 4, gap = 5, dotSize = 3, color }: DotGridProps) {
  const dots = Array.from({ length: rows * cols });
  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
        gap,
        pointerEvents: "none",
      }}
    >
      {dots.map((_, index) => (
        <div key={index} style={{ width: dotSize, height: dotSize, borderRadius: "50%", background: color ?? tokens.accent }} />
      ))}
    </div>
  );
}
