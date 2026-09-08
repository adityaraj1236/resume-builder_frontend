import type { ExperienceEntry } from "@/types/resume";
import type { ThemeTokens } from "@/types/resume_theme";

// Shared prop contract every experience layout renders from. No new data model -
// ExperienceEntry/Position (types/resume.ts) is exactly what the backend already
// sends; layouts only differ in how they arrange these same fields.
export type ExperienceLayoutProps = {
  tokens: ThemeTokens;
  entries: ExperienceEntry[];
};
