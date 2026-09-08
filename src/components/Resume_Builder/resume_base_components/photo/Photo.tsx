// Always renders (even with no photo yet) - photo_url is set via HeaderEditForm in
// ResumeContentEditor, not by clicking the rendered photo (the resume preview is
// read-only display).
type PhotoProps = {
  photoUrl: string;
  shape?: "circle" | "rect";
  size?: number; // circle diameter
  width?: number | string; // rect width
  height?: number | string; // rect height
  borderRadius?: number; // rect corner radius
  borderColor?: string;
  placeholderBackground?: string;
  iconColor?: string;
  tint?: string; // optional color wash over the photo (rect mode)
  diagonalCut?: boolean; // rect mode: slice the bottom edge on a diagonal instead of straight across
};

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M4 8a2 2 0 0 1 2-2h1.2l1-1.5A2 2 0 0 1 9.9 3.5h4.2a2 2 0 0 1 1.7 1L17 6h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export default function Photo({
  photoUrl,
  shape = "circle",
  size = 84,
  width,
  height,
  borderRadius = 0,
  borderColor = "rgba(0,0,0,0.15)",
  placeholderBackground = "#e5e7eb",
  iconColor = "#9aa3b0",
  tint,
  diagonalCut = false,
}: PhotoProps) {
  const isCircle = shape === "circle";

  return (
    <div
      // An empty placeholder is only a screen affordance showing where a photo will
      // go - it has no place in the printed/exported resume, so it's excluded from print.
      className={photoUrl ? undefined : "no-print"}
      style={{
        position: "relative",
        width: isCircle ? size : (width ?? "100%"),
        height: isCircle ? size : (height ?? 200),
        borderRadius: isCircle ? "50%" : borderRadius,
        overflow: "hidden",
        border: isCircle ? `2px solid ${borderColor}` : undefined,
        clipPath: !isCircle && diagonalCut ? "polygon(0 0, 100% 0, 100% 100%, 0 78%)" : undefined,
        background: placeholderBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {photoUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {tint ? (
            <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "multiply", opacity: 0.35 }} />
          ) : null}
        </>
      ) : (
        <CameraIcon color={iconColor} />
      )}
    </div>
  );
}
