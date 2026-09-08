import type { ThemeTokens } from "@/types/resume_theme";

type TwoColumnLayoutProps = {
  tokens: ThemeTokens;
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string;
  gap?: number;
  rightAlign?: boolean;
  showDivider?: boolean;
  dividerThickness?: number;
};

export default function TwoColumnLayout({
  tokens,
  left,
  right,
  leftWidth = "60%",
  gap,
  rightAlign = true,
  showDivider = false,
  dividerThickness,
}: TwoColumnLayoutProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: gap ?? tokens.spacing.itemGap, alignItems: "flex-start" }}>
      <div style={{ width: leftWidth }}>{left}</div>
      {showDivider ? (
        <div style={{ width: dividerThickness ?? tokens.divider.thickness, background: tokens.divider.color, alignSelf: "stretch" }} />
      ) : null}
      <div style={{ flex: 1, textAlign: rightAlign ? "right" : "left" }}>{right}</div>
    </div>
  );
}
