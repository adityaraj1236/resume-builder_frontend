// Mirrors backend/app/resume/models.py field-for-field (snake_case kept verbatim,
// same convention the pitch deck frontend uses for its backend contract types).
import type { ThemeTokens } from "./resume_theme";

export type BaseSectionConfig<TContent> = {
  theme: string | ThemeTokens;
  content: TContent;
};

// ---- Request (form input) types ----

export type PersonalInfo = {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  photo_url?: string;
  summary_notes?: string;
};

export type PositionInput = {
  role: string;
  start_date: string;
  end_date?: string;
  raw_notes: string;
};

export type ExperienceEntryInput = {
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string;
  raw_notes: string;
  // Promotions/other roles at the same company - kept separate from the primary
  // role above so existing single-role entries need no migration.
  additional_positions?: PositionInput[];
};

export type EducationEntryInput = {
  institution: string;
  degree: string;
  field_of_study?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  notes?: string;
};

export type ProjectEntryInput = {
  name: string;
  description_notes: string;
  tech_stack: string[];
  link?: string;
};

export type CertificationEntryInput = {
  name: string;
  issuer: string;
  date?: string;
};

export type PublicationEntryInput = {
  title: string;
  publisher: string;
  date?: string;
  link?: string;
  description_notes?: string;
};

export type ResumeGenerateRequest = {
  personal_info: PersonalInfo;
  work_experience: ExperienceEntryInput[];
  education: EducationEntryInput[];
  skills: string[];
  projects: ProjectEntryInput[];
  certifications: CertificationEntryInput[];
  publications: PublicationEntryInput[];
  target_role?: string;
  job_description?: string;
};

// ---- Document (generated/stored) types ----

export type SectionType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "publications"
  | "achievements";

// Fallback heading text used when a section's content has no title set yet
// (e.g. freshly created sections). Templates should prefer content.title and
// only fall back to this map, so a user-edited heading always wins.
export const SECTION_DEFAULT_TITLES: Record<SectionType, string> = {
  header: "",
  summary: "Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  publications: "Publications",
  achievements: "Achievements",
};

export type ResumeSection = {
  section_key: string;
  section_type: SectionType;
  design_id: string;
  order: number;
  content: Record<string, unknown>;
};

export type ResumeDocument = {
  resume_id: string;
  sections: ResumeSection[];
  theme: string;
  template_id: string;
  target_role?: string | null;
  created_at: string;
  updated_at: string;
};

export type ResumeUpdateRequest = {
  sections: ResumeSection[];
  theme?: string;
  template_id?: string;
};

export type DesignOption = {
  design_id: string;
  name: string;
  description: string;
};

export type TemplateOption = {
  template_id: string;
  name: string;
  description: string;
};

export type DesignRegistryResponse = {
  designs: Record<SectionType, DesignOption[]>;
  templates: TemplateOption[];
};

// ---- Section content shapes (must match backend EMPTY_SECTION_CONTENT_TEMPLATES) ----

export type HeaderContent = {
  full_name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  photo_url: string;
};

export type SummaryContent = {
  // Section heading text (e.g. "Summary", "Professional Summary", "Profile") - like
  // every other section's optional title, falls back to a design's own hardcoded
  // default when empty rather than rendering blank.
  title?: string;
  professional_title: string;
  years_of_experience: string;
  summary: string;
};

export type Position = {
  role: string;
  start_date: string;
  end_date: string;
  bullets: string[];
};

export type ExperienceEntry = {
  company: string;
  company_url?: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
  additional_positions?: Position[];
};

export type ExperienceContent = {
  title?: string;
  entries: ExperienceEntry[];
};

export type EducationEntry = {
  institution: string;
  degree: string;
  field_of_study: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa: string;
  notes: string;
};

export type EducationContent = {
  title?: string;
  entries: EducationEntry[];
};

export type SkillCategory = {
  category_name: string;
  skills: string[];
  // Optional, index-aligned with `skills` (0-100 proficiency per skill). Additive -
  // every existing skills design/template ignores it and keeps rendering `skills` as
  // a plain list; only a design that explicitly supports a proficiency meter reads it.
  levels?: number[];
  // Optional, index-aligned with `skills` - a per-skill logo/icon image URL (same
  // click-to-set-URL affordance as CertificationEntry.icon_url, see IconUpload).
  // Additive - only a design that explicitly renders an icon-per-skill grid reads it,
  // falling back to a generic glyph when a given index has no icon set.
  icons?: (string | undefined)[];
};

export type SkillsContent = {
  title?: string;
  categories: SkillCategory[];
};

export type ProjectEntry = {
  name: string;
  description: string;
  tech_stack: string[];
  link: string;
};

export type ProjectsContent = {
  title?: string;
  entries: ProjectEntry[];
};

export type CertificationEntry = {
  name: string;
  issuer: string;
  date: string;
  link?: string;
  // Issuer logo/badge image URL - same click-to-set-URL affordance as header.photo_url
  // (see IconUpload), so a future icon-picker UI has a real field to write to. Falls
  // back to a generic certificate glyph when unset, same "never invent a brand mark"
  // reasoning CertificationsIconCards documents.
  icon_url?: string;
};

export type CertificationsContent = {
  title?: string;
  entries: CertificationEntry[];
};

export type PublicationEntry = {
  title: string;
  publisher: string;
  date: string;
  link: string;
  description: string;
};

export type PublicationsContent = {
  title?: string;
  entries: PublicationEntry[];
};

export type AchievementEntry = {
  title: string;
  description: string;
};

export type AchievementsContent = {
  title?: string;
  entries: AchievementEntry[];
};

// ---- Materialized (render-ready) types, mirroring MaterializedSlide/MaterializedDeck ----

export type MaterializedSection = {
  sectionKey: string;
  designId: string;
  sectionType: SectionType;
  order: number;
  config: BaseSectionConfig<Record<string, unknown>>;
};

export type MaterializedResume = {
  resumeId: string;
  theme: string | ThemeTokens;
  sections: MaterializedSection[];
};
