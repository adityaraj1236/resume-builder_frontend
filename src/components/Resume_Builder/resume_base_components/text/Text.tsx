import type { ThemeTokens } from "@/types/resume_theme";

type TextSize = "name" | "title" | "sectionHeading" | "body" | "small";
type TextColor = "foreground" | "subtext" | "accent" | "background";
// Shorthand bundling size+color for the common "de-emphasized detail" case (a
// location, a field of study, a GPA line) - explicit size/color props still win
// over the variant's defaults if both are passed.
type TextVariant = "minor";

type TextProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  as?: "p" | "span" | "div" | "h1" | "h2";
  variant?: TextVariant;
  size?: TextSize;
  color?: TextColor;
  bold?: boolean;
  italic?: boolean;
  uppercase?: boolean;
  dataField?: string;
  style?: React.CSSProperties;
};

const VARIANT_DEFAULTS: Record<TextVariant, { size: TextSize; color: TextColor }> = {
  minor: { size: "small", color: "subtext" },
};

// The single text primitive every base/section/template component renders through -
// font, size, color, and line-height all come from ThemeTokens so nothing hardcodes
// a pixel size or hex color inline (mirrors the pitch deck's theme-driven text atom).
export default function Text({
  tokens,
  children,
  as = "span",
  variant,
  size,
  color,
  bold = false,
  italic = false,
  uppercase = false,
  dataField,
  style,
}: TextProps) {
  const variantDefaults = variant ? VARIANT_DEFAULTS[variant] : undefined;
  const resolvedSize = size ?? variantDefaults?.size ?? "body";
  const resolvedColor = color ?? variantDefaults?.color ?? "foreground";
  const Tag = as;
  const isHeadingSize = resolvedSize === "name" || resolvedSize === "title" || resolvedSize === "sectionHeading";

  return (
    <Tag
      data-field={dataField}
      style={{
        fontFamily: tokens.font.family,
        fontWeight: bold ? tokens.font.headingWeight : tokens.font.bodyWeight,
        fontSize: tokens.font.sizes[resolvedSize],
        lineHeight: isHeadingSize ? tokens.font.lineHeights.heading : tokens.font.lineHeights.body,
        color: tokens[resolvedColor],
        fontStyle: italic ? "italic" : "normal",
        textTransform: uppercase ? "uppercase" : undefined,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
