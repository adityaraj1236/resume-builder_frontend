"use client";

import type { BaseSectionConfig, SkillsContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Badge from "@/components/Resume_Builder/resume_base_components/badge/Badge";

export const designId = "skills-pill-cloud-v1";
export const designName = "Pill Cloud";

type Content = SkillsContent;
export type SectionConfig = BaseSectionConfig<Content>;

type SkillsPillCloudProps = {
  config: SectionConfig;
  showHeading?: boolean;
};

export default function SkillsPillCloud({ config, showHeading = true }: SkillsPillCloudProps) {
  const tokens = getThemeTokens(config.theme);
  const categories = config.content?.categories ?? [];
  const allSkills = categories.flatMap((category) => category.skills);

  return (
    <div>
      {showHeading ? <Heading tokens={tokens}>Skills</Heading> : null}
      {/* Flattened view across categories - not individually editable here since a flat
          index can't be walked back into the nested categories[].skills[] structure;
          switch to the Grouped Columns design to edit individual skills. */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {allSkills.map((skill, index) => (
          <Badge tokens={tokens} key={index} borderRadius={tokens.radii.card * 0.6} paddingX={tokens.spacing.itemGap}>
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
