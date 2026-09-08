"use client";

import { useState } from "react";
import { Pencil, Copy, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { editorTheme } from "@/components/ResumeContentEditor/shared/editorTheme";

// One list entry, Teal-style: a borderless summary row (title + subtitle) with an
// icon toolbar that appears on hover - edit (expands the row in place to reveal
// `children`, the entry's editable fields), duplicate, and delete. The grip icon is
// the actual drag handle (via dnd-kit's useSortable) - dragging it reorders this
// entry within its section's list; see SortableEntryList, which wraps a section's
// whole entries.map(...) in the DndContext/SortableContext this needs.
type EntryRowShellProps = {
  id: string;
  title: string;
  subtitle?: string;
  onDuplicate?: () => void;
  onRemove: () => void;
  children: React.ReactNode;
};

export default function EntryRowShell({ id, title, subtitle, onDuplicate, onRemove, children }: EntryRowShellProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const rowStyle: React.CSSProperties = {
    borderRadius: editorTheme.rowRadius,
    background: expanded ? "#fafafa" : "transparent",
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={rowStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", cursor: "pointer" }} onClick={() => setExpanded((v) => !v)}>
        <span {...attributes} {...listeners} onClick={(event) => event.stopPropagation()} style={{ display: "flex", flexShrink: 0, cursor: "grab", touchAction: "none" }}>
          <GripVertical size={14} color={editorTheme.textFaint} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title || "Untitled"}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 12, color: editorTheme.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 2, opacity: hovered || expanded ? 1 : 0, transition: "opacity 0.1s" }}>
          <IconButton
            title="Edit"
            active={expanded}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(true);
            }}
          >
            <Pencil size={14} />
          </IconButton>
          {onDuplicate ? (
            <IconButton
              title="Duplicate"
              onClick={(event) => {
                event.stopPropagation();
                onDuplicate();
              }}
            >
              <Copy size={14} />
            </IconButton>
          ) : null}
          <IconButton
            title="Delete"
            danger
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 size={14} />
          </IconButton>
        </div>
      </div>

      {expanded ? <div style={{ padding: "4px 12px 14px 26px" }}>{children}</div> : null}
    </div>
  );
}

function IconButton({
  children,
  title,
  onClick,
  danger,
  active,
}: {
  children: React.ReactNode;
  title: string;
  onClick: (event: React.MouseEvent) => void;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        border: "none",
        background: active ? editorTheme.accentSoft : "transparent",
        color: danger ? editorTheme.danger : active ? editorTheme.accent : "#4b5563",
        borderRadius: 6,
        width: 26,
        height: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
