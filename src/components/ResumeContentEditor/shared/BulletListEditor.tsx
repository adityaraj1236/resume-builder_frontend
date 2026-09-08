"use client";

import { Trash2, Plus } from "lucide-react";
import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";

type BulletListEditorProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
};

// A small list-of-strings editor - one text input per bullet with its own remove
// button, plus an "+ Add bullet" line. Used wherever an entry carries a bullets:
// string[] field (Experience's own bullets and each additional_position's bullets).
export default function BulletListEditor({ label, items, onChange }: BulletListEditorProps) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: editorTheme.textMuted, marginBottom: 4 }}>{label}</div>
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
          <input
            type="text"
            value={item}
            onChange={(event) => updateItem(index, event.target.value)}
            style={{
              flex: 1,
              boxSizing: "border-box",
              border: `1px solid ${editorTheme.border}`,
              borderRadius: 6,
              padding: "6px 8px",
              fontSize: 12.5,
              fontFamily: "inherit",
              color: "#111827",
            }}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            title="Remove bullet"
            style={{ border: "none", background: "transparent", color: editorTheme.danger, cursor: "pointer", padding: 4, flexShrink: 0 }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", color: editorTheme.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "2px 0" }}
      >
        <Plus size={13} /> Add bullet
      </button>
    </div>
  );
}
