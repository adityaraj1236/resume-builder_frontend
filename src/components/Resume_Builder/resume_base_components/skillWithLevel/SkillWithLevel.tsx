import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import SkillMeter from "@/components/Resume_Builder/resume_base_components/skillMeter/SkillMeter";
import SkillBar from "@/components/Resume_Builder/resume_base_components/skillBar/SkillBar";

type SkillWithLevelProps = {
  tokens: ThemeTokens;
  skill: string;
  dataField: string;
  // undefined when the category has no per-skill levels - the meter is simply omitted
  // (the label still renders), matching both templates' original "no data, no meter"
  // behavior.
  level?: number;
  meterType: "dots" | "bar";
  // "row": label and meter share one line, justified apart (PortfolioBlobTemplate).
  // "stacked": label above, meter on its own line below (IconRailTemplate).
  layout: "row" | "stacked";
  // "foreground" (default) uses Text's normal color token. A literal CSS color
  // string (e.g. "rgba(255,255,255,0.85)") overrides it via inline style instead -
  // IconRailTemplate's translucent-white label on its dark sidebar isn't a real
  // theme token, so it can't be expressed as one.
  labelColor?: "foreground" | string;
  barTrackColor?: string;
};

// One "skill label + proficiency meter" unit, reused by any skills design that shows
// real per-skill level data (SkillCategory.levels) instead of a plain unranked list.
// Row/stacked layout and dot/bar meter style stay template-controlled props - both are
// deliberate visual choices (see SkillBar/SkillMeter's own comments), not something
// this component should decide for its caller.
export default function SkillWithLevel({ tokens, skill, dataField, level, meterType, layout, labelColor = "foreground", barTrackColor }: SkillWithLevelProps) {
  const meter =
    level === undefined ? null : meterType === "dots" ? (
      <SkillMeter tokens={tokens} level={level} />
    ) : (
      <SkillBar tokens={tokens} level={level} trackColor={barTrackColor} />
    );

  const isTokenColor = labelColor === "foreground";

  if (layout === "stacked") {
    return (
      <div>
        <Text
          tokens={tokens}
          size="small"
          color={isTokenColor ? "foreground" : undefined}
          style={{ color: isTokenColor ? undefined : labelColor, marginBottom: tokens.spacing.itemGap * 0.3, display: "block" }}
          dataField={dataField}
        >
          {skill}
        </Text>
        {meter}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacing.itemGap * 0.7 }}>
      <Text tokens={tokens} size="small" color={isTokenColor ? "foreground" : undefined} style={isTokenColor ? undefined : { color: labelColor }} dataField={dataField}>
        {skill}
      </Text>
      {meter}
    </div>
  );
}
