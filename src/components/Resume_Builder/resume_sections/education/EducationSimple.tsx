"use client";

import type { BaseSectionConfig, EducationContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import DateRange from "@/components/Resume_Builder/resume_base_components/dateRange/DateRange";
import BulletList from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";

export const designId = "education-simple-v1";
export const designName = "Simple List";

type Content = EducationContent;
export type SectionConfig = BaseSectionConfig<Content>;

type EducationSimpleProps = {
  config: SectionConfig;
  showHeading?: boolean;
  showDetails?: boolean;
  layout?: "side-by-side" | "stacked" | "stacked-with-courses";
  // "stacked-with-courses" only: label text above the courses bullet list -
  // StudentSidebarTemplate uses "Relevant Courses:", PortfolioBlobTemplate uses
  // "Relevant Coursework:".
  courseLabel?: string;
  // "stacked-with-courses" only: DateRange color - defaults to "accent" (Student
  // Sidebar/PortfolioBlob's look). IconRailTemplate leaves it at DateRange's own
  // default ("subtext").
  dateColor?: "subtext" | "foreground" | "accent";
  // "stacked-with-courses" only: renders entry.notes as a "Relevant Courses" bullet
  // list (default true). IconRailTemplate's design has no coursework block at all -
  // false skips it even when notes has data.
  showCourses?: boolean;
};

export default function EducationSimple({
  config,
  showHeading = true,
  showDetails = true,
  layout = "side-by-side",
  courseLabel = "Relevant Courses:",
  dateColor = "accent",
  showCourses = true,
}: EducationSimpleProps) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  return (
    <div>
      {showHeading ? <Heading tokens={tokens}>Education</Heading> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * 0.6 }}>
        {entries.map((entry, index) => {
          if (layout === "stacked-with-courses") {
            const courses = (entry.notes ?? "")
              .split(/[,\n]/)
              .map((course) => course.trim())
              .filter(Boolean);

            return (
              <div key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <Text tokens={tokens} as="div" bold dataField={`entries.${index}.degree`}>
                  {entry.degree}
                </Text>
                <Text tokens={tokens} as="div" variant="minor" color="foreground" dataField={`entries.${index}.institution`}>
                  {entry.institution}
                </Text>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <DateRange
                    tokens={tokens}
                    startDate={entry.start_date}
                    endDate={entry.end_date}
                    startField={`entries.${index}.start_date`}
                    endField={`entries.${index}.end_date`}
                    color={dateColor}
                    showPresent
                  />
                  {entry.gpa ? (
                    <Text tokens={tokens} size="small" color="accent">
                      GPA: <span data-field={`entries.${index}.gpa`}>{entry.gpa}</span>
                    </Text>
                  ) : null}
                </div>
                {showCourses && courses.length > 0 ? (
                  <div style={{ marginTop: tokens.spacing.itemGap * 0.4 }}>
                    <Text tokens={tokens} as="div" size="small" color="foreground" bold italic style={{ marginBottom: 2 }}>
                      {courseLabel}
                    </Text>
                    {/* entry.notes is one string, not a real array - so this carries
                        ONE dataField on the whole list (BulletList's dataField mode),
                        not per-course. CSS multi-column auto-splits the <ul> into two
                        columns as evenly as possible. */}
                    <div style={{ columnCount: 2, columnGap: 16 }}>
                      <BulletList tokens={tokens} items={courses} dataField={`entries.${index}.notes`} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          }

          return layout === "stacked" ? (
            <div key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <Heading tokens={tokens} variant="primary" dataField={`entries.${index}.degree`}>
                {entry.degree}
              </Heading>
              <Text tokens={tokens} as="div" variant="minor" color="foreground" dataField={`entries.${index}.institution`}>
                {entry.institution}
              </Text>
              <DateRange
                tokens={tokens}
                startDate={entry.start_date}
                endDate={entry.end_date}
                startField={`entries.${index}.start_date`}
                endField={`entries.${index}.end_date`}
                color="accent"
              />
            </div>
          ) : (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div>
                <Heading tokens={tokens} variant="primary" dataField={`entries.${index}.degree`}>
                  {entry.degree}
                  {entry.field_of_study ? (
                    <Text tokens={tokens} as="span" dataField={`entries.${index}.field_of_study`}>
                      {" "}— {entry.field_of_study}
                    </Text>
                  ) : null}
                </Heading>
                <Heading tokens={tokens} variant="secondary" dataField={`entries.${index}.institution`}>
                  {entry.institution}
                </Heading>
                {showDetails && entry.location ? (
                  <Text tokens={tokens} as="div" variant="minor" dataField={`entries.${index}.location`}>
                    {entry.location}
                  </Text>
                ) : null}
                {showDetails && entry.gpa ? (
                  <Text tokens={tokens} as="div" variant="minor" dataField={`entries.${index}.gpa`}>
                    GPA: {entry.gpa}
                  </Text>
                ) : null}
                {showDetails && entry.notes ? (
                  <Text tokens={tokens} as="div" variant="minor" dataField={`entries.${index}.notes`}>
                    {entry.notes}
                  </Text>
                ) : null}
              </div>
              <div style={{ whiteSpace: "nowrap" }}>
                <DateRange
                  tokens={tokens}
                  startDate={entry.start_date}
                  endDate={entry.end_date}
                  startField={`entries.${index}.start_date`}
                  endField={`entries.${index}.end_date`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
