import Link from "next/link";

import ResumeInputForm from "@/components/ResumeInputForm";
import { SAMPLE_RESUMES } from "@/lib/dummyResumes";

export default function Home() {
  return (
    <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-2xl mb-8">
        <h1 className="text-2xl font-bold">AI Resume Builder</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Fill in your background below. The generator will turn your notes into a
          structured, themeable resume you can preview, edit, and export.
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Frontend-only demo build: resumes are generated locally with mock data and
          saved in this browser — no backend required.
        </p>
      </div>

      <div className="mx-auto max-w-2xl mb-10 rounded-md border border-neutral-200 p-4">
        <h2 className="text-sm font-semibold mb-2">Or jump straight into a sample resume</h2>
        <p className="text-xs text-neutral-500 mb-3">
          Each link opens a fully populated resume so you can try every template and section design without filling in the form.
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_RESUMES.map((sample) => (
            <Link
              key={sample.resume_id}
              href={`/resume/${sample.resume_id}`}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-500 hover:bg-neutral-50"
            >
              {sample.label}
            </Link>
          ))}
        </div>
      </div>

      <ResumeInputForm />
    </main>
  );
}
