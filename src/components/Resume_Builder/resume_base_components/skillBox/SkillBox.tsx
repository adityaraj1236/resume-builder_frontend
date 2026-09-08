import type { ThemeTokens } from "@/types/resume_theme";

type SkillBoxProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  dataField?: string;
};

// A single boxed skill tile - accent-bordered rounded rectangle, centered text, full
// width of its grid cell. Used wherever a template renders skills as a boxed grid
// instead of a bulleted list or pill cloud (e.g. StudentSidebarTemplate's Tech Skills).
export default function SkillBox({ tokens, children, dataField }: SkillBoxProps) {
  return (
    <div
      data-field={dataField}
      style={{
        fontFamily: tokens.font.family,
        fontSize: tokens.font.sizes.small,
        color: tokens.foreground,
        background: tokens.surface.card,
        border: `1px solid ${tokens.accent}`,
        borderRadius: 0,
        padding: "5px 8px",
        textAlign: "center",
        width: "100%",
        boxSizing: "border-box",
        overflowWrap: "break-word",
      }}
    >
      {children}
    </div>
  );
}
