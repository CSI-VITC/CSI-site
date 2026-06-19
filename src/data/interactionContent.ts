import type { WindowId } from "@/components/nova/types";

export const DOCK_STORIES: Record<string, { hint: string; story: string }> = {
  about: {
    hint: "About",
    story: "Mission, core values, and the numbers behind CSI.",
  },
  depts: {
    hint: "Domains",
    story: "Four teams shaping events, products, and culture.",
  },
  events: {
    hint: "Events",
    story: "Hackathons, workshops, and moments that define us.",
  },
  projects: {
    hint: "Projects",
    story: "Tools built by students, for students.",
  },
  more: {
    hint: "Launchpad",
    story: "Every app on the CSI desktop — one click away.",
  },
};

export const DOMAIN_DETAILS = [
  {
    name: "Management",
    leads: "Sudeep & Suyash",
    image: "/images/managemeent.jpg",
    tagline: "Strategy meets execution",
    focus: ["Operations", "Partnerships", "Event planning"],
    story: "Keeps CSI running — from sponsor outreach to flawless event delivery.",
  },
  {
    name: "Technical",
    leads: "Yeswanth & Syed",
    image: "/images/technical.png",
    tagline: "Engineering the future",
    focus: ["Web Dev", "AI/ML", "Systems"],
    story: "Builds workshops, hackathon infra, and the tools members ship daily.",
  },
  {
    name: "Design",
    leads: "Janet",
    image: "/images/design.jpg",
    tagline: "Craft in every pixel",
    focus: ["UI/UX", "Brand", "Visual storytelling"],
    story: "Shapes how CSI looks and feels — posters, products, and experiences.",
  },
  {
    name: "Social & Content",
    leads: "Nityasri",
    image: "/images/social.jpg",
    tagline: "Voice of the chapter",
    focus: ["Content", "Social media", "Community"],
    story: "Amplifies member stories and keeps the community connected online.",
  },
];

export const EVENT_STORIES = [
  {
    src: "/images/hackathon1.jpg",
    area: "1 / 1 / 3 / 2",
    title: "Hackathon Sprint",
    story: "Teams ship overnight — ideas become prototypes by sunrise.",
  },
  {
    src: "/images/grp-photo.jpg",
    area: "1 / 2 / 2 / 3",
    title: "Chapter Collective",
    story: "150 builders united by one belief: learn by building.",
  },
  {
    src: "/images/workshop1.jpg",
    area: "1 / 3 / 2 / 4",
    title: "Technical Workshop",
    story: "Hands-on sessions that turn theory into skill.",
  },
  {
    src: "/images/Hackathon2.jpg",
    area: "1 / 4 / 2 / 5",
    title: "Build Marathon",
    story: "Collaborative energy, mentors on standby, demos at dawn.",
  },
  {
    src: "/images/workshop2.jpg",
    area: "2 / 2 / 3 / 4",
    title: "Deep Dive Session",
    story: "Small groups, big outcomes — peer-led learning at its best.",
  },
  {
    src: "/images/Computer1.jpg",
    area: "2 / 4 / 3 / 5",
    title: "Lab Culture",
    story: "Late nights at the lab — where curiosity becomes code.",
  },
];

export const CSI_STATS = [
  { value: 150, suffix: "+", label: "Members" },
  { value: 40, suffix: "+", label: "Events" },
  { value: 25, suffix: "+", label: "Projects" },
  { value: 6, suffix: "", label: "Years Strong" },
];

export const ACHIEVEMENTS = {
  first_explore: {
    title: "First Visit",
    description: "Opened your first CSI app.",
    icon: "👋",
  },
  desktop_master: {
    title: "Explorer",
    description: "Explored every section on the CSI desktop.",
    icon: "🗺️",
  },
  power_explorer: {
    title: "Power User",
    description: "Discovered a hidden system shortcut.",
    icon: "⚡",
  },
  nova_connected: {
    title: "Nova Friend",
    description: "Started a conversation with CSI Nova.",
    icon: "🤖",
  },
  builder_mindset: {
    title: "Builder Mindset",
    description: "You speak our language — ship early, learn fast.",
    icon: "🛠️",
  },
  resource_hunter: {
    title: "Resource Hunter",
    description: "Bookmarked your first learning resource.",
    icon: "📚",
  },
  event_enthusiast: {
    title: "Event Enthusiast",
    description: "Registered for a CSI event.",
    icon: "📅",
  },
  command_master: {
    title: "Command Master",
    description: "Used the global command palette.",
    icon: "⌘",
  },
  roadmap_starter: {
    title: "Pathfinder",
    description: "Started a learning roadmap.",
    icon: "🧭",
  },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export const CORE_APP_IDS: WindowId[] = [
  "dashboard",
  "profile",
  "events",
  "gallery",
  "about",
  "depts",
  "projects",
  "resources",
  "team",
  "contact",
  "csi",
];
