"use client";

// Mock data (the resume store) lives in localStorage, which only exists in the
// browser - so unlike the original backend-backed version, this page can no longer be
// a server component doing an async fetch before render. It loads client-side instead
// and shows a brief loading/not-found state, but calls the same src/lib/api.ts
// functions (getResume/getDesignRegistry) and hands the result to the unchanged
// ResumeRenderer exactly as before.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import ResumeRenderer from "@/components/ResumeRenderer";
import { getDesignRegistry, getResume } from "@/lib/api";
import type { DesignRegistryResponse, ResumeDocument } from "@/types/resume";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "ready"; document: ResumeDocument; designRegistry: DesignRegistryResponse };

export default function ResumePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    async function load() {
      try {
        const [document, designRegistry] = await Promise.all([getResume(id), getDesignRegistry()]);
        if (!cancelled) setState({ status: "ready", document, designRegistry });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof Error && err.message.includes("(404)")) {
          setState({ status: "not-found" });
        } else {
          setState({ status: "error", message: err instanceof Error ? err.message : "Failed to load resume" });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <main className="flex-1 bg-neutral-100 px-6 py-10">
        <p className="mx-auto max-w-2xl text-sm text-neutral-600">Loading resume…</p>
      </main>
    );
  }

  if (state.status === "not-found") {
    return (
      <main className="flex-1 bg-neutral-100 px-6 py-10">
        <div className="mx-auto max-w-2xl space-y-3">
          <h1 className="text-lg font-semibold">Resume not found</h1>
          <p className="text-sm text-neutral-600">
            No resume exists with id &quot;{id}&quot; in this browser&apos;s local storage. It may have been
            generated in a different browser, or storage may have been cleared.
          </p>
          <Link href="/" className="text-sm text-blue-600 underline">
            Back to Resume Builder
          </Link>
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="flex-1 bg-neutral-100 px-6 py-10">
        <p className="mx-auto max-w-2xl text-sm text-red-600">{state.message}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-neutral-100 px-6 py-10 print:bg-white print:p-0">
      <ResumeRenderer initialDocument={state.document} designRegistry={state.designRegistry} />
    </main>
  );
}
