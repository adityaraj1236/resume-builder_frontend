"use client";

import type { AchievementsContent, BaseSectionConfig } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

export const designId = "achievements-bullets-v1";
export const designName = "Bullets";

type Content = AchievementsContent;
export type SectionConfig = BaseSectionConfig<Content>;

type AchievementsBulletsProps = {
  config: SectionConfig;
  showHeading?: boolean;
};
export default function AchievementsBullets({ config, showHeading = true }: AchievementsBulletsProps) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  if (entries.length === 0) return null;

  return (
    <div>
      {showHeading ? <Heading tokens={tokens}>Achievements</Heading> : null}
      <ul style={{ margin: 0, paddingLeft: 18, listStyleType: "disc" }}>
        {entries.map((entry, index) => (
          <li key={index} style={{ marginBottom: 0, breakInside: "avoid", pageBreakInside: "avoid" }}>
            <Text tokens={tokens} as="span" bold dataField={`entries.${index}.title`}>
              {entry.title}
            </Text>
            {entry.description ? (
              <Text tokens={tokens} as="span" color="subtext" dataField={`entries.${index}.description`}>
                {" "}
                {entry.description}
              </Text>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
