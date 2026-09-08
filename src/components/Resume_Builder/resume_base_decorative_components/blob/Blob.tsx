import type { ThemeTokens } from "@/types/resume_theme";

type BlobProps = {
  tokens: ThemeTokens;
  size?: number;
  color?: string;
  opacity?: number;
};

// An organic accent-colored splash meant to sit behind a Photo (via a position:relative
// wrapper), breaking up the plain circle/rect photo shape the way Marker breaks up a
// plain timeline line. Path is a fixed hand-traced blob on a 200x200 box, scaled to
// `size` through the SVG viewBox so it always fills its wrapper. Purely decorative -
// never carries a data-field.
export default function Blob({ tokens, size = 140, color, opacity = 1 }: BlobProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ opacity, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <path
        fill={color ?? tokens.accent}
        d="M52.4,-62.3C67.5,-53.6,79.2,-37.6,83.4,-19.8C87.6,-2,84.3,17.6,74.8,33.2C65.3,48.8,49.6,60.4,32.4,67.6C15.2,74.8,-3.5,77.6,-21.1,73.4C-38.7,69.2,-55.2,58,-65.8,42.6C-76.4,27.2,-81.1,7.6,-77.8,-10.4C-74.5,-28.4,-63.2,-44.8,-48.5,-53.6C-33.8,-62.4,-16.9,-63.6,1.2,-65.2C19.3,-66.8,38.6,-68.8,52.4,-62.3Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
