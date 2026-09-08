// Well-structured dummy resumes used in place of backend-generated data. Seeded into
// the mock store (see mockStore.ts) so every template/design combination can be
// opened and tested immediately, with no form filling and no backend required.
import type {
  AchievementEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  PublicationEntry,
  ResumeDocument,
  ResumeSection,
  SectionType,
  SkillCategory,
} from "@/types/resume";
import { SECTION_DEFAULT_TITLES } from "@/types/resume";
import { DEFAULT_SECTION_DESIGN, SECTION_TYPES } from "./designRegistry";

type PersonaHeader = {
  full_name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  photo_url: string;
};

type PersonaSummary = {
  professional_title: string;
  years_of_experience: string;
  summary: string;
};

type Persona = {
  header: PersonaHeader;
  summary: PersonaSummary;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  publications: PublicationEntry[];
  achievements: AchievementEntry[];
};

// Persona A - experienced engineer with a promotion at their current company, used to
// exercise additional_positions (nested Entry rendering) across every design/template.
const experienced: Persona = {
  header: {
    full_name: "Jordan Avery",
    title: "Senior Software Engineer",
    email: "jordan.avery@example.com",
    phone: "+1 (555) 214-7788",
    location: "Austin, TX",
    linkedin_url: "linkedin.com/in/jordanavery",
    portfolio_url: "jordanavery.dev",
    photo_url: "",
  },
  summary: {
    professional_title: "Senior Software Engineer",
    years_of_experience: "8+ years",
    summary:
      "Backend-focused engineer with **8+ years** building distributed systems and developer platforms. Led the migration of a monolith to microservices that cut deployment time by 70%, and mentors junior engineers across two teams. Comfortable owning a service from design doc through on-call.",
  },
  experience: [
    {
      company: "Northwind Analytics",
      company_url: "northwindanalytics.com",
      role: "Staff Software Engineer",
      location: "Austin, TX (Remote)",
      start_date: "Mar 2024",
      end_date: "",
      bullets: [
        "**Reduced end-to-end latency from 40 minutes to under 3 minutes** by leading the redesign of the ingestion pipeline.",
        "**Cut incident response time in half** by introducing a service-ownership model adopted by 6 teams.",
        "Mentored 4 engineers through promotion to mid-level within 18 months.",
      ],
      additional_positions: [
        {
          role: "Senior Software Engineer",
          start_date: "Jun 2022",
          end_date: "Mar 2024",
          bullets: [
            "Owned the checkout service supporting $40M in annual GMV.",
            "Drove adoption of contract testing across 5 services, eliminating a class of integration bugs.",
          ],
        },
      ],
    },
    {
      company: "Beacon Software",
      company_url: "beaconsoftware.io",
      role: "Software Engineer II",
      location: "Remote",
      start_date: "Aug 2019",
      end_date: "May 2022",
      bullets: [
        "Built a real-time notifications service handling 2M+ events/day on Kafka.",
        "Reduced p95 API latency by 35% by introducing read replicas and query caching.",
        "Shipped the company's first public API and accompanying developer docs.",
      ],
      additional_positions: [],
    },
    {
      company: "Delta Systems",
      role: "Junior Software Engineer",
      location: "Chicago, IL",
      start_date: "Jul 2017",
      end_date: "Jul 2019",
      bullets: [
        "Implemented an automated regression test suite that cut manual QA time by 20 hours/week.",
        "Fixed 50+ customer-reported defects across the billing and reporting modules.",
      ],
      additional_positions: [],
    },
  ],
  education: [
    {
      institution: "University of Illinois Urbana-Champaign",
      degree: "B.S.",
      field_of_study: "Computer Science",
      location: "Urbana, IL",
      start_date: "Aug 2013",
      end_date: "May 2017",
      gpa: "3.7",
      notes: "Minor in Mathematics",
    },
  ],
  skills: [
    {
      category_name: "Languages",
      skills: ["TypeScript", "Python", "Go", "SQL"],
      // Placeholder proficiency - real values will come from the backend once it
      // starts sending SkillCategory.levels; UI support (SkillBar) is in place either way.
      levels: [92, 85, 70, 88],
    },
    { category_name: "Frameworks & Libraries", skills: ["React", "Node.js", "FastAPI", "Next.js"], levels: [90, 88, 78, 82] },
    { category_name: "Cloud & Infrastructure", skills: ["AWS", "Docker", "Kubernetes", "Terraform"], levels: [85, 90, 80, 72] },
    { category_name: "Practices", skills: ["System Design", "CI/CD", "Mentorship", "Incident Response"], levels: [88, 84, 90, 86] },
  ],
  projects: [
    {
      name: "Open Source: pgqueue",
      description: "A lightweight Postgres-backed job queue for Node.js with at-least-once delivery and a monitoring dashboard.",
      tech_stack: ["TypeScript", "PostgreSQL", "Node.js"],
      link: "github.com/jordanavery/pgqueue",
    },
    {
      name: "Latency Budget Tracker",
      description: "Internal tool that tracks per-service latency budgets and pages owners automatically on regression.",
      tech_stack: ["Python", "Grafana", "Prometheus"],
      link: "",
    },
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect â€“ Associate", issuer: "Amazon Web Services", date: "2023", link: "aws.amazon.com/certification" },
    { name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2022" },
    { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", date: "2021" },
  ],
  publications: [
    {
      title: "Reducing Tail Latency in Multi-Tenant Queues",
      publisher: "QCon Austin",
      date: "2023",
      link: "",
      description: "Conference talk on backpressure and fair scheduling strategies for shared job queues.",
    },
    {
      title: "A Practical Guide to Contract Testing",
      publisher: "Beacon Engineering Blog",
      date: "2021",
      link: "",
      description: "Case study on rolling out consumer-driven contract tests across five services.",
    },
  ],
  achievements: [
    { title: "Hackathon Winner, TechCrunch Disrupt", description: "Led a 4-person team to first place building a real-time incident-triage tool in 24 hours." },
    { title: "Engineering All-Hands Speaker", description: "Presented the ingestion pipeline redesign to 200+ engineers at the company-wide quarterly all-hands." },
    { title: "Member, ACM", description: "Active member of the Association for Computing Machinery, participating in workshops and tech talks." },
  ],
};

// Persona B - early-career candidate, used for the Photo Timeline template which is
// designed around a career objective and a projects/internships-forward layout.
const earlyCareer: Persona = {
  header: {
    full_name: "Maya Chen",
    title: "Aspiring Frontend Developer",
    email: "maya.chen@example.com",
    phone: "+1 (555) 908-2231",
    location: "Seattle, WA",
    linkedin_url: "linkedin.com/in/mayachen",
    portfolio_url: "mayachen.dev",
    photo_url: "",
  },
  summary: {
    professional_title: "",
    years_of_experience: "",
    summary:
      "Computer Science graduate passionate about building accessible, delightful web interfaces. Seeking a frontend or full-stack role where I can grow alongside an experienced engineering team.",
  },
  experience: [
    {
      company: "Cascade Retail Co.",
      role: "Software Engineering Intern",
      location: "Seattle, WA",
      start_date: "Jun 2025",
      end_date: "Aug 2025",
      bullets: [
        "Built a reusable component library used across 3 internal admin tools.",
        "Partnered with design to implement a fully accessible checkout flow (WCAG 2.1 AA).",
      ],
      additional_positions: [],
    },
  ],
  education: [
    {
      institution: "University of Washington",
      degree: "B.S.",
      field_of_study: "Computer Science",
      location: "Seattle, WA",
      start_date: "Sep 2021",
      end_date: "Jun 2025",
      gpa: "3.8",
      notes: "Data Structures & Algorithms, Software Engineering, Web Development, Database Management Systems",
    },
  ],
  skills: [
    {
      category_name: "Soft Skills",
      skills: ["Critical Thinking", "Leadership", "Creativity", "Teamwork", "Adaptability"],
      // Placeholder proficiency - real values will come from the backend once it
      // starts sending SkillCategory.levels; UI support (SkillMeter) is in place either way.
      levels: [90, 75, 85, 80, 70],
    },
    { category_name: "Tech Skills", skills: ["React", "TypeScript", "CSS", "Git", "Figma", "Jest"] },
  ],
  projects: [
    {
      name: "Campus Event Finder",
      description: "A React + Firebase app that helped 500+ students discover campus events.",
      tech_stack: ["React", "Firebase"],
      link: "github.com/mayachen/campus-events",
    },
    {
      name: "A11y Audit Bot",
      description: "A CLI tool that scans a site for common accessibility violations.",
      tech_stack: ["Node.js", "Puppeteer"],
      link: "",
    },
  ],
  certifications: [
    { name: "freeCodeCamp Responsive Web Design", issuer: "freeCodeCamp", date: "2024" },
    { name: "Google UX Design Certificate", issuer: "Google", date: "2023" },
    { name: "Meta Front-End Developer", issuer: "Meta", date: "2022" },
  ],
  publications: [],
  achievements: [],
};

function buildSections(persona: Persona, designOverrides: Partial<Record<SectionType, string>> = {}): ResumeSection[] {
  const contentByType: Record<SectionType, Record<string, unknown>> = {
    header: persona.header,
    summary: persona.summary,
    experience: { title: SECTION_DEFAULT_TITLES.experience, entries: persona.experience },
    education: { title: SECTION_DEFAULT_TITLES.education, entries: persona.education },
    skills: { title: SECTION_DEFAULT_TITLES.skills, categories: persona.skills },
    projects: { title: SECTION_DEFAULT_TITLES.projects, entries: persona.projects },
    certifications: { title: SECTION_DEFAULT_TITLES.certifications, entries: persona.certifications },
    publications: { title: SECTION_DEFAULT_TITLES.publications, entries: persona.publications },
    achievements: { title: SECTION_DEFAULT_TITLES.achievements, entries: persona.achievements },
  };

  return SECTION_TYPES.map((sectionType, index) => ({
    section_key: sectionType,
    section_type: sectionType,
    design_id: designOverrides[sectionType] ?? DEFAULT_SECTION_DESIGN[sectionType],
    order: index,
    content: contentByType[sectionType],
  }));
}

function buildDocument(
  resumeId: string,
  persona: Persona,
  templateId: string,
  theme: string,
  targetRole: string,
  designOverrides?: Partial<Record<SectionType, string>>,
): ResumeDocument {
  const timestamp = "2026-08-15T00:00:00.000Z";
  return {
    resume_id: resumeId,
    sections: buildSections(persona, designOverrides),
    theme,
    template_id: templateId,
    target_role: targetRole,
    created_at: timestamp,
    updated_at: timestamp,
  };
}

export const SAMPLE_RESUMES: { resume_id: string; label: string }[] = [
  { resume_id: "sample-sections", label: "Sections — default designs" },
  { resume_id: "sample-sections-compact", label: "Sections — compact experience" },
  { resume_id: "sample-two-column-icon", label: "Two-Column Icon" },
  { resume_id: "sample-student-sidebar", label: "Student Sidebar" },
  { resume_id: "sample-portfolio-blob", label: "Portfolio Blob" },
  { resume_id: "sample-icon-rail", label: "Icon Rail" },
  { resume_id: "sample-centered-timeline", label: "Centered Timeline" },
  { resume_id: "sample-icon-line", label: "Icon Line" },
];

export function seedSampleResumes(): ResumeDocument[] {
  return [
    buildDocument("sample-sections", experienced, "sections", "classic", "Staff Software Engineer"),
    buildDocument("sample-sections-compact", earlyCareer, "sections", "minimal", "Frontend Developer"),
    buildDocument("sample-two-column-icon", experienced, "two-column-icon-v1", "modern", "Staff Software Engineer"),
    buildDocument("sample-student-sidebar", earlyCareer, "student-sidebar-v1", "modern", "Frontend Developer"),
    buildDocument("sample-portfolio-blob", earlyCareer, "portfolio-blob-v1", "modern", "Frontend Developer"),
    buildDocument("sample-icon-rail", experienced, "icon-rail-v1", "classic", "Senior Software Engineer"),
    buildDocument("sample-centered-timeline", experienced, "centered-timeline-v1", "classic", "Senior Software Engineer"),
    buildDocument("sample-icon-line", experienced, "icon-line-v1", "modern", "Senior Software Engineer"),
  ];
}
