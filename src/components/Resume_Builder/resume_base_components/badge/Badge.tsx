import type { ThemeTokens } from "@/types/resume_theme";

type BadgeProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  dataField?: string;
  borderRadius?: number;
  paddingX?: number;
};

export default function Badge({ tokens, children, dataField, borderRadius, paddingX = 10 }: BadgeProps) {
  return (
    <span
      data-field={dataField}
      style={{
        display: "inline-block",
        fontFamily: tokens.font.family,
        fontSize: tokens.font.sizes.small,
        color: tokens.foreground,
        background: tokens.surface.card,
        border: `1px solid ${tokens.surface.border}`,
        borderRadius: borderRadius ?? tokens.radii.pill,
        padding: `3px ${paddingX}px`,
        marginRight: tokens.spacing.itemGap * 0.5,
        marginBottom: tokens.spacing.itemGap * 0.5,
      }}
    >
      {children}
    </span>
  );
}
