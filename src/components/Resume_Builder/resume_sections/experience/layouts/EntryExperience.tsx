import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import DateRange from "@/components/Resume_Builder/resume_base_components/dateRange/DateRange";
import BulletList from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";
import Marker from "@/components/Resume_Builder/resume_base_decorative_components/marker/Marker";
import { railBorderStyle } from "@/components/Resume_Builder/resume_base_decorative_components/rail/Rail";
import type { ExperienceEntry } from "@/types/resume";
import type { ThemeTokens } from "@/types/resume_theme";
import type { ExperienceLayoutProps } from "@/components/Resume_Builder/resume_sections/experience/types";
import { entryField } from "@/components/Resume_Builder/resume_sections/experience/ExperienceEntryFields";
import { ExternalLink } from "lucide-react";

type CompanyLayout =
  // Heading(company) on its own line, italic role below, then its own date row
  // (TwoColumnIconTemplate).
  | "company-then-role"
  // Bold role on its own line, plain company below, then its own date row
  // (StudentSidebarTemplate).
  | "role-then-company"
  // Bold role and "· company" on one baseline-aligned wrapping row, then its own date
  // row (PortfolioBlobTemplate).
  | "role-company-inline"
  // Bold accent role on its own line; company (+ optional "· location") and the date
  // range share one justified row (IconRailTemplate).
  | "role-then-company-date-row"
  // Bold accent role on its own line; company on the next line with an external-link
  // icon beside it when company_url is present, then its own date row
  // (IconLineTemplate).
  | "role-then-linked-company";

type AchievementsLabelStyle =
  // Rendered whenever there are any bullets (TwoColumnIconTemplate).
  | "italic-accent"
  // Rendered only when there are bullets (StudentSidebarTemplate).
  | "bold-uppercase-accent"
  | "none";

type EntryExperienceProps = ExperienceLayoutProps & {
  companyLayout: CompanyLayout;
  // Marker + accent connecting line to its left, like a mini timeline per entry.
  showMarker?: boolean;
  // Appends "· location" next to company - only used by role-then-company-date-row.
  showLocation?: boolean;
  dateColor?: "subtext" | "foreground" | "accent";
  achievementsLabel?: AchievementsLabelStyle;
  // TwoColumnTimelineExperience always rendered BulletList even for an empty list;
  // every other original layout skipped it when there were no bullets. Default true
  // (skip when empty) since that's what 4 of the 5 merged layouts did.
  hideBulletsWhenEmpty?: boolean;
};

function CompanyBlock({ tokens, entry, index, layout }: { tokens: ThemeTokens; entry: ExperienceEntry; index: number; layout: CompanyLayout }) {
  if (layout === "company-then-role") {
    return (
      <>
        <Heading tokens={tokens} variant="primary" dataField={entryField(index, "company")}>
          {entry.company}
        </Heading>
        <Text tokens={tokens} as="div" variant="minor" color="foreground" italic dataField={entryField(index, "role")}>
          {entry.role}
        </Text>
      </>
    );
  }

  if (layout === "role-then-company") {
    return (
      <>
        <Text tokens={tokens} as="div" bold dataField={entryField(index, "role")}>
          {entry.role}
        </Text>
        <Text tokens={tokens} as="div" variant="minor" color="foreground" dataField={entryField(index, "company")}>
          {entry.company}
        </Text>
      </>
    );
  }

  if (layout === "role-company-inline") {
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: tokens.spacing.itemGap * 0.4, flexWrap: "wrap" }}>
        <Text tokens={tokens} as="span" bold dataField={entryField(index, "role")}>
          {entry.role}
        </Text>
        <Text tokens={tokens} as="span" variant="minor" color="foreground" dataField={entryField(index, "company")}>
          · {entry.company}
        </Text>
      </div>
    );
  }

  if (layout === "role-then-linked-company") {
    return (
      <>
        <Text tokens={tokens} as="div" bold color="accent" dataField={entryField(index, "role")}>
          {entry.role}
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Text tokens={tokens} as="div" bold dataField={entryField(index, "company")}>
            {entry.company}
          </Text>
          {entry.company_url ? (
            <a
              href={/^https?:\/\//i.test(entry.company_url) ? entry.company_url : `https://${entry.company_url}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${entry.company} website`}
              style={{ display: "inline-flex", color: tokens.accent }}
            >
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          ) : null}
        </div>
      </>
    );
  }

  // role-then-company-date-row: role alone here, company+date share a row rendered by the caller.
  return (
    <Text tokens={tokens} as="div" bold color="accent" dataField={entryField(index, "role")}>
      {entry.role}
    </Text>
  );
}

// One shared "role/company block, then date range, then optional bullets" entry
// renderer, covering five previously near-identical layouts (formerly
// TwoColumnTimelineExperience, StackedAchievementsExperience, BaselineRowExperience,
// SplitRowExperience, StackedLinkedExperience) via a handful of props instead of one
// copy per template. Layouts with a genuinely different row shape (a 3-column
// date-left timeline, an absolutely-positioned border rail, raw non-component markup)
// stay as their own separate files - forcing those into this prop set would grow this
// component into the "giant switch" the section was built to avoid.
export default function EntryExperience({
  tokens,
  entries,
  companyLayout,
  showMarker = false,
  showLocation = false,
  dateColor = "subtext",
  achievementsLabel = "none",
  hideBulletsWhenEmpty = true,
}: EntryExperienceProps) {
  // 22px - matches IconBadge's default size, so when a template puts an IconBadge
  // above this list (e.g. TwoColumnIconTemplate's SectionHeading) the marker centers
  // under the icon's own center instead of under the marker column's left edge.
  const markerColumnWidth = 22;

  // The timeline rail, drawn as a BACKGROUND GRADIENT on this container rather than as
  // an absolutely-positioned child.
  //
  // It was an absolute element, which meant it lived in exactly ONE fragment: when
  // Paged.js split the experience list, the rail stayed with the first page and
  // continuation pages showed markers with no line joining them. A background is
  // painted on every fragment of a split element, so the line now survives pagination.
  // (Same swap as railBorderStyle() in Rail.tsx and wavyLinesBackgroundStyle().)
  //
  // A gradient is used instead of a border because a border would sit on the box's own
  // edge and consume width; a gradient paints at an arbitrary offset and takes none.
  // The stripe is centred on the marker column's midpoint, exactly where the old
  // absolute element sat.
  const railInset = 5 + markerColumnWidth / 2;
  const railCenter = markerColumnWidth / 2;
  const railStyle: React.CSSProperties =
    showMarker && entries.length > 1
      ? railBorderStyle(tokens, railCenter - 1, tokens.accent, railInset)
      : {};

  return (
    // Block flow, not a flex column: a flex item is fragmented as one opaque box, so
    // entries in a flex container cannot split across pages. Each entry carries its own
    // marginTop in place of the container's former `gap`.
    <div data-resume-rail={showMarker && entries.length > 1 ? "" : undefined} style={{ position: showMarker ? "relative" : undefined, ...railStyle }}>
      {entries.map((entry, index) => {
        const showBullets = !hideBulletsWhenEmpty || entry.bullets.length > 0;
        const showAchievementsLabel = achievementsLabel !== "none" && showBullets;

        const body = (
          // No flex sizing: the marker layout is an indented block now, so the body is
          // simply normal flow filling the column.
          <div>
            {/* Role/company/date/label are one unbreakable unit glued to whatever
                follows, so a page break can never land between an entry's title and
                its first bullet. The entry as a whole stays splittable (see the
                wrapper below), so only the bullets that overflow move to the next
                page - the entry's heading is not dragged along with them. */}
            <div style={{ breakInside: "avoid", pageBreakInside: "avoid", breakAfter: "avoid", pageBreakAfter: "avoid" }}>
              <CompanyBlock tokens={tokens} entry={entry} index={index} layout={companyLayout} />

              {companyLayout === "role-then-company-date-row" ? (
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: tokens.spacing.itemGap * 0.6 }}>
                  <Text tokens={tokens} as="span" variant="minor" color="foreground" dataField={entryField(index, "company")}>
                    {entry.company}
                    {showLocation && entry.location ? <span data-field={entryField(index, "location")}> · {entry.location}</span> : null}
                  </Text>
                  <DateRange
                    tokens={tokens}
                    startDate={entry.start_date}
                    endDate={entry.end_date}
                    startField={entryField(index, "start_date")}
                    endField={entryField(index, "end_date")}
                    color={dateColor}
                    showPresent
                  />
                </div>
              ) : (
                <DateRange
                  tokens={tokens}
                  startDate={entry.start_date}
                  endDate={entry.end_date}
                  startField={entryField(index, "start_date")}
                  endField={entryField(index, "end_date")}
                  color={dateColor}
                  showPresent
                />
              )}

              {showAchievementsLabel ? (
                <Text
                  tokens={tokens}
                  as="div"
                  size="small"
                  color="accent"
                  italic={achievementsLabel === "italic-accent"}
                  bold={achievementsLabel === "bold-uppercase-accent"}
                  uppercase={achievementsLabel === "bold-uppercase-accent"}
                  style={{ marginTop: tokens.spacing.itemGap * 0.4, marginBottom: 2 }}
                >
                  Achievements
                </Text>
              ) : null}
            </div>
            {showBullets ? <BulletList tokens={tokens} items={entry.bullets} dataFieldPrefix={entryField(index, "bullets")} /> : null}
          </div>
        );

        // No breakInside:avoid on the entry wrapper. It used to be atomic, which made
        // Paged.js move a WHOLE entry to the next page the moment one extra bullet
        // pushed it past the space remaining - leaving a large empty band behind.
        // The entry may now split; the header block above keeps the role/company/date
        // together and glued to the first bullet, so a split only ever falls BETWEEN
        // bullets, which is the normal way a long entry continues onto a new page.
        const entryGap = index > 0 ? tokens.spacing.itemGap : 0;

        if (!showMarker) {
          return (
            <div key={index} style={{ marginTop: entryGap }}>
              {body}
            </div>
          );
        }

        // An INDENTED BLOCK with the marker absolutely positioned into the reserved
        // gutter - not a flex row. A flex row cannot split, so a long entry could not
        // continue onto the next page; indenting leaves the body in normal flow at
        // full width, which a continuation fragment inherits correctly.
        const markerGutter = markerColumnWidth + tokens.spacing.itemGap * 0.7;
        return (
          <div key={index} style={{ position: "relative", paddingLeft: markerGutter, marginTop: entryGap }}>
            {/* Belongs to the entry's start, so it is painted once, on whichever page
                the entry begins - the rail behind it is the container's background and
                repeats on every page by itself. */}
            <div style={{ position: "absolute", left: 0, top: 5, width: markerColumnWidth, display: "flex", justifyContent: "center", zIndex: 1 }}>
              <Marker tokens={tokens} filled />
            </div>
            {body}
          </div>
        );
      })}
    </div>
  );
}
