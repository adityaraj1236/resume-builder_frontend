import type { ThemeTokens } from "@/types/resume_theme";

type DividerProps = {
  tokens: ThemeTokens;
  // "thin" is a 1px hairline for tucking under a heading; the default reuses the
  // theme's own divider thickness/color for a full section-to-section rule.
  thin?: boolean;
  // A dashed 1px rule (e.g. separating one experience entry from the next) instead of
  // the solid filled bar - rendered via border, not background, since a dashed
  // background fill isn't a thing.
  dashed?: boolean;
  marginTop?: number;
  marginBottom?: number;
  // Cancels out the page's own padding (tokens.spacing.pagePad) with a negative
  // margin on that side, so the rule reaches the page edge there instead of
  // stopping at the page's padded content area. Independent per side so a rule can
  // bleed on just one edge. Only meaningful for a template using the default
  // padded shell - a custom-shell template manages its own bleed.
  bleedLeft?: boolean;
  bleedRight?: boolean;
  // Instead of a flat tokens.divider.color fill, starts at the theme's accent color
  // and fades into the muted divider color across the rule's width.
  fade?: boolean;
};

export default function Divider({ tokens, thin = false, dashed = false, marginTop, marginBottom, bleedLeft = false, bleedRight = false, fade = false }: DividerProps) {
  const resolvedMarginTop = marginTop ?? tokens.spacing.itemGap;
  const resolvedMarginBottom = marginBottom ?? tokens.spacing.itemGap;
  const bleedStyle = {
    ...(bleedLeft ? { marginLeft: -tokens.spacing.pagePad } : null),
    ...(bleedRight ? { marginRight: -tokens.spacing.pagePad } : null),
  };

  if (dashed) {
    return (
      <div
        style={{
          borderTop: `1px dashed ${tokens.divider.color}`,
          marginTop: resolvedMarginTop,
          marginBottom: resolvedMarginBottom,
          ...bleedStyle,
        }}
      />
    );
  }

  return (
    <div
      style={{
        height: thin ? 1 : tokens.divider.thickness,
        background: fade ? `linear-gradient(to right, ${tokens.accent}, ${tokens.subtext})` : tokens.divider.color,
        marginTop: resolvedMarginTop,
        marginBottom: resolvedMarginBottom,
        ...bleedStyle,
      }}
    />
  );
}
