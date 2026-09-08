import type { ThemeTokens } from "@/types/resume_theme";

// A small round icon slot (e.g. a certification's issuer logo) - the URL is set via
// that section's edit form in ResumeContentEditor, not by clicking the icon itself
// (the resume preview is read-only display). Falls back to `fallbackIcon` when no
// URL is set.
type IconUploadProps = {
  tokens: ThemeTokens;
  iconUrl?: string;
  size?: number;
  fallbackIcon: React.ReactNode;
  background?: string;
};

export default function IconUpload({ tokens, iconUrl, size = 34, fallbackIcon, background }: IconUploadProps) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: background ?? tokens.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        fallbackIcon
      )}
    </div>
  );
}
