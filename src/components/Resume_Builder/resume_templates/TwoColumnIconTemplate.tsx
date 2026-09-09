"use client";
import { COLUMN_GAP_PX } from "../pagedjs_poc/pageMargins";
import { type ResumeSection, type ThemeTokens, getThemeTokens, getTypedSections, Badge, EntryLinkList, Divider, TwoColumnLayout, HeaderSplit, EntryExperience, ProjectsLinkList, EducationSimple, Briefcase, GraduationCap, Tag, ImageIconLucide, Award, BookOpen } from "@/components/Resume_Builder/resume_templates_imports";
import RailSectionHeading, { railIndentFor } from "@/components/Resume_Builder/resume_base_decorative_components/railSectionHeading/RailSectionHeading";
export const templateId = "two-column-icon-v1";
export const templateName = "Two-Column Icon";
const SECTION_ICON_SIZE = 22;
const SECTION_CONTENT_INDENT = (tokens: ThemeTokens) => railIndentFor(SECTION_ICON_SIZE, tokens);
type SectionsByType = Record<string, ResumeSection>;

type TwoColumnIconTemplateProps = {
  sectionsByType: SectionsByType;
  theme: string | ThemeTokens;
};

export default function TwoColumnIconTemplate({ sectionsByType, theme }: TwoColumnIconTemplateProps) {
  const tokens = getThemeTokens(theme);

  const { header, summary, experience, education, skills, projects, certifications, publications } = getTypedSections(sectionsByType);

  return (
    <div style={{ display: "block", fontFamily: tokens.font.family, color: tokens.foreground }}>
      {/* Header */}
      <div data-section-key="header" style={{ display: "block" }}>
        {header ? <HeaderSplit config={{ theme, content: header }} summaryText={summary?.summary} /> : null}
      </div>

      <Divider tokens={tokens} marginTop={tokens.spacing.sectionGap} marginBottom={tokens.spacing.sectionGap} bleedLeft />

      <div style={{ display: "block", marginTop: tokens.spacing.sectionGap }}>
        <TwoColumnLayout
          tokens={tokens}
          /* Widening the left column pushes the right one further right. Kept as a
             percentage so both columns still scale with the page rather than being
             pinned to a fixed pixel split. */
          leftWidth="54%"
          gap={COLUMN_GAP_PX}
          rightAlign={false}
          left={
            // Block flow, not a flex column. A flex item is fragmented as one opaque
            // box, so a flex container's children cannot split across pages - Paged.js
            // was forced to break at a lower level, which stranded bullets on page 2
            // with no section heading above them. Each section carries its own
            // marginTop in place of the container's `gap`.
            <div>
              {/* Experience */}
              {experience && experience.entries.length > 0 ? (
                <div data-section-key="experience">
                  <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<Briefcase size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
                    {experience.title}
                  </RailSectionHeading>
                  <EntryExperience
                    tokens={tokens}
                    entries={experience.entries}
                    companyLayout="company-then-role"
                    showMarker
                    dateColor="accent"
                    achievementsLabel="italic-accent"
                    hideBulletsWhenEmpty={false}
                  />
                </div>
              ) : null}

              {/* Education */}
              {education && education.entries.length > 0 ? (
                <div data-section-key="education" style={{ display: "block", marginTop: tokens.spacing.sectionGap }}>
                  <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<GraduationCap size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
                    {education.title}
                  </RailSectionHeading>
                  <div style={{ display: "block", paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
                    <EducationSimple config={{ theme, content: education }} showHeading={false} layout="stacked" />
                  </div>
                </div>
              ) : null}
            </div>
          }
          right={
            // Block flow, not a flex column - same reason as the left column above.
            <div>
              {/* Skills */}
              {skills && skills.categories.length > 0 ? (
                <div data-section-key="skills">
                  {skills.categories.map((category, index) => (
                    // A single skill category is small, so it stays atomic - but the
                    // categories are no longer flex siblings, so the LIST of them can
                    // break between categories.
                    <div key={index} style={{ display: "block", marginTop: index > 0 ? tokens.spacing.itemGap : 0, breakInside: "avoid", pageBreakInside: "avoid" }}>
                      <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<Tag size={12} strokeWidth={2} color="white" />} tokens={tokens}>
                        <span data-field={`categories.${index}.category_name`}>{category.category_name}</span>
                      </RailSectionHeading>
                      <div style={{ display: "block", paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
                        {category.skills.map((skill, skillIndex) => (
                          <Badge tokens={tokens} key={skillIndex} borderRadius={tokens.radii.card * 0.6} paddingX={tokens.spacing.itemGap}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Projects */}
              {projects && projects.entries.length > 0 ? (
                <div data-section-key="projects" style={{ display: "block", marginTop: tokens.spacing.sectionGap }}>
                  <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<ImageIconLucide size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
                    {projects.title}
                  </RailSectionHeading>
                  <div style={{ display: "block", paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
                    <ProjectsLinkList config={{ theme, content: projects }} showHeading={false} descriptionAsBullets />
                  </div>
                </div>
              ) : null}

              {/* Certifications */}
              {certifications && certifications.entries.length > 0 ? (
                <div data-section-key="certifications" style={{ display: "block", marginTop: tokens.spacing.sectionGap }}>
                  <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<Award size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
                    {certifications.title}
                  </RailSectionHeading>
                  <div style={{ display: "block", paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
                    <EntryLinkList
                      tokens={tokens}
                      heading="Certifications"
                      showHeading={false}
                      linkStyle="icon"
                      titleLayout="title-link-row"
                      gapMultiplier={0.7}
                      items={certifications.entries.map((entry, index) => ({
                        title: entry.name,
                        titleField: `entries.${index}.name`,
                        subtitle: entry.issuer,
                        subtitleField: `entries.${index}.issuer`,
                        date: entry.date,
                        dateField: `entries.${index}.date`,
                        link: entry.link,
                        linkField: `entries.${index}.link`,
                      }))}
                    />
                  </div>
                </div>
              ) : null}

              {/* Publications */}
              {publications && publications.entries.length > 0 ? (
                <div data-section-key="publications" style={{ display: "block", marginTop: tokens.spacing.sectionGap }}>
                  <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<BookOpen size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
                    {publications.title}
                  </RailSectionHeading>
                  <div style={{ display: "block", paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
                    <EntryLinkList
                      tokens={tokens}
                      heading="Publications"
                      showHeading={false}
                      linkStyle="icon"
                      titleLayout="title-link-row"
                      gapMultiplier={0.7}
                      items={publications.entries.map((entry, index) => ({
                        title: entry.title,
                        titleField: `entries.${index}.title`,
                        subtitle: entry.publisher,
                        subtitleField: `entries.${index}.publisher`,
                        date: entry.date,
                        dateField: `entries.${index}.date`,
                        link: entry.link,
                        linkField: `entries.${index}.link`,
                        description: entry.description,
                        descriptionField: `entries.${index}.description`,
                      }))}
                    />
                  </div>
                </div>
              ) : null}

              
            </div>
          }
        />
      </div>
    </div>
  );
}
