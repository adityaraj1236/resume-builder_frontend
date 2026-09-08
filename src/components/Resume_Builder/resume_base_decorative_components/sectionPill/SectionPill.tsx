import type { ThemeTokens } from "@/types/resume_theme";

type SectionPillProps = {
  tokens: ThemeTokens;
  // Left indent so the pill lines up under a heading's text rather than its icon
  // badge - pass RAIL_INDENT (from RailSectionHeading) when sitting directly under
  // one, or a plain number for any other context.
  indent?: number;
  width?: number;
  height?: number;
  marginTop?: number;
  marginBottom?: number;
};

// A short pill-shaped accent bar meant to sit directly under a section heading (e.g.
// RailSectionHeading), mirroring the small rounded-bar underline style already used
// elsewhere for sidebar headings - IconRailTemplate's own SidebarHeading, for one.
// Purely decorative. Kept generic (indent/width/height/margins all overridable) so any
// future template can place it under its own heading style, not just a rail one.
export default function SectionPill({ tokens, indent = 0, width = 26, height = 4, marginTop, marginBottom }: SectionPillProps) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: height / 2,
        background: tokens.accent,
        marginLeft: indent,
        marginTop: marginTop ?? -tokens.spacing.itemGap + 1,
        marginBottom: marginBottom ?? tokens.spacing.itemGap * 0.6,
      }}
    />
  );
}
