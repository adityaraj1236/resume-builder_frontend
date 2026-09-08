"use client";

import { type ResumeSection, type ThemeTokens, getThemeTokens, getTypedSections, Heading, Text, ContactGroup, Divider, FlourishHeading, SummaryParagraph, SkillsPillCloud, EducationSimple, CertificationsList, ProjectsLinkList, EntryExperience, PublicationsList, AchievementsBullets, User, Settings, Briefcase, Code2, Star, GraduationCap, BadgeCheck, FileText } from "@/components/Resume_Builder/resume_templates_imports";

export const templateId = "icon-line-v1";
export const templateName = "Icon Line";
const SECTION_CONTENT_INDENT = 28;

function IconHeading({ tokens, icon, children }: { tokens: ThemeTokens; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.itemGap * 0.7, marginBottom: tokens.spacing.itemGap, breakAfter: "avoid", pageBreakAfter: "avoid" }}>
      {icon}
      <Text tokens={tokens} as="div" size="sectionHeading" color="foreground" bold uppercase style={{ letterSpacing: 0.6, flexShrink: 0 }}>
        {children}
      </Text>
      <div style={{ flex: 1 }}>
        <Divider tokens={tokens} thin marginTop={0} marginBottom={0} />
      </div>
    </div>
  );
}

type SectionsByType = Record<string, ResumeSection>;

type IconLineTemplateProps = {
  sectionsByType: SectionsByType;
  theme: string | ThemeTokens;
};

export default function IconLineTemplate({ sectionsByType, theme }: IconLineTemplateProps) {
  const tokens = getThemeTokens(theme);

  const { header, summary, experience, education, skills, projects, certifications, publications, achievements } = getTypedSections(sectionsByType);

  const contactRows = [
    { type: "email" as const, value: header?.email, dataField: "email" },
    { type: "phone" as const, value: header?.phone, dataField: "phone" },
    { type: "location" as const, value: header?.location, dataField: "location" },
    { type: "link" as const, value: header?.linkedin_url, dataField: "linkedin_url" },
    { type: "link" as const, value: header?.portfolio_url, dataField: "portfolio_url" },
  ];

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
          <IconHeading tokens={tokens} icon={<User size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{summary.title || "Professional Summary"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <SummaryParagraph config={{ theme, content: summary }} showHeading={false} showMeta={false} />
          </div>
        </div>
      ) : null}

      {/* Skills */}
      {skills && skills.categories.length > 0 ? (
        <div data-section-key="skills" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<Settings size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{skills.title || "General Skills"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <SkillsPillCloud config={{ theme, content: skills }} showHeading={false} />
          </div>
        </div>
      ) : null}

      {/* Experience */}
      {experience && experience.entries.length > 0 ? (
        <div data-section-key="experience" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<Briefcase size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{experience.title || "Work Experience"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <EntryExperience tokens={tokens} entries={experience.entries} companyLayout="role-then-linked-company" />
          </div>
        </div>
      ) : null}

      {/* Projects */}
      {projects && projects.entries.length > 0 ? (
        <div data-section-key="projects" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<Code2 size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{projects.title || "Projects"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <ProjectsLinkList config={{ theme, content: projects }} showHeading={false} />
          </div>
        </div>
      ) : null}

      {/* Achievements */}
      {achievements && achievements.entries.length > 0 ? (
        <div data-section-key="achievements" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<Star size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{achievements.title || "Achievements"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <AchievementsBullets config={{ theme, content: achievements }} showHeading={false} />
          </div>
        </div>
      ) : null}

      {/* Education */}
      {education && education.entries.length > 0 ? (
        <div data-section-key="education" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<GraduationCap size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{education.title || "Education"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <EducationSimple config={{ theme, content: education }} showHeading={false} showDetails={false} />
          </div>
        </div>
      ) : null}

      {/* Certifications */}
      {certifications && certifications.entries.length > 0 ? (
        <div data-section-key="certifications" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<BadgeCheck size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{certifications.title || "Certificates"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <CertificationsList config={{ theme, content: certifications }} showHeading={false} />
          </div>
        </div>
      ) : null}

      {/* Publications */}
      {publications && publications.entries.length > 0 ? (
        <div data-section-key="publications" style={{ marginTop: tokens.spacing.sectionGap }}>
          <IconHeading tokens={tokens} icon={<FileText size={18} strokeWidth={2} color={tokens.accent} />}>
            <span data-field="title">{publications.title || "Publications"}</span>
          </IconHeading>
          <div style={{ paddingLeft: SECTION_CONTENT_INDENT }}>
            <PublicationsList config={{ theme, content: publications }} showHeading={false} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
