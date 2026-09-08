import type { ThemeTokens } from "@/types/resume_theme";

type RailProps = {
  tokens: ThemeTokens;
  x?: number;
  top?: number;
  bottom?: number;
  color?: string;
};
export default function Rail({ tokens, x = 13, top = 14, bottom = 14, color }: RailProps) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", top, bottom, left: x, width: 2, background: color ?? tokens.surface.border }}
    />
  );
}
