import type {
  AchievementsContent,
  CertificationsContent,
  EducationContent,
  ExperienceContent,
  HeaderContent,
  ProjectsContent,
  PublicationsContent,
  ResumeSection,
  SkillsContent,
  SummaryContent,
} from "@/types/resume";

export type TypedSections = {
  header?: HeaderContent;
  summary?: SummaryContent;
  experience?: ExperienceContent;
  education?: EducationContent;
  skills?: SkillsContent;
  projects?: ProjectsContent;
  certifications?: CertificationsContent;
  publications?: PublicationsContent;
  achievements?: AchievementsContent;
};

// Every whole-page template starts by pulling each section's untyped
// `content: Record<string, unknown>` out of sectionsByType and casting it to its real
// shape (`sectionsByType.experience?.content as ExperienceContent | undefined`, one
// line per section type) - the same 8-9 line block was being hand-typed in 9
// templates. Centralized here so there is exactly one place that knows the
// section-key -> content-type mapping.
export function getTypedSections(sectionsByType: Record<string, ResumeSection>): TypedSections {
  return {
    header: sectionsByType.header?.content as HeaderContent | undefined,
    summary: sectionsByType.summary?.content as SummaryContent | undefined,
    experience: sectionsByType.experience?.content as ExperienceContent | undefined,
    education: sectionsByType.education?.content as EducationContent | undefined,
    skills: sectionsByType.skills?.content as SkillsContent | undefined,
    projects: sectionsByType.projects?.content as ProjectsContent | undefined,
    certifications: sectionsByType.certifications?.content as CertificationsContent | undefined,
    publications: sectionsByType.publications?.content as PublicationsContent | undefined,
    achievements: sectionsByType.achievements?.content as AchievementsContent | undefined,
  };
}
