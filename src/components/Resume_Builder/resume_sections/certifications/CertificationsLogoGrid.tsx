"use client";

import type { BaseSectionConfig, CertificationsContent } from "@/types/resume";
import { getThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import IconUpload from "@/components/Resume_Builder/resume_base_components/iconUpload/IconUpload";

export const designId = "certifications-logo-grid-v1";
export const designName = "Logo Grid";

// Entries per row. Fixed rather than left to flex wrapping so the code can tell which
// entry starts a row - see the grid comment below.
const COLUMNS = 3;

type Content = CertificationsContent;
export type SectionConfig = BaseSectionConfig<Content>;

function CertificateIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="8" r="6" />
      <path d="m8.5 13.5-1.5 8 5-3 5 3-1.5-8" />
    </svg>
  );
}

type CertificationsLogoGridProps = {
  config: SectionConfig;
  // Lets a whole-page template that draws its own icon-badged section heading render
  // just the grid, without a second heading stacked on top of its own (same
  // convention as CertificationsIconCards/CertificationsList's showHeading).
  showHeading?: boolean;
};

// A clean multi-column row of certifications - each entry's own logo/badge (via
// IconUpload, falling back to a generic certificate glyph when icon_url is unset)
// above its name and year, columns separated by a thin vertical divider instead of
// each entry getting its own bordered card. Distinct from CertificationsIconCards
// (bordered card grid) - which one a template uses is purely a visual choice.
export default function CertificationsLogoGrid({ config, showHeading = true }: CertificationsLogoGridProps) {
  const tokens = getThemeTokens(config.theme);
  const entries = config.content?.entries ?? [];

  if (entries.length === 0) return null;

  return (
    <div>
      {showHeading ? <Heading tokens={tokens}>Certifications</Heading> : null}
      {/* A fixed 3-up grid rather than a wrapping flex row. Wrapping was dynamic, so
          nothing could know WHICH entry started a new row - the divider rule
          (index > 0) then drew a borderLeft on the first item of every wrapped row,
          leaving a stray line with nothing beside it. With a fixed column count the
          row position is just index % COLUMNS, so the divider can be suppressed
          exactly at each row start. rowGap also separates the rows, which a plain
          wrapping row had no way to do. */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`, rowGap: tokens.spacing.sectionGap }}>
        {entries.map((entry, index) => (
          <div
            key={index}
            style={{
              boxSizing: "border-box",
              borderLeft: index % COLUMNS !== 0 ? `1px solid ${tokens.surface.border}` : undefined,
              padding: `0 ${tokens.spacing.itemGap}px`,
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <div style={{ marginBottom: tokens.spacing.itemGap * 0.6 }}>
              <IconUpload tokens={tokens} iconUrl={entry.icon_url} fallbackIcon={<CertificateIcon color={tokens.background} />} />
            </div>
            <Text tokens={tokens} as="div" bold size="small" dataField={`entries.${index}.name`}>
              {entry.name}
            </Text>
            <Text tokens={tokens} as="div" size="small" dataField={`entries.${index}.issuer`}>
              {entry.issuer}
            </Text>
            {entry.date ? (
              <Text tokens={tokens} as="div" size="small" color="accent" dataField={`entries.${index}.date`}>
                {entry.date}
              </Text>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
