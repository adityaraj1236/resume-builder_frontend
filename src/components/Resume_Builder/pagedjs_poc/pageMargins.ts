import type { CSSProperties } from "react";

// Half an inch at 96 CSS pixels per inch, shared by every preview layout.
export const PAGE_MARGIN_PX = 42;

// Space between column boxes, separate from outer margins and icon indentation.
export const COLUMN_GAP_PX = 24;
export const pageMarginStyle = {
  "--resume-page-margin": `${PAGE_MARGIN_PX}px`,
} as CSSProperties;

// Apply during pagination AND after two-column fragments leave Paged.js's chrome.
// Inline template margins must not reappear on a continuation fragment.
export const continuationCss = `
  .pagedjs_page_content [data-split-from],
  .poc-col [data-split-from] {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .pagedjs_page_content [data-split-from] > :first-child,
  .poc-col [data-split-from] > :first-child {
    margin-top: 0 !important;
  }

  /* A continued rail reaches the content edge at the page break. Its actual
     first/last endpoints retain their icon-aligned insets. */
  .pagedjs_page_content [data-resume-rail][data-split-from],
  .poc-col [data-resume-rail][data-split-from] {
    --resume-rail-top: 0px !important;
  }

  .pagedjs_page_content [data-resume-rail][data-split-to],
  .poc-col [data-resume-rail][data-split-to] {
    --resume-rail-bottom: 0px !important;
  }
`;
