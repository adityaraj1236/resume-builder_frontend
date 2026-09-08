import type { ThemeTokens } from "@/types/resume_theme";

type QuoteMarkProps = {
  tokens: ThemeTokens;
  size?: number;
  color?: string;
};
export default function QuoteMark({ tokens, size = 26, color }: QuoteMarkProps) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 32 24" fill="none" aria-hidden="true">
      <path
        fill={color ?? tokens.accent}
        d="M0 24V14.4Q0 7.6 3.4 3.8 6.8 0 12.8 0V4.8Q9.2 4.8 7.4 7 5.6 9.2 5.6 12.8H12.8V24H0ZM17.6 24V14.4Q17.6 7.6 21 3.8 24.4 0 30.4 0V4.8Q26.8 4.8 25 7 23.2 9.2 23.2 12.8H30.4V24H17.6Z"
      />
    </svg>
  );
}
