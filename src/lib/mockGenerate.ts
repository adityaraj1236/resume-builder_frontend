// Frontend-only stand-in for the backend's LLM generation chain. There is no AI here:
// raw notes are deterministically split into bullet points instead of being rewritten,
// so the form -> resume flow still works end-to-end without any backend/API call.
import type {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ExperienceEntryInput,
  Position,
  ProjectEntry,
  PublicationEntry,
  ResumeDocument,
  ResumeGenerateRequest,
  ResumeSection,
  SectionType,
} from "@/types/resume";
import { SECTION_DEFAULT_TITLES } from "@/types/resume";
import { DEFAULT_SECTION_DESIGN, DEFAULT_TEMPLATE_ID, SECTION_TYPES } from "./designRegistry";

function splitIntoBullets(rawNotes: string): string[] {
  const trimmed = rawNotes.trim();
  if (!trimmed) return [];

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\s]+/, "").trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length > 0 ? sentences : [trimmed];
}

const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function parseResumeDate(value?: string): Date | null {
  if (!value) return null;
  const text = value.trim();

  let match = text.match(/^(\d{4})-(\d{1,2})$/);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, 1);

  match = text.match(/^(\d{4})$/);
  if (match) return new Date(Number(match[1]), 0, 1);

  match = text.match(/^([A-Za-z]+)\.?\s+(\d{4})$/);
  if (match) {
    const month = MONTH_NAMES[match[1].toLowerCase()];
    if (month) return new Date(Number(match[2]), month - 1, 1);
  }

  return null;
}

function computeYearsOfExperience(entries: ExperienceEntryInput[]): string {
  const spans: [Date, Date][] = [];
  for (const entry of entries) {
    const start = parseResumeDate(entry.start_date);
    if (!start) continue;
    const end = parseResumeDate(entry.end_date) ?? new Date();
    spans.push([start, end]);
  }
  if (spans.length === 0) return "";

  const earliestStart = new Date(Math.min(...spans.map(([start]) => start.getTime())));
  const latestEnd = new Date(Math.max(...spans.map(([, end]) => end.getTime())));
  const totalMonths = (latestEnd.getFullYear() - earliestStart.getFullYear()) * 12 + (latestEnd.getMonth() - earliestStart.getMonth());
  if (totalMonths < 1) return "";

  const years = totalMonths / 12;
  if (years < 1) return `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`;
  const rounded = Math.round(years * 2) / 2;
  const formatted = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${formatted}+ years`;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `resume-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function generateMockResume(request: ResumeGenerateRequest): ResumeDocument {
  const experienceEntries: ExperienceEntry[] = request.work_experience.map((entry) => ({
    company: entry.company,
    role: entry.role,
    location: entry.location ?? "",
    start_date: entry.start_date,
    end_date: entry.end_date ?? "",
    bullets: splitIntoBullets(entry.raw_notes),
    additional_positions: (entry.additional_positions ?? []).map(
      (position): Position => ({
        role: position.role,
        start_date: position.start_date,
        end_date: position.end_date ?? "",
        bullets: splitIntoBullets(position.raw_notes),
      }),
    ),
  }));

  const educationEntries: EducationEntry[] = request.education.map((entry) => ({
    institution: entry.institution,
    degree: entry.degree,
    field_of_study: entry.field_of_study ?? "",
    location: entry.location ?? "",
    start_date: entry.start_date,
    end_date: entry.end_date ?? "",
    gpa: entry.gpa ?? "",
    notes: entry.notes ?? "",
  }));

  const projectEntries: ProjectEntry[] = request.projects.map((entry) => ({
    name: entry.name,
    description: entry.description_notes.trim(),
    tech_stack: entry.tech_stack,
    link: entry.link ?? "",
  }));

  const certificationEntries: CertificationEntry[] = request.certifications.map((entry) => ({
    name: entry.name,
    issuer: entry.issuer,
    date: entry.date ?? "",
  }));

  const publicationEntries: PublicationEntry[] = request.publications.map((entry) => ({
    title: entry.title,
    publisher: entry.publisher,
    date: entry.date ?? "",
    link: entry.link ?? "",
    description: entry.description_notes?.trim() ?? "",
  }));

  const professionalTitle = request.target_role || request.work_experience[0]?.role || "";

  const contentByType: Record<SectionType, Record<string, unknown>> = {
    header: {
      full_name: request.personal_info.full_name,
      title: professionalTitle,
      email: request.personal_info.email,
      phone: request.personal_info.phone ?? "",
      location: request.personal_info.location ?? "",
      linkedin_url: request.personal_info.linkedin_url ?? "",
      portfolio_url: request.personal_info.portfolio_url ?? "",
      photo_url: request.personal_info.photo_url ?? "",
    },
    summary: {
      professional_title: professionalTitle,
      years_of_experience: computeYearsOfExperience(request.work_experience),
      summary: request.personal_info.summary_notes?.trim() ?? "",
    },
    experience: { title: SECTION_DEFAULT_TITLES.experience, entries: experienceEntries },
    education: { title: SECTION_DEFAULT_TITLES.education, entries: educationEntries },
    skills: {
      title: SECTION_DEFAULT_TITLES.skills,
      categories: request.skills.length > 0 ? [{ category_name: "Skills", skills: request.skills }] : [],
    },
    projects: { title: SECTION_DEFAULT_TITLES.projects, entries: projectEntries },
    certifications: { title: SECTION_DEFAULT_TITLES.certifications, entries: certificationEntries },
    publications: { title: SECTION_DEFAULT_TITLES.publications, entries: publicationEntries },
    // The intake form doesn't collect achievements yet, so generated resumes always
    // start with an empty list here - same as every other section that has no form UI.
    achievements: { title: SECTION_DEFAULT_TITLES.achievements, entries: [] },
  };

  const sections: ResumeSection[] = SECTION_TYPES.map((sectionType, index) => ({
    section_key: sectionType,
    section_type: sectionType,
    design_id: DEFAULT_SECTION_DESIGN[sectionType],
    order: index,
    content: contentByType[sectionType],
  }));

  const now = new Date().toISOString();
  return {
    resume_id: newId(),
    sections,
    theme: "classic",
    template_id: DEFAULT_TEMPLATE_ID,
    target_role: request.target_role,
    created_at: now,
    updated_at: now,
  };
}
