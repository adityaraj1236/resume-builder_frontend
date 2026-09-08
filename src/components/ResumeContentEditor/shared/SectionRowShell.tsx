"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";

// One section's row in the left panel, Teal-style: a borderless header (chevron +
// label) that expands to reveal its entries inline, with a "+" to add a new entry
// sitting at the section level (not per-entry). Sections without a real edit form
// yet render disabled (no chevron/expand, no +) via `disabled`.
type SectionRowShellProps = {
  label: string;
  onAdd?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function SectionRowShell({ label, onAdd, disabled, children }: SectionRowShellProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${editorTheme.border}` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 4px",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.45 : 1,
        }}
        onClick={() => !disabled && setExpanded((v) => !v)}
      >
        {disabled ? (
          <span style={{ width: 16 }} />
        ) : expanded ? (
          <ChevronDown size={16} color="#4b5563" />
        ) : (
          <ChevronRight size={16} color="#4b5563" />
        )}
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#111827" }}>{label}</span>
        {!disabled && onAdd ? (
          <button
            type="button"
            title={`Add ${label}`}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(true);
              onAdd();
            }}
            style={{
              border: "none",
              background: "transparent",
              color: editorTheme.accent,
              width: 26,
              height: 26,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
          </button>
        ) : null}
        {disabled ? <span style={{ fontSize: 11, color: editorTheme.textFaint }}>Soon</span> : null}
      </div>

      {expanded && !disabled ? <div style={{ paddingBottom: 10 }}>{children}</div> : null}
    </div>
  );
}
