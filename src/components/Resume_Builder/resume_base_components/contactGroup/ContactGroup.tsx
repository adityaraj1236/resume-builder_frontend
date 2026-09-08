import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import Link from "@/components/Resume_Builder/resume_base_components/link/Link";

type ContactType = "email" | "phone" | "location" | "link";
type ContactColor = "foreground" | "subtext" | "accent" | "background";

type ContactGroupItem = {
  type?: ContactType;
  value?: string;
  dataField: string;
  icon?: React.ReactNode;
};

type ContactGroupProps = {
  tokens: ThemeTokens;
  items: ContactGroupItem[];
  color?: ContactColor;
  direction?: "row" | "column";
  gap?: number;
  align?: "left" | "center";
  separator?: boolean;
  wrap?: boolean;
};

function iconStrokeColor(color: ContactColor, tokens: ThemeTokens): string {
  return color === "background" ? tokens.background : tokens[color];
}

function MailIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.2a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.5 2Z" />
    </svg>
  );
}

function MapPinIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LinkIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" />
    </svg>
  );
}

function defaultIconForType(type: ContactType | undefined, color: string): React.ReactNode {
  switch (type) {
    case "email":
      return <MailIcon color={color} />;
    case "phone":
      return <PhoneIcon color={color} />;
    case "location":
      return <MapPinIcon color={color} />;
    case "link":
      return <LinkIcon color={color} />;
    default:
      return null;
  }
}

// Single "icon + value" contact line (email/phone/location/link) - auto-selects an
// icon by type, or renders a caller-supplied icon override. type="link" renders the
// value as a clickable anchor via Link; every other type renders plain Text.
function ContactEntry({ tokens, value, dataField, color, type, icon }: { tokens: ThemeTokens; value?: string; dataField?: string; color: ContactColor; type?: ContactType; icon?: React.ReactNode }) {
  if (!value) return null;
  const resolvedIcon = icon ?? defaultIconForType(type, iconStrokeColor(color, tokens));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {resolvedIcon}
      {type === "link" ? (
        <Link tokens={tokens} href={value} dataField={dataField} color={color} />
      ) : (
        <Text tokens={tokens} size="small" color={color} dataField={dataField}>
          {value}
        </Text>
      )}
    </div>
  );
}

// One "list of contact items" layout, laid out either as a horizontal row (header
// contact lines, with pipe separators between items) or a vertical column (sidebar
// contact blocks) - covers what used to be three separate components (ContactItem,
// ContactRow, ContactList) that only differed in flex-direction, gap, wrapping, and
// whether a separator was drawn between items.
export default function ContactGroup({
  tokens,
  items,
  color = "subtext",
  direction = "row",
  gap = tokens.spacing.itemGap,
  align = "center",
  separator = false,
  wrap = false,
}: ContactGroupProps) {
  const present = items.filter((item) => item.value);
  if (present.length === 0) return null;

  const isRow = direction === "row";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        justifyContent: isRow ? (align === "center" ? "center" : "flex-start") : undefined,
        alignItems: isRow ? "center" : undefined,
        flexWrap: isRow && wrap ? "wrap" : "nowrap",
        gap,
      }}
    >
      {present.map((item, index) => {
        if (!separator) {
          return <ContactEntry key={item.dataField} tokens={tokens} type={item.type} value={item.value} dataField={item.dataField} color={color} icon={item.icon} />;
        }

        return (
          <div key={item.dataField} style={{ display: "flex", alignItems: "center", gap }}>
            {index > 0 ? <div style={{ width: 1, height: 12, background: tokens.surface.border }} /> : null}
            <ContactEntry tokens={tokens} type={item.type} value={item.value} dataField={item.dataField} color={color} icon={item.icon} />
          </div>
        );
      })}
    </div>
  );
}
