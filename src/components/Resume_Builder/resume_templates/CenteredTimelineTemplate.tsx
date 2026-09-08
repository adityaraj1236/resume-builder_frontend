"use client";

import { type ResumeSection, type ThemeTokens, getThemeTokens, getTypedSections, Heading, ContactGroup, FlourishHeading, EducationSimple, SummaryParagraph, SkillsFlatList, ProjectsLinkList, CertificationsList, PublicationsList, AchievementsBullets, DateLeftTimelineExperience } from "@/components/Resume_Builder/resume_templates_imports";

export const templateId = "centered-timeline-v1";
export const templateName = "Centered Timeline";
type SectionsByType = Record<string, ResumeSection>;

type CenteredTimelineTemplateProps = {
  sectionsByType: SectionsByType;
  theme: string | ThemeTokens;
};

export default function CenteredTimelineTemplate({ sectionsByType, theme }: CenteredTimelineTemplateProps) {
  const tokens = getThemeTokens(theme);

  const { header, summary, experience, education, skills, projects, certifications, publications, achievements } = getTypedSections(sectionsByType);

  const contactRows = [
    { type: "email" as const, value: header?.email, dataField: "email" },
    { type: "phone" as const, value: header?.phone, dataField: "phone" },
    { type: "location" as const, value: header?.location, dataField: "location" },
    { type: "link" as const, value: header?.linkedin_url, dataField: "linkedin_url" },
    { type: "link" as const, value: header?.portfolio_url, dataField: "portfolio_url" },
  ].filter((row) => row.value);

  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.background }}>
      {/* Header */}
      <div data-section-key="header" style={{ textAlign: "center" }}>
        <Heading tokens={tokens} variant="name" dataField="full_name">
          {header?.full_name}
        </Heading>

        {header?.title ? (
          <div style={{ marginTop: tokens.spacing.itemGap * 0.4 }}>
            <FlourishHeading tokens={tokens} dataField="title">
              {header.title}
            </FlourishHeading>
          </div>
        ) : null}

        <div style={{ marginTop: tokens.spacing.itemGap * 0.7 }}>
          <ContactGroup tokens={tokens} items={contactRows} separator wrap />
        </div>
      </div>

      {/* Summary */}
      {summary?.summary ? (
        <div data-section-key="summary" style={{ marginTop: tokens.spacing.sectionGap }}>
          <SummaryParagraph config={{ theme, content: summary }} showMeta={false} />
        </div>
      ) : null}

      {/* Experience */}
      {experience && experience.entries.length > 0 ? (
        <div data-section-key="experience" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} dataField="title">{experience.title || "Experience"}</Heading>
          <DateLeftTimelineExperience tokens={tokens} entries={experience.entries} />
        </div>
      ) : null}

      {/* Achievements */}
      {achievements && achievements.entries.length > 0 ? (
        <div data-section-key="achievements" style={{ marginTop: tokens.spacing.sectionGap }}>
          <AchievementsBullets config={{ theme, content: achievements }} />
        </div>
      ) : null}

      {/* Projects */}
      {projects && projects.entries.length > 0 ? (
        <div data-section-key="projects" style={{ marginTop: tokens.spacing.sectionGap }}>
          <ProjectsLinkList config={{ theme, content: projects }} linkAsIcon />
        </div>
      ) : null}

      {/* Skills & Certifications */}
      {(skills && skills.categories.length > 0) || (certifications && certifications.entries.length > 0) ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.spacing.sectionGap, marginTop: tokens.spacing.sectionGap }}>
          {skills && skills.categories.length > 0 ? (
            <div data-section-key="skills">
              <SkillsFlatList config={{ theme, content: skills }} />
            </div>
          ) : null}

          {certifications && certifications.entries.length > 0 ? (
            <div data-section-key="certifications">
              <CertificationsList config={{ theme, content: certifications }} bulleted />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Education */}
      {education && education.entries.length > 0 ? (
        <div data-section-key="education" style={{ marginTop: tokens.spacing.sectionGap }}>
          <EducationSimple config={{ theme, content: education }} />
        </div>
      ) : null}

      {/* Publications */}
      {publications && publications.entries.length > 0 ? (
        <div data-section-key="publications" style={{ marginTop: tokens.spacing.sectionGap }}>
          <PublicationsList config={{ theme, content: publications }} />
        </div>
      ) : null}
    </div>
  );
}
