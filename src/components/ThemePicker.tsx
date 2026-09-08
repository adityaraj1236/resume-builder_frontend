"use client";

import { useEffect, useRef, useState } from "react";

import {
  themePresets,
  getThemeTokens,
  getThemeLabel,
  encodeCustomTheme,
  type ThemeTokens,
} from "@/types/resume_theme";

type ThemePickerProps = {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
};

const CUSTOM_FIELDS: { key: "background" | "foreground" | "accent"; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "foreground", label: "Text" },
  { key: "accent", label: "Accent" },
];

function SwatchTrio({ tokens, size = 14 }: { tokens: ThemeTokens; size?: number }) {
  const colors = [tokens.background, tokens.foreground, tokens.accent];
  return (
    <div style={{ display: "flex" }}>
      {colors.map((color, index) => (
        <div
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: 4,
            background: color,
            border: "1px solid rgba(0,0,0,0.15)",
            marginLeft: index === 0 ? 0 : -4,
          }}
        />
      ))}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2.5"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ThemePicker({ currentTheme, onThemeChange }: ThemePickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"presets" | "custom">("presets");
  const [draft, setDraft] = useState<ThemeTokens>(() => getThemeTokens(currentTheme));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const currentTokens = getThemeTokens(currentTheme);
  const currentLabel = getThemeLabel(currentTheme);

  function selectPreset(id: string) {
    onThemeChange(id);
    setOpen(false);
  }

  function applyCustomTheme() {
    onThemeChange(encodeCustomTheme(draft));
    setOpen(false);
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #d4d4d4",
          borderRadius: 999,
          padding: "6px 12px",
          background: "#ffffff",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 13, color: "#525252" }}>Theme:</span>
        <SwatchTrio tokens={currentTokens} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{currentLabel}</span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width: 300,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
            zIndex: 30,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
            <button
              type="button"
              onClick={() => setTab("presets")}
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 13,
                fontWeight: 600,
                color: tab === "presets" ? "#1a1a1a" : "#9ca3af",
                borderBottom: tab === "presets" ? "2px solid #1a1a1a" : "2px solid transparent",
                background: "none",
                cursor: "pointer",
              }}
            >
              Presets
            </button>
            <button
              type="button"
              onClick={() => setTab("custom")}
              style={{
                flex: 1,
                padding: "10px 0",
                fontSize: 13,
                fontWeight: 600,
                color: tab === "custom" ? "#1a1a1a" : "#9ca3af",
                borderBottom: tab === "custom" ? "2px solid #1a1a1a" : "2px solid transparent",
                background: "none",
                cursor: "pointer",
              }}
            >
              Custom
            </button>
          </div>

          {tab === "presets" ? (
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
              {themePresets.map((preset) => {
                const selected = preset.id === currentTheme;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 10px",
                      borderRadius: 8,
                      border: selected ? "1.5px solid #4f46e5" : "1px solid #e5e7eb",
                      background: selected ? "#eef2ff" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <SwatchTrio tokens={preset.tokens} />
                    <span style={{ fontSize: 13.5, fontWeight: selected ? 600 : 500, color: "#1a1a1a" }}>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {CUSTOM_FIELDS.map(({ key, label }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "#525252" }}>{label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{draft[key]}</span>
                    <input
                      type="color"
                      value={draft[key]}
                      onChange={(event) => setDraft((prev) => ({ ...prev, [key]: event.target.value }))}
                      style={{ width: 30, height: 22, border: "1px solid #e5e7eb", borderRadius: 4, padding: 0, background: "none", cursor: "pointer" }}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={applyCustomTheme}
                className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
              >
                Apply Theme
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
