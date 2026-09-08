// Shared import surface for resume_templates/*.tsx - re-exports the base/decorative/
// layout/section components, icons, types, and utils templates commonly need, so a
// template file can pull them from one path instead of a long individual-import
// block. Not every template uses this yet; each one that does still only imports the
// names it actually needs. Every export here is a straight re-export of the real
// component/type/util - add new ones here as more templates adopt this file, grouped
// under the matching comment header below.

// ---- Base components ----
export { default as Heading } from "@/components/Resume_Builder/resume_base_components/heading/Heading";
export { default as Text } from "@/components/Resume_Builder/resume_base_components/text/Text";
export { default as DateRange } from "@/components/Resume_Builder/resume_base_components/dateRange/DateRange";
export { default as Link } from "@/components/Resume_Builder/resume_base_components/link/Link";
export { default as Badge } from "@/components/Resume_Builder/resume_base_components/badge/Badge";
export { default as BulletList } from "@/components/Resume_Builder/resume_base_components/bulletList/BulletList";
export { default as EntryLinkList } from "@/components/Resume_Builder/resume_base_components/entryLinkList/EntryLinkList";
export { default as Photo } from "@/components/Resume_Builder/resume_base_components/photo/Photo";
export { default as SkillBox } from "@/components/Resume_Builder/resume_base_components/skillBox/SkillBox";
export { default as ContactGroup } from "@/components/Resume_Builder/resume_base_components/contactGroup/ContactGroup";
export { default as SkillMeter } from "@/components/Resume_Builder/resume_base_components/skillMeter/SkillMeter";
export { default as IconUpload } from "@/components/Resume_Builder/resume_base_components/iconUpload/IconUpload";
export { default as SkillWithLevel } from "@/components/Resume_Builder/resume_base_components/skillWithLevel/SkillWithLevel";

// ---- Decorative components ----
export { default as Divider } from "@/components/Resume_Builder/resume_base_decorative_components/divider/Divider";
export { default as IconBadge } from "@/components/Resume_Builder/resume_base_decorative_components/iconBadge/IconBadge";
export { default as Blob } from "@/components/Resume_Builder/resume_base_decorative_components/blob/Blob";
export { default as DotGrid } from "@/components/Resume_Builder/resume_base_decorative_components/dotGrid/DotGrid";
export { default as QuoteCard } from "@/components/Resume_Builder/resume_base_decorative_components/quoteCard/QuoteCard";
export { default as Rail, railBorderStyle } from "@/components/Resume_Builder/resume_base_decorative_components/rail/Rail";
export { default as WavyLines, wavyLinesBackgroundStyle } from "@/components/Resume_Builder/resume_base_decorative_components/wavyLines/WavyLines";
export { default as RailSectionHeading, RAIL_INDENT } from "@/components/Resume_Builder/resume_base_decorative_components/railSectionHeading/RailSectionHeading";
export { default as SectionPill } from "@/components/Resume_Builder/resume_base_decorative_components/sectionPill/SectionPill";
export { default as FlourishHeading } from "@/components/Resume_Builder/resume_base_decorative_components/flourishHeading/FlourishHeading";

// ---- Layouts ----
export { default as TwoColumnLayout } from "@/components/Resume_Builder/resume_layouts/TwoColumnLayout";

// ---- Sections ----
export { default as HeaderSplit } from "@/components/Resume_Builder/resume_sections/header/HeaderSplit";
export { default as EntryExperience } from "@/components/Resume_Builder/resume_sections/experience/layouts/EntryExperience";
export { default as ProjectsLinkList } from "@/components/Resume_Builder/resume_sections/projects/ProjectsLinkList";
export { default as EducationSimple } from "@/components/Resume_Builder/resume_sections/education/EducationSimple";
export { default as SummaryParagraph } from "@/components/Resume_Builder/resume_sections/summary/SummaryParagraph";
export { default as CertificationsLogoGrid } from "@/components/Resume_Builder/resume_sections/certifications/CertificationsLogoGrid";
export { default as PublicationsList } from "@/components/Resume_Builder/resume_sections/publications/PublicationsList";
export { default as SkillsFlatList } from "@/components/Resume_Builder/resume_sections/skills/SkillsFlatList";
export { default as SkillsPillCloud } from "@/components/Resume_Builder/resume_sections/skills/SkillsPillCloud";
export { default as CertificationsList } from "@/components/Resume_Builder/resume_sections/certifications/CertificationsList";
export { default as AchievementsBullets } from "@/components/Resume_Builder/resume_sections/achievements/AchievementsBullets";
export { default as DateLeftTimelineExperience } from "@/components/Resume_Builder/resume_sections/experience/layouts/DateLeftTimelineExperience";

// ---- Icons (lucide-react) ----
export { Briefcase, GraduationCap, Tag, Image as ImageIconLucide, Award, BookOpen, Mail, Phone, MapPin, Link2, FolderOpen, BadgeCheck, User, Code2, FileText, Star, Settings } from "lucide-react";

// ---- Types & utils ----
export type { ResumeSection } from "@/types/resume";
export type { ThemeTokens } from "@/types/resume_theme";
export { getThemeTokens } from "@/types/resume_theme";
export { getTypedSections } from "@/lib/getTypedSections";
