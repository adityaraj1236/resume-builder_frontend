import type { ThemeTokens } from "@/types/resume_theme";
import DotGrid from "@/components/Resume_Builder/resume_base_decorative_components/dotGrid/DotGrid";

type AvatarInitialsProps = {
  tokens: ThemeTokens;
  fullName: string;
  size?: number;
  background?: string;
  textColor?: string;
};
function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
export default function AvatarInitials({
  tokens,
  fullName,
  size = 80,
  background,
  textColor = "#ffffff",
}: AvatarInitialsProps) {
  const initials = getInitials(fullName);
  const width = size * 0.86;
  const bleedTop = tokens.spacing.pagePad;
  const height = size + bleedTop;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        marginTop: -bleedTop,
        borderRadius: `0 0 ${width / 2}px ${width / 2}px / 0 0 ${width / 2}px ${width / 2}px`,
        background: background ?? tokens.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: size * 0.14,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", top: size * 0.12, right: width * 0.12, opacity: 0.35 }}>
        <DotGrid tokens={tokens} rows={4} cols={4} gap={size * 0.045} dotSize={size * 0.045} color={textColor} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size * 0.62,
          height: size * 0.62,
          marginTop: size * 0.76,
          borderRadius: "50%",
          border: `1.5px solid ${textColor}`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: tokens.font.family,
            fontWeight: 700,
            fontSize: size * 0.26,
            color: textColor,
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
}
