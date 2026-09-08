import type { ThemeTokens } from "@/types/resume_theme";

// A4 at 96 CSS px/inch (the standard "1px = 1/96in" browser resolution), matched by
// the print CSS's `size: A4` so on-screen preview and printed output agree exactly.
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

// The vertical space available for actual content inside one A4 page, after the
// theme's own page padding is subtracted top and bottom.
export function getPageContentHeight(tokens: ThemeTokens): number {
  return A4_HEIGHT_PX - tokens.spacing.pagePad * 2;
}
