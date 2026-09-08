import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import DateRange from "@/components/Resume_Builder/resume_base_components/dateRange/DateRange";
import BulletList from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";
import Marker from "@/components/Resume_Builder/resume_base_decorative_components/marker/Marker";
import Divider from "@/components/Resume_Builder/resume_base_decorative_components/divider/Divider";
import type { ExperienceLayoutProps } from "@/components/Resume_Builder/resume_sections/experience/types";
import { entryField } from "@/components/Resume_Builder/resume_sections/experience/ExperienceEntryFields";

// A date column and a marker+connecting-line rail down the left, then
// role/company/bullets, with a dashed divider between entries.
//
// Laid out as an INDENTED BLOCK with the two decorative columns absolutely positioned
// into the reserved gutter, rather than as a flex or grid row - see the comment on the
// entry div for why both of those break under pagination.
//
// Originally moved here unchanged from CenteredTimelineTemplate's inline JSX;
// decorative column widths stay literal pixel values (same rationale as that
// template's own comment - genuine layout rhythm still reads from ThemeTokens, these
// are just fixed geometry for the row shape).
const DATE_COL_WIDTH = 92;
const ROW_GAP = 14;
const MARKER_COL_WIDTH = 16;
const MARKER_LEAD_IN = 5;
// Left gutter reserved on every entry for the absolutely-positioned date and marker
// columns. The dashed divider pulls back by the same amount to span the full width.
const CONTENT_INDENT = DATE_COL_WIDTH + ROW_GAP + MARKER_COL_WIDTH + ROW_GAP;

export default function DateLeftTimelineExperience({ tokens, entries }: ExperienceLayoutProps) {
  // The connecting line, painted as this container's BACKGROUND rather than as
  // per-entry absolutely-positioned segments. A background is repainted on every
  // fragment of a split element, so the line continues down a page that a long entry
  // spilled onto; the old segments lived inside one entry each, so a continuation page
  // showed no line until the next entry started. (Same swap as railBorderStyle() in
  // Rail.tsx and the timeline rail in EntryExperience.)
  const lineCenter = DATE_COL_WIDTH + ROW_GAP + MARKER_COL_WIDTH / 2;
  const railStyle: React.CSSProperties =
    entries.length > 1
      ? {
          backgroundImage: `linear-gradient(to right, transparent ${lineCenter - 1}px, ${tokens.divider.color} ${lineCenter - 1}px, ${tokens.divider.color} ${lineCenter + 1}px, transparent ${lineCenter + 1}px)`,
          // Starts level with the first marker's centre and stops at the last one, so
          // the line touches every dot without overshooting the section.
          backgroundPosition: `0 ${MARKER_LEAD_IN + MARKER_COL_WIDTH / 2}px`,
          backgroundSize: `100% calc(100% - ${MARKER_LEAD_IN + MARKER_COL_WIDTH}px)`,
          backgroundRepeat: "no-repeat",
        }
      : {};

  return (
    <div style={railStyle}>
      {entries.map((entry, index) => (
        // A plain block indented by CONTENT_INDENT, NOT a flex or grid row. Both of
        // those were tried and both failed for the same underlying reason: a
        // multi-column row cannot survive fragmentation intact.
        //   - flex: a flex item is fragmented as ONE opaque box, so the entry could
        //     not split at all - one extra bullet relocated the whole entry to the
        //     next page, leaving a large empty band.
        //   - grid: the entry split, but the continuation fragment did not carry
        //     grid-template-columns, so the overflow bullets rendered inside the 92px
        //     date track instead of the content column.
        // Indenting the whole entry and absolutely positioning the date and marker
        // into that reserved gutter leaves the bullets in NORMAL FLOW at full width,
        // so a continuation fragment inherits the right geometry automatically.
        <div key={index} style={{ position: "relative", paddingLeft: CONTENT_INDENT }}>
          {/* Date and marker sit in the reserved left gutter. They belong to the
              entry's start, so they are painted once, on whichever page the entry
              begins - a continuation page correctly shows bullets only. */}
          <div style={{ position: "absolute", left: 0, top: 3, width: DATE_COL_WIDTH }}>
            <DateRange
              tokens={tokens}
              startDate={entry.start_date}
              endDate={entry.end_date}
              startField={entryField(index, "start_date")}
              endField={entryField(index, "end_date")}
              showPresent
            />
          </div>
          {/* Only the marker DOT lives here. The connecting line used to be drawn as
              two absolutely-positioned segments inside this box (a lead-in above the
              dot, a filler below it), which meant the line existed only within an
              entry - so when a page break fell inside one, the continuation page had
              no line until the NEXT entry began. The line is now one background
              gradient on the outer container, which the browser repaints on every
              fragment, so it runs unbroken down every page. */}
          <div
            style={{
              position: "absolute",
              left: DATE_COL_WIDTH + ROW_GAP,
              top: MARKER_LEAD_IN,
              width: MARKER_COL_WIDTH,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Marker tokens={tokens} />
          </div>

          {/* Role + company stay together and glued to the first bullet, so a break
              can only ever fall BETWEEN bullets - never between an entry's title and
              its content. */}
          <div style={{ breakInside: "avoid", pageBreakInside: "avoid", breakAfter: "avoid", pageBreakAfter: "avoid" }}>
            <Text tokens={tokens} as="div" bold dataField={entryField(index, "role")}>
              {entry.role}
            </Text>
            <Text tokens={tokens} as="div" variant="minor" color="foreground" italic dataField={entryField(index, "company")}>
              {entry.company}
            </Text>
          </div>
          {entry.bullets.length > 0 ? <BulletList tokens={tokens} items={entry.bullets} dataFieldPrefix={entryField(index, "bullets")} /> : null}
          {index < entries.length - 1 ? (
            <div style={{ marginLeft: -CONTENT_INDENT }}>
              <Divider tokens={tokens} thin dashed marginTop={tokens.spacing.itemGap * 0.6} marginBottom={tokens.spacing.itemGap * 0.6} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
