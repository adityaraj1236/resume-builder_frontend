"use client";

import { type ResumeSection, type ThemeTokens, getThemeTokens, getTypedSections, Photo, Text, ContactGroup, BulletList, SkillWithLevel, IconUpload, Blob, DotGrid, QuoteCard, Rail, WavyLines, RailSectionHeading, RAIL_INDENT, ProjectsLinkList, EntryExperience, EducationSimple, CertificationsLogoGrid, PublicationsList, SummaryParagraph, GraduationCap, Award, FolderOpen, BadgeCheck, BookOpen } from "@/components/Resume_Builder/resume_templates_imports";

export const templateId = "portfolio-blob-v1";
export const templateName = "Portfolio Blob";

function ToolDotIcon({ color }: { color: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10">
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );
}

function SidebarHeading({ tokens, children }: { tokens: ThemeTokens; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: tokens.spacing.itemGap, breakAfter: "avoid", pageBreakAfter: "avoid" }}>
      <Text tokens={tokens} as="div" size="small" color="foreground" bold uppercase style={{ letterSpacing: 1 }}>
        {children}
      </Text>
      <div style={{ height: 2, width: 26, background: tokens.accent, marginTop: 5 }} />
    </div>
  );
}

// First sentence of the summary, used for the pull-quote callout
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

const PHOTO_SIZE = 108;

type SectionsByType = Record<string, ResumeSection>;

type PortfolioBlobTemplateProps = {
  sectionsByType: SectionsByType;
  theme: string | ThemeTokens;
};

// Builds the sidebar (left) and main-content (right) halves - shared by the default
// render below and by getSplitSections, which PaginatedResume calls to paginate the
// sidebar and main column independently across A4 pages.
function buildSplitSections({ sectionsByType, theme }: PortfolioBlobTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { header, summary, experience, education, skills, projects, certifications, publications } = getTypedSections(sectionsByType);

  const categories = skills?.categories ?? [];
  // First category = plain soft skills, second = icon+label grid, rest = plain lists
  const softSkillsCategory = categories[0];
  const iconGridCategory = categories[1];
  const extraCategories = categories.slice(2);
  const softSkillsLevels =
    softSkillsCategory?.levels && softSkillsCategory.levels.length === softSkillsCategory.skills.length
      ? softSkillsCategory.levels
      : null;

  const nameTokens = (header?.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameTokens[0] ?? "";
  const restOfName = nameTokens.slice(1).join(" ");

  const left = (
    <div style={{ height: "100%", boxSizing: "border-box", background: tokens.surface.card, borderRight: `1px solid ${tokens.surface.border}`, padding: "32px 22px 32px 24px", display: "flex", flexDirection: "column" }}>
      {/* Photo */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: PHOTO_SIZE + 30, height: PHOTO_SIZE + 30 }}>
          <div style={{ position: "absolute", bottom: PHOTO_SIZE * 0.08, left: -PHOTO_SIZE * 0.12 }}>
            <Blob tokens={tokens} size={PHOTO_SIZE * 0.55} opacity={0.85} />
          </div>
          <div style={{ position: "absolute", top: -6, right: -8 }}>
            <DotGrid tokens={tokens} rows={6} cols={6} dotSize={3} gap={5} />
          </div>
          <div style={{ position: "relative" }}>
            <Photo photoUrl={header?.photo_url ?? ""} size={PHOTO_SIZE} borderColor={tokens.background} placeholderBackground={tokens.surface.card} iconColor={tokens.foreground} />
          </div>
        </div>
      </div>

      {/* Signature */}
      {firstName ? (
        <Text tokens={tokens} as="div" color="accent" italic style={{ marginTop: 8, textAlign: "center", fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontSize: 22, fontStyle: "normal" }}>
          {firstName.toLowerCase()}
        </Text>
      ) : null}

      {/* Contact */}
      <div style={{ marginTop: tokens.spacing.sectionGap }}>
        <SidebarHeading tokens={tokens}>Contact</SidebarHeading>
        <ContactGroup
          tokens={tokens}
          direction="column"
          color="foreground"
          gap={tokens.spacing.itemGap * 0.6}
          items={[
            { type: "email", value: header?.email, dataField: "email" },
            { type: "phone", value: header?.phone, dataField: "phone" },
            { type: "location", value: header?.location, dataField: "location" },
            { type: "link", value: header?.linkedin_url, dataField: "linkedin_url" },
            { type: "link", value: header?.portfolio_url, dataField: "portfolio_url" },
          ]}
        />
      </div>

      {/* Soft skills */}
      {softSkillsCategory && softSkillsCategory.skills.length > 0 ? (
        <div data-section-key="skills" style={{ marginTop: tokens.spacing.sectionGap }}>
          <SidebarHeading tokens={tokens}>
            <span data-field="categories.0.category_name">{softSkillsCategory.category_name}</span>
          </SidebarHeading>
          {softSkillsLevels ? (
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * 0.6 }}>
              {softSkillsCategory.skills.map((skill, skillIndex) => (
                <SkillWithLevel key={skillIndex} tokens={tokens} skill={skill} dataField={`categories.0.skills.${skillIndex}`} level={softSkillsLevels[skillIndex]} meterType="dots" layout="row" />
              ))}
            </div>
          ) : (
            <BulletList tokens={tokens} items={softSkillsCategory.skills} dataFieldPrefix="categories.0.skills" style="disc" />
          )}
        </div>
      ) : null}

      {/* Icon-grid skills */}
      {iconGridCategory && iconGridCategory.skills.length > 0 ? (
        <div style={{ marginTop: tokens.spacing.sectionGap, breakInside: "avoid", pageBreakInside: "avoid" }}>
          <SidebarHeading tokens={tokens}>
            <span data-field="categories.1.category_name">{iconGridCategory.category_name}</span>
          </SidebarHeading>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.spacing.itemGap * 0.6 }}>
            {iconGridCategory.skills.map((skill, skillIndex) => (
              <div key={skillIndex} style={{ display: "flex", alignItems: "center", gap: tokens.spacing.itemGap * 0.4 }}>
                <IconUpload tokens={tokens} iconUrl={iconGridCategory.icons?.[skillIndex]} size={18} fallbackIcon={<ToolDotIcon color={tokens.background} />} />
                <Text tokens={tokens} size="small" color="foreground" dataField={`categories.1.skills.${skillIndex}`}>
                  {skill}
                </Text>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Extra skills */}
      {extraCategories.map((category, extraIndex) => {
        const realIndex = extraIndex + 2;
        if (category.skills.length === 0) return null;
        return (
          <div key={realIndex} style={{ marginTop: tokens.spacing.sectionGap, breakInside: "avoid", pageBreakInside: "avoid" }}>
            <SidebarHeading tokens={tokens}>
              <span data-field={`categories.${realIndex}.category_name`}>{category.category_name}</span>
            </SidebarHeading>
            <BulletList tokens={tokens} items={category.skills} dataFieldPrefix={`categories.${realIndex}.skills`} style="disc" />
          </div>
        );
      })}

      {/* Footer decoration */}
      <div style={{ marginTop: "auto", marginLeft: -24, marginRight: -22, marginBottom: -32, paddingTop: tokens.spacing.sectionGap }}>
        <WavyLines tokens={tokens} />
      </div>
    </div>
  );

  const right = (
    <div style={{ padding: "32px 36px 32px 0", boxSizing: "border-box" }}>
      {/* Header */}
      <div data-section-key="header">
        <div data-field="full_name" style={{ fontFamily: tokens.font.family, fontWeight: tokens.font.headingWeight, fontSize: tokens.font.sizes.name, lineHeight: tokens.font.lineHeights.heading }}>
          <span style={{ color: tokens.foreground }}>{firstName}</span>
          {restOfName ? <span style={{ color: tokens.accent }}> {restOfName}</span> : null}
        </div>
        <Text tokens={tokens} as="div" size="title" color="accent" bold uppercase dataField="title" style={{ marginTop: 4, letterSpacing: 1 }}>
          {header?.title}
        </Text>
        <div style={{ height: 2, width: 40, background: tokens.accent, marginTop: tokens.spacing.itemGap * 0.6 }} />
      </div>

      {/* Summary */}
      {summary?.summary ? (
        <div data-section-key="summary" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: tokens.spacing.itemGap * 1.5, flexWrap: "wrap", marginTop: tokens.spacing.itemGap, marginBottom: -16 }}>
          <div style={{ flex: "1 1 260px", minWidth: 0 }}>
            <SummaryParagraph config={{ theme, content: summary }} showHeading={false} showMeta={false} />
          </div>
          <div style={{ marginTop: -16 }}>
            <QuoteCard tokens={tokens} text={firstSentence(summary.summary)} />
          </div>
        </div>
      ) : null}

      {/* Rail */}
      <div style={{ position: "relative", marginTop: tokens.spacing.sectionGap }}>
        <Rail tokens={tokens} />

        {/* Education */}
        {education && education.entries.length > 0 ? (
          <div data-section-key="education">
            <RailSectionHeading tokens={tokens} icon={<GraduationCap size={14} strokeWidth={2} color={tokens.background} />} underline="dot-rule">
              <span data-field="title">{education.title || "Education"}</span>
            </RailSectionHeading>
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <EducationSimple config={{ theme, content: education }} showHeading={false} layout="stacked-with-courses" courseLabel="Relevant Coursework:" />
            </div>
          </div>
        ) : null}

        {/* Experience */}
        {experience && experience.entries.length > 0 ? (
          <div data-section-key="experience" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<Award size={14} strokeWidth={2} color={tokens.background} />} underline="dot-rule">
              <span data-field="title">{experience.title || "Experience"}</span>
            </RailSectionHeading>
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <EntryExperience tokens={tokens} entries={experience.entries} companyLayout="role-company-inline" dateColor="accent" />
            </div>
          </div>
        ) : null}

        {/* Projects */}
        {projects && projects.entries.length > 0 ? (
          <div data-section-key="projects" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<FolderOpen size={14} strokeWidth={2} color={tokens.background} />} underline="dot-rule">
              <span data-field="title">{projects.title || "Projects"}</span>
            </RailSectionHeading>
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <ProjectsLinkList config={{ theme, content: projects }} showHeading={false} techStackLabel="Role:" />
            </div>
          </div>
        ) : null}

        {/* Certifications */}
        {certifications && certifications.entries.length > 0 ? (
          <div data-section-key="certifications" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<BadgeCheck size={14} strokeWidth={2} color={tokens.background} />} underline="dot-rule">
              <span data-field="title">{certifications.title || "Certificates"}</span>
            </RailSectionHeading>
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <CertificationsLogoGrid config={{ theme, content: certifications }} showHeading={false} />
            </div>
          </div>
        ) : null}

        {/* Publications */}
        {publications && publications.entries.length > 0 ? (
          <div data-section-key="publications" style={{ marginTop: tokens.spacing.sectionGap }}>
            <RailSectionHeading tokens={tokens} icon={<BookOpen size={14} strokeWidth={2} color={tokens.background} />} underline="dot-rule">
              <span data-field="title">{publications.title || "Publications"}</span>
            </RailSectionHeading>
            <div style={{ paddingLeft: RAIL_INDENT }}>
              <PublicationsList config={{ theme, content: publications }} showHeading={false} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return { left, right };
}

// Used by PaginatedResume to paginate the sidebar and main column independently.
// `leftBackground`/`leftWidthRatio` mirror the sidebar's own panel and width below so
// paginated pages keep the full-height panel and the same 30/70 proportions.
export function getSplitSections(props: PortfolioBlobTemplateProps) {
  const tokens = getThemeTokens(props.theme);
  return { ...buildSplitSections(props), leftBackground: tokens.surface.card, leftWidthRatio: 0.3 };
}

export default function PortfolioBlobTemplate({ sectionsByType, theme }: PortfolioBlobTemplateProps) {
  const tokens = getThemeTokens(theme);
  const { left, right } = buildSplitSections({ sectionsByType, theme });

  return (
    <div style={{ fontFamily: tokens.font.family, background: tokens.background, display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: tokens.spacing.sectionGap }}>
      <div style={{ width: "30%", minWidth: 220, flexShrink: 0 }}>{left}</div>
      <div style={{ flex: "1 1 340px", minWidth: 0 }}>{right}</div>
    </div>
  );
}
