# Paged.js POC — Findings

Scope: can Paged.js paginate the two-column resume templates into A4 pages where the
left and right columns flow **independently** but stay side by side on every page?

**Verdict: not with the current DOM, and not without a composition layer that fights
the library.** Details below.

---

## 1. What Paged.js can and cannot do

### It cannot fragment flex/grid columns independently

Paged.js paginates **one linear flow in document order**. Its chunker has no flex or
grid awareness — the only display value it ever inspects is `display: none`
(`src/utils/dom.js`). There is no `columns.js` or regions module.

So for two columns that are flex siblings, the break lands wherever the document-order
walk happens to be. In practice the whole left column is emitted, then the whole right
column — which is why the first single-run attempt put right-column content alone on
page 2.

This is a CSS Fragmentation-spec limitation, not a bug: a flex item is fragmented as
one opaque box. Native browser print has the identical constraint.

### CSS multicol does not solve it

`column-count: 2` genuinely paginates and browsers implement it natively. But multicol
is a **single flow snaking through columns** — content fills column 1, then wraps into
column 2. You cannot pin Experience/Education to the left and Skills/Projects to the
right; it interleaves by available space. That contradicts the templates' design.

### Generated pages are fixed full-page-height boxes

Paged.js's own base stylesheet (`src/polisher/base.js:471`):

```css
.pagedjs_page { width: var(--pagedjs-width); height: var(--pagedjs-height); }
```

Every generated page is a fixed, full-A4-height (1123px) box **regardless of how much
content it holds**. Any attempt to nest generated pages inside a composed sheet has to
unwrap them first, or a column holding 400px of content still occupies 1123px.

### `@page :first` did not take effect

An `@page :first { margin-top: … }` rule to shorten page 1 (making room for a header)
silently did nothing — instrumentation showed both pages still reporting the full
1016px content area. The class (`pagedjs_first_page`) *is* applied, but page-area
sizing did not follow. Not investigated further.

---

## 2. The approach that was tried

Run Paged.js **twice** — once per column, each as its own linear flow — then compose
page N of each run side by side into a synthetic sheet.

```
left column  ─► Previewer A ─► [L1, L2, L3]
right column ─► Previewer B ─► [R1, R2, R3]

sheet 1 = [L1 | R1]    sheet 2 = [L2 | R2]    sheet 3 = [L3 | R3]
```

Paged.js still chose every break — no height measurement, break math, or element
splitting in the POC code.

### Why it stays fragile

The two runs know nothing about each other, so everything shared between the columns
has to be faked by the composition layer:

| Shared concern | Consequence |
|---|---|
| The header spans both columns | Doesn't exist in either run. Its space must be faked by injecting a spacer div into both flows, then stripped from the output. |
| Column widths | Must be measured from a hidden source and passed into each run as `@page size`. |
| Page boxes | Full-height, so each generated page must be unwrapped and its `.pagedjs_page_content` lifted into the slot. |
| Sheet height | Header + full-height page box = 1323px in an 1123px sheet, silently clipped by `overflow: hidden`. |

Each of those is a patch for the same underlying mismatch: **Paged.js is paginating two
unrelated documents that are stapled together afterwards**, not paginating the resume.

---

## 3. Template-specific findings

### TwoColumnIcon (`two-column-icon-v1`)

Structurally the best case: columns come from the shared `TwoColumnLayout`, which has
no `flex-wrap`, so the columns cannot wrap. Widths are exact:

```
371 (52%) + 24 (gap) + 319 = 714  ✓ fits the A4 content width
```

`leftWidth="52%"` is **not** a source of overflow — this was checked and ruled out.

### StudentSidebar (`student-sidebar-v1`) — excluded

Different layout model: the template root *is* the columns row, and the two columns
hold opposite sections (skills left; everything else right). Two blockers:

1. At 714px the sidebar's `width: 30%` computes to 214px, below its own `min-width:
   220px` — the template is already at its responsive limit inside an A4 content area.
2. `SkillBox` uses `width: 100%`, which resolves against whatever container it lands
   in after fragmentation.

The sidebar behaves as a **fixed decorative rail**, not a peer content column, so the
TwoColumnIcon algorithm should not be forced onto it.

### Ruled out (verified, not assumed)

- **Flex-wrap in the measurement source**: 220 + 320 + 24 = 564 < 714, so no wrap
  occurs. A `preventColumnWrap` fix was written and then removed as unnecessary.
- **Template/layout bugs**: no template, layout, section, or base component file was
  modified at any point in the POC.

---

## 4. Environment issue worth knowing

`pagedjs@0.4.3` **cannot be imported** under Next 16's Turbopack. It depends on
`es5-ext`, whose modules use a conditional CommonJS export:

```js
module.exports = require("./is-implemented")() ? String.prototype.contains : require("./shim");
```

Turbopack's interop returns a non-callable for this, surfacing as
`contains.call is not a function` inside `d/index.js` during
`Previewer.initializeHandlers()`. The same module resolves to a proper function under
plain Node `require`, confirming a bundler issue rather than a library one.

**Workaround used:** load the prebuilt `paged.polyfill.js` from `/public` via a script
tag, bypassing module interop entirely.

Needing this workaround — plus a dependency that calls `String.prototype.contains`, a
proposal removed from browsers years ago — is worth weighing before adopting Paged.js
more widely.

---

## 5. Options from here

1. **Single-flow Paged.js.** One run over the whole template. Columns won't flow
   independently (a tall left column pushes the right one down), but pagination is
   correct, predictable, and entirely the library's job. Much less code.
2. **Restructure the templates** so each column is its own top-level flow, designed for
   pagination from the start, rather than recovering columns from rendered DOM.
3. **Server-side print** (headless Chromium / Puppeteer) for the PDF path, accepting
   that the browser preview and the PDF are produced differently.

---

## 6. POC files (all uncommitted, nothing merged)

```
public/vendor/paged.polyfill.js                              (added)
src/components/Resume_Builder/pagedjs_poc/PagedJsPreview.tsx (added)
src/types/pagedjs.d.ts                                       (added)
src/app/globals.css                                          (modified — .poc-* rules)
src/components/ResumeRenderer.tsx                            (modified — one branch)
package.json / package-lock.json                             (modified — pagedjs dep)
```

**No template, layout, section, or base component was modified** — verified against the
`2375aa7` rollback commit.

To remove the POC completely:

```bash
rm -rf public/vendor src/components/Resume_Builder/pagedjs_poc src/types/pagedjs.d.ts
npm uninstall pagedjs
git checkout src/app/globals.css src/components/ResumeRenderer.tsx
```
