import type { ThemeTokens } from "@/types/resume_theme";

type IconBadgeProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  size?: number;
  background?: string;
};

// A small filled circle with a centered icon - marks a contact row or a section
// heading. Defaults to the theme's accent color so it matches whatever accent the
// rest of the page is using.
export default function IconBadge({ tokens, children, size = 22, background }: IconBadgeProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: background ?? tokens.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}
