"use client";

import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";

type EditableFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

export default function EditableField({ label, value, onChange, placeholder, multiline = false }: EditableFieldProps) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${editorTheme.border}`,
    borderRadius: 6,
    padding: "7px 9px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#111827",
    background: "#fff",
    outline: "none",
  };

  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: editorTheme.textMuted, marginBottom: 4 }}>{label}</div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </label>
  );
}
