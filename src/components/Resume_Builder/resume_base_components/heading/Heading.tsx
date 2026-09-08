import type { ThemeTokens } from "@/types/resume_theme";
import Divider from "@/components/Resume_Builder/resume_base_decorative_components/divider/Divider";
import PillRule from "@/components/Resume_Builder/resume_base_decorative_components/pillRule/PillRule";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

type HeadingVariant = "section" | "name" | "primary" | "secondary";

type HeadingProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  // "section" (default) is the existing uppercase + divider section title (EXPERIENCE,
  // EDUCATION, ...). "name" is the candidate's full name. "primary"/"secondary" are for
  // a repeatable entry's own two-level heading (e.g. Company Name / Job Title,
  // Degree / Institution) - primary bold+foreground, secondary accent-colored.
  variant?: HeadingVariant;
  withDivider?: boolean;
  dataField?: string;
  fadeDivider?: boolean;
  // Short accent pill segment connected to a thin line, instead of a full-width
  // Divider - see PillRule.
  pillDivider?: boolean;
  // Only meaningful with pillDivider: renders just the accent bar with no continuing
  // line - for a narrow column (e.g. a sidebar) where a full-width line would look
  // stray. See PillRule's continuesLine.
  pillOnly?: boolean;
  // pillOnly bar dimensions - defaults match StudentSidebarTemplate's original bar
  // (18x3). IconRailTemplate's own sidebar heading uses a slightly larger 26x4 bar.
  pillWidth?: number;
  pillHeight?: number;
  // "section" variant only: overrides the default sectionHeading size/accent color -
  // for a smaller, foreground- or background-colored sidebar-style heading.
  size?: "sectionHeading" | "small";
  color?: "accent" | "foreground" | "background";
};

export default function Heading({
  tokens,
  children,
  variant = "section",
  withDivider,
  dataField,
  fadeDivider,
  pillDivider,
  pillOnly = false,
  pillWidth,
  pillHeight,
  size = "sectionHeading",
  color = "accent",
}: HeadingProps) {
  if (variant === "name") {
    return (
      <Text tokens={tokens} as="h1" size="name" bold dataField={dataField}>
        {children}
      </Text>
    );
  }

  if (variant === "primary") {
    return (
      <Text tokens={tokens} as="div" bold dataField={dataField}>
        {children}
      </Text>
    );
  }

  if (variant === "secondary") {
    return (
      <Text tokens={tokens} as="div" color="accent" dataField={dataField}>
        {children}
      </Text>
    );
  }

  const showDivider = withDivider ?? true;
  return (
    <div style={{ marginBottom: pillOnly ? tokens.spacing.itemGap : tokens.spacing.itemGap * 0.6, breakAfter: "avoid", pageBreakAfter: "avoid" }}>
      <Text tokens={tokens} as="h2" size={size} color={color} bold uppercase style={{ letterSpacing: 1 }} dataField={dataField}>
        {children}
      </Text>
      {showDivider ? (
        pillDivider ? (
          <div style={{ marginTop: pillOnly ? 5 : 4 }}>
            <PillRule tokens={tokens} pillWidth={pillWidth ?? (pillOnly ? 18 : 22)} height={pillHeight ?? (pillOnly ? 3 : undefined)} continuesLine={!pillOnly} />
          </div>
        ) : (
          <Divider tokens={tokens} thin marginTop={4} marginBottom={0} fade={fadeDivider} />
        )
      ) : null}
    </div>
  );
}
