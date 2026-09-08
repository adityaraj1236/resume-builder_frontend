import { A4_WIDTH_PX, A4_HEIGHT_PX } from "@/lib/pageDimensions";

type PageFrameProps = {
  padding: number;
  background: string;
  color: string;
  children: React.ReactNode;
};

// One A4-sized physical "sheet": a fixed-size, overflow-hidden viewport. The caller
// positions its (singly-mounted) flow strip inside via a negative top offset so this
// frame shows only the vertical slice belonging to its page - no content is
// duplicated or unmounted between pages, so links/icons/state stay singular.
export default function PageFrame({ padding, background, color, children }: PageFrameProps) {
  return (
    <div
      className="resume-page-frame"
      style={{
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        boxSizing: "border-box",
        padding,
        background,
        color,
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
