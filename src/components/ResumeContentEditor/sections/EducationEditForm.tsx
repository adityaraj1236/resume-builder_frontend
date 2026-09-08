"use client";

import { useEffect, useRef } from "react";
import type { EducationContent, EducationEntry } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";
import EntryRowShell from "@/components/ResumeContentEditor/shared/EntryRowShell";
import SortableEntryList, { arrayMove } from "@/components/ResumeContentEditor/shared/SortableEntryList";

type EducationEditFormProps = {
  content: EducationContent;
  onChange: (content: EducationContent) => void;
  registerAdd: (add: () => void) => void;
};

const BLANK_ENTRY: EducationEntry = {
  institution: "",
  degree: "",
  field_of_study: "",
  location: "",
  start_date: "",
  end_date: "",
  gpa: "",
  notes: "",
};

function entrySubtitle(entry: EducationEntry): string {
  return [entry.degree, entry.institution].filter(Boolean).join(" · ");
}

// Inline entry list for Education, rendered inside its SectionRowShell (see
// ResumeContentEditor.tsx) rather than a separate full-panel form. Each entry is an
// EntryRowShell that expands in place to reveal its fields; the section's own "+"
// button (wired via registerAdd) appends a new blank entry. Writes flow straight
// through onChange on every keystroke - there is no separate Save/Cancel step
// anymore, matching Teal's always-live editing.
export default function EducationEditForm({ content, onChange, registerAdd }: EducationEditFormProps) {
  const entries = content.entries;
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    registerAdd(() => {
      onChangeRef.current({ ...content, entries: [...content.entries, { ...BLANK_ENTRY }] });
    });
  }, [registerAdd, content]);

  function updateEntry(index: number, patch: Partial<EducationEntry>) {
    onChange({ ...content, entries: entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)) });
  }

  function removeEntry(index: number) {
    onChange({ ...content, entries: entries.filter((_, i) => i !== index) });
  }

  function duplicateEntry(index: number) {
    const copy = { ...entries[index] };
    onChange({ ...content, entries: [...entries.slice(0, index + 1), copy, ...entries.slice(index + 1)] });
  }

  function reorderEntries(fromIndex: number, toIndex: number) {
    onChange({ ...content, entries: arrayMove(entries, fromIndex, toIndex) });
  }

  if (entries.length === 0) {
    return <div style={{ fontSize: 12.5, color: "#9ca3af", padding: "4px 6px" }}>No education yet - use the + button above.</div>;
  }

  const ids = entries.map((_, index) => String(index));

  return (
    <SortableEntryList ids={ids} onReorder={reorderEntries}>
      {entries.map((entry, index) => (
        <EntryRowShell
          key={ids[index]}
          id={ids[index]}
          title={entry.institution}
          subtitle={entrySubtitle(entry)}
          onDuplicate={() => duplicateEntry(index)}
          onRemove={() => removeEntry(index)}
        >
          <EditableField label="Institution" value={entry.institution} onChange={(v) => updateEntry(index, { institution: v })} />
          <EditableField label="Degree" value={entry.degree} onChange={(v) => updateEntry(index, { degree: v })} placeholder="e.g. B.S." />
          <EditableField label="Field of study" value={entry.field_of_study} onChange={(v) => updateEntry(index, { field_of_study: v })} />
          <EditableField label="Location" value={entry.location} onChange={(v) => updateEntry(index, { location: v })} />
          <EditableField label="Start date" value={entry.start_date} onChange={(v) => updateEntry(index, { start_date: v })} placeholder="e.g. Aug 2013" />
          <EditableField label="End date" value={entry.end_date} onChange={(v) => updateEntry(index, { end_date: v })} placeholder="Leave blank for Present" />
          <EditableField label="GPA" value={entry.gpa} onChange={(v) => updateEntry(index, { gpa: v })} />
          <EditableField label="Notes / relevant courses" value={entry.notes} onChange={(v) => updateEntry(index, { notes: v })} multiline />
        </EntryRowShell>
      ))}
    </SortableEntryList>
  );
}
