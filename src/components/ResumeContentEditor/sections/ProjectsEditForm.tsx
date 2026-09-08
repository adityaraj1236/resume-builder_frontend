"use client";

import { useEffect, useRef } from "react";
import type { ProjectEntry, ProjectsContent } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";
import EntryRowShell from "@/components/ResumeContentEditor/shared/EntryRowShell";
import SortableEntryList, { arrayMove } from "@/components/ResumeContentEditor/shared/SortableEntryList";

type ProjectsEditFormProps = {
  content: ProjectsContent;
  onChange: (content: ProjectsContent) => void;
  registerAdd: (add: () => void) => void;
};

const BLANK_ENTRY: ProjectEntry = { name: "", description: "", tech_stack: [], link: "" };

export default function ProjectsEditForm({ content, onChange, registerAdd }: ProjectsEditFormProps) {
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

  function updateEntry(index: number, patch: Partial<ProjectEntry>) {
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
    return <div style={{ fontSize: 12.5, color: "#9ca3af", padding: "4px 6px" }}>No projects yet - use the + button above.</div>;
  }

  const ids = entries.map((_, index) => String(index));

  return (
    <SortableEntryList ids={ids} onReorder={reorderEntries}>
      {entries.map((entry, index) => (
        <EntryRowShell key={ids[index]} id={ids[index]} title={entry.name} subtitle={entry.tech_stack.join(", ")} onDuplicate={() => duplicateEntry(index)} onRemove={() => removeEntry(index)}>
          <EditableField label="Project name" value={entry.name} onChange={(v) => updateEntry(index, { name: v })} />
          <EditableField label="Description" value={entry.description} onChange={(v) => updateEntry(index, { description: v })} multiline />
          <EditableField
            label="Tech stack (comma-separated)"
            value={entry.tech_stack.join(", ")}
            onChange={(v) => updateEntry(index, { tech_stack: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <EditableField label="Link" value={entry.link} onChange={(v) => updateEntry(index, { link: v })} placeholder="https://..." />
        </EntryRowShell>
      ))}
    </SortableEntryList>
  );
}
