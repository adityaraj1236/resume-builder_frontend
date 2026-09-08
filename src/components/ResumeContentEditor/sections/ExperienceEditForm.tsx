"use client";

import { useEffect, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import type { ExperienceContent, ExperienceEntry, Position } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";
import EntryRowShell from "@/components/ResumeContentEditor/shared/EntryRowShell";
import SortableEntryList, { arrayMove } from "@/components/ResumeContentEditor/shared/SortableEntryList";
import BulletListEditor from "@/components/ResumeContentEditor/shared/BulletListEditor";
import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";

type ExperienceEditFormProps = {
  content: ExperienceContent;
  onChange: (content: ExperienceContent) => void;
  registerAdd: (add: () => void) => void;
};

const BLANK_ENTRY: ExperienceEntry = {
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  bullets: [],
  additional_positions: [],
};

const BLANK_POSITION: Position = { role: "", start_date: "", end_date: "", bullets: [] };

function entrySubtitle(entry: ExperienceEntry): string {
  return [entry.role, entry.company].filter(Boolean).join(" · ");
}

// Experience is the one section with real nesting: each entry is a Company, which
// carries its own primary Position fields (role/dates/bullets) directly, plus an
// optional additional_positions: Position[] list for promotions within that same
// company (e.g. Senior -> Staff). The outer EntryRowShell per-company is the same
// pattern every other section uses; additional positions are rendered as their own
// small nested rows (no EntryRowShell - one level of hover-toolbar nesting is
// enough before it gets visually noisy) inside the expanded company card.
export default function ExperienceEditForm({ content, onChange, registerAdd }: ExperienceEditFormProps) {
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

  function updateEntry(index: number, patch: Partial<ExperienceEntry>) {
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

  function addPosition(index: number) {
    const positions = entries[index].additional_positions ?? [];
    updateEntry(index, { additional_positions: [...positions, { ...BLANK_POSITION }] });
  }

  function updatePosition(entryIndex: number, positionIndex: number, patch: Partial<Position>) {
    const positions = entries[entryIndex].additional_positions ?? [];
    updateEntry(entryIndex, {
      additional_positions: positions.map((position, i) => (i === positionIndex ? { ...position, ...patch } : position)),
    });
  }

  function removePosition(entryIndex: number, positionIndex: number) {
    const positions = entries[entryIndex].additional_positions ?? [];
    updateEntry(entryIndex, { additional_positions: positions.filter((_, i) => i !== positionIndex) });
  }

  if (entries.length === 0) {
    return <div style={{ fontSize: 12.5, color: "#9ca3af", padding: "4px 6px" }}>No work experience yet - use the + button above.</div>;
  }

  const ids = entries.map((_, index) => String(index));

  return (
    <SortableEntryList ids={ids} onReorder={reorderEntries}>
      {entries.map((entry, index) => (
        <EntryRowShell key={ids[index]} id={ids[index]} title={entry.company} subtitle={entrySubtitle(entry)} onDuplicate={() => duplicateEntry(index)} onRemove={() => removeEntry(index)}>
          <EditableField label="Company" value={entry.company} onChange={(v) => updateEntry(index, { company: v })} />
          <EditableField label="Company URL" value={entry.company_url ?? ""} onChange={(v) => updateEntry(index, { company_url: v })} placeholder="https://..." />
          <EditableField label="Role" value={entry.role} onChange={(v) => updateEntry(index, { role: v })} />
          <EditableField label="Location" value={entry.location} onChange={(v) => updateEntry(index, { location: v })} />
          <EditableField label="Start date" value={entry.start_date} onChange={(v) => updateEntry(index, { start_date: v })} placeholder="e.g. Mar 2024" />
          <EditableField label="End date" value={entry.end_date} onChange={(v) => updateEntry(index, { end_date: v })} placeholder="Leave blank for Present" />
          <BulletListEditor label="Achievements" items={entry.bullets} onChange={(bullets) => updateEntry(index, { bullets })} />

          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${editorTheme.border}` }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: editorTheme.textMuted, marginBottom: 6 }}>
              Additional positions at this company
            </div>
            {(entry.additional_positions ?? []).map((position, positionIndex) => (
              <div key={positionIndex} style={{ border: `1px solid ${editorTheme.border}`, borderRadius: 6, padding: 10, marginBottom: 8, position: "relative" }}>
                <button
                  type="button"
                  onClick={() => removePosition(index, positionIndex)}
                  title="Remove position"
                  style={{ position: "absolute", top: 6, right: 6, border: "none", background: "transparent", color: editorTheme.danger, cursor: "pointer", padding: 4 }}
                >
                  <Trash2 size={13} />
                </button>
                <div style={{ paddingRight: 28 }}>
                  <EditableField label="Role" value={position.role} onChange={(v) => updatePosition(index, positionIndex, { role: v })} />
                  <EditableField label="Start date" value={position.start_date} onChange={(v) => updatePosition(index, positionIndex, { start_date: v })} />
                  <EditableField label="End date" value={position.end_date} onChange={(v) => updatePosition(index, positionIndex, { end_date: v })} />
                  <BulletListEditor label="Achievements" items={position.bullets} onChange={(bullets) => updatePosition(index, positionIndex, { bullets })} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addPosition(index)}
              style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", color: editorTheme.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "2px 0" }}
            >
              <Plus size={13} /> Add position
            </button>
          </div>
        </EntryRowShell>
      ))}
    </SortableEntryList>
  );
}
