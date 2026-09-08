"use client";

import type { BaseSectionConfig, PublicationsContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import EntryLinkList from "@/components/Resume_Builder/resume_base_components/entryLinkList/EntryLinkList";

export const designId = "publications-list-v1";
export const designName = "List";

type Content = PublicationsContent;
export type SectionConfig = BaseSectionConfig<Content>;

type PublicationsListProps = {
  config: SectionConfig;
  // Lets a whole-page template that draws its own section heading (see
  // PortfolioBlobTemplate's icon-badged SectionTitle) render just the entries,
  // without a second "Publications" heading stacked on top of its own.
  showHeading?: boolean;
};

export default function PublicationsList({ config, showHeading = true }: PublicationsListProps) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  return (
    <EntryLinkList
      tokens={tokens}
      heading="Publications"
      showHeading={showHeading}
      linkStyle="text"
      gapMultiplier={0.4}
      items={entries.map((entry, index) => ({
        title: entry.title,
        titleField: `entries.${index}.title`,
        subtitle: entry.publisher,
        subtitleField: `entries.${index}.publisher`,
        date: entry.date,
        dateField: `entries.${index}.date`,
        link: entry.link,
        linkField: `entries.${index}.link`,
        description: entry.description,
        descriptionField: `entries.${index}.description`,
      }))}
    />
  );
}
