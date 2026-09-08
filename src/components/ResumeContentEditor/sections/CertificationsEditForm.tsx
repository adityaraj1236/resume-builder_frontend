"use client";

import { useEffect, useRef } from "react";
import type { CertificationEntry, CertificationsContent } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";
import EntryRowShell from "@/components/ResumeContentEditor/shared/EntryRowShell";
import SortableEntryList, { arrayMove } from "@/components/ResumeContentEditor/shared/SortableEntryList";

type CertificationsEditFormProps = {
  content: CertificationsContent;
  onChange: (content: CertificationsContent) => void;
  registerAdd: (add: () => void) => void;
};

const BLANK_ENTRY: CertificationEntry = { name: "", issuer: "", date: "" };

export default function CertificationsEditForm({ content, onChange, registerAdd }: CertificationsEditFormProps) {
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

  function updateEntry(index: number, patch: Partial<CertificationEntry>) {
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
    return <div style={{ fontSize: 12.5, color: "#9ca3af", padding: "4px 6px" }}>No certifications yet - use the + button above.</div>;
  }

  const ids = entries.map((_, index) => String(index));

  return (
    <SortableEntryList ids={ids} onReorder={reorderEntries}>
      {entries.map((entry, index) => (
        <EntryRowShell key={ids[index]} id={ids[index]} title={entry.name} subtitle={entry.issuer} onDuplicate={() => duplicateEntry(index)} onRemove={() => removeEntry(index)}>
          <EditableField label="Certification name" value={entry.name} onChange={(v) => updateEntry(index, { name: v })} />
          <EditableField label="Issuer" value={entry.issuer} onChange={(v) => updateEntry(index, { issuer: v })} />
          <EditableField label="Date" value={entry.date} onChange={(v) => updateEntry(index, { date: v })} />
          <EditableField label="Credential URL" value={entry.link ?? ""} onChange={(v) => updateEntry(index, { link: v })} placeholder="https://..." />
          <EditableField label="Icon URL" value={entry.icon_url ?? ""} onChange={(v) => updateEntry(index, { icon_url: v })} placeholder="https://..." />
        </EntryRowShell>
      ))}
    </SortableEntryList>
  );
}
