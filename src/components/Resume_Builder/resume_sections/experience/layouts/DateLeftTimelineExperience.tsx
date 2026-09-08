import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import DateRange from "@/components/Resume_Builder/resume_base_components/dateRange/DateRange";
import BulletList from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";
import Marker from "@/components/Resume_Builder/resume_base_decorative_components/marker/Marker";
import Divider from "@/components/Resume_Builder/resume_base_decorative_components/divider/Divider";
import type { ExperienceLayoutProps } from "@/components/Resume_Builder/resume_sections/experience/types";
import { entryField } from "@/components/Resume_Builder/resume_sections/experience/ExperienceEntryFields";

// Three-column row per entry - date column, then a marker+connecting-line rail
// column, then role/company/bullets - with a dashed divider (pulled left to visually
// span all three columns) between entries. Moved here unchanged from
// CenteredTimelineTemplate's inline JSX; decorative column widths stay literal pixel
// values (same rationale as that template's own comment - genuine layout rhythm
// still reads from ThemeTokens, these are just fixed geometry for the row shape).
const DATE_COL_WIDTH = 92;
const ROW_GAP = 14;
const MARKER_COL_WIDTH = 16;
const MARKER_LEAD_IN = 5;
const DIVIDER_PULL = DATE_COL_WIDTH + ROW_GAP + MARKER_COL_WIDTH + ROW_GAP;

export default function DateLeftTimelineExperience({ tokens, entries }: ExperienceLayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {entries.map((entry, index) => (
        <div key={index} style={{ display: "flex", gap: ROW_GAP, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <div style={{ width: DATE_COL_WIDTH, flexShrink: 0, paddingTop: 3 }}>
            <DateRange
              tokens={tokens}
              startDate={entry.start_date}
              endDate={entry.end_date}
              startField={entryField(index, "start_date")}
              endField={entryField(index, "end_date")}
              showPresent
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: MARKER_COL_WIDTH, flexShrink: 0 }}>
            {index > 0 ? (
              <div style={{ width: 2, height: MARKER_LEAD_IN, background: tokens.divider.color }} />
            ) : (
              <div style={{ height: MARKER_LEAD_IN }} />
            )}
            <Marker tokens={tokens} />
            {index < entries.length - 1 ? <div style={{ flex: 1, width: 2, background: tokens.divider.color }} /> : null}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text tokens={tokens} as="div" bold dataField={entryField(index, "role")}>
              {entry.role}
            </Text>
            <Text tokens={tokens} as="div" variant="minor" color="foreground" italic dataField={entryField(index, "company")}>
              {entry.company}
            </Text>
            {entry.bullets.length > 0 ? <BulletList tokens={tokens} items={entry.bullets} dataFieldPrefix={entryField(index, "bullets")} /> : null}
            {index < entries.length - 1 ? (
              <div style={{ marginLeft: -DIVIDER_PULL, width: `calc(100% + ${DIVIDER_PULL}px)` }}>
                <Divider tokens={tokens} thin dashed marginTop={tokens.spacing.itemGap * 0.6} marginBottom={tokens.spacing.itemGap * 0.6} />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
