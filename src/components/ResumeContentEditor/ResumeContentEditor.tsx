"use client";

import { useRef } from "react";
import type {
  AchievementsContent,
  CertificationsContent,
  EducationContent,
  ExperienceContent,
  HeaderContent,
  ProjectsContent,
  PublicationsContent,
  ResumeSection,
  SectionType,
  SkillsContent,
  SummaryContent,
} from "@/types/resume";
import { SECTION_DEFAULT_TITLES } from "@/types/resume";
import SectionRowShell from "@/components/ResumeContentEditor/shared/SectionRowShell";
import HeaderEditForm from "@/components/ResumeContentEditor/sections/HeaderEditForm";
import SummaryEditForm from "@/components/ResumeContentEditor/sections/SummaryEditForm";
import ExperienceEditForm from "@/components/ResumeContentEditor/sections/ExperienceEditForm";
import EducationEditForm from "@/components/ResumeContentEditor/sections/EducationEditForm";
import SkillsEditForm from "@/components/ResumeContentEditor/sections/SkillsEditForm";
import ProjectsEditForm from "@/components/ResumeContentEditor/sections/ProjectsEditForm";
import CertificationsEditForm from "@/components/ResumeContentEditor/sections/CertificationsEditForm";
import PublicationsEditForm from "@/components/ResumeContentEditor/sections/PublicationsEditForm";
import AchievementsEditForm from "@/components/ResumeContentEditor/sections/AchievementsEditForm";

type MutateSection = (sectionType: SectionType, mutate: (content: Record<string, unknown>) => void) => void;

type ResumeContentEditorProps = {
  sectionsByType: Record<string, ResumeSection>;
  mutateSection: MutateSection;
};

// Every section now has a real edit form.
const SECTIONS_WITH_EDIT_FORM = new Set<SectionType>([
  "header",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "publications",
  "achievements",
]);

const SECTION_ORDER: SectionType[] = [
  "header",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "publications",
  "achievements",
];

function sectionLabel(type: SectionType): string {
  return type === "header" ? "Header" : SECTION_DEFAULT_TITLES[type];
}

// Left-panel content editor, Teal-style: every section is its own collapsible row
// (SectionRowShell). Expanding a section reveals its entries/fields inline - no
// separate full-panel edit view, no explicit Save step. Each section's *EditForm
// writes through `onChange` on every keystroke, straight into mutateSection, which
// ResumeRenderer already threads into the single workingDocument state - so this
// component holds no draft state of its own.
export default function ResumeContentEditor({ sectionsByType, mutateSection }: ResumeContentEditorProps) {
  // Each list-based section's EditForm registers its own "add a blank entry"
  // callback here via registerAdd, so SectionRowShell's "+" button (owned by this
  // component, sitting above the entry list) can trigger it without this component
  // needing to know that section's entry shape. Header/Summary have no list, so
  // they never register one and their SectionRowShell gets no onAdd.
  const addHandlers = useRef<Partial<Record<SectionType, () => void>>>({});

  return (
    <div style={{ padding: "4px 10px" }}>
      {SECTION_ORDER.map((type) => {
            const section = sectionsByType[type];
            if (!section) return null;
            const hasForm = SECTIONS_WITH_EDIT_FORM.has(type);
            const content = section.content as Record<string, unknown>;
            const isListSection = type !== "header" && type !== "summary";

            return (
              <SectionRowShell
                key={type}
                label={sectionLabel(type)}
                disabled={!hasForm}
                onAdd={hasForm && isListSection ? () => addHandlers.current[type]?.() : undefined}
              >
                {type === "header" ? (
                  <HeaderEditForm
                    content={content as unknown as HeaderContent}
                    onChange={(next) => mutateSection("header", (draft) => Object.assign(draft, next))}
                  />
                ) : type === "summary" ? (
                  <SummaryEditForm
                    content={content as unknown as SummaryContent}
                    onChange={(next) => mutateSection("summary", (draft) => Object.assign(draft, next))}
                  />
                ) : type === "experience" ? (
                  <ExperienceEditForm
                    content={content as unknown as ExperienceContent}
                    onChange={(next) => mutateSection("experience", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.experience = add;
                    }}
                  />
                ) : type === "education" ? (
                  <EducationEditForm
                    content={content as unknown as EducationContent}
                    onChange={(next) => mutateSection("education", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.education = add;
                    }}
                  />
                ) : type === "skills" ? (
                  <SkillsEditForm
                    content={content as unknown as SkillsContent}
                    onChange={(next) => mutateSection("skills", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.skills = add;
                    }}
                  />
                ) : type === "projects" ? (
                  <ProjectsEditForm
                    content={content as unknown as ProjectsContent}
                    onChange={(next) => mutateSection("projects", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.projects = add;
                    }}
                  />
                ) : type === "certifications" ? (
                  <CertificationsEditForm
                    content={content as unknown as CertificationsContent}
                    onChange={(next) => mutateSection("certifications", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.certifications = add;
                    }}
                  />
                ) : type === "publications" ? (
                  <PublicationsEditForm
                    content={content as unknown as PublicationsContent}
                    onChange={(next) => mutateSection("publications", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.publications = add;
                    }}
                  />
                ) : type === "achievements" ? (
                  <AchievementsEditForm
                    content={content as unknown as AchievementsContent}
                    onChange={(next) => mutateSection("achievements", (draft) => Object.assign(draft, next))}
                    registerAdd={(add) => {
                      addHandlers.current.achievements = add;
                    }}
                  />
                ) : null}
              </SectionRowShell>
            );
          })}
    </div>
  );
}
