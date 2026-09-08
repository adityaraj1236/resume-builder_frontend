"use client";

import type { BaseSectionConfig, ProjectsContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import { ExternalLink } from "lucide-react";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import Link from "@/components/Resume_Builder/resume_base_components/link/Link";
import BulletList from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";

function normalizeHref(href: string): string {
  return /^https?:\/\//i.test(href) ? href : `https://${href}`;
}

export const designId = "projects-link-list-v1";
export const designName = "Link List";

type Content = ProjectsContent;
export type SectionConfig = BaseSectionConfig<Content>;

type ProjectsLinkListProps = {
  config: SectionConfig;

  showHeading?: boolean;
  techStackLabel?: string;
  linkAsIcon?: boolean;
  descriptionAsBullets?: boolean;
  textColor?: "subtext" | "foreground";
};

// Name + link on one row, description below, then an italic "Tech Stack:" line - the
// pattern PortfolioBlobTemplate and IconRailTemplate were each hand-rolling separately
// before this existed. Extracted here so a third template (and any future one) reuses
// it instead of a third copy.
export default function ProjectsLinkList({
  config,
  showHeading = true,
  techStackLabel = "Tech Stack:",
  linkAsIcon = false,
  descriptionAsBullets = false,
  textColor = "subtext",
}: ProjectsLinkListProps) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  if (entries.length === 0) return null;

  return (
    <div>
      {showHeading ? <Heading tokens={tokens}>Projects</Heading> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap }}>
        {entries.map((entry, index) => {
          const achievementLines = descriptionAsBullets
            ? entry.description.split("\n").map((line) => line.trim()).filter(Boolean)
            : [];

          return (
            <div key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              {descriptionAsBullets ? (
                <>
                  <Text tokens={tokens} as="div" bold dataField={`entries.${index}.name`}>
                    {entry.name}
                  </Text>
                  <Link tokens={tokens} href={entry.link} dataField={`entries.${index}.link`} showIcon />
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacing.itemGap * 0.6 }}>
                  <Text tokens={tokens} as="div" bold dataField={`entries.${index}.name`}>
                    {entry.name}
                  </Text>
                  {linkAsIcon ? (
                    entry.link ? (
                      <a
                        href={normalizeHref(entry.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${entry.name} link`}
                        style={{ display: "inline-flex", color: tokens.accent }}
                      >
                        <ExternalLink size={13} strokeWidth={2} />
                      </a>
                    ) : null
                  ) : (
                    <Link tokens={tokens} href={entry.link} dataField={`entries.${index}.link`} size="small" showIcon />
                  )}
                </div>
              )}

              {descriptionAsBullets ? (
                achievementLines.length > 0 ? (
                  <>
                    <Text tokens={tokens} as="div" size="small" color="accent" italic style={{ marginTop: tokens.spacing.itemGap * 0.4, marginBottom: 2 }}>
                      Achievements
                    </Text>
                    <BulletList tokens={tokens} items={achievementLines} dataField={`entries.${index}.description`} />
                  </>
                ) : null
              ) : (
                <>
                  <Text tokens={tokens} as="div" size="small" color={textColor} dataField={`entries.${index}.description`} style={{ marginTop: 2 }}>
                    {entry.description}
                  </Text>
                  {entry.tech_stack.length > 0 ? (
                    <Text tokens={tokens} as="div" size="small" color="accent" italic style={{ marginTop: 3 }}>
                      {techStackLabel} <span data-field={`entries.${index}.tech_stack`} style={{ color: tokens[textColor] }}>{entry.tech_stack.join(", ")}</span>
                    </Text>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
