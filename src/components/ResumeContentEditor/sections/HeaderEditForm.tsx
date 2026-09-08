"use client";

import type { HeaderContent } from "@/types/resume";
import EditableField from "@/components/ResumeContentEditor/shared/EditableField";

type HeaderEditFormProps = {
  content: HeaderContent;
  onChange: (content: HeaderContent) => void;
};

// Header has no list of entries (it's one object), so it renders its fields
// directly inside the section row - no EntryRowShell/registerAdd needed, unlike
// every list-based section. Live onChange, same as the rest.
export default function HeaderEditForm({ content, onChange }: HeaderEditFormProps) {
  function set<K extends keyof HeaderContent>(key: K, value: HeaderContent[K]) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div style={{ padding: "4px 6px 10px" }}>
      <EditableField label="Full name" value={content.full_name} onChange={(v) => set("full_name", v)} />
      <EditableField label="Title" value={content.title} onChange={(v) => set("title", v)} placeholder="e.g. Senior Software Engineer" />
      <EditableField label="Email" value={content.email} onChange={(v) => set("email", v)} />
      <EditableField label="Phone" value={content.phone} onChange={(v) => set("phone", v)} />
      <EditableField label="Location" value={content.location} onChange={(v) => set("location", v)} />
      <EditableField label="LinkedIn URL" value={content.linkedin_url ?? ""} onChange={(v) => set("linkedin_url", v)} placeholder="linkedin.com/in/..." />
      <EditableField label="Portfolio URL" value={content.portfolio_url ?? ""} onChange={(v) => set("portfolio_url", v)} placeholder="https://..." />
      <EditableField label="Photo URL" value={content.photo_url ?? ""} onChange={(v) => set("photo_url", v)} placeholder="https://..." />
    </div>
  );
}
