import type { WindowId } from "@/components/nova/types";
import { RESOURCE_CATEGORIES, RESOURCES } from "@/data/resourceHubData";
import { TECH_DOMAINS_SHORT } from "@/data/platformContent";

export type SpotlightResultKind =
  | "action"
  | "app"
  | "event"
  | "resource"
  | "project"
  | "team"
  | "announcement"
  | "domain"
  | "gallery"
  | "nova";

export interface SpotlightStaticEntry {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  kind: SpotlightResultKind;
  keywords: string[];
  windowId?: WindowId;
  categoryLabel?: string;
}

export const SPOTLIGHT_TEAM: SpotlightStaticEntry[] = [
  {
    id: "team-arjun",
    title: "Arjun Selvam",
    subtitle: "Team · President",
    description: "Web Dev lead — CSI core team",
    kind: "team",
    keywords: ["arjun", "president", "web", "lead", "core team"],
    windowId: "team",
  },
  {
    id: "team-karthik",
    title: "Karthik Rajan",
    subtitle: "Team · Vice President",
    description: "AI/ML domain — CSI leadership",
    kind: "team",
    keywords: ["karthik", "vice president", "ai", "ml"],
    windowId: "team",
  },
  {
    id: "team-meera",
    title: "Meera Krishnan",
    subtitle: "Team · Design Lead",
    description: "UI/UX and brand experiences",
    kind: "team",
    keywords: ["meera", "design", "ui", "ux"],
    windowId: "team",
  },
  {
    id: "team-vikram",
    title: "Vikram Anand",
    subtitle: "Team · Security Lead",
    description: "Cybersecurity and CTF initiatives",
    kind: "team",
    keywords: ["vikram", "security", "cyber", "ctf"],
    windowId: "team",
  },
  {
    id: "team-priya",
    title: "Priya Nair",
    subtitle: "Team · Tech Lead",
    description: "Web development and chapter tech",
    kind: "team",
    keywords: ["priya", "tech lead", "web"],
    windowId: "team",
  },
  {
    id: "team-page",
    title: "CSI Core Team",
    subtitle: "Page · Team",
    description: "Meet chapter leads and domain heads",
    kind: "team",
    keywords: ["team", "members", "leads", "core"],
    windowId: "team",
  },
];

export const SPOTLIGHT_PROJECTS: SpotlightStaticEntry[] = [
  {
    id: "proj-campusos",
    title: "CampusOS",
    subtitle: "Project · Platform",
    description: "Unified campus platform for navigation and student utilities",
    kind: "project",
    keywords: ["campusos", "platform", "next.js", "web"],
    windowId: "projects",
    categoryLabel: "Web Dev",
  },
  {
    id: "proj-sentinelx",
    title: "SentinelX",
    subtitle: "Project · Security",
    description: "Monitoring and security tooling for campus infrastructure",
    kind: "project",
    keywords: ["sentinelx", "security", "monitoring", "docker"],
    windowId: "projects",
    categoryLabel: "Cybersecurity",
  },
  {
    id: "proj-lecturelens",
    title: "LectureLens",
    subtitle: "Project · AI / EdTech",
    description: "Smart lecture capture and summarization",
    kind: "project",
    keywords: ["lecturelens", "ai", "ml", "edtech", "whisper"],
    windowId: "projects",
    categoryLabel: "AI/ML",
  },
  {
    id: "proj-aaroha",
    title: "Aaroha",
    subtitle: "Project · Community",
    description: "Mentorship platform connecting CSI members",
    kind: "project",
    keywords: ["aaroha", "community", "mentorship"],
    windowId: "projects",
  },
  {
    id: "proj-page",
    title: "CSI Projects",
    subtitle: "Page · Projects",
    description: "Browse member-built products and demos",
    kind: "project",
    keywords: ["projects", "build", "portfolio"],
    windowId: "projects",
  },
];

export const SPOTLIGHT_DOMAINS: SpotlightStaticEntry[] = [
  { id: "domain-ai", title: "AI / ML", subtitle: "Domain · Technical", kind: "domain", keywords: ["ai", "ml", "machine learning", "deep learning", "llm"], windowId: "depts", categoryLabel: "AI/ML" },
  { id: "domain-web", title: "Web Development", subtitle: "Domain · Technical", kind: "domain", keywords: ["web", "frontend", "react", "next.js", "full stack"], windowId: "depts", categoryLabel: "Web Dev" },
  { id: "domain-cyber", title: "Cybersecurity", subtitle: "Domain · Technical", kind: "domain", keywords: ["cyber", "security", "ctf", "hacking"], windowId: "depts", categoryLabel: "Cybersecurity" },
  { id: "domain-cp", title: "Competitive Programming", subtitle: "Domain · Technical", kind: "domain", keywords: ["cp", "competitive", "dsa", "algorithms"], windowId: "depts", categoryLabel: "CP" },
  { id: "domain-ui", title: "UI / UX Design", subtitle: "Domain · Design", kind: "domain", keywords: ["ui", "ux", "design", "figma"], windowId: "depts", categoryLabel: "UI/UX" },
  { id: "domain-oss", title: "Open Source", subtitle: "Domain · Community", kind: "domain", keywords: ["open source", "oss", "github", "contributions"], windowId: "depts", categoryLabel: "Open Source" },
  { id: "domain-page", title: "CSI Departments", subtitle: "Page · Domains", description: TECH_DOMAINS_SHORT.join(" · "), kind: "domain", keywords: ["domains", "departments", "technical", "design"], windowId: "depts" },
];

export const SPOTLIGHT_RESOURCES: SpotlightStaticEntry[] = RESOURCES.map((r) => {
  const cat = RESOURCE_CATEGORIES.find((c) => c.id === r.category);
  return {
    id: `res-${r.id}`,
    title: r.title,
    subtitle: `Resource · ${cat?.label ?? r.category}`,
    description: r.description,
    kind: "resource" as const,
    keywords: [r.title, r.description, r.category, r.type, r.difficulty, cat?.label ?? ""].filter(Boolean),
    windowId: "resources" as WindowId,
    categoryLabel: cat?.label,
  };
});

export const SPOTLIGHT_GALLERY: SpotlightStaticEntry[] = [
  {
    id: "gallery-page",
    title: "CSI Gallery",
    subtitle: "Page · Gallery",
    description: "Chapter moments, events, and hackathon highlights",
    kind: "gallery",
    keywords: ["gallery", "photos", "moments", "events", "hackathon"],
    windowId: "gallery",
  },
];

export const QUICK_ACTIONS: {
  id: string;
  title: string;
  subtitle: string;
  keywords: string[];
  windowId?: WindowId;
  systemAction?: "launchpad" | "home" | "nova";
  adminOnly?: boolean;
}[] = [
  { id: "act-events", title: "Open Events", subtitle: "Action · Workshops & hackathons", keywords: ["events", "workshop", "hackathon", "register"], windowId: "events" },
  { id: "act-resources", title: "Open Resources", subtitle: "Action · Learning hub & roadmaps", keywords: ["resources", "roadmap", "learn", "study"], windowId: "resources" },
  { id: "act-projects", title: "Open Projects", subtitle: "Action · Member builds", keywords: ["projects", "build", "portfolio"], windowId: "projects" },
  { id: "act-team", title: "Open Team", subtitle: "Action · Meet CSI leads", keywords: ["team", "leads", "members"], windowId: "team" },
  { id: "act-dashboard", title: "Open Dashboard", subtitle: "Action · Member home", keywords: ["dashboard", "home", "member"], windowId: "dashboard" },
  { id: "act-gallery", title: "Open Gallery", subtitle: "Action · Chapter moments", keywords: ["gallery", "photos"], windowId: "gallery" },
  { id: "act-depts", title: "Open Domains", subtitle: "Action · Technical departments", keywords: ["domains", "departments", "depts"], windowId: "depts" },
  { id: "act-admin", title: "Open Admin Console", subtitle: "Action · Administrator tools", keywords: ["admin", "console", "manage"], windowId: "admin-console", adminOnly: true },
  { id: "act-nova", title: "Open CSI Nova", subtitle: "Action · AI assistant", keywords: ["nova", "assistant", "ai", "help", "ask"], systemAction: "nova" },
  { id: "act-launchpad", title: "Show Launchpad", subtitle: "Action · All apps", keywords: ["launchpad", "apps", "all"], systemAction: "launchpad" },
  { id: "act-home", title: "Go to Desktop", subtitle: "Action · Return home", keywords: ["desktop", "home", "clear"], systemAction: "home" },
];

export const DOMAIN_TOPIC_MAP: Record<string, string[]> = {
  ai: ["ai", "ml", "machine", "learning", "deep", "llm", "neural"],
  web: ["web", "react", "next", "frontend", "full stack", "fullstack"],
  security: ["security", "cyber", "ctf", "hack"],
  design: ["design", "ui", "ux", "figma"],
  cp: ["competitive", "cp", "dsa", "algorithm"],
};
