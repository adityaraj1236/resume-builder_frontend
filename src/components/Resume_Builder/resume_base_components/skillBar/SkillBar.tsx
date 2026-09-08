import type { ThemeTokens } from "@/types/resume_theme";

type SkillBarProps = {
  tokens: ThemeTokens;
  level: number; // 0-100
  height?: number;
  fillColor?: string;
  trackColor?: string;
};

// A horizontal filled-track proficiency bar - the bar-style counterpart to SkillMeter's
// dot-style rating. Both read the same real (currently dummy) SkillCategory.levels
// data; which one a template uses is purely a visual choice.
export default function SkillBar({ tokens, level, height = 5, fillColor, trackColor }: SkillBarProps) {
  const pct = Math.min(100, Math.max(0, level));
  return (
    <div style={{ width: "100%", height, borderRadius: height / 2, background: trackColor ?? tokens.surface.border, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: fillColor ?? tokens.accent, borderRadius: height / 2 }} />
    </div>
  );
}
