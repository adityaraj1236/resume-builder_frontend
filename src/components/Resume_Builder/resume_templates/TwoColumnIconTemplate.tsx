"use client";
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

// Builds the template's two independently-flowing halves - shared by the normal
// TwoColumnLayout render below and by getSplitSections, which PaginatedResume calls
// to paginate the left/right columns independently across A4 pages.
function buildSplitSections({ sectionsByType, theme }: TwoColumnIconTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { experience, education, skills, projects, certifications, publications } = getTypedSections(sectionsByType);

  const left = (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sectionGap }}>
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
        <div data-section-key="education">
          <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<GraduationCap size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
            {education.title}
          </RailSectionHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
            <EducationSimple config={{ theme, content: education }} showHeading={false} layout="stacked" />
          </div>
        </div>
      ) : null}
    </div>
  );

  const right = (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sectionGap }}>
      {/* Skills */}
      {skills && skills.categories.length > 0 ? (
        <div data-section-key="skills" style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap }}>
          {skills.categories.map((category, index) => (
            <div key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<Tag size={12} strokeWidth={2} color="white" />} tokens={tokens}>
                <span data-field={`categories.${index}.category_name`}>{category.category_name}</span>
              </RailSectionHeading>
              <div style={{ paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
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
        <div data-section-key="projects">
          <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<ImageIconLucide size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
            {projects.title}
          </RailSectionHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
            <ProjectsLinkList config={{ theme, content: projects }} showHeading={false} descriptionAsBullets />
          </div>
        </div>
      ) : null}

      {/* Certifications */}
      {certifications && certifications.entries.length > 0 ? (
        <div data-section-key="certifications">
          <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<Award size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
            {certifications.title}
          </RailSectionHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
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
        <div data-section-key="publications">
          <RailSectionHeading iconSize={SECTION_ICON_SIZE} textColor="accent" underline="divider-below" icon={<BookOpen size={12} strokeWidth={2} color="white" />} tokens={tokens} dataField="title">
            {publications.title}
          </RailSectionHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT(tokens) }}>
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
  );

  return { left, right };
}

function buildHeader({ sectionsByType, theme }: TwoColumnIconTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { header, summary } = getTypedSections(sectionsByType);

  return (
    <div style={{ fontFamily: tokens.font.family, color: tokens.foreground }}>
      <div data-section-key="header">
        {header ? <HeaderSplit config={{ theme, content: header }} summaryText={summary?.summary} /> : null}
      </div>
      <Divider tokens={tokens} marginTop={tokens.spacing.sectionGap} marginBottom={tokens.spacing.sectionGap} bleedLeft />
    </div>
  );
}

// Used by PaginatedResume: `header` renders once above the two columns (page 1 only,
// full page width); `left`/`right` are the two independently-paginated flows.
export function getSplitSections(props: TwoColumnIconTemplateProps) {
  return { header: buildHeader(props), ...buildSplitSections(props) };
}

export default function TwoColumnIconTemplate({ sectionsByType, theme }: TwoColumnIconTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { left, right } = buildSplitSections({ sectionsByType, theme });

  return (
    <div>
      {buildHeader({ sectionsByType, theme })}
      <TwoColumnLayout tokens={tokens} leftWidth="52%" gap={tokens.spacing.sectionGap} rightAlign={false} left={left} right={right} />
    </div>
  );
}
