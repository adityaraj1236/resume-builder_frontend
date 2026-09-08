import type { ThemeTokens } from "@/types/resume_theme";

type SkillMeterProps = {
  tokens: ThemeTokens;
  level: number; // 0-100
  dotCount?: number;
  size?: number;
  gap?: number;
};

// A row of filled/unfilled accent-colored dots showing a 0-100 proficiency level as
// filled-dot-count/dotCount (e.g. level=80, dotCount=6 -> 5 filled). Reused wherever a
// skills design wants to show real per-skill proficiency data (SkillCategory.levels)
// instead of a plain unranked list.
export default function SkillMeter({ tokens, level, dotCount = 6, size = 7, gap = 4 }: SkillMeterProps) {
  const filled = Math.round((Math.min(100, Math.max(0, level)) / 100) * dotCount);
  return (
    <div style={{ display: "flex", gap, flexShrink: 0 }}>
      {Array.from({ length: dotCount }).map((_, index) => (
        <div
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            boxSizing: "border-box",
            border: `1.5px solid ${tokens.accent}`,
            background: index < filled ? tokens.accent : "transparent",
          }}
        />
      ))}
    </div>
  );
}
