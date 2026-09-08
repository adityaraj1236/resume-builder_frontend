import type { ThemeTokens } from "@/types/resume_theme";

type MarkerProps = {
  tokens: ThemeTokens;
  size?: number;
  filled?: boolean;
  color?: string;
};

// A small themed ring/dot used to mark a point on a vertical timeline rail (e.g. one
// per experience entry). Defaults to the theme's accent color so it always matches
// whatever accent the rest of the page is using.
export default function Marker({ tokens, size = 9, filled = false, color }: MarkerProps) {
  const ringColor = color ?? tokens.accent;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${ringColor}`,
        background: filled ? ringColor : tokens.background,
        flexShrink: 0,
      }}
    />
  );
}
