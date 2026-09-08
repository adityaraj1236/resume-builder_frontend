import type { ThemeTokens } from "@/types/resume_theme";

type PillRuleProps = {
  tokens: ThemeTokens;
  pillWidth?: number;
  height?: number;
  // false: just the accent bar, no continuing thin line - suited to a narrow column
  // (e.g. a sidebar) where a line stretching the rest of the row would look stray.
  // true (default): bar + continuing line, filling the rest of a wider row.
  continuesLine?: boolean;
};
export default function PillRule({ tokens, pillWidth = 22, height = 3, continuesLine = true }: PillRuleProps) {
  if (!continuesLine) {
    return <div style={{ width: pillWidth, height, borderRadius: height / 2, background: tokens.accent }} />;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <div style={{ width: pillWidth, height, borderRadius: height / 2, background: tokens.accent, flexShrink: 0 }} />
      <div style={{ flex: 1, height: 1, background: tokens.surface.border }} />
    </div>
  );
}
