import type { ThemeTokens } from "@/types/resume_theme";

type DotRuleProps = {
  tokens: ThemeTokens;
  color?: string;
  dotColor?: string;
};

// A small filled circle followed by a thin horizontal line that stretches to fill
// whatever space it's given - meant to sit inline right after a heading label (e.g.
// in RailSectionHeading) as a lightweight rule balancing out the rest of the row.
// The dot defaults to the theme's accent color (so it reads as a solid marker, not
// a faint one) while the line itself stays on the muted line color.
export default function DotRule({ tokens, color, dotColor }: DotRuleProps) {
  const resolvedLineColor = color ?? tokens.surface.border;
  const resolvedDotColor = dotColor ?? tokens.accent;
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 24 }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: resolvedDotColor, flexShrink: 0 }} />
      <div style={{ flex: 1, height: 1, background: resolvedLineColor }} />
    </div>
  );
}
