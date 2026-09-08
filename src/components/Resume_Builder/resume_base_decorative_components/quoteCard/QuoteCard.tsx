import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import DotGrid from "@/components/Resume_Builder/resume_base_decorative_components/dotGrid/DotGrid";
import QuoteMark from "@/components/Resume_Builder/resume_base_decorative_components/quoteMark/QuoteMark";

type QuoteCardProps = {
  tokens: ThemeTokens;
  text: string;
  width?: number;
};
export default function QuoteCard({ tokens, text, width = 150 }: QuoteCardProps) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: -6, right: -18, pointerEvents: "none" }}>
        <DotGrid tokens={tokens} rows={4} cols={4} dotSize={3} gap={5} />
      </div>
      <div
        style={{
          position: "relative",
          width,
          boxSizing: "border-box",
          background: tokens.surface.card,
          border: `1px solid ${tokens.surface.border}`,
          borderRadius: tokens.radii.card * 1.5,
          padding: "22px 16px 16px",
        }}
      >
        <div style={{ position: "absolute", top: -9, left: 0 }}>
          <QuoteMark tokens={tokens} size={22} />
        </div>
        <Text tokens={tokens} as="p" size="small" italic color="subtext" style={{ margin: 0, lineHeight: 1.5 }}>
          {text}
        </Text>
      </div>
    </div>
  );
}
