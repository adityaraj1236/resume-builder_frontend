"use client";

import type { BaseSectionConfig, SkillsContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

export const designId = "skills-flat-list-v1";
export const designName = "Flat List";

type Content = SkillsContent;
export type SectionConfig = BaseSectionConfig<Content>;

export default function SkillsFlatList({ config }: { config: SectionConfig }) {
  const tokens = getThemeTokens(config.theme);
  const categories = config.content?.categories ?? [];
  const allSkills = categories.flatMap((category) => category.skills);

  return (
    <div>
      <Heading tokens={tokens}>Skills</Heading>
      {/* Flattened across every category into one "skill | skill | skill" line - not
          individually editable here since a flat index can't be walked back into the
          nested categories[].skills[] structure; switch to the Grouped Columns design
          to edit individual skills. */}
      <Text tokens={tokens} as="div" size="body" color="foreground">
        {allSkills.join(" | ")}
      </Text>
    </div>
  );
}
