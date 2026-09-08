import type { ThemeTokens } from "@/types/resume_theme";
import Heading from "@/components/Resume_Builder/resume_base_components/heading/Heading";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import Link from "@/components/Resume_Builder/resume_base_components/link/Link";
import { ExternalLink } from "lucide-react";

export type EntryLinkListItem = {
  // "Certification name" / "Publication title" - always bold.
  title: string;
  titleField: string;
  // "Issuer" / "Publisher" - accent-colored, joined to title with an em dash.
  subtitle: string;
  subtitleField: string;
  date?: string;
  dateField: string;
  link?: string;
  linkField: string;
  // Publications-only: a description line under the title/subtitle row.
  description?: string;
  descriptionField?: string;
};

type EntryLinkListProps = {
  tokens: ThemeTokens;
  heading: string;
  items: EntryLinkListItem[];
  showHeading?: boolean;
  // Wraps each entry in a real <li> (disc marker) instead of a plain stacked line -
  // CertificationsList's "bulleted" mode.
  bulleted?: boolean;
  // "icon" (small ExternalLink glyph inline after the date, no dataField - what
  // CertificationsList uses for a credential URL) vs "text" (full Link component
  // showing the URL on its own line - what PublicationsList uses). Ignored when
  // titleLayout is "title-link-row" - that row always uses an inline icon link.
  linkStyle: "icon" | "text";
  // Between-entry gap, as a multiplier of tokens.spacing.itemGap - CertificationsList
  // uses 0.3, PublicationsList uses 0.4; kept a prop so both keep their own spacing.
  gapMultiplier?: number;
  // "title-dash-subtitle" (default): "Title — Subtitle (date)[ link]" on one line -
  // CertificationsList/PublicationsList's shape.
  // "title-link-row": title and link icon share a justified row (title left, icon
  // right), with "subtitle · date" on its own line below - TwoColumnIconTemplate's
  // inline certifications/publications shape.
  // "title-date-subtitle": "Title (Date) – Subtitle" on one line, no bold title and no
  // link icon regardless of linkStyle/entry.link - StudentSidebarTemplate's plain
  // <ul><li> certifications shape.
  // "title-issuer-split": title on the left, "subtitle · date" right-aligned on the
  // same row (justify-content: space-between) - no bold, no link icon regardless of
  // linkStyle/entry.link - IconRailTemplate's certifications shape.
  titleLayout?: "title-dash-subtitle" | "title-link-row" | "title-date-subtitle" | "title-issuer-split";
};

// Shared "bold title — accent subtitle (small date)[, optional description][, link]"
// row renderer behind both CertificationsList and PublicationsList - those stay the
// two components templates/the design registry actually import (their own designId,
// their own field names read from CertificationEntry/PublicationEntry), but the
// row markup itself lives here once instead of twice.
export default function EntryLinkList({
  tokens,
  heading,
  items,
  showHeading = true,
  bulleted = false,
  linkStyle,
  gapMultiplier = 0.3,
  titleLayout = "title-dash-subtitle",
}: EntryLinkListProps) {
  if (items.length === 0) return null;

  const rows = items.map((item, index) => {
    const linkIcon = item.link ? (
      <a
        href={/^https?:\/\//i.test(item.link) ? item.link : `https://${item.link}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.title} link`}
        style={{ display: "inline-flex", flexShrink: 0, color: tokens.accent }}
      >
        <ExternalLink size={12} strokeWidth={2} />
      </a>
    ) : null;

    return (
      <div key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
        {titleLayout === "title-link-row" ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacing.itemGap * 0.6 }}>
              <Text tokens={tokens} as="div" bold dataField={item.titleField}>
                {item.title}
              </Text>
              {linkIcon}
            </div>
            <Text tokens={tokens} as="div" size="small">
              <span data-field={item.subtitleField}>{item.subtitle}</span>
              {item.date ? <span data-field={item.dateField}> · {item.date}</span> : null}
            </Text>
          </>
        ) : titleLayout === "title-date-subtitle" ? (
          <Text tokens={tokens} as="div">
            <span data-field={item.titleField}>{item.title}</span>
            {item.date ? <span data-field={item.dateField}> ({item.date})</span> : null}
            {item.subtitle ? <span data-field={item.subtitleField}> – {item.subtitle}</span> : null}
          </Text>
        ) : titleLayout === "title-issuer-split" ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: tokens.spacing.itemGap * 0.8, flexWrap: "wrap" }}>
            <Text tokens={tokens} size="small" color="foreground" dataField={item.titleField}>
              {item.title}
            </Text>
            <Text tokens={tokens} size="small" color="foreground" style={{ textAlign: "right" }}>
              <span data-field={item.subtitleField}>{item.subtitle}</span>
              {item.date ? <span data-field={item.dateField}> · {item.date}</span> : null}
            </Text>
          </div>
        ) : (
          <Text tokens={tokens} as="div">
            <Text tokens={tokens} as="span" bold dataField={item.titleField}>
              {item.title}
            </Text>
            {" — "}
            <Text tokens={tokens} as="span" color="accent" dataField={item.subtitleField}>
              {item.subtitle}
            </Text>
            {item.date ? (
              <Text tokens={tokens} as="span" size="small" color="subtext" dataField={item.dateField}>
                {" "}({item.date})
              </Text>
            ) : null}
            {linkStyle === "icon" && item.link ? (
              <span style={{ display: "inline-flex", verticalAlign: "middle", marginLeft: 4 }}>{linkIcon}</span>
            ) : null}
          </Text>
        )}
        {item.description ? (
          titleLayout === "title-link-row" ? (
            <Text tokens={tokens} as="div" size="small" dataField={item.descriptionField} style={{ marginTop: 2 }}>
              {item.description}
            </Text>
          ) : (
            <Text tokens={tokens} as="div" variant="minor" dataField={item.descriptionField}>
              {item.description}
            </Text>
          )
        ) : null}
        {titleLayout === "title-dash-subtitle" && linkStyle === "text" && item.link ? <Link tokens={tokens} href={item.link} dataField={item.linkField} /> : null}
      </div>
    );
  });

  return (
    <div>
      {showHeading ? <Heading tokens={tokens}>{heading}</Heading> : null}
      {bulleted ? (
        <ul style={{ margin: 0, paddingLeft: 18, listStyleType: "disc", display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * gapMultiplier }}>
          {rows.map((row, index) => (
            <li key={index} style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              {row}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap * gapMultiplier }}>{rows}</div>
      )}
    </div>
  );
}
