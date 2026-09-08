"use client";

import type { TemplateOption } from "@/types/resume";
import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";

type DesignerPanelProps = {
  templates: TemplateOption[];
  currentTemplateId: string;
  onSelect: (templateId: string) => void;
};

// Template picker, Teal-style "Designer" tab: a grid of every available template
// (from designRegistry.templates - already carries {template_id, name, description}
// for each PAGE_TEMPLATE_COMPONENTS entry). Switching template_id alone re-renders
// the exact same sectionsByType content in a different layout - no data loss, same
// mechanism ThemePicker already uses for theme switching.
export default function DesignerPanel({ templates, currentTemplateId, onSelect }: DesignerPanelProps) {
  return (
    <div style={{ padding: "4px 10px 14px" }}>
      <div style={{ fontSize: 12, color: "#737373", padding: "8px 6px 12px" }}>
        Pick a template - your content carries over automatically.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {templates.map((template) => {
          const active = template.template_id === currentTemplateId;
          return (
            <button
              key={template.template_id}
              type="button"
              onClick={() => onSelect(template.template_id)}
              title={template.description}
              style={{
                textAlign: "left",
                border: `2px solid ${active ? editorTheme.accent : editorTheme.border}`,
                background: active ? editorTheme.accentSoft : "#fff",
                borderRadius: 8,
                padding: 10,
                cursor: "pointer",
              }}
            >
              <TemplateThumbnail templateId={template.template_id} active={active} />
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginTop: 8 }}>{template.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// A lightweight abstract stand-in for a real thumbnail (a scaled-down live render of
// each template would mean mounting all ~11 templates at once just for this picker -
// too heavy for what's otherwise a static list). Reads as "a page with a header bar
// and a couple of text lines," enough to browse by without implying a specific layout.
function TemplateThumbnail({ templateId, active }: { templateId: string; active: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        aspectRatio: "3 / 4",
        borderRadius: 4,
        background: "#f3f4f6",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ height: 8, width: "60%", borderRadius: 2, background: active ? editorTheme.accent : "#9ca3af" }} />
      <div style={{ height: 4, width: "40%", borderRadius: 2, background: "#d1d5db", marginBottom: 4 }} />
      <div style={{ height: 3, width: "90%", borderRadius: 2, background: "#e5e7eb" }} />
      <div style={{ height: 3, width: "80%", borderRadius: 2, background: "#e5e7eb" }} />
      <div style={{ height: 3, width: "85%", borderRadius: 2, background: "#e5e7eb" }} />
      <div style={{ fontSize: 8, color: "#9ca3af", marginTop: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {templateId}
      </div>
    </div>
  );
}
