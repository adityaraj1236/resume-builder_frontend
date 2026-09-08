import type { ThemeTokens } from "@/types/resume_theme";

type EntryProps = {
  tokens: ThemeTokens;
  children: React.ReactNode;
  // A repeatable sub-entry indented and rail-connected under a parent heading -
  // used for one company's additional positions (promotions/other roles held there).
  nested?: boolean;
};

// Generic wrapper for one item in a repeatable list (a position, an education entry,
// a project). Its only real job today is the "nested under a parent" indent/rail -
// a flat (non-nested) Entry is just its children with a bit of vertical spacing.
export default function Entry({ tokens, children, nested = false }: EntryProps) {
  if (!nested) {
    return (
      <div style={{ marginBottom: tokens.spacing.itemGap * 0.5, breakInside: "avoid", pageBreakInside: "avoid" }}>{children}</div>
    );
  }

  return (
    <div
      style={{
        marginTop: tokens.spacing.itemGap * 0.5,
        marginLeft: 14,
        paddingLeft: 14,
        borderLeft: `2px solid ${tokens.divider.color}`,
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      {children}
    </div>
  );
}
