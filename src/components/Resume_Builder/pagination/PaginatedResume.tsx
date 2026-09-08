"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ThemeTokens } from "@/types/resume_theme";
import { A4_WIDTH_PX, getPageContentHeight } from "@/lib/pageDimensions";
import { usePagination } from "@/components/Resume_Builder/pagination/usePagination";
import PageFrame from "@/components/Resume_Builder/pagination/PageFrame";

type PaginatedResumeProps = {
  tokens: ThemeTokens;
  background: string;
  color: string;
  // Single-strip mode: the whole template output as one opaque tree.
  children?: React.ReactNode;
  // Two-strip mode: independent left/right flows (sidebar + main, or the
  // TwoColumnLayout left/right), each paginated on its own. `header`, when given,
  // renders once at full page width above both columns, on page 1 only (e.g.
  // TwoColumnIconTemplate's name/contact header row, which isn't part of either
  // column's own flow) - its real rendered height is subtracted from page 1's
  // available column height so the columns never overflow past the page bottom.
  left?: React.ReactNode;
  right?: React.ReactNode;
  header?: React.ReactNode;
  // Background painted behind the FULL height of the left column on every page (a
  // sidebar tint/dark panel). The template's own left node only stretches as far as
  // its content, so on a page where the sidebar runs out of content early its colour
  // would otherwise stop mid-page; painting it on the window instead keeps the panel
  // running edge-to-edge down every page.
  leftBackground?: string;
  // Fraction of the page width the left column takes (0-1). Defaults to an even
  // split; sidebar templates pass their own narrower ratio (e.g. 0.3) so the
  // paginated pages keep the same proportions as the template's own layout.
  leftWidthRatio?: number;
};

// A hidden, natural-height copy of one flow's content, used only to measure where
// page breaks fall. Rendered off-screen (not display:none, so fonts/layout are real).
function MeasurementStrip({ innerRef, width, children }: { innerRef: React.RefObject<HTMLDivElement | null>; width: number; children: React.ReactNode }) {
  return (
    <div ref={innerRef} style={{ width, position: "absolute", visibility: "hidden", pointerEvents: "none", top: 0, left: -99999 }}>
      {children}
    </div>
  );
}

// Content passed as `children`/`left`/`right` is rendered again inside every page's
// clipped window below (one React re-render per page, not one DOM subtree reused
// across pages). This is safe ONLY because every resume template/section component is
// pure and props-driven (verified: zero useState/useEffect/refs anywhere under
// resume_templates/ or resume_sections/) - each page's copy produces byte-identical
// output from the same props, so there is no divergent state or duplicated side
// effect to worry about. If a future section component ever gains local state, it
// must not be passed through here without revisiting this assumption.
function PageWindow({ content, offset, height, width, background }: { content: React.ReactNode; offset: number; height: number; width?: number; background?: string }) {
  return (
    <div style={{ flex: width === undefined ? 1 : undefined, width, minWidth: 0, overflow: "hidden", position: "relative", height, background }}>
      <div style={{ position: "absolute", top: -offset, left: 0, width: "100%" }}>{content}</div>
    </div>
  );
}

// The slice of a flow shown on page `pageIndex`: from its own break offset up to the
// next one. Deriving the clip height from the breaks themselves (rather than from a
// separately-computed page-height constant) is what guarantees the visible cut always
// lands exactly where the algorithm decided to break - if the two are computed
// independently they drift apart (e.g. by the header's height on page 1), which shows
// up as content clipped at the bottom of one page and repeated at the top of the next.
function sliceFor(breaks: number[], pageIndex: number, maxHeight: number): { offset: number; height: number } | null {
  const offset = breaks[pageIndex];
  if (offset === undefined) return null;
  const next = breaks[pageIndex + 1];
  return { offset, height: next === undefined ? maxHeight : next - offset };
}

// Returns null until the node has actually been measured, so callers can tell
// "not measured yet" apart from a genuine height of 0 - page-break math must not run
// against a placeholder height, or page 1 gets a budget that's too generous by
// exactly the header's height and overflows into the next page's content.
function useMeasuredHeight(ref: React.RefObject<HTMLDivElement | null>): number | null {
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    setHeight(node.offsetHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  return height;
}

export default function PaginatedResume({ tokens, background, color, children, left, right, header, leftBackground, leftWidthRatio = 0.5 }: PaginatedResumeProps) {
  const isSplit = left !== undefined || right !== undefined;

  const leftMeasureRef = useRef<HTMLDivElement>(null);
  const rightMeasureRef = useRef<HTMLDivElement>(null);
  const headerMeasureRef = useRef<HTMLDivElement>(null);

  // A full-bleed sidebar template gets no frame padding (see PageFrame below), so its
  // columns span the entire page width; every other layout sits inside the frame's
  // own page padding.
  const fullContentWidth = leftBackground ? A4_WIDTH_PX : A4_WIDTH_PX - tokens.spacing.pagePad * 2;
  // Two columns share the page width with a gap between them, matching
  // TwoColumnLayout's own default gap so line-wrapping matches the non-paginated
  // render exactly. A full-bleed sidebar has no gutter between the panel and the main
  // column - the panel edge is the divider.
  const columnGap = leftBackground ? 0 : tokens.spacing.sectionGap;
  const splitWidth = fullContentWidth - columnGap;
  const leftColumnWidth = isSplit ? Math.round(splitWidth * leftWidthRatio) : fullContentWidth;
  const rightColumnWidth = isSplit ? splitWidth - leftColumnWidth : fullContentWidth;

  const measuredHeaderHeight = useMeasuredHeight(headerMeasureRef);
  const pageHeight = getPageContentHeight(tokens);
  // Page 1 has less room for column content than later pages, since the header
  // occupies the top of it; later pages have no header and get the full page height.
  // While the header's height is still unknown, assume it takes the whole page so no
  // break is computed against a too-generous page-1 budget - the real value lands on
  // the very next layout pass and recomputes.
  const headerHeight = header ? measuredHeaderHeight : 0;
  const firstPageColumnHeight = headerHeight === null ? 0 : Math.max(pageHeight - headerHeight, 0);

  const { left: leftBreaks, right: rightBreaks, pageCount } = usePagination(pageHeight, leftMeasureRef, isSplit ? rightMeasureRef : undefined, firstPageColumnHeight);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Hidden measurement copies - natural height, real width, invisible */}
      {header ? <MeasurementStrip innerRef={headerMeasureRef} width={fullContentWidth}>{header}</MeasurementStrip> : null}
      <MeasurementStrip innerRef={leftMeasureRef} width={leftColumnWidth}>
        {isSplit ? left : children}
      </MeasurementStrip>
      {isSplit ? (
        <MeasurementStrip innerRef={rightMeasureRef} width={rightColumnWidth}>
          {right}
        </MeasurementStrip>
      ) : null}

      {Array.from({ length: pageCount }, (_, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        // Room available for column content on this page - page 1 gives up the top of
        // itself to the header, later pages get the whole page.
        const columnHeight = isFirstPage ? firstPageColumnHeight : pageHeight;
        const leftSlice = sliceFor(leftBreaks, pageIndex, columnHeight);
        const rightSlice = isSplit ? sliceFor(rightBreaks, pageIndex, columnHeight) : null;

        return (
          // A sidebar template paints a full-bleed panel and carries its own interior
          // padding, so the frame adds none of its own - otherwise the panel would be
          // inset from the page edge and the padding would double up.
          <PageFrame key={pageIndex} padding={leftBackground ? 0 : tokens.spacing.pagePad} background={background} color={color}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {isFirstPage && header ? <div style={{ flexShrink: 0 }}>{header}</div> : null}
              {isSplit ? (
                // Both column windows are always the FULL column height, never just
                // as tall as the slice they happen to hold - a sidebar that runs out
                // of content early still needs its panel colour to reach the bottom
                // of the page instead of stopping where its text ends.
                <div style={{ display: "flex", width: "100%", gap: columnGap, height: columnHeight }}>
                  <PageWindow
                    content={leftSlice ? left : null}
                    offset={leftSlice?.offset ?? 0}
                    height={columnHeight}
                    width={leftColumnWidth}
                    background={leftBackground}
                  />
                  <PageWindow content={rightSlice ? right : null} offset={rightSlice?.offset ?? 0} height={columnHeight} width={rightColumnWidth} />
                </div>
              ) : leftSlice ? (
                <PageWindow content={children} offset={leftSlice.offset} height={columnHeight} />
              ) : null}
            </div>
          </PageFrame>
        );
      })}
    </div>
  );
}
