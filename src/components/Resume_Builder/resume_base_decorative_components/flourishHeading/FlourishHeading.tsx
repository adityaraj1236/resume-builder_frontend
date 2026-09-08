import type { ThemeTokens } from "@/types/resume_theme";
import Marker from "@/components/Resume_Builder/resume_base_decorative_components/marker/Marker";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

type FlourishHeadingProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  lineWidth?: number;
  dataField?: string;
};
export default function FlourishHeading({ tokens, children, lineWidth = 60, dataField }: FlourishHeadingProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: tokens.spacing.itemGap * 0.7 }}>
      <div style={{ width: lineWidth, height: 1, background: tokens.divider.color }} />
      <Marker tokens={tokens} size={6} filled />
      <Text tokens={tokens} as="div" size="title" color="accent" bold uppercase dataField={dataField} style={{ letterSpacing: 2 }}>
        {children}
      </Text>
      <Marker tokens={tokens} size={6} filled />
      <div style={{ width: lineWidth, height: 1, background: tokens.divider.color }} />
    </div>
  );
}
