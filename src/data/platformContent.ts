import type { WindowId } from "@/components/nova/types";

export const PLATFORM_STATS = [
  { value: 150, suffix: "+", label: "Members" },
  { value: 40, suffix: "+", label: "Events" },
  { value: 25, suffix: "+", label: "Projects" },
  { value: 12, suffix: "+", label: "Hackathons" },
  { value: 6, suffix: "", label: "Domains" },
] as const;

export const TECH_DOMAINS_SHORT = [
  "AI / ML",
  "Web Dev",
  "Cybersecurity",
  "Competitive Programming",
  "UI / UX",
  "Open Source",
] as const;

export const FEATURED_PROJECT = {
  name: "CampusOS",
  summary: "A unified campus platform for navigation, services, and student utilities — built by CSI members.",
  stack: ["Next.js", "TypeScript", "Firebase"],
  windowId: "projects" as WindowId,
};

export interface PlatformAnnouncement {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
}

export const SEED_ANNOUNCEMENTS: PlatformAnnouncement[] = [
  {
    id: "ann-1",
    title: "CSI Nova is online",
    body: "Ask Nova about events, resources, domains, and how to get involved with CSI VIT Chennai.",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "ann-2",
    title: "Resource Hub updated",
    body: "New learning roadmaps and curated picks for AI/ML, web development, and competitive programming.",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "ann-3",
    title: "Workshop registrations open",
    body: "Sign in to save events, track registrations, and unlock your member dashboard.",
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const FOOTER_LINKS: { label: string; windowId: WindowId }[] = [
  { label: "Events", windowId: "events" },
  { label: "Resources", windowId: "resources" },
  { label: "Projects", windowId: "projects" },
  { label: "Team", windowId: "team" },
  { label: "Contact", windowId: "contact" },
  { label: "About", windowId: "about" },
];
