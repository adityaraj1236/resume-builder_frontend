"use client";

import type { BaseSectionConfig, HeaderContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import TwoColumnLayout from "@/components/Resume_Builder/resume_layouts/TwoColumnLayout";
import AvatarInitials from "@/components/Resume_Builder/resume_base_components/avatarInitials/AvatarInitials";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import ContactGroup from "@/components/Resume_Builder/resume_base_components/contactGroup/ContactGroup";
import Divider from "@/components/Resume_Builder/resume_base_decorative_components/divider/Divider";

export const designId = "header-split-v1";
export const designName = "Split Left/Right";

type Content = HeaderContent;
export type SectionConfig = BaseSectionConfig<Content>;

export default function HeaderSplit({ config, summaryText }: { config: SectionConfig; summaryText?: string }) {
  const tokens = getThemeTokens(config.theme);
  const content = config.content;

  return (
    <TwoColumnLayout
      tokens={tokens}
      leftWidth="65%"
      showDivider
      dividerThickness={1}
      left={
        <div style={{ display: "flex", alignItems: "flex-start", gap: tokens.spacing.itemGap }}>
          <AvatarInitials tokens={tokens} fullName={content.full_name} size={80} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Heading tokens={tokens} variant="name" dataField="full_name">
              {content.full_name}
            </Heading>
            <Text tokens={tokens} as="div" size="title" color="accent" dataField="title" style={{ marginTop: 4 }}>
              {content.title}
            </Text>
            <div style={{ width: 40 }}>
              <Divider tokens={tokens} thin marginTop={6} marginBottom={0} />
            </div>
            {summaryText ? (
              <Text tokens={tokens} as="div" size="small" color="subtext" dataField="summary" style={{ marginTop: 4 }}>
                {summaryText}
              </Text>
            ) : null}
          </div>
        </div>
      }
      right={
        <div style={{ alignSelf: "flex-start" }}>
          <ContactGroup
            tokens={tokens}
            direction="column"
            color="subtext"
            gap={tokens.spacing.itemGap * 0.3}
            items={[
              { type: "email", value: content.email, dataField: "email" },
              { type: "phone", value: content.phone, dataField: "phone" },
              { type: "location", value: content.location, dataField: "location" },
              { type: "link", value: content.linkedin_url, dataField: "linkedin_url" },
              { type: "link", value: content.portfolio_url, dataField: "portfolio_url" },
            ]}
          />
        </div>
      }
    />
  );
}
