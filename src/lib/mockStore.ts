// Frontend-only stand-in for the backend's resume database. Persists to this browser's
// localStorage instead of a server, so generated/edited resumes survive a page reload
// with no backend, no database, and no network calls involved.
import type { ResumeDocument, ResumeSection } from "@/types/resume";
import { seedSampleResumes } from "./dummyResumes";

const STORAGE_KEY = "resume_builder_mock_store_v1";

type ResumeStore = Record<string, ResumeDocument>;

function readStore(): ResumeStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResumeStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ResumeStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function ensureSeeded(store: ResumeStore): ResumeStore {
  let changed = false;
  for (const doc of seedSampleResumes()) {
    if (!store[doc.resume_id]) {
      store[doc.resume_id] = doc;
      changed = true;
    }
  }
  if (changed) writeStore(store);
  return store;
}

export function getMockResume(resumeId: string): ResumeDocument | undefined {
  const store = ensureSeeded(readStore());
  return store[resumeId];
}

// Drops one resume from the store so the next getMockResume() call reseeds it fresh
// from dummyResumes.ts - useful while iterating on seed data, since ensureSeeded()
// otherwise only seeds resume_ids not already present (it never overwrites existing
// entries, including ones a previous session already seeded before a dummyResumes.ts
// edit landed).
export function resetMockResume(resumeId: string): void {
  const store = readStore();
  if (store[resumeId]) {
    delete store[resumeId];
    writeStore(store);
  }
}

export function createMockResume(doc: ResumeDocument): ResumeDocument {
  const store = ensureSeeded(readStore());
  store[doc.resume_id] = doc;
  writeStore(store);
  return doc;
}

export function updateMockResume(
  resumeId: string,
  sections: ResumeSection[],
  theme?: string,
  templateId?: string,
): ResumeDocument | undefined {
  const store = ensureSeeded(readStore());
  const existing = store[resumeId];
  if (!existing) return undefined;

  const updated: ResumeDocument = {
    ...existing,
    sections,
    theme: theme ?? existing.theme,
    template_id: templateId ?? existing.template_id,
    updated_at: new Date().toISOString(),
  };
  store[resumeId] = updated;
  writeStore(store);
  return updated;
}
