import type { ThemeTokens } from "@/types/resume_theme";
import Text from "@/components/Resume_Builder/resume_base_components/text/Text";

type DateRangeProps = {
  tokens: ThemeTokens;
  startDate?: string;
  endDate?: string;
  startField?: string;
  endField?: string;
  // e.g. "Present" / "Current" when endDate is empty (an ongoing role/degree).
  // showPresent is a shorthand for the common case - fallbackEndLabel wins if both
  // are given, so a custom label ("Current", "Ongoing") is still possible.
  fallbackEndLabel?: string;
  showPresent?: boolean;
  separator?: string;
  color?: "subtext" | "foreground" | "accent";
};

// The "start_date – end_date" pattern repeated across every experience/education
// design variant and template, centralized so its two data-fields stay wired
// consistently wherever it's used.
export default function DateRange({
  tokens,
  startDate,
  endDate,
  startField,
  endField,
  fallbackEndLabel,
  showPresent = false,
  separator = " – ",
  color = "subtext",
}: DateRangeProps) {
  const resolvedFallback = fallbackEndLabel ?? (showPresent ? "Present" : "");
  return (
    <Text tokens={tokens} size="small" color={color}>
      <span data-field={startField}>{startDate}</span>
      {separator}
      <span data-field={endField}>{endDate || resolvedFallback}</span>
    </Text>
  );
}
