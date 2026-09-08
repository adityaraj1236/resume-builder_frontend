import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

type DateLabelProps = {
  tokens: ThemeTokens;
  value?: string;
  dataField?: string;
  color?: "subtext" | "foreground" | "accent";
};

// A single standalone date (e.g. a certification's issue date) - renamed DateLabel
// internally to avoid shadowing the global Date constructor.
export default function DateLabel({ tokens, value, dataField, color = "subtext" }: DateLabelProps) {
  if (!value) return null;
  return (
    <Text tokens={tokens} size="small" color={color} dataField={dataField}>
      {value}
    </Text>
  );
}
