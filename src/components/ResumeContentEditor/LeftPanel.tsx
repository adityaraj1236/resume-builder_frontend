"use client";

import { useState } from "react";
import type { ResumeSection, SectionType, TemplateOption } from "@/types/resume";
import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";
import ResumeContentEditor from "@/components/ResumeContentEditor/ResumeContentEditor";
import DesignerPanel from "@/components/ResumeContentEditor/DesignerPanel";

type MutateSection = (sectionType: SectionType, mutate: (content: Record<string, unknown>) => void) => void;

type LeftPanelProps = {
  sectionsByType: Record<string, ResumeSection>;
  mutateSection: MutateSection;
  templates: TemplateOption[];
  currentTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  // The resume preview's real rendered pixel height (measured via ResizeObserver in
  // ResumeRenderer). CSS alone can't cap this panel to a shorter sibling's height -
  // grid/flexbox both size a shared row to the TALLEST cell, so without this, the
  // Designer tab's full template grid would push the row taller than the resume
  // instead of clipping to it with its own scrollbar. Undefined until first measured.
  matchHeight?: number;
};

type Tab = "content" | "designer";

// Owns the "Content Editor" / "Designer" tab switch (Teal-style) and the shared
// panel chrome (border, height) both tabs sit inside - ResumeContentEditor and
// DesignerPanel are just the two tab bodies now, no chrome of their own.
export default function LeftPanel({ sectionsByType, mutateSection, templates, currentTemplateId, onTemplateChange, matchHeight }: LeftPanelProps) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div className="no-print" style={{ width: "40%", flexShrink: 0, height: matchHeight, display: "flex" }}>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", width: "100%", minHeight: 0 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
          <TabButton label="Content Editor" active={tab === "content"} onClick={() => setTab("content")} />
          <TabButton label="Designer" active={tab === "designer"} onClick={() => setTab("designer")} />
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {tab === "content" ? (
            <ResumeContentEditor sectionsByType={sectionsByType} mutateSection={mutateSection} />
          ) : (
            <DesignerPanel templates={templates} currentTemplateId={currentTemplateId} onSelect={onTemplateChange} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 8px",
        border: "none",
        borderBottom: active ? `2px solid ${editorTheme.accent}` : "2px solid transparent",
        background: "transparent",
        color: active ? editorTheme.accent : "#4b5563",
        fontSize: 13.5,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
