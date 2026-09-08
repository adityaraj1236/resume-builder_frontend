"use client";

import { useEffect, useRef } from "react";
import type { SkillCategory, SkillsContent } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";
import EntryRowShell from "@/components/ResumeContentEditor/shared/EntryRowShell";
import SortableEntryList, { arrayMove } from "@/components/ResumeContentEditor/shared/SortableEntryList";

type SkillsEditFormProps = {
  content: SkillsContent;
  onChange: (content: SkillsContent) => void;
  registerAdd: (add: () => void) => void;
};

const BLANK_CATEGORY: SkillCategory = { category_name: "", skills: [] };

// Skills is edited one category per row (e.g. "Languages", "Frameworks"), each with
// a comma-separated skills text field - matches the same comma-list convention the
// old ContentEditorPanel used, since a per-skill row editor would be a much bigger
// change for little benefit here. levels/icons (index-aligned proficiency/logo
// arrays) aren't editable as text - those are set by clicking directly on the
// rendered skill on the resume (SkillMeter drag, IconUpload click).
export default function SkillsEditForm({ content, onChange, registerAdd }: SkillsEditFormProps) {
  const categories = content.categories;
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    registerAdd(() => {
      onChangeRef.current({ ...content, categories: [...content.categories, { ...BLANK_CATEGORY }] });
    });
  }, [registerAdd, content]);

  function updateCategory(index: number, patch: Partial<SkillCategory>) {
    onChange({ ...content, categories: categories.map((category, i) => (i === index ? { ...category, ...patch } : category)) });
  }

  function removeCategory(index: number) {
    onChange({ ...content, categories: categories.filter((_, i) => i !== index) });
  }

  function duplicateCategory(index: number) {
    const copy = { ...categories[index] };
    onChange({ ...content, categories: [...categories.slice(0, index + 1), copy, ...categories.slice(index + 1)] });
  }

  function reorderCategories(fromIndex: number, toIndex: number) {
    onChange({ ...content, categories: arrayMove(categories, fromIndex, toIndex) });
  }

  if (categories.length === 0) {
    return <div style={{ fontSize: 12.5, color: "#9ca3af", padding: "4px 6px" }}>No skill categories yet - use the + button above.</div>;
  }

  const ids = categories.map((_, index) => String(index));

  return (
    <SortableEntryList ids={ids} onReorder={reorderCategories}>
      {categories.map((category, index) => (
        <EntryRowShell
          key={ids[index]}
          id={ids[index]}
          title={category.category_name}
          subtitle={category.skills.join(", ")}
          onDuplicate={() => duplicateCategory(index)}
          onRemove={() => removeCategory(index)}
        >
          <EditableField label="Category name" value={category.category_name} onChange={(v) => updateCategory(index, { category_name: v })} placeholder="e.g. Languages" />
          <EditableField
            label="Skills (comma-separated)"
            value={category.skills.join(", ")}
            onChange={(v) => updateCategory(index, { skills: v.split(",").map((s) => s.trim()).filter(Boolean) })}
            multiline
          />
        </EntryRowShell>
      ))}
    </SortableEntryList>
  );
}
