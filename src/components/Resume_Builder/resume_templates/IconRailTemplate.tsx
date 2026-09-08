"use client";

import { type ResumeSection, type ThemeTokens, getThemeTokens, getTypedSections, Text, Heading, ContactGroup, SkillWithLevel, railBorderStyle, RailSectionHeading, RAIL_INDENT, SectionPill, ProjectsLinkList, EntryExperience, SummaryParagraph, EntryLinkList, EducationSimple, User, Briefcase, Code2, BookOpen, GraduationCap, FileText, Star } from "@/components/Resume_Builder/resume_templates_imports";

export const templateId = "icon-rail-v1";
export const templateName = "Icon Rail";

type SectionsByType = Record<string, ResumeSection>;

type IconRailTemplateProps = {
  sectionsByType: SectionsByType;
  theme: string | ThemeTokens;
};

// Builds the sidebar (left) and main-content (right) halves, composed by the default
// render below.
function buildSplitSections({ sectionsByType, theme }: IconRailTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { header, summary, experience, education, skills, projects, certifications, publications, achievements } = getTypedSections(sectionsByType);

  // Flattened across every category into one "Technical Skills" list
  const flatSkills = (skills?.categories ?? []).flatMap((category, categoryIndex) =>
    category.skills.map((skill, skillIndex) => ({
      skill,
      level: category.levels?.[skillIndex],
      dataField: `categories.${categoryIndex}.skills.${skillIndex}`,
    })),
  );

  const nameTokens = (header?.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameTokens[0] ?? "";
  const restOfName = nameTokens.slice(1).join(" ");

  const left = (
    <div style={{ height: "100%", boxSizing: "border-box", background: tokens.foreground, padding: "32px 24px" }}>
      {/* Name */}
      <div data-field="full_name" style={{ fontFamily: tokens.font.family, fontWeight: tokens.font.headingWeight, fontSize: tokens.font.sizes.name * 0.85, lineHeight: tokens.font.lineHeights.heading }}>
        <span style={{ color: tokens.background }}>{firstName}</span>
        {restOfName ? (
          <>
            <br />
            <span style={{ color: tokens.accent }}>{restOfName}</span>
          </>
        ) : null}
      </div>
      <Text tokens={tokens} as="div" size="small" bold uppercase style={{ marginTop: 8, letterSpacing: 1.5, color: "rgba(255,255,255,0.7)" }}>
        {header?.title}
      </Text>
      <div style={{ height: 2, width: 40, background: tokens.accent, marginTop: tokens.spacing.itemGap, marginBottom: tokens.spacing.sectionGap }} />

      {/* Contact */}
      <ContactGroup
        tokens={tokens}
        direction="column"
        color="background"
        gap={tokens.spacing.itemGap * 0.6}
        items={[
          { type: "email", value: header?.email, dataField: "email" },
          { type: "phone", value: header?.phone, dataField: "phone" },
          { type: "location", value: header?.location, dataField: "location" },
          { type: "link", value: header?.portfolio_url, dataField: "portfolio_url" },
          { type: "link", value: header?.linkedin_url, dataField: "linkedin_url" },
        ]}
      />

      {/* Skills */}
      {flatSkills.length > 0 ? (
        <div data-section-key="skills" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} size="small" color="background" pillDivider pillOnly pillWidth={26} pillHeight={4}>
            <span data-field="title">{skills?.title || "Technical Skills"}</span>
          </Heading>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * 0.7 }}>
            {flatSkills.map(({ skill, level, dataField }, index) => (
              <SkillWithLevel key={index} tokens={tokens} skill={skill} dataField={dataField} level={level} meterType="bar" layout="stacked" labelColor="rgba(255,255,255,0.85)" barTrackColor="rgba(255,255,255,0.18)" />
            ))}
          </div>
        </div>
      ) : null}

      {/* Achievements */}
      {achievements && achievements.entries.length > 0 ? (
        <div data-section-key="achievements" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} size="small" color="background" pillDivider pillOnly pillWidth={26} pillHeight={4}>
            <span data-field="title">{achievements.title || "Achievements"}</span>
          </Heading>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * 0.8 }}>
            {achievements.entries.map((entry, index) => (
              <div key={index} style={{ display: "flex", gap: tokens.spacing.itemGap * 0.6, breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div style={{ marginTop: 3, flexShrink: 0 }}>
                  <Star size={12} fill={tokens.accent} stroke="none" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <Text tokens={tokens} as="div" size="small" bold style={{ color: "#ffffff" }} dataField={`entries.${index}.title`}>
                    {entry.title}
                  </Text>
                  {entry.description ? (
                    <Text tokens={tokens} as="div" size="small" style={{ color: "rgba(255,255,255,0.7)", marginTop: 1 }} dataField={`entries.${index}.description`}>
                      {entry.description}
                    </Text>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  const right = (
    <div style={{ padding: "12px 16px", boxSizing: "border-box"}}>
      {/* Rail painted as this wrapper's background rather than an absolutely-
          positioned <Rail/>, so it repeats on every fragment when the column is
          split across pages. A background costs no width, so the column keeps its
          full measured size. position:relative stays for SectionPill below. */}
      <div style={{ position: "relative", ...railBorderStyle(tokens) }}>

        {/* Summary */}
        {summary?.summary ? (
          <div data-section-key="summary">
            <RailSectionHeading tokens={tokens} icon={<User size={14} strokeWidth={2} color={tokens.background} />}>
              <span data-field="title">{summary.title || "Professional Summary"}</span>
            </RailSectionHeading>
            <SectionPill tokens={tokens} indent={RAIL_INDENT} />
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <SummaryParagraph config={{ theme, content: summary }} showHeading={false} showMeta={false} />
            </div>
          </div>
        ) : null}

        {/* Experience */}
        {experience && experience.entries.length > 0 ? (
          <div data-section-key="experience" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<Briefcase size={14} strokeWidth={2} color={tokens.background} />}>
              <span data-field="title">{experience.title || "Work Experience"}</span>
            </RailSectionHeading>
            <SectionPill tokens={tokens} indent={RAIL_INDENT} />
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <EntryExperience tokens={tokens} entries={experience.entries} companyLayout="role-then-company-date-row" showLocation />
            </div>
          </div>
        ) : null}

        {/* Projects */}
        {projects && projects.entries.length > 0 ? (
          <div data-section-key="projects" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<Code2 size={14} strokeWidth={2} color={tokens.background} />}>
              <span data-field="title">{projects.title || "Projects"}</span>
            </RailSectionHeading>
            <SectionPill tokens={tokens} indent={RAIL_INDENT} />
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <ProjectsLinkList config={{ theme, content: projects }} showHeading={false} />
            </div>
          </div>
        ) : null}

        {/* Certifications */}
        {certifications && certifications.entries.length > 0 ? (
          <div data-section-key="certifications" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<BookOpen size={14} strokeWidth={2} color={tokens.background} />}>
              <span data-field="title">{certifications.title || "Courses & Trainings"}</span>
            </RailSectionHeading>
            <SectionPill tokens={tokens} indent={RAIL_INDENT} />
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <EntryLinkList
                tokens={tokens}
                heading="Courses & Trainings"
                showHeading={false}
                linkStyle="icon"
                titleLayout="title-issuer-split"
                gapMultiplier={0.4}
                items={certifications.entries.map((entry, index) => ({
                  title: entry.name,
                  titleField: `entries.${index}.name`,
                  subtitle: entry.issuer,
                  subtitleField: `entries.${index}.issuer`,
                  date: entry.date,
                  dateField: `entries.${index}.date`,
                  linkField: `entries.${index}.link`,
                }))}
              />
            </div>
          </div>
        ) : null}

        {/* Education */}
        {education && education.entries.length > 0 ? (
          <div data-section-key="education" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<GraduationCap size={14} strokeWidth={2} color={tokens.background} />}>
              <span data-field="title">{education.title || "Education"}</span>
            </RailSectionHeading>
            <SectionPill tokens={tokens} indent={RAIL_INDENT} />
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <EducationSimple config={{ theme, content: education }} showHeading={false} layout="stacked-with-courses" dateColor="subtext" showCourses={false} />
            </div>
          </div>
        ) : null}

        {/* Publications */}
        {publications && publications.entries.length > 0 ? (
          <div data-section-key="publications" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<FileText size={14} strokeWidth={2} color={tokens.background} />}>
              <span data-field="title">{publications.title || "Publications"}</span>
            </RailSectionHeading>
            <SectionPill tokens={tokens} indent={RAIL_INDENT} />
            <div style={{ paddingLeft: RAIL_INDENT }}>
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
                  linkField: `entries.${index}.link`,
                }))}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return { left, right };
}

export default function IconRailTemplate({ sectionsByType, theme }: IconRailTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { left, right } = buildSplitSections({ sectionsByType, theme });

  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.background, display: "flex", alignItems: "stretch", flexWrap: "wrap" }}>
      <div style={{ width: "32%", minWidth: 230, flexShrink: 0 }}>{left}</div>
      <div style={{ flex: "1 1 340px", minWidth: 0 }}>{right}</div>
    </div>
  );
}
