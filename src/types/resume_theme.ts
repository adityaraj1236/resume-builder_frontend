// Theme system for the Resume Builder. Trimmed version of the pitch deck's
// ThemeTokens (presentation_theme.ts) — resumes are static print-like documents,
// so slide-deck-only concerns (hero/decoration/glass/linearGlow) are dropped.
// Purely a frontend concept: the backend only ever stores an opaque theme id string.

export type ThemeTokens = {
  background: string;
  foreground: string;
  subtext: string;
  accent: string;
  surface: {
    card: string;
    border: string;
  };
  font: {
    family: string;
    headingWeight: number;
    bodyWeight: number;
    sizes: {
      name: number;
      title: number;
      sectionHeading: number;
      body: number;
      small: number;
    };
    lineHeights: {
      heading: number;
      body: number;
    };
  };
  spacing: {
    pagePad: number;
    sectionGap: number;
    itemGap: number;
  };
  radii: {
    card: number;
    pill: number;
  };
  divider: {
    color: string;
    thickness: number;
  };
};

export type ThemePreset = {
  id: string;
  name: string;
  tokens: ThemeTokens;
};

const classicTokens: ThemeTokens = {
  background: "#ffffff",
  foreground: "#1a1a1a",
  subtext: "#525252",
  accent: "#1f2937",
  surface: { card: "#ffffff", border: "#d4d4d4" },
  font: {
    family: '"Georgia", "Times New Roman", serif',
    headingWeight: 700,
    bodyWeight: 400,
    sizes: { name: 30, title: 16, sectionHeading: 14, body: 12.5, small: 11 },
    lineHeights: { heading: 1.2, body: 1.5 },
  },
  spacing: { pagePad: 40, sectionGap: 22, itemGap: 12 },
  radii: { card: 4, pill: 999 },
  divider: { color: "#d4d4d4", thickness: 0.5 },
};

const modernTokens: ThemeTokens = {
  background: "#ffffff",
  foreground: "#111827",
  subtext: "#4b5563",
  accent: "#2563eb",
  surface: { card: "#f8fafc", border: "#e2e8f0" },
  font: {
    family: '"Inter", "Segoe UI", system-ui, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    sizes: { name: 32, title: 16, sectionHeading: 13, body: 12.5, small: 11 },
    lineHeights: { heading: 1.2, body: 1.55 },
  },
  spacing: { pagePad: 40, sectionGap: 24, itemGap: 14 },
  radii: { card: 10, pill: 999 },
  divider: { color: "#2563eb", thickness: 2 },
};

const minimalTokens: ThemeTokens = {
  background: "#ffffff",
  foreground: "#0a0a0a",
  subtext: "#6b6b6b",
  accent: "#0a0a0a",
  surface: { card: "#ffffff", border: "#e5e5e5" },
  font: {
    family: '"Helvetica Neue", Arial, sans-serif',
    headingWeight: 600,
    bodyWeight: 400,
    sizes: { name: 26, title: 14, sectionHeading: 12, body: 12, small: 10.5 },
    lineHeights: { heading: 1.15, body: 1.45 },
  },
  spacing: { pagePad: 36, sectionGap: 18, itemGap: 10 },
  radii: { card: 0, pill: 4 },
  divider: { color: "#0a0a0a", thickness: 1 },
};

export const themePresets: ThemePreset[] = [
  { id: "classic", name: "Classic", tokens: classicTokens },
  { id: "modern", name: "Modern", tokens: modernTokens },
  { id: "minimal", name: "Minimal", tokens: minimalTokens },
];
const CUSTOM_THEME_PREFIX = "custom:";

function isThemeTokens(value: unknown): value is ThemeTokens {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.background === "string" && typeof candidate.foreground === "string" && typeof candidate.accent === "string" && !!candidate.font && !!candidate.spacing;
}

export function encodeCustomTheme(tokens: ThemeTokens): string {
  const json = JSON.stringify(tokens);
  const base64 =
    typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, "utf-8").toString("base64");
  return `${CUSTOM_THEME_PREFIX}${base64}`;
}

export function decodeCustomTheme(value: string): ThemeTokens | null {
  if (!value.startsWith(CUSTOM_THEME_PREFIX)) return null;
  try {
    const base64 = value.slice(CUSTOM_THEME_PREFIX.length);
    const json =
      typeof window !== "undefined"
        ? decodeURIComponent(escape(window.atob(base64)))
        : Buffer.from(base64, "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    return isThemeTokens(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getThemeTokens(theme: string | ThemeTokens): ThemeTokens {
  if (typeof theme !== "string") return theme;
  const preset = themePresets.find((p) => p.id === theme);
  if (preset) return preset.tokens;
  return decodeCustomTheme(theme) ?? themePresets[0].tokens;
}

export function getThemeLabel(theme: string | ThemeTokens): string {
  if (typeof theme === "string") {
    const preset = themePresets.find((p) => p.id === theme);
    if (preset) return preset.name;
  }
  return "Custom";
}
