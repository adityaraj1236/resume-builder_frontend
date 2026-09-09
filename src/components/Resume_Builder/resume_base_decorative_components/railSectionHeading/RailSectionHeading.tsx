import type { ThemeTokens } from "@/types/resume_theme";
import IconBadge from "@/components/Resume_Builder/resume_base_decorative_components/iconBadge/IconBadge";
import DotRule from "@/components/Resume_Builder/resume_base_decorative_components/dotRule/DotRule";
import Divider from "@/components/Resume_Builder/resume_base_decorative_components/divider/Divider";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

export const RAIL_ICON_SIZE = 28;
// Left indent a section's body content needs so it clears the icon-badge column - the
// rail line (which sits inside that column, see Rail's default x) never crosses under
// any text.
export const RAIL_INDENT = RAIL_ICON_SIZE + 10;

// Indent for iconSize=22 callers (TwoColumnIconTemplate's own badge size) - same
// "badge width + gap" formula as RAIL_INDENT, just for the smaller badge.
export function railIndentFor(iconSize: number, tokens: ThemeTokens): number {
  return iconSize + tokens.spacing.itemGap * 0.6;
}

type UnderlineStyle =
  // A row of dots filling the rest of the heading row, beside the icon+text (IconRailTemplate/PortfolioBlobTemplate).
  | "dot-rule"
  // A thin solid Divider on its own row below, indented to clear the icon (TwoColumnIconTemplate).
  | "divider-below"
  | "none";

type RailSectionHeadingProps = {
  tokens: ThemeTokens;
  icon: React.ReactNode;
  children: React.ReactNode;
  iconBackground?: string;
  // iconSize/textColor default to the original RailSectionHeading look (28px badge,
  // foreground text) so IconRailTemplate/PortfolioBlobTemplate need no changes.
  iconSize?: number;
  textColor?: "foreground" | "accent";
  underline?: UnderlineStyle;
  dataField?: string;
};

// One "icon badge + section title" row meant to sit on a Rail line - the
// icon-threaded-on-a-spine heading style shared by every section-icon-forward
// template (PortfolioBlobTemplate, IconRailTemplate, TwoColumnIconTemplate) instead
// of each hand-rolling its own. Give the section's body content
// `paddingLeft: RAIL_INDENT` (or `railIndentFor(iconSize, tokens)` for a non-default
// iconSize) so it clears the icon column.
export default function RailSectionHeading({
  tokens,
  icon,
  children,
  iconBackground,
  iconSize = RAIL_ICON_SIZE,
  textColor = "foreground",
  underline = "none",
  dataField,
}: RailSectionHeadingProps) {
  return (
    <div
      style={{
        display: "block",
        position: "relative",
        breakAfter: "avoid",
        pageBreakAfter: "avoid",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.itemGap * 0.7, marginBottom: underline === "divider-below" ? tokens.spacing.itemGap * 0.4 : tokens.spacing.itemGap }}>
        <IconBadge tokens={tokens} size={iconSize} background={iconBackground}>
          {icon}
        </IconBadge>
        <Text
          tokens={tokens}
          as="div"
          size="sectionHeading"
          color={textColor}
          bold
          uppercase
          dataField={dataField}
          style={{ letterSpacing: 0.6, flexShrink: underline === "dot-rule" ? 0 : undefined }}
        >
          {children}
        </Text>
        {underline === "dot-rule" ? <DotRule tokens={tokens} /> : null}
      </div>
      {underline === "divider-below" ? (
        <div style={{ marginLeft: railIndentFor(iconSize, tokens), marginBottom: tokens.spacing.itemGap * 0.6 }}>
          <Divider tokens={tokens} thin marginTop={0} marginBottom={0} />
        </div>
      ) : null}
    </div>
  );
}
