// Paged.js ships no TypeScript definitions and has no @types package. This is the
// minimal surface the POC uses (see resume_builder/pagedjs_poc/PagedJsPreview.tsx).
declare module "pagedjs" {
  export class Previewer {
    preview(
      source: Node | string,
      stylesheets?: unknown[],
      target?: HTMLElement | null,
    ): Promise<{ total: number }>;
  }
}
