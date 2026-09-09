"use client";

import { useEffect, useRef, useState } from "react";

import { PAGE_MARGIN_PX, pageMarginStyle, continuationCss } from "./pageMargins";
import { registerOrphanHeadingGuard } from "./orphanHeadingGuard";

const PAGEDJS_SRC = "/vendor/paged.polyfill.js";

function pageCss(): string {
  return `
    ${continuationCss}

    @page {
      size: A4;
      margin: ${PAGE_MARGIN_PX}px;
    }

    h1, h2 {
      break-inside: avoid;
    }

    h1 + *, h2 + * {
      break-before: avoid;
    }

    [data-section-key] > div:first-child:not(:only-child) {
      break-after: avoid;
      break-inside: avoid;
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

type PagedJsSingleFlowProps = {
  children: React.ReactNode;
};

export default function PagedJsSingleFlow({ children }: PagedJsSingleFlowProps) {
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

        const previewer = new Paged.Previewer();
        registerOrphanHeadingGuard(previewer);
        const flow = await previewer.preview(source.innerHTML, [{ _: pageCss() }], target);
        if (cancelled) return;
        setStatus(`${flow.total} page(s)`);
      } catch (err) {
        console.error("[Paged.js] preview() threw:", err);
        if (!cancelled) setStatus(`failed: ${err instanceof Error ? err.message : String(err)} (see console)`);
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
        Paged.js: {status}
      </div>

      <div
        ref={sourceRef}
        aria-hidden
        style={{ position: "absolute", left: -99999, top: 0, width: 794 - PAGE_MARGIN_PX * 2, visibility: "hidden", pointerEvents: "none" }}
      >
        {children}
      </div>

      <div ref={targetRef} className="pagedjs-target pagedjs-single" />
    </div>
  );
}
