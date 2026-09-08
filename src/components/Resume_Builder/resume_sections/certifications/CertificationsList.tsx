"use client";

import type { BaseSectionConfig, CertificationsContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import EntryLinkList from "@/components/Resume_Builder/resume_base_components/entryLinkList/EntryLinkList";

export const designId = "certifications-list-v1";
export const designName = "List";

type Content = CertificationsContent;
export type SectionConfig = BaseSectionConfig<Content>;

type CertificationsListProps = {
  config: SectionConfig;
  showHeading?: boolean;
  // Renders each entry as a real <li> (disc marker) instead of a plain stacked line -
  // each entry still carries its own rich name/issuer/date fields, just wrapped in a
  // <ul>/<li> instead of a <div>, so per-field editability is unaffected.
  bulleted?: boolean;
};

export default function CertificationsList({ config, showHeading = true, bulleted = false }: CertificationsListProps) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  return (
    <EntryLinkList
      tokens={tokens}
      heading="Certifications"
      showHeading={showHeading}
      bulleted={bulleted}
      linkStyle="icon"
      items={entries.map((entry, index) => ({
        title: entry.name,
        titleField: `entries.${index}.name`,
        subtitle: entry.issuer,
        subtitleField: `entries.${index}.issuer`,
        date: entry.date,
        dateField: `entries.${index}.date`,
        link: entry.link,
        linkField: `entries.${index}.link`,
      }))}
    />
  );
}
