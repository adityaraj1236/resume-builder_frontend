"use client";

import { type ResumeSection, type ThemeTokens, getThemeTokens, getTypedSections, Photo, Heading, SkillBox, Text, ContactGroup, BulletList, EntryExperience, SummaryParagraph, ProjectsLinkList, EducationSimple, EntryLinkList, Mail, Phone, MapPin, Link2 } from "@/components/Resume_Builder/resume_templates_imports";

export const templateId = "student-sidebar-v1";
export const templateName = "Student Sidebar";
const SIDEBAR_TOP_PAD = 32;
const PHOTO_SIZE = 104;

type SectionsByType = Record<string, ResumeSection>;

type StudentSidebarTemplateProps = {
  sectionsByType: SectionsByType;
  theme: string | ThemeTokens;
};

// Builds the sidebar (left) and main-content (right) halves, composed by the default
// render below.
function buildSplitSections({ sectionsByType, theme }: StudentSidebarTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { header, summary, experience, education, skills, projects, certifications, publications } = getTypedSections(sectionsByType);

  const categories = skills?.categories ?? [];
  // First category = bulleted soft skills, remaining categories = boxed tech skills
  const softSkillsCategory = categories[0];
  const boxedSkillCategories = categories.slice(1);

  const left = (
    <div style={{ position: "relative", height: "100%", boxSizing: "border-box", background: tokens.surface.card, padding: `${SIDEBAR_TOP_PAD}px 20px 32px 24px` }}>
      {/* Accent spine */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 8, height: SIDEBAR_TOP_PAD + PHOTO_SIZE, background: tokens.accent }} />

      {/* Photo */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Photo photoUrl={header?.photo_url ?? ""} size={PHOTO_SIZE} borderColor={tokens.accent} placeholderBackground={tokens.surface.card} iconColor={tokens.foreground} />
      </div>
      <div style={{ height: 1, background: tokens.surface.border, marginTop: tokens.spacing.itemGap }} />

      {/* Contact */}
      <div style={{ marginTop: tokens.spacing.sectionGap }}>
        <Heading tokens={tokens} size="small" color="foreground" pillDivider pillOnly>Contact</Heading>
        <ContactGroup
          tokens={tokens}
          direction="column"
          color="foreground"
          gap={tokens.spacing.itemGap * 0.6}
          items={[
            { value: header?.email, dataField: "email", icon: <Mail size={12} strokeWidth={2} color={tokens.foreground} /> },
            { value: header?.phone, dataField: "phone", icon: <Phone size={12} strokeWidth={2} color={tokens.foreground} /> },
            { value: header?.location, dataField: "location", icon: <MapPin size={12} strokeWidth={2} color={tokens.foreground} /> },
            { type: "link", value: header?.linkedin_url, dataField: "linkedin_url", icon: <Link2 size={12} strokeWidth={2} color={tokens.foreground} /> },
            { type: "link", value: header?.portfolio_url, dataField: "portfolio_url", icon: <Link2 size={12} strokeWidth={2} color={tokens.foreground} /> },
          ]}
        />
      </div>

      {/* Soft skills */}
      {softSkillsCategory && softSkillsCategory.skills.length > 0 ? (
        <>
          <div style={{ height: 1, background: tokens.surface.border, marginTop: tokens.spacing.sectionGap }} />
          <div data-section-key="skills" style={{ marginTop: tokens.spacing.sectionGap }}>
            <Heading tokens={tokens} size="small" color="foreground" pillDivider pillOnly>
              <span data-field="categories.0.category_name">{softSkillsCategory.category_name}</span>
            </Heading>
            <BulletList tokens={tokens} items={softSkillsCategory.skills} dataFieldPrefix="categories.0.skills" style="disc" />
          </div>
        </>
      ) : null}

      {/* Tech skills */}
      {boxedSkillCategories.length > 0
        ? boxedSkillCategories.map((category, categoryIndex) => {
            const realIndex = categoryIndex + 1;
            return (
              <div key={realIndex}>
                <div style={{ height: 1, background: tokens.surface.border, marginTop: tokens.spacing.sectionGap }} />
                <div style={{ marginTop: tokens.spacing.sectionGap, breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <Heading tokens={tokens} size="small" color="foreground" pillDivider pillOnly>
                    <span data-field={`categories.${realIndex}.category_name`}>{category.category_name}</span>
                  </Heading>
                  <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * 0.6 }}>
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBox key={skillIndex} tokens={tokens}>
                        <span data-field={`categories.${realIndex}.skills.${skillIndex}`}>{skill}</span>
                      </SkillBox>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );

  const right = (
    <div style={{ padding: "32px 36px 32px 0", boxSizing: "border-box" }}>
      {/* Header */}
      <div data-section-key="header">
        <Heading tokens={tokens} variant="name" dataField="full_name">
          {header?.full_name}
        </Heading>
        <Text tokens={tokens} as="div" size="title" color="accent" bold uppercase dataField="title" style={{ marginTop: 4, letterSpacing: 1 }}>
          {header?.title}
        </Text>
        <div style={{ height: 2, width: 40, background: tokens.accent, marginTop: tokens.spacing.itemGap * 0.6 }} />
      </div>

      {/* Summary */}
      {summary?.summary ? (
        <div data-section-key="summary" style={{ marginTop: tokens.spacing.itemGap }}>
          <SummaryParagraph config={{ theme, content: summary }} showHeading={false} showMeta={false} />
        </div>
      ) : null}

      {/* Education */}
      {education && education.entries.length > 0 ? (
        <div data-section-key="education" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} pillDivider dataField="title">{education.title || "Education"}</Heading>
          <EducationSimple config={{ theme, content: education }} showHeading={false} layout="stacked-with-courses" />
        </div>
      ) : null}

      {/* Experience */}
      {experience && experience.entries.length > 0 ? (
        <div data-section-key="experience" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} pillDivider dataField="title">{experience.title || "Experience"}</Heading>
          <EntryExperience tokens={tokens} entries={experience.entries} companyLayout="role-then-company" achievementsLabel="bold-uppercase-accent" />
        </div>
      ) : null}

      {/* Projects */}
      {projects && projects.entries.length > 0 ? (
        <div data-section-key="projects" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} pillDivider dataField="title">{projects.title || "Projects"}</Heading>
          <ProjectsLinkList config={{ theme, content: projects }} showHeading={false} textColor="foreground" />
        </div>
      ) : null}

      {/* Certifications */}
      {certifications && certifications.entries.length > 0 ? (
        <div data-section-key="certifications" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} pillDivider dataField="title">{certifications.title || "Certificates"}</Heading>
          <EntryLinkList
            tokens={tokens}
            heading="Certifications"
            showHeading={false}
            bulleted
            linkStyle="icon"
            titleLayout="title-date-subtitle"
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
      ) : null}

      {/* Publications */}
      {publications && publications.entries.length > 0 ? (
        <div data-section-key="publications" style={{ marginTop: tokens.spacing.sectionGap }}>
          <Heading tokens={tokens} pillDivider dataField="title">{publications.title || "Publications"}</Heading>
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
      ) : null}
    </div>
  );

  return { left, right };
}

export default function StudentSidebarTemplate({ sectionsByType, theme }: StudentSidebarTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { left, right } = buildSplitSections({ sectionsByType, theme });

  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.background, display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: tokens.spacing.sectionGap }}>
      <div style={{ width: "30%", minWidth: 220, flexShrink: 0 }}>{left}</div>
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>{right}</div>
    </div>
  );
}
