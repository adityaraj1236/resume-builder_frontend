import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import DateRange from "@/components/Resume_Builder/resume_base_components/dateRange/DateRange";
import BulletList from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";
import Marker from "@/components/Resume_Builder/resume_base_decorative_components/marker/Marker";
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap, position: showMarker ? "relative" : undefined }}>
      {/* One continuous rail behind every marker, instead of a separate line
          fragment per entry - a per-entry line can never cross the gap between
          rows, which left a visible break at every dot. Runs from the center of
          the first marker to the center of the last, so it always touches every
          dot regardless of how tall each entry's own content is. */}
      {showMarker && entries.length > 1 ? (
        <div
          style={{
            position: "absolute",
            top: 5 + markerColumnWidth / 2,
            bottom: 5 + markerColumnWidth / 2,
            left: markerColumnWidth / 2,
            width: 2,
            marginLeft: -1,
            background: tokens.accent,
          }}
        />
      ) : null}
      {entries.map((entry, index) => {
        const showBullets = !hideBulletsWhenEmpty || entry.bullets.length > 0;
        const showAchievementsLabel = achievementsLabel !== "none" && showBullets;

        const body = (
          <div style={{ flex: showMarker ? 1 : undefined }}>
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
            {showBullets ? <BulletList tokens={tokens} items={entry.bullets} dataFieldPrefix={entryField(index, "bullets")} /> : null}
          </div>
        );

        if (!showMarker) {
          return (
            <div key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              {body}
            </div>
          );
        }

        return (
          <div key={index} style={{ display: "flex", gap: tokens.spacing.itemGap * 0.7, breakInside: "avoid", pageBreakInside: "avoid" }}>
            <div style={{ width: markerColumnWidth, flexShrink: 0, paddingTop: 5, display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
              <Marker tokens={tokens} filled />
            </div>
            {body}
          </div>
        );
      })}
    </div>
  );
}
