import { useLayoutEffect, useRef, useState } from "react";

// Position of `element`'s top edge relative to `container` (not `element`'s immediate
// offsetParent, which is what `element.offsetTop` alone gives - wrong as soon as a
// break point is chosen inside a nested child, since that child's own offsetTop is
// relative to ITS parent, not the top-level measurement strip).
function topRelativeTo(element: HTMLElement, container: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== container) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

// Greedily accumulates a strip's direct children into pages, breaking only between
// siblings. A child taller than the current page's remaining height is descended into
// - repeatedly, through any number of single-child wrapper divs (every section wraps
// its content in several nested divs: a `data-section-key` div, a padding div, a
// component's own root div, ...) - until real sibling entries are found (e.g.
// individual experience/skill/publication entries, which every template ultimately
// renders as one DOM node per entry), so the break lands between two entries instead
// of one level short of them. If a single entry alone exceeds a full page, it's left
// intact on its own page rather than split further - splitting inside one entry isn't
// a safe break point.
//
// `getPageHeight(pageIndex)` lets page 1 have a different budget than later pages
// (e.g. a header occupies part of page 1 only) - most callers pass the same height
// for every page.
function computeBreaks(container: HTMLElement, getPageHeight: (pageIndex: number) => number): number[] {
  const breaks = [0];
  let pageStart = 0;
  let pageIndex = 0;

  // Descends through single-child wrapper chains to find the first level with
  // multiple children (a real set of breakable siblings) or a true leaf.
  function unwrap(element: HTMLElement): HTMLElement[] {
    let current = element;
    while (current.children.length === 1) {
      current = current.children[0] as HTMLElement;
    }
    return Array.from(current.children) as HTMLElement[];
  }

  // `noBreakBefore` is the Y offset of the nearest preceding heading-like sibling
  // (the first child of whatever group we're currently inside) - a break is never
  // allowed to land at or before it, so recursing into an oversized section can never
  // separate that section's own heading from its content, no matter how many wrapper
  // layers sit between the heading and the eventual entries.
  function walkChildren(children: HTMLElement[], noBreakBefore: number) {
    const groupStart = children.length > 0 ? topRelativeTo(children[0], container) : noBreakBefore;
    const effectiveNoBreakBefore = Math.max(noBreakBefore, groupStart);

    children.forEach((child) => {
      const top = topRelativeTo(child, container);
      const height = child.offsetHeight;
      const bottom = top + height;
      const pageHeight = getPageHeight(pageIndex);

      // Does this child fit in what's LEFT of the current page (not: is it smaller
      // than a whole page)? If it doesn't fit, try to split it between its own inner
      // entries rather than shunting the entire section to the next page - moving a
      // whole tall section wholesale is what leaves half a page of dead space above
      // it. Only when a child has no inner structure to split does it move as a unit.
      const overflowsRemainingSpace = bottom - pageStart > pageHeight;

      if (overflowsRemainingSpace) {
        const descendants = unwrap(child);
        if (descendants.length > 1) {
          // Descend with the floor we already carry. The child's own `top` is NOT a
          // floor - starting a fresh page exactly at this child is a legitimate (and
          // often the desired) break; only a preceding heading constrains us.
          walkChildren(descendants, noBreakBefore);
          return;
        }
      }

      const shouldBreak = overflowsRemainingSpace && top > pageStart && top > effectiveNoBreakBefore;
      if (shouldBreak) {
        breaks.push(top);
        pageStart = top;
        pageIndex += 1;
      }
    });
  }

  walkChildren(Array.from(container.children) as HTMLElement[], 0);
  return breaks;
}

export type PaginationResult = {
  // Page-break Y offsets (px) for the left/primary strip and, when in two-strip mode,
  // the right strip. Single-strip callers only read `left`.
  left: number[];
  right: number[];
  pageCount: number;
};

const DEBOUNCE_MS = 140;

// Measures one or two hidden "flow strips" and produces page-break offsets, re-run
// whenever the strip's rendered content changes size (edits, font load, image load)
// via ResizeObserver, debounced so a deep-clone-per-keystroke edit flow doesn't
// re-paginate on every character. `firstPageHeight`, when given, is used instead of
// `pageHeight` for page 1 only (e.g. a header eating into page 1's available space).
export function usePagination(
  pageHeight: number,
  leftRef: React.RefObject<HTMLDivElement | null>,
  rightRef?: React.RefObject<HTMLDivElement | null>,
  firstPageHeight?: number,
): PaginationResult {
  const [result, setResult] = useState<PaginationResult>({ left: [0], right: [0], pageCount: 1 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const leftNode = leftRef.current;
    if (!leftNode) return;
    const rightNode = rightRef?.current;
    const getPageHeight = (pageIndex: number) => (pageIndex === 0 && firstPageHeight !== undefined ? firstPageHeight : pageHeight);

    function recompute() {
      if (!leftNode) return;
      const left = computeBreaks(leftNode, getPageHeight);
      const right = rightNode ? computeBreaks(rightNode, getPageHeight) : [0];
      setResult({ left, right, pageCount: Math.max(left.length, right.length) });
    }

    function scheduleRecompute() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(recompute, DEBOUNCE_MS);
    }

    recompute();

    // ResizeObserver watches the measurement node(s) directly for content-size
    // changes (edits, font load, image load) - refs themselves are stable across
    // re-renders (created once by useRef in the caller), so this effect only needs
    // to re-run when pageHeight/firstPageHeight change (e.g. a theme swap or the
    // header's own height settling), never on ref identity.
    const observer = new ResizeObserver(scheduleRecompute);
    observer.observe(leftNode);
    if (rightNode) observer.observe(rightNode);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pageHeight, firstPageHeight, leftRef, rightRef]);

  return result;
}
