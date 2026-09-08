import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";
import { renderRichTextSegments } from "@/lib/richTextSegments";

type RichTextProps = {
  tokens: ThemeTokens;
  children: string;
  dataField?: string;
  color?: "foreground" | "subtext" | "background";
};

// Minimal inline formatting for generated prose (e.g. a summary description) - only
// **bold** is recognized, deliberately not a full markdown parser.
export default function RichText({ tokens, children, dataField, color = "foreground" }: RichTextProps) {
  return (
    <Text tokens={tokens} as="p" color={color} dataField={dataField}>
      {renderRichTextSegments(children)}
    </Text>
  );
}
