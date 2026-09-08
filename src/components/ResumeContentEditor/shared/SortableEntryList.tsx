"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

type SortableEntryListProps = {
  // Stable string ids, one per entry, index-aligned with the array being reordered -
  // array index alone can't be used as the drag id (it changes on every reorder),
  // so callers pass e.g. entries.map((_, i) => String(i)) recomputed each render, or
  // a real per-entry key if one exists.
  ids: string[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
};

// Wraps a section's entries.map(...) (rendering one EntryRowShell per entry) in
// dnd-kit's DndContext + SortableContext, so each row's grip handle can drag-reorder
// it within the list. `onReorder` receives the old/new index; the caller (each
// section's *EditForm) is the one that actually knows how to splice its own
// entries array and call onChange - this component only detects the drag gesture.
export default function SortableEntryList({ ids, onReorder, children }: SortableEntryListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = ids.indexOf(String(active.id));
    const toIndex = ids.indexOf(String(over.id));
    if (fromIndex === -1 || toIndex === -1) return;
    onReorder(fromIndex, toIndex);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

// Re-exported so a section's *EditForm can reorder its own array without importing
// dnd-kit directly.
export { arrayMove };
