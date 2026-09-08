"use client";

import type { BaseSectionConfig, SummaryContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import RichText from "@/components/Resume_Builder/resume_base_components/richText/RichText";

export const designId = "summary-paragraph-v1";
export const designName = "Plain Paragraph";

type Content = SummaryContent;
export type SectionConfig = BaseSectionConfig<Content>;

type SummaryParagraphProps = {
  config: SectionConfig;
  showHeading?: boolean;
  // Hides the professional_title/years_of_experience row - some designs (e.g. a
  // sidebar template that already shows title in the header) have nowhere for this
  // row to go without duplicating what's already on the page.
  showMeta?: boolean;
};

export default function SummaryParagraph({ config, showHeading = true, showMeta = true }: SummaryParagraphProps) {
  const tokens = getThemeTokens(config.theme);
  const content = config.content;

  return (
    <div>
      {showHeading ? (
        <Heading tokens={tokens} dataField="title">
          {content.title || "Summary"}
        </Heading>
      ) : null}
      {showMeta && (content.professional_title || content.years_of_experience) ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: tokens.spacing.itemGap * 0.3 }}>
          <Heading tokens={tokens} variant="secondary" dataField="professional_title">
            {content.professional_title}
          </Heading>
          {content.years_of_experience ? (
            <Text tokens={tokens} variant="minor" dataField="years_of_experience">
              {content.years_of_experience}
            </Text>
          ) : null}
        </div>
      ) : null}
      <RichText tokens={tokens} dataField="summary">
        {content.summary}
      </RichText>
    </div>
  );
}
