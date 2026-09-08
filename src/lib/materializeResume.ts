// Direct mapping from ResumeDocument -> MaterializedResume, mirroring the pitch deck's
// shipped materializeDeckV2 (no adapter/validation layer — that layer exists upstream
// but is confirmed dead code in the live product, so it isn't replicated here).
import type { MaterializedResume, ResumeDocument } from "@/types/resume";
import { getThemeTokens, type ThemeTokens } from "@/types/resume_theme";

export function materializeResume(
  doc: ResumeDocument,
  themeOverride?: string | ThemeTokens,
): MaterializedResume {
  const theme = getThemeTokens(themeOverride ?? doc.theme);

  const sections = [...doc.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      sectionKey: section.section_key,
      designId: section.design_id,
      sectionType: section.section_type,
      order: section.order,
      config: {
        theme,
        content: section.content,
      },
    }));

  return {
    resumeId: doc.resume_id,
    theme: doc.theme,
    sections,
  };
}
