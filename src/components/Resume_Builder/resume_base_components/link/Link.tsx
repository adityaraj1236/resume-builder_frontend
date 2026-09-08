import type { ThemeTokens } from "@/types/resume_theme";
import { ExternalLink } from "lucide-react";

type LinkProps = {
  tokens: ThemeTokens;
  href?: string;
  children?: React.ReactNode;
  dataField?: string;
  color?: "foreground" | "subtext" | "accent" | "background";
  size?: "body" | "small";
  underline?: boolean;
  // Shows a small ExternalLink icon after the link text, as its own separate anchor
  // (not carrying dataField) - the text anchor is deliberately kept editable via
  // contentEditable for its URL text, which some browsers won't reliably navigate on
  // click; the icon anchor has no dataField so it stays a plain, always-clickable link.
  showIcon?: boolean;
};

function normalizeHref(href: string): string {
  return /^https?:\/\//i.test(href) ? href : `https://${href}`;
}

// Renders linkedin_url/portfolio_url/project links as real clickable anchors instead
// of plain text - opens in a new tab with rel="noopener noreferrer" since these are
// user-supplied URLs.
export default function Link({ tokens, href, children, dataField, color = "accent", size = "small", underline = false, showIcon = false }: LinkProps) {
  if (!href) return null;
  const resolvedHref = normalizeHref(href);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <a
        data-field={dataField}
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: tokens.font.family,
          fontSize: tokens.font.sizes[size],
          color: tokens[color],
          textDecoration: underline ? "underline" : "none",
        }}
      >
        {children ?? href}
      </a>
      {showIcon ? (
        <a
          href={resolvedHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open link"
          style={{ display: "inline-flex", color: tokens[color] }}
        >
          <ExternalLink size={12} strokeWidth={2} />
        </a>
      ) : null}
    </span>
  );
}
