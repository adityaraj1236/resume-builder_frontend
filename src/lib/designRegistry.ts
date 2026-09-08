// Frontend-only catalog of section designs and whole-page templates.
// This is static UI configuration (not AI/business logic) mirroring the rendering
// contract already encoded in ResumeRenderer's SECTION_COMPONENTS / PAGE_TEMPLATE_COMPONENTS
// maps and each section/template component's own exported designId/templateId.
// There is no backend in this project - this registry is the single source of truth.
import type { DesignRegistryResponse, SectionType } from "@/types/resume";

export const DEFAULT_TEMPLATE_ID = "sections";

export const TEMPLATE_REGISTRY: DesignRegistryResponse["templates"] = [
  {
    template_id: "sections",
    name: "Sections (mix & match)",
    description:
      "Single-column, stacks each section independently using its own design. Safe, flexible default - best for most corporate/professional roles.",
  },
  {
    template_id: "two-column-icon-v1",
    name: "Two-Column Icon",
    description:
      "Plain white page: a header row with a circular photo, name/title/summary on the left and icon-badged contact rows on the right, then an even two-column body - work experience (timeline) and education on the left, skills (one icon-badged pill group per category), portfolio, certifications, and publications on the right. Every section heading and contact row carries a small accent-colored icon badge. Best for creative and portfolio-forward roles.",
  },
  {
    template_id: "student-sidebar-v1",
    name: "Student Sidebar",
    description:
      "Light two-column page with a thin accent spine down the left edge: a narrow white sidebar (circular photo, contact list, a bulleted first skills category, and every other skills category as a boxed grid) beside a wider main column (underlined name/title, summary, education with relevant courses, experience, projects with links, and certificates). Minimal color, information-dense. Best for students and early-career candidates.",
  },
  {
    template_id: "portfolio-blob-v1",
    name: "Portfolio Blob",
    description:
      "Light, photo-forward two-column page: a sidebar with a circular photo backed by a soft decorative blob and dot accent, contact list, soft skills, an icon-labeled skills grid, and any further skills category (e.g. languages) as its own list, beside a main column with a pull-quote built from the summary, education with relevant courses, experience (labeled Volunteer Experience), projects, and certificates as icon cards. Best for design/creative portfolios and early-career candidates.",
  },
  {
    template_id: "icon-rail-v1",
    name: "Icon Rail",
    description:
      "No-photo two-column page: a dark sidebar (name, contact, and the first skills category as horizontal proficiency bars) beside a white main column where every section - Professional Summary, Work Experience, Projects, Courses & Trainings (certifications relabeled), Education, Publications - sits on one connecting vertical rail behind its own accent icon badge. Best for technical/developer roles wanting a bold, icon-forward look.",
  },
  {
    template_id: "centered-timeline-v1",
    name: "Centered Timeline",
    description:
      "Plain, single-column, ATS-friendly page: a centered header (name, title flanked by a line-and-dot flourish, contact row) above Summary, Experience (each entry on a connecting vertical timeline rail with a date column on the left), Achievements, Projects, Education, Skills, Certifications, and Publications. Best for a classic, no-color-block, highly readable resume.",
  },
  {
    template_id: "icon-line-v1",
    name: "Icon Line",
    description:
      "Plain, single-column, no-photo page with the same centered header/flourish as Centered Timeline, but every section heading is a plain accent-colored icon (no circle badge) followed by the title and a thin line filling the rest of the row: Professional Summary, General Skills (flat pill tags), Work Experience, Projects, Achievements, Education, Certificates, and Publications. Best for a clean, icon-forward but still ATS-friendly resume.",
  },
];

export const SECTION_TYPES: SectionType[] = [
  "header",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "publications",
  "achievements",
];

export const DEFAULT_SECTION_DESIGN: Record<SectionType, string> = {
  header: "header-split-v1",
  summary: "summary-paragraph-v1",
  experience: "experience-entry-list-v1",
  education: "education-simple-v1",
  skills: "skills-pill-cloud-v1",
  projects: "projects-link-list-v1",
  certifications: "certifications-list-v1",
  publications: "publications-list-v1",
  achievements: "achievements-bullets-v1",
};

export const SECTION_DESIGN_REGISTRY: DesignRegistryResponse["designs"] = {
  header: [{ design_id: "header-split-v1", name: "Split Left/Right", description: "Name and title on the left, contact block on the right." }],
  summary: [{ design_id: "summary-paragraph-v1", name: "Plain Paragraph", description: "Single flowing paragraph." }],
  experience: [{ design_id: "experience-entry-list-v1", name: "Entry List", description: "Role, company, date range, and bullets per entry." }],
  education: [{ design_id: "education-simple-v1", name: "Simple List", description: "Plain stacked list of degrees." }],
  skills: [{ design_id: "skills-pill-cloud-v1", name: "Pill Cloud", description: "Flat wrapped pill tags." }],
  projects: [{ design_id: "projects-link-list-v1", name: "Link List", description: "Name + link per row, with description and a Tech Stack line." }],
  certifications: [{ design_id: "certifications-list-v1", name: "List", description: "Plain stacked list." }],
  publications: [{ design_id: "publications-list-v1", name: "List", description: "Plain stacked list of publications." }],
  achievements: [{ design_id: "achievements-bullets-v1", name: "Bullets", description: "One bullet per achievement, bold title inline with its description." }],
};

export const EMPTY_SECTION_CONTENT_TEMPLATES: Record<SectionType, Record<string, unknown>> = {
  header: {
    full_name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    photo_url: "",
  },
  summary: {
    title: "",
    professional_title: "",
    years_of_experience: "",
    summary: "",
  },
  experience: { entries: [] },
  education: { entries: [] },
  skills: { categories: [] },
  projects: { entries: [] },
  certifications: { entries: [] },
  publications: { entries: [] },
  achievements: { entries: [] },
};

export function getDesignRegistrySnapshot(): DesignRegistryResponse {
  return {
    designs: SECTION_DESIGN_REGISTRY,
    templates: TEMPLATE_REGISTRY,
  };
}
