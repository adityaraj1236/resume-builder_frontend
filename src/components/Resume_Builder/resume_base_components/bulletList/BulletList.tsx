import type { ThemeTokens } from "@/types/resume_theme";
import { renderRichTextSegments } from "@/lib/richTextSegments";

type BulletStyle = "disc" | "circle" | "square" | "dash" | "arrow" | "check";

type BulletListProps = {
  tokens: ThemeTokens;
  items: string[];
  // Use dataFieldPrefix when items are a real array field (each item gets its
  // own `${dataFieldPrefix}.${index}`, e.g. entry.bullets). Use dataField
  // instead when items are display-only lines split out of one string field
  // (e.g. entry.description split on "\n") - it goes on the <ul> as the single
  // editable field covering the whole list.
  dataFieldPrefix?: string;
  dataField?: string;
  style?: BulletStyle;
};

// disc/circle/square map straight to CSS list-style-type; dash/arrow/check have no
// native list-style-type equivalent, so those render as a plain list with an
// explicit prefix glyph per item instead of a marker.
const NATIVE_MARKERS: Record<string, BulletStyle> = { disc: "disc", circle: "circle", square: "square" };
const GLYPH_PREFIXES: Partial<Record<BulletStyle, string>> = { dash: "– ", arrow: "→ ", check: "✓ " };

export default function BulletList({ tokens, items, dataFieldPrefix, dataField, style = "disc" }: BulletListProps) {
  const nativeMarker = NATIVE_MARKERS[style];
  const glyphPrefix = GLYPH_PREFIXES[style];

  return (
    <ul
      data-field={dataField}
      style={{ margin: `${tokens.spacing.itemGap * 0.5}px 0 0`, paddingLeft: 18, listStyleType: nativeMarker ?? "none" }}
    >
      {items.map((item, index) => (
        <li
          key={index}
          data-field={dataFieldPrefix ? `${dataFieldPrefix}.${index}` : undefined}
          style={{
            fontFamily: tokens.font.family,
            fontWeight: tokens.font.bodyWeight,
            fontSize: tokens.font.sizes.body,
            lineHeight: tokens.font.lineHeights.body,
            color: tokens.foreground,
            marginBottom: 2,
          }}
        >
          {glyphPrefix ? glyphPrefix : null}
          {renderRichTextSegments(item)}
        </li>
      ))}
    </ul>
  );
}
