// Frontend-only replacement for the original backend-backed API client. Same exported
// function signatures as before (generateResume/getResume/updateResume/getDesignRegistry)
// so every caller (ResumeInputForm, ResumeRenderer) works unchanged - only the
// implementation moved from `fetch(...)` against a FastAPI backend to local mock data
// and browser localStorage. No network calls, no backend, no env vars.
import type {
  DesignRegistryResponse,
  ResumeDocument,
  ResumeGenerateRequest,
  ResumeSection,
} from "@/types/resume";
import { generateMockResume } from "./mockGenerate";
import { createMockResume, getMockResume, updateMockResume } from "./mockStore";
import { getDesignRegistrySnapshot } from "./designRegistry";

// A tiny artificial delay so loading states in the UI (buttons/spinners built for a
// real network round trip) still have something to show, instead of resolving instantly.
const MOCK_DELAY_MS = 250;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

export async function generateResume(request: ResumeGenerateRequest): Promise<ResumeDocument> {
  const doc = generateMockResume(request);
  createMockResume(doc);
  return delay(doc);
}

export async function getResume(resumeId: string): Promise<ResumeDocument> {
  const doc = getMockResume(resumeId);
  if (!doc) {
    throw new Error(`Request failed (404): resume "${resumeId}" not found`);
  }
  return delay(doc);
}

export async function updateResume(
  resumeId: string,
  sections: ResumeSection[],
  theme?: string,
  templateId?: string,
): Promise<ResumeDocument> {
  const doc = updateMockResume(resumeId, sections, theme, templateId);
  if (!doc) {
    throw new Error(`Request failed (404): resume "${resumeId}" not found`);
  }
  return delay(doc);
}

export async function getDesignRegistry(): Promise<DesignRegistryResponse> {
  return delay(getDesignRegistrySnapshot());
}
