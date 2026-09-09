// Keeps a section heading from being stranded alone at the bottom of a page with
// its content starting fresh on the next one.
//
// CSS break-before/break-after: avoid was the first attempt (see git history) but
// Paged.js only turns those into an actual break decision when the marked element
// has a genuine rendered sibling to glue to at the SAME nesting depth as the
// heading - real section markup rarely lines up that way, so the rule silently
// no-oped for every case that mattered here (confirmed by hand: it never produced
// a data-break-before attribute for our actual templates).
//
// This uses the one mechanism that does fire reliably: Paged.js calls its
// onOverflow hook with the exact Range of content it's about to push to the next
// page, every time a page overflows. If that page's last rendered heading
// (data-resume-heading, set by Heading.tsx) has nothing rendered after it yet -
// nextElementSibling is still null - the heading is about to be left alone with
// its content starting on the next page. Widening the range's start to include
// the heading pushes it along too. If ANY content already fit next to it, we
// leave the range untouched - whatever fits, stays.
type OnOverflowHook = {
  register: (fn: (overflow: Range | undefined, rendered: HTMLElement | undefined) => Range | undefined) => void;
};

type PreviewerWithChunkerHooks = {
  chunker: { hooks: { onOverflow: OnOverflowHook } };
};

export function registerOrphanHeadingGuard(previewer: PreviewerWithChunkerHooks): void {
  previewer.chunker.hooks.onOverflow.register((overflow, rendered) => {
    if (!overflow || !rendered) return undefined;

    const headings = rendered.querySelectorAll<HTMLElement>("[data-resume-heading]");
    if (headings.length === 0) return undefined;

    const lastHeading = headings[headings.length - 1];
    if (lastHeading.nextElementSibling) return undefined;

    overflow.setStartBefore(lastHeading);
    return overflow;
  });
}
