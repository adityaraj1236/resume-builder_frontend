"use client";

import type { SummaryContent } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";

type SummaryEditFormProps = {
  content: SummaryContent;
  onChange: (content: SummaryContent) => void;
};

// Same shape as HeaderEditForm - one object, no entry list, fields render directly
// inside the section row.
export default function SummaryEditForm({ content, onChange }: SummaryEditFormProps) {
  function set<K extends keyof SummaryContent>(key: K, value: SummaryContent[K]) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div style={{ padding: "4px 6px 10px" }}>
      <EditableField label="Section title" value={content.title ?? ""} onChange={(v) => set("title", v)} placeholder="Summary" />
      <EditableField label="Professional title" value={content.professional_title} onChange={(v) => set("professional_title", v)} />
      <EditableField label="Years of experience" value={content.years_of_experience} onChange={(v) => set("years_of_experience", v)} placeholder="e.g. 8+ years" />
      <EditableField label="Summary" value={content.summary} onChange={(v) => set("summary", v)} multiline />
    </div>
  );
}
