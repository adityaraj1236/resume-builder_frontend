"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";

import type { BaseSectionConfig, DesignRegistryResponse, ResumeDocument, ResumeSection, SectionType } from "@/types/resume";
import { getThemeTokens, type ThemeTokens } from "@/types/resume_theme";
import { materializeResume } from "@/lib/materializeResume";
import { updateResume } from "@/lib/api";
import { resetMockResume } from "@/lib/mockStore";

import HeaderSplit from "@/components/Resume_Builder/resume_sections/header/HeaderSplit";
import SummaryParagraph from "@/components/Resume_Builder/resume_sections/summary/SummaryParagraph";
import ExperienceEntryList from "@/components/Resume_Builder/resume_sections/experience/ExperienceEntryList";
import EducationSimple from "@/components/Resume_Builder/resume_sections/education/EducationSimple";
import SkillsPillCloud from "@/components/Resume_Builder/resume_sections/skills/SkillsPillCloud";
import ProjectsLinkList from "@/components/Resume_Builder/resume_sections/projects/ProjectsLinkList";
import CertificationsList from "@/components/Resume_Builder/resume_sections/certifications/CertificationsList";
import PublicationsList from "@/components/Resume_Builder/resume_sections/publications/PublicationsList";
import AchievementsBullets from "@/components/Resume_Builder/resume_sections/achievements/AchievementsBullets";

import LeftPanel from "@/components/ResumeContentEditor/LeftPanel";
import ThemePicker from "@/components/ThemePicker";
import TwoColumnIconTemplate from "@/components/Resume_Builder/resume_templates/TwoColumnIconTemplate";
import StudentSidebarTemplate from "@/components/Resume_Builder/resume_templates/StudentSidebarTemplate";
import PortfolioBlobTemplate from "@/components/Resume_Builder/resume_templates/PortfolioBlobTemplate";
import IconRailTemplate from "@/components/Resume_Builder/resume_templates/IconRailTemplate";
import CenteredTimelineTemplate from "@/components/Resume_Builder/resume_templates/CenteredTimelineTemplate";
import IconLineTemplate from "@/components/Resume_Builder/resume_templates/IconLineTemplate";

// Whole-page templates render every section themselves (mirrors a pitch deck slide
// being one self-contained component) instead of stacking independently-swappable
// sections. Selecting one bypasses SECTION_COMPONENTS entirely.
// "sections" (the flexible mix-and-match mode) has no entry here - it's the fallback
// whenever workingDocument.template_id isn't a key in this map. Rendering contract:
// keys here must exactly match backend/app/resume/config.py's TEMPLATE_REGISTRY
// template_id strings (same hand-maintained contract as SECTION_COMPONENTS below).
const PAGE_TEMPLATE_COMPONENTS: Record<
  string,
  ComponentType<{ sectionsByType: Record<string, ResumeSection>; theme: string | ThemeTokens }>
> = {
  "two-column-icon-v1": TwoColumnIconTemplate,
  "student-sidebar-v1": StudentSidebarTemplate,
  "portfolio-blob-v1": PortfolioBlobTemplate,
  "icon-rail-v1": IconRailTemplate,
  "centered-timeline-v1": CenteredTimelineTemplate,
  "icon-line-v1": IconLineTemplate,
};

// Templates that manage their own full-bleed background/colors render edge-to-edge
// with no outer padding and hide the shared ThemePicker, since ThemeTokens wouldn't
// visibly do anything for them. Templates not in this set (the default "sections"
// mode, and theme-token-driven templates) use the normal theme-padded page shell and
// the shared ThemePicker.
const TEMPLATES_WITH_CUSTOM_SHELL = new Set(["student-sidebar-v1", "portfolio-blob-v1", "icon-rail-v1"]);

// Rendering contract: these keys must exactly match backend/app/resume/config.py's
// SECTION_DESIGN_REGISTRY / DEFAULT_SECTION_DESIGN design_id strings.
// Each design component narrows `config.content` to its own specific content type
// (HeaderContent, SummaryContent, ...), so the individual imports aren't directly
// assignable to one shared registry type - the cast below erases that back to the
// Record<string, unknown> shape the section actually carries at this call site.
type SectionComponent = ComponentType<{ config: BaseSectionConfig<Record<string, unknown>> }>;

const SECTION_COMPONENTS: Record<string, SectionComponent> = {
  "header-split-v1": HeaderSplit as unknown as SectionComponent,
  "summary-paragraph-v1": SummaryParagraph as unknown as SectionComponent,
  "experience-entry-list-v1": ExperienceEntryList as unknown as SectionComponent,
  "education-simple-v1": EducationSimple as unknown as SectionComponent,
  "skills-pill-cloud-v1": SkillsPillCloud as unknown as SectionComponent,
  "projects-link-list-v1": ProjectsLinkList as unknown as SectionComponent,
  "certifications-list-v1": CertificationsList as unknown as SectionComponent,
  "publications-list-v1": PublicationsList as unknown as SectionComponent,
  "achievements-bullets-v1": AchievementsBullets as unknown as SectionComponent,
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

type ResumeRendererProps = {
  initialDocument: ResumeDocument;
  designRegistry: DesignRegistryResponse;
};

export default function ResumeRenderer({ initialDocument, designRegistry }: ResumeRendererProps) {
  const [originalDocument, setOriginalDocument] = useState<ResumeDocument>(initialDocument);
  const [workingDocument, setWorkingDocument] = useState<ResumeDocument>(deepClone(initialDocument));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Measures the resume preview's real rendered height so LeftPanel can be pinned to
  // exactly that height (with its own internal scroll) instead of guessing via CSS -
  // grid/flexbox both size a shared row to the TALLEST cell, which would let
  // LeftPanel's own content (e.g. the Designer tab's full template grid) push the row
  // taller than the resume rather than clipping to it.
  const resumePageRef = useRef<HTMLDivElement>(null);
  const [resumeHeight, setResumeHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const node = resumePageRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setResumeHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasUnsavedChanges = JSON.stringify(originalDocument) !== JSON.stringify(workingDocument);

  const materialized = useMemo(
    () => materializeResume(workingDocument, workingDocument.theme),
    [workingDocument],
  );
  const themeTokens: ThemeTokens = getThemeTokens(workingDocument.theme);

  const sectionsByType = useMemo(() => {
    const map: Record<string, ResumeSection> = {};
    for (const section of workingDocument.sections) map[section.section_type] = section;
    return map;
  }, [workingDocument]);

  const PageTemplateComponent = PAGE_TEMPLATE_COMPONENTS[workingDocument.template_id];
  const usesCustomShell = TEMPLATES_WITH_CUSTOM_SHELL.has(workingDocument.template_id);
  const currentTemplateName =
    designRegistry.templates.find((t) => t.template_id === workingDocument.template_id)?.name ??
    workingDocument.template_id;

  function updateSection(sectionKey: string, mutate: (section: ResumeSection) => void) {
    setWorkingDocument((prev) => {
      const next = deepClone(prev);
      const section = next.sections.find((s) => s.section_key === sectionKey);
      if (section) mutate(section);
      return next;
    });
  }

  // ResumeContentEditor uses this to read/write a section's whole content object by
  // section type, rather than by section_key, since that's how it looks sections up.
  function mutateSectionContent(sectionType: SectionType, mutate: (content: Record<string, unknown>) => void) {
    const section = sectionsByType[sectionType];
    if (!section) return;
    updateSection(section.section_key, (s) => mutate(s.content));
  }

  function handleThemeChange(themeId: string) {
    setWorkingDocument((prev) => ({ ...prev, theme: themeId }));
  }

  // Switching template_id alone re-renders the same sectionsByType content in a
  // different layout - every template reads from the same underlying sections, so
  // no data migration is needed here, same as handleThemeChange.
  function handleTemplateChange(templateId: string) {
    setWorkingDocument((prev) => ({ ...prev, template_id: templateId }));
  }

  async function saveChanges() {
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await updateResume(
        workingDocument.resume_id,
        workingDocument.sections,
        workingDocument.theme,
        workingDocument.template_id,
      );
      setOriginalDocument(saved);
      setWorkingDocument(deepClone(saved));
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  function exportPdf() {
    window.print();
  }

  // Temporary dev aid: drops this resume from localStorage so it reseeds fresh from
  // dummyResumes.ts on reload, discarding any edits made in this browser. Only useful
  // while iterating on seed data - remove once seed content stabilizes.
  function resetSampleData() {
    resetMockResume(workingDocument.resume_id);
    window.location.reload();
  }

  return (
    <div>
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#525252" }}>Template:</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a1a",
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "4px 10px",
              }}
            >
              {currentTemplateName}
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>(chosen automatically at generation time)</span>
          </div>
          <ThemePicker currentTheme={workingDocument.theme} onThemeChange={handleThemeChange} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saveError ? <span style={{ color: "#dc2626", fontSize: 13 }}>{saveError}</span> : null}
          <button
            onClick={saveChanges}
            disabled={!hasUnsavedChanges || saving}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving ? "Saving..." : hasUnsavedChanges ? "Save changes" : "Saved"}
          </button>
          <button onClick={exportPdf} className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium">
            Export PDF
          </button>
          <button
            onClick={resetSampleData}
            title="Discards edits and reseeds this sample resume from the latest dummy data"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600"
          >
            Reset sample data
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <LeftPanel
          sectionsByType={sectionsByType}
          mutateSection={mutateSectionContent}
          templates={designRegistry.templates}
          currentTemplateId={workingDocument.template_id}
          onTemplateChange={handleTemplateChange}
          matchHeight={resumeHeight}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            id="resume-page"
            ref={resumePageRef}
            style={{
              background: !usesCustomShell ? themeTokens.background : "#ffffff",
              color: !usesCustomShell ? themeTokens.foreground : "#1a1a1a",
              padding: !usesCustomShell ? themeTokens.spacing.pagePad : 0,
              maxWidth: 820,
              margin: "0 auto",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            {PageTemplateComponent ? (
              <PageTemplateComponent sectionsByType={sectionsByType} theme={workingDocument.theme} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: themeTokens.spacing.sectionGap }}>
                {materialized.sections.map((section) => {
                  const Component = SECTION_COMPONENTS[section.designId];
                  return (
                    <div key={section.sectionKey} className="resume-section" data-section-key={section.sectionKey}>
                      {Component ? (
                        <Component config={section.config} />
                      ) : (
                        <div style={{ color: "#dc2626", fontSize: 13 }}>
                          No component registered for design_id: {section.designId}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
