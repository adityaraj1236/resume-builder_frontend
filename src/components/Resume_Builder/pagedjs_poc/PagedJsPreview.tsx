"use client";

import { useEffect, useRef, useState } from "react";

import { PAGE_MARGIN_PX, pageMarginStyle, continuationCss } from "./pageMargins";
import { registerOrphanHeadingGuard } from "./orphanHeadingGuard";

const PAGEDJS_SRC = "/vendor/paged.polyfill.js";

const PAGE_HEIGHT_MM = 297;

const PAGE_WIDTH_PX = 794;
const PAGE_PADDING_X_PX = PAGE_MARGIN_PX;
const CONTENT_WIDTH_PX = PAGE_WIDTH_PX - PAGE_PADDING_X_PX * 2;

function columnPageCss(widthPx: number): string {
  return `
    ${continuationCss}

    @page {
      size: ${widthPx}px ${PAGE_HEIGHT_MM}mm;
      margin: ${PAGE_MARGIN_PX}px 0;
    }

    h1, h2 {
      break-inside: avoid;
    }

    h1 + *, h2 + * {
      break-before: avoid;
    }

    [data-section-key] > div:first-child:not(:only-child) {
      break-inside: avoid;
      break-after: avoid;
    }

    li[data-split-from] {
      list-style-type: none;
    }

    li[data-split-from]::marker {
      content: none;
    }

    ul, ol {
      orphans: 2;
      widows: 2;
    }

    p, li {
      orphans: 2;
      widows: 2;
    }
  `;
}

type PagedPreviewer = {
  preview: (content: string, stylesheets: unknown[], target: HTMLElement) => Promise<{ total: number }>;
  chunker: { hooks: { onOverflow: { register: (fn: (overflow: Range | undefined, rendered: HTMLElement | undefined) => Range | undefined) => void } } };
};

type PagedWindow = Window & {
  Paged?: { Previewer: new () => PagedPreviewer };
};

function loadPagedJs(): Promise<NonNullable<PagedWindow["Paged"]>> {
  return new Promise((resolve, reject) => {
    const w = window as PagedWindow;
    if (w.Paged) return resolve(w.Paged);

    (window as unknown as { PagedConfig?: Record<string, unknown> }).PagedConfig = { auto: false };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAGEDJS_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => (w.Paged ? resolve(w.Paged) : reject(new Error("Paged.js loaded but window.Paged is missing"))));
    script.addEventListener("error", () => reject(new Error(`Failed to load ${PAGEDJS_SRC}`)));
    if (!existing) {
      script.src = PAGEDJS_SRC;
      document.head.appendChild(script);
    }
  });
}

function appendPageContent(slot: HTMLElement, page: HTMLElement | undefined): void {
  if (!page) return;
  const content = page.querySelector<HTMLElement>(".pagedjs_page_content");
  if (!content) return;
  while (content.firstChild) slot.appendChild(content.firstChild);
}

type PanelDecoration = { image: string; position: string; size: string; repeat: string };

function liftPanelDecoration(column: HTMLElement): PanelDecoration | null {
  const panel = column.matches("[data-panel-decoration]")
    ? column
    : column.querySelector<HTMLElement>("[data-panel-decoration]");
  if (!panel) return null;

  const style = window.getComputedStyle(panel);
  const image = style.backgroundImage;
  if (!image || image === "none") return null;
  const lifted: PanelDecoration = {
    image,
    position: style.backgroundPosition,
    size: style.backgroundSize,
    repeat: style.backgroundRepeat,
  };
  return lifted;
}

function applyPanelDecoration(slot: HTMLElement, decoration: PanelDecoration): void {
  slot.style.setProperty("background-image", decoration.image);
  slot.style.setProperty("background-position", decoration.position);
  slot.style.setProperty("background-size", decoration.size);
  slot.style.setProperty("background-repeat", decoration.repeat);
}

function readPanelBackground(column: HTMLElement): string | null {
  const candidates = [column, column.firstElementChild as HTMLElement | null];
  for (const node of candidates) {
    if (!node) continue;
    const background = window.getComputedStyle(node).backgroundColor;
    if (background && background !== "transparent" && !background.startsWith("rgba(0, 0, 0, 0")) {
      return background;
    }
  }
  return null;
}

// The panel's own borderRight only spans its own box, which is as tall as its
// content - shorter than the page whenever the sidebar has less content than the
// main column. Lifting it onto the full-height slot (same idea as the background
// lift above) keeps the divider running the full page height even past where the
// sidebar's own content ends.
function readPanelBorderRight(column: HTMLElement): string | null {
  const candidates = [column, column.firstElementChild as HTMLElement | null];
  for (const node of candidates) {
    if (!node) continue;
    const style = window.getComputedStyle(node);
    const width = parseFloat(style.borderRightWidth);
    if (style.borderRightStyle !== "none" && width > 0) {
      return `${style.borderRightWidth} ${style.borderRightStyle} ${style.borderRightColor}`;
    }
  }
  return null;
}

function findColumns(source: HTMLElement): { left: HTMLElement; right: HTMLElement; row: HTMLElement } | null {
  const candidates = Array.from(source.querySelectorAll<HTMLElement>("div")).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.display === "flex" && style.flexDirection === "row" && el.children.length >= 2;
  });

  const root = source.firstElementChild as HTMLElement | null;
  if (root) {
    const rootStyle = window.getComputedStyle(root);
    if (rootStyle.display === "flex" && rootStyle.flexDirection === "row" && root.children.length >= 2) {
      candidates.unshift(root);
    }
  }

  let best: { left: HTMLElement; right: HTMLElement; row: HTMLElement; score: number } | null = null;

  for (const row of candidates) {
    const kids = (Array.from(row.children) as HTMLElement[]).filter((kid) => kid.querySelector("[data-section-key]") || kid.matches("[data-section-key]"));
    if (kids.length < 2) continue;

    const score = row.querySelectorAll("[data-section-key]").length;
    if (!best || score > best.score) {
      best = { left: kids[0], right: kids[kids.length - 1], row, score };
    }
  }

  return best ? { left: best.left, right: best.right, row: best.row } : null;
}

function extractHeader(source: HTMLElement, columnsRow: HTMLElement): { markup: string; height: number } | null {
  const templateRoot = source.firstElementChild as HTMLElement | undefined;
  if (!templateRoot) return null;

  if (columnsRow === templateRoot) return null;

  const path: number[] = [];
  let node: HTMLElement = columnsRow;
  while (node !== templateRoot && node.parentElement) {
    path.unshift(Array.prototype.indexOf.call(node.parentElement.children, node));
    node = node.parentElement;
  }
  if (node !== templateRoot) return null;

  const clone = templateRoot.cloneNode(true) as HTMLElement;
  let target: Element = clone;
  for (const index of path) {
    const next = target.children[index];
    if (!next) return null;
    target = next;
  }
  let toRemove: Element = target;
  while (toRemove.parentElement && toRemove.parentElement !== clone && toRemove.parentElement.children.length === 1) {
    toRemove = toRemove.parentElement;
  }
  toRemove.remove();

  if (!clone.textContent?.trim()) return null;

  const probe = document.createElement("div");
  probe.className = "poc-header";
  probe.style.setProperty("--resume-page-margin", `${PAGE_MARGIN_PX}px`);
  probe.innerHTML = clone.innerHTML;
  probe.style.position = "absolute";
  probe.style.left = "-99999px";
  probe.style.top = "0";
  probe.style.right = "auto";
  probe.style.width = `${PAGE_WIDTH_PX}px`;
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return { markup: clone.innerHTML, height };
}

type PagedJsPreviewProps = {
  children: React.ReactNode;
};

export default function PagedJsPreview({ children }: PagedJsPreviewProps) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>("rendering...");

  useEffect(() => {
    let cancelled = false;
    const source = sourceRef.current;
    const target = targetRef.current;
    if (!source || !target) return;

    async function paginate() {
      if (!source || !target) return;
      target.innerHTML = "";
      try {
        const Paged = await loadPagedJs();
        if (cancelled) return;

        const columns = findColumns(source);
        if (!columns) {
          setStatus("could not locate the two columns in the rendered template");
          return;
        }

        const sidebarBackground = readPanelBackground(columns.left);
        const sidebarBorderRight = readPanelBorderRight(columns.left);

        const panelDecoration = liftPanelDecoration(columns.left);

        const availableWidth = sidebarBackground ? PAGE_WIDTH_PX : CONTENT_WIDTH_PX;
        if (source.getBoundingClientRect().width !== availableWidth) {
          source.style.width = `${availableWidth}px`;
          void source.offsetWidth;
        }

        const leftWidth = columns.left.getBoundingClientRect().width;
        const rightWidth = columns.right.getBoundingClientRect().width;
        const header = extractHeader(source, columns.row);

        const leftRect = columns.left.getBoundingClientRect();
        const rightRect = columns.right.getBoundingClientRect();
        const measuredGap = Math.max(0, rightRect.left - leftRect.right);

        const leftHost = document.createElement("div");
        const rightHost = document.createElement("div");
        for (const host of [leftHost, rightHost]) {
          host.style.position = "absolute";
          host.style.left = "-99999px";
          host.style.top = "0";
          host.style.visibility = "hidden";
          host.style.pointerEvents = "none";
        }
        document.body.append(leftHost, rightHost);

        try {
          const headerHeight = header?.height ?? 0;
          // The column's page margin already reserves the header's top inset.
          const spacerHeight = Math.max(0, headerHeight - PAGE_MARGIN_PX);
          const spacer = spacerHeight > 0 ? `<div data-poc-header-spacer style="height:${spacerHeight}px"></div>` : "";

          const leftPreviewer = new Paged.Previewer();
          registerOrphanHeadingGuard(leftPreviewer);
          const rightPreviewer = new Paged.Previewer();
          registerOrphanHeadingGuard(rightPreviewer);

          const leftFlow = await leftPreviewer.preview(spacer + columns.left.innerHTML, [{ _: columnPageCss(leftWidth) }], leftHost);
          const rightFlow = await rightPreviewer.preview(spacer + columns.right.innerHTML, [{ _: columnPageCss(rightWidth) }], rightHost);
          if (cancelled) return;

          const leftPages = Array.from(leftHost.querySelectorAll<HTMLElement>(".pagedjs_page"));
          const rightPages = Array.from(rightHost.querySelectorAll<HTMLElement>(".pagedjs_page"));

          console.log(`%c[POC] headerHeight(measured)=${Math.round(headerHeight)} spacerPresent=${spacer !== ""}`, "font-weight:bold;color:#2563eb");
          for (const [label, pages] of [["left", leftPages], ["right", rightPages]] as const) {
            pages.forEach((page, index) => {
              const area = page.querySelector<HTMLElement>(".pagedjs_page_content");
              if (!area) return;
              const available = Math.round(area.getBoundingClientRect().height);
              const used = area.scrollHeight;
              const spacerEl = page.querySelector<HTMLElement>("[data-poc-header-spacer]");
              const sections = Array.from(page.querySelectorAll<HTMLElement>("[data-section-key]"))
                .map((s) => s.dataset.sectionKey)
                .join(",");
              console.log(
                `%c[POC] ${label} p${index + 1}: available=${available} used=${used} unused=${available - used} spacer=${spacerEl ? Math.round(spacerEl.getBoundingClientRect().height) : "none"} [${sections}]`,
                `color:${available - used > 100 ? "#dc2626" : "#059669"}`,
              );
            });
          }

          const pageCount = Math.max(leftPages.length, rightPages.length);

          for (let i = 0; i < pageCount; i += 1) {
            const page = document.createElement("div");
            page.className = "poc-page";

            if (i === 0 && header) {
              const headerSlot = document.createElement("div");
              headerSlot.className = "poc-header";
              headerSlot.innerHTML = header.markup;
              page.appendChild(headerSlot);
            }

            const row = document.createElement("div");
            row.className = "poc-columns";
            row.style.marginTop = "0";
            row.style.gap = `${measuredGap}px`;

            const leftSlot = document.createElement("div");
            leftSlot.className = "poc-col poc-col-left";
            // Untinted columns were measured inside the page margins. Add the
            // outer inset to the slot, so its content width stays exactly measured.
            leftSlot.style.width = `${leftWidth + (sidebarBackground ? 0 : PAGE_MARGIN_PX)}px`;
            if (sidebarBackground) {
              leftSlot.classList.add("poc-col-tinted");
              leftSlot.style.background = sidebarBackground;
              leftSlot.style.alignSelf = "stretch";
              if (panelDecoration) applyPanelDecoration(leftSlot, panelDecoration);
            }
            if (sidebarBorderRight) {
              leftSlot.style.borderRight = sidebarBorderRight;
              leftSlot.style.alignSelf = "stretch";
            }
            appendPageContent(leftSlot, leftPages[i]);

            const rightSlot = document.createElement("div");
            rightSlot.className = "poc-col poc-col-right";
            rightSlot.style.width = `${rightWidth + (sidebarBackground ? 0 : PAGE_MARGIN_PX)}px`;
            appendPageContent(rightSlot, rightPages[i]);

            row.append(leftSlot, rightSlot);
            page.appendChild(row);
            target.appendChild(page);
          }

          requestAnimationFrame(() => {
            const hdr = target.querySelector<HTMLElement>(".poc-header");
            if (hdr) {
              console.log(
                `%c[POC] header rendered=${Math.round(hdr.getBoundingClientRect().height)} vs measured=${Math.round(headerHeight)}`,
                "font-weight:bold;color:#b45309",
              );
            }
            target.querySelectorAll<HTMLElement>(".poc-page").forEach((sheet, i) => {
              const cols = sheet.querySelector<HTMLElement>(".poc-columns");
              const left = sheet.querySelector<HTMLElement>(".poc-col-left");
              console.log(
                `%c[POC] sheet ${i + 1}: height=${Math.round(sheet.getBoundingClientRect().height)} columnsTop=${Math.round((cols?.getBoundingClientRect().top ?? 0) - sheet.getBoundingClientRect().top)} leftColHeight=${Math.round(left?.getBoundingClientRect().height ?? 0)}`,
                "color:#7c3aed",
              );
            });
          });

          setStatus(`Paged.js: left ${leftFlow.total} page(s), right ${rightFlow.total} page(s) -> ${pageCount} composed page(s)`);
        } finally {
          leftHost.remove();
          rightHost.remove();
        }
      } catch (err) {
        console.error("[Paged.js POC] preview() threw:", err);
        if (!cancelled) setStatus(`Paged.js failed: ${err instanceof Error ? err.message : String(err)} (see console)`);
      }
    }

    const timer = setTimeout(paginate, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [children]);

  return (
    <div style={pageMarginStyle}>
      <div className="no-print" style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
        POC: {status}
      </div>

      <div
        ref={sourceRef}
        aria-hidden
        style={{ position: "absolute", left: -99999, top: 0, width: CONTENT_WIDTH_PX, visibility: "hidden", pointerEvents: "none" }}
      >
        {children}
      </div>

      <div ref={targetRef} className="pagedjs-target" />
    </div>
  );
}
