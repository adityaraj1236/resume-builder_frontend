"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  CertificationEntryInput,
  EducationEntryInput,
  ExperienceEntryInput,
  PersonalInfo,
  PositionInput,
  ProjectEntryInput,
  PublicationEntryInput,
  ResumeGenerateRequest,
} from "@/types/resume";
import { generateResume } from "@/lib/api";

const emptyExperience = (): ExperienceEntryInput => ({
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  raw_notes: "",
  additional_positions: [],
});

const emptyPosition = (): PositionInput => ({
  role: "",
  start_date: "",
  end_date: "",
  raw_notes: "",
});

const emptyEducation = (): EducationEntryInput => ({
  institution: "",
  degree: "",
  field_of_study: "",
  location: "",
  start_date: "",
  end_date: "",
  gpa: "",
  notes: "",
});

const emptyProject = (): ProjectEntryInput => ({
  name: "",
  description_notes: "",
  tech_stack: [],
  link: "",
});

const emptyCertification = (): CertificationEntryInput => ({
  name: "",
  issuer: "",
  date: "",
});

const emptyPublication = (): PublicationEntryInput => ({
  title: "",
  publisher: "",
  date: "",
  link: "",
  description_notes: "",
});

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none";
const labelClass = "block text-xs font-medium text-neutral-600 mb-1";

export default function ResumeInputForm() {
  const router = useRouter();

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    photo_url: "",
    summary_notes: "",
  });
  const [workExperience, setWorkExperience] = useState<ExperienceEntryInput[]>([emptyExperience()]);
  const [education, setEducation] = useState<EducationEntryInput[]>([emptyEducation()]);
  const [skillsText, setSkillsText] = useState("");
  const [projects, setProjects] = useState<ProjectEntryInput[]>([]);
  const [certifications, setCertifications] = useState<CertificationEntryInput[]>([]);
  const [publications, setPublications] = useState<PublicationEntryInput[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateAt<T>(list: T[], index: number, patch: Partial<T>): T[] {
    return list.map((item, i) => (i === index ? { ...item, ...patch } : item));
  }

  function updatePositionAt(experienceIndex: number, positionIndex: number, patch: Partial<PositionInput>) {
    setWorkExperience(
      updateAt(workExperience, experienceIndex, {
        additional_positions: updateAt(workExperience[experienceIndex].additional_positions ?? [], positionIndex, patch),
      }),
    );
  }

  function addPosition(experienceIndex: number) {
    setWorkExperience(
      updateAt(workExperience, experienceIndex, {
        additional_positions: [...(workExperience[experienceIndex].additional_positions ?? []), emptyPosition()],
      }),
    );
  }

  function removePosition(experienceIndex: number, positionIndex: number) {
    setWorkExperience(
      updateAt(workExperience, experienceIndex, {
        additional_positions: (workExperience[experienceIndex].additional_positions ?? []).filter((_, i) => i !== positionIndex),
      }),
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const request: ResumeGenerateRequest = {
      personal_info: personalInfo,
      work_experience: workExperience.filter((e) => e.company || e.role),
      education: education.filter((e) => e.institution || e.degree),
      skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
      projects: projects.filter((p) => p.name),
      certifications: certifications.filter((certification) => certification.name),
      publications: publications.filter((p) => p.title),
      target_role: targetRole || undefined,
      job_description: jobDescription || undefined,
    };

    try {
      const doc = await generateResume(request);
      router.push(`/resume/${doc.resume_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate resume");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8 pb-24">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Personal info</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Full name *</label>
            <input
              required
              className={inputClass}
              value={personalInfo.full_name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input
              required
              type="email"
              className={inputClass}
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              className={inputClass}
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={personalInfo.location}
              onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input
              className={inputClass}
              value={personalInfo.linkedin_url}
              onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin_url: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Portfolio URL</label>
            <input
              className={inputClass}
              value={personalInfo.portfolio_url}
              onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio_url: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Photo URL (optional)</label>
            <input
              className={inputClass}
              placeholder="https://images.pexels.com/photos/..."
              value={personalInfo.photo_url}
              onChange={(e) => setPersonalInfo({ ...personalInfo, photo_url: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Notes for your summary (a few sentences about your background)</label>
          <textarea
            className={inputClass}
            rows={3}
            value={personalInfo.summary_notes}
            onChange={(e) => setPersonalInfo({ ...personalInfo, summary_notes: e.target.value })}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Work experience</h2>
          <button
            type="button"
            onClick={() => setWorkExperience([...workExperience, emptyExperience()])}
            className="text-sm text-blue-600"
          >
            + Add role
          </button>
        </div>
        {workExperience.map((entry, index) => (
          <div key={index} className="space-y-2 rounded-md border border-neutral-200 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Company</label>
                <input
                  className={inputClass}
                  value={entry.company}
                  onChange={(e) => setWorkExperience(updateAt(workExperience, index, { company: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <input
                  className={inputClass}
                  value={entry.role}
                  onChange={(e) => setWorkExperience(updateAt(workExperience, index, { role: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  className={inputClass}
                  value={entry.location}
                  onChange={(e) => setWorkExperience(updateAt(workExperience, index, { location: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Start date</label>
                  <input
                    className={inputClass}
                    placeholder="Jan 2021"
                    value={entry.start_date}
                    onChange={(e) => setWorkExperience(updateAt(workExperience, index, { start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>End date</label>
                  <input
                    className={inputClass}
                    placeholder="Present"
                    value={entry.end_date}
                    onChange={(e) => setWorkExperience(updateAt(workExperience, index, { end_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Raw notes (what you did - the AI will turn this into polished bullets)</label>
              <textarea
                className={inputClass}
                rows={3}
                value={entry.raw_notes}
                onChange={(e) => setWorkExperience(updateAt(workExperience, index, { raw_notes: e.target.value }))}
              />
            </div>

            {(entry.additional_positions ?? []).length > 0 ? (
              <div className="space-y-2 border-l-2 border-neutral-200 pl-3">
                <label className={labelClass}>Other roles held at this company (promotions, etc.)</label>
                {(entry.additional_positions ?? []).map((position, posIndex) => (
                  <div key={posIndex} className="space-y-2 rounded-md border border-neutral-200 p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Role</label>
                        <input
                          className={inputClass}
                          value={position.role}
                          onChange={(e) => updatePositionAt(index, posIndex, { role: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelClass}>Start date</label>
                          <input
                            className={inputClass}
                            placeholder="Jan 2021"
                            value={position.start_date}
                            onChange={(e) => updatePositionAt(index, posIndex, { start_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>End date</label>
                          <input
                            className={inputClass}
                            placeholder="Present"
                            value={position.end_date}
                            onChange={(e) => updatePositionAt(index, posIndex, { end_date: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Raw notes for this role</label>
                      <textarea
                        className={inputClass}
                        rows={2}
                        value={position.raw_notes}
                        onChange={(e) => updatePositionAt(index, posIndex, { raw_notes: e.target.value })}
                      />
                    </div>
                    <button type="button" onClick={() => removePosition(index, posIndex)} className="text-xs text-red-600">
                      Remove this role
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => addPosition(index)} className="text-xs text-blue-600">
                + Add another role at this company
              </button>
              {workExperience.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setWorkExperience(workExperience.filter((_, i) => i !== index))}
                  className="text-xs text-red-600"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Education</h2>
          <button
            type="button"
            onClick={() => setEducation([...education, emptyEducation()])}
            className="text-sm text-blue-600"
          >
            + Add degree
          </button>
        </div>
        {education.map((entry, index) => (
          <div key={index} className="space-y-2 rounded-md border border-neutral-200 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Institution</label>
                <input
                  className={inputClass}
                  value={entry.institution}
                  onChange={(e) => setEducation(updateAt(education, index, { institution: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Degree</label>
                <input
                  className={inputClass}
                  value={entry.degree}
                  onChange={(e) => setEducation(updateAt(education, index, { degree: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Field of study</label>
                <input
                  className={inputClass}
                  value={entry.field_of_study}
                  onChange={(e) => setEducation(updateAt(education, index, { field_of_study: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  className={inputClass}
                  value={entry.location}
                  onChange={(e) => setEducation(updateAt(education, index, { location: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>GPA / Grade (optional)</label>
                <input
                  className={inputClass}
                  value={entry.gpa}
                  onChange={(e) => setEducation(updateAt(education, index, { gpa: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>Start date</label>
                  <input
                    className={inputClass}
                    value={entry.start_date}
                    onChange={(e) => setEducation(updateAt(education, index, { start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass}>End date</label>
                  <input
                    className={inputClass}
                    value={entry.end_date}
                    onChange={(e) => setEducation(updateAt(education, index, { end_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            {education.length > 1 ? (
              <button
                type="button"
                onClick={() => setEducation(education.filter((_, i) => i !== index))}
                className="text-xs text-red-600"
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div>
          <label className={labelClass}>Comma-separated list</label>
          <input
            className={inputClass}
            placeholder="Python, TypeScript, React, SQL"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects (optional)</h2>
          <button
            type="button"
            onClick={() => setProjects([...projects, emptyProject()])}
            className="text-sm text-blue-600"
          >
            + Add project
          </button>
        </div>
        {projects.map((entry, index) => (
          <div key={index} className="space-y-2 rounded-md border border-neutral-200 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={inputClass}
                  value={entry.name}
                  onChange={(e) => setProjects(updateAt(projects, index, { name: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <input
                  className={inputClass}
                  value={entry.link}
                  onChange={(e) => setProjects(updateAt(projects, index, { link: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Tech stack (comma-separated)</label>
                <input
                  className={inputClass}
                  value={entry.tech_stack.join(", ")}
                  onChange={(e) =>
                    setProjects(
                      updateAt(projects, index, {
                        tech_stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      }),
                    )
                  }
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Raw description notes</label>
              <textarea
                className={inputClass}
                rows={2}
                value={entry.description_notes}
                onChange={(e) => setProjects(updateAt(projects, index, { description_notes: e.target.value }))}
              />
            </div>
            <button
              type="button"
              onClick={() => setProjects(projects.filter((_, i) => i !== index))}
              className="text-xs text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Certifications (optional)</h2>
          <button
            type="button"
            onClick={() => setCertifications([...certifications, emptyCertification()])}
            className="text-sm text-blue-600"
          >
            + Add certification
          </button>
        </div>
        {certifications.map((entry, index) => (
          <div key={index} className="grid grid-cols-3 gap-3 rounded-md border border-neutral-200 p-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                value={entry.name}
                onChange={(e) => setCertifications(updateAt(certifications, index, { name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Issuer</label>
              <input
                className={inputClass}
                value={entry.issuer}
                onChange={(e) => setCertifications(updateAt(certifications, index, { issuer: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input
                className={inputClass}
                value={entry.date}
                onChange={(e) => setCertifications(updateAt(certifications, index, { date: e.target.value }))}
              />
            </div>
            <button
              type="button"
              onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
              className="col-span-3 text-left text-xs text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Publications (optional)</h2>
          <button
            type="button"
            onClick={() => setPublications([...publications, emptyPublication()])}
            className="text-sm text-blue-600"
          >
            + Add publication
          </button>
        </div>
        {publications.map((entry, index) => (
          <div key={index} className="space-y-2 rounded-md border border-neutral-200 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  className={inputClass}
                  value={entry.title}
                  onChange={(e) => setPublications(updateAt(publications, index, { title: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Publisher / Venue</label>
                <input
                  className={inputClass}
                  value={entry.publisher}
                  onChange={(e) => setPublications(updateAt(publications, index, { publisher: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  className={inputClass}
                  value={entry.date}
                  onChange={(e) => setPublications(updateAt(publications, index, { date: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Link (optional)</label>
                <input
                  className={inputClass}
                  value={entry.link}
                  onChange={(e) => setPublications(updateAt(publications, index, { link: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Raw description notes (optional)</label>
              <textarea
                className={inputClass}
                rows={2}
                value={entry.description_notes}
                onChange={(e) => setPublications(updateAt(publications, index, { description_notes: e.target.value }))}
              />
            </div>
            <button
              type="button"
              onClick={() => setPublications(publications.filter((_, i) => i !== index))}
              className="text-xs text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Target role (optional)</h2>
        <div>
          <label className={labelClass}>Target job title</label>
          <input className={inputClass} value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Job description to tailor toward</label>
          <textarea
            className={inputClass}
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        {submitting ? "Generating resume..." : "Generate resume"}
      </button>
    </form>
  );
}
