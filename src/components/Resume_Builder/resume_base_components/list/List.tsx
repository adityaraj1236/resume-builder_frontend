import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

type ListLayout = "inline" | "stacked" | "columns";

type ListProps = {
  tokens: ThemeTokens;
  items: string[];
  layout?: ListLayout;
  dataField?: string;
  color?: "foreground" | "subtext" | "accent";
};

// Plain (non-bulleted) list of short text items - skills, tools, languages. Distinct
// from BulletList, which is specifically for prose bullet points with a marker glyph.
export default function List({ tokens, items, layout = "inline", dataField, color = "foreground" }: ListProps) {
  if (items.length === 0) return null;

  if (layout === "inline") {
    return (
      <Text tokens={tokens} as="div" color={color} dataField={dataField}>
        {items.join(", ")}
      </Text>
    );
  }

  const style: React.CSSProperties =
    layout === "columns"
      ? { columnCount: 2, columnGap: tokens.spacing.itemGap }
      : { display: "flex", flexDirection: "column", gap: 2 };

  return (
    <div style={style}>
      {items.map((item, index) => (
        <Text tokens={tokens} as="div" color={color} key={index} dataField={dataField ? `${dataField}.${index}` : undefined}>
          {item}
        </Text>
      ))}
    </div>
  );
}
