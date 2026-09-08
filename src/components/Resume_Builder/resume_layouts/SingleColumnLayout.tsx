import type { ThemeTokens } from "@/types/resume_theme";

type SingleColumnLayoutProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
};

export default function SingleColumnLayout({ tokens, children }: SingleColumnLayoutProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.itemGap }}>
      {children}
    </div>
  );
}
