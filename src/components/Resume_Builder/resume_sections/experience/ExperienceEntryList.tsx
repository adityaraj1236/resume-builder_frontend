"use client";

import type { BaseSectionConfig, ExperienceContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import EntryExperience from "@/components/Resume_Builder/resume_sections/experience/layouts/EntryExperience";

export const designId = "experience-entry-list-v1";
export const designName = "Entry List";

type Content = ExperienceContent;
export type SectionConfig = BaseSectionConfig<Content>;

export default function ExperienceEntryList({ config }: { config: SectionConfig }) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  return (
    <div>
      <Heading tokens={tokens}>{config.content?.title || "Experience"}</Heading>
      <EntryExperience tokens={tokens} entries={entries} companyLayout="role-then-company" achievementsLabel="none" />
    </div>
  );
}
