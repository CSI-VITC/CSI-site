import type { UserRole } from "@/types/auth";
import type { WindowId } from "@/components/nova/types";
import { APP_ICONS } from "./appIcons";

export interface NavItem {
  id: WindowId | "more";
  label: string;
  iconSrc: string;
  bg?: string;
}

/** Guest dock — explore without signing in */
const GUEST_DOCK: NavItem[] = [
  { id: "about", label: "Home", iconSrc: APP_ICONS.home },
  { id: "events", label: "Events", iconSrc: APP_ICONS.events },
  { id: "resources", label: "Resources", iconSrc: APP_ICONS.resources },
  { id: "gallery", label: "Gallery", iconSrc: APP_ICONS.gallery },
  { id: "team", label: "Team", iconSrc: APP_ICONS.team },
  { id: "profile", label: "Profile", iconSrc: APP_ICONS.profile },
  { id: "more", label: "Launchpad", iconSrc: APP_ICONS.launchpad },
];

const MEMBER_DOCK: NavItem[] = [
  { id: "dashboard", label: "Dashboard", iconSrc: APP_ICONS.dashboard },
  { id: "events", label: "Events", iconSrc: APP_ICONS.events },
  { id: "resources", label: "Resources", iconSrc: APP_ICONS.resources },
  { id: "gallery", label: "Gallery", iconSrc: APP_ICONS.gallery },
  { id: "team", label: "Team", iconSrc: APP_ICONS.team },
  { id: "profile", label: "Profile", iconSrc: APP_ICONS.profile },
  { id: "more", label: "Launchpad", iconSrc: APP_ICONS.launchpad },
];

const ADMIN_DOCK: NavItem[] = [
  { id: "dashboard", label: "Dashboard", iconSrc: APP_ICONS.dashboard },
  { id: "events", label: "Events", iconSrc: APP_ICONS.events },
  { id: "resources", label: "Resources", iconSrc: APP_ICONS.resources },
  { id: "gallery", label: "Gallery", iconSrc: APP_ICONS.gallery },
  { id: "team", label: "Team", iconSrc: APP_ICONS.team },
  { id: "profile", label: "Profile", iconSrc: APP_ICONS.profile },
  { id: "admin-console", label: "Admin Console", iconSrc: APP_ICONS.adminConsole },
  { id: "admin-analytics", label: "Analytics", iconSrc: APP_ICONS.analytics },
  { id: "event-admin", label: "Event Manager", iconSrc: APP_ICONS.eventAdmin },
  { id: "more", label: "Launchpad", iconSrc: APP_ICONS.launchpad },
];

export interface LaunchpadItemDef {
  id: WindowId;
  label: string;
  iconSrc: string;
  adminOnly?: boolean;
  memberOnly?: boolean;
}

export const ALL_LAUNCHPAD_ITEMS: LaunchpadItemDef[] = [
  { id: "about", label: "About Us", iconSrc: APP_ICONS.home },
  { id: "events", label: "Events", iconSrc: APP_ICONS.events },
  { id: "gallery", label: "Gallery", iconSrc: APP_ICONS.gallery },
  { id: "resources", label: "Resource Hub", iconSrc: APP_ICONS.resources },
  { id: "team", label: "Team", iconSrc: APP_ICONS.team },
  { id: "projects", label: "Projects", iconSrc: APP_ICONS.projects },
  { id: "contact", label: "Contact", iconSrc: APP_ICONS.contact },
  { id: "csi", label: "CSI Official", iconSrc: APP_ICONS.csi },
  { id: "depts", label: "Departments", iconSrc: APP_ICONS.depts },
  { id: "profile", label: "Profile", iconSrc: APP_ICONS.profile },
  { id: "dashboard", label: "Dashboard", iconSrc: APP_ICONS.dashboard, memberOnly: true },
  { id: "admin-console", label: "Admin Console", iconSrc: APP_ICONS.adminConsole, adminOnly: true },
  { id: "admin-analytics", label: "Analytics", iconSrc: APP_ICONS.analytics, adminOnly: true },
  { id: "event-admin", label: "Event Manager", iconSrc: APP_ICONS.eventAdmin, adminOnly: true },
  { id: "admin-users", label: "User Management", iconSrc: APP_ICONS.profile, adminOnly: true },
  { id: "admin-resources", label: "Resource Management", iconSrc: APP_ICONS.resources, adminOnly: true },
  { id: "admin-gallery", label: "Gallery Management", iconSrc: APP_ICONS.gallery, adminOnly: true },
  { id: "admin-announcements", label: "Announcements", iconSrc: APP_ICONS.contact, adminOnly: true },
  { id: "admin-certificates", label: "Certificates", iconSrc: APP_ICONS.csi, adminOnly: true },
];

export function getDockItems(isAuthenticated: boolean, role: UserRole | null): NavItem[] {
  if (!isAuthenticated) return GUEST_DOCK;
  if (role === "admin") return ADMIN_DOCK;
  return MEMBER_DOCK;
}

export function getLaunchpadItems(isAuthenticated: boolean, role: UserRole | null): LaunchpadItemDef[] {
  if (!isAuthenticated) {
    return ALL_LAUNCHPAD_ITEMS.filter((i) => !i.adminOnly && !i.memberOnly);
  }
  if (role === "admin") return ALL_LAUNCHPAD_ITEMS;
  return ALL_LAUNCHPAD_ITEMS.filter((i) => !i.adminOnly);
}

export const WINDOW_TITLES: Record<WindowId, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  events: "Events",
  gallery: "Gallery",
  resources: "Resource Hub",
  team: "Team",
  about: "About Us",
  depts: "Departments",
  projects: "Projects",
  contact: "Contact",
  csi: "CSI Official Site",
  "admin-console": "Admin Console",
  "admin-analytics": "Analytics",
  "event-admin": "Event Management",
  "admin-users": "User Management",
  "admin-resources": "Resource Management",
  "admin-gallery": "Gallery Management",
  "admin-announcements": "Announcements",
  "admin-certificates": "Certificate Management",
};

/** Icon for minimized window strip & window chrome */
export const WINDOW_ICONS: Record<WindowId, string> = {
  dashboard: APP_ICONS.dashboard,
  profile: APP_ICONS.profile,
  events: APP_ICONS.events,
  gallery: APP_ICONS.gallery,
  resources: APP_ICONS.resources,
  team: APP_ICONS.team,
  about: APP_ICONS.home,
  depts: APP_ICONS.depts,
  projects: APP_ICONS.projects,
  contact: APP_ICONS.contact,
  csi: APP_ICONS.csi,
  "admin-console": APP_ICONS.adminConsole,
  "admin-analytics": APP_ICONS.analytics,
  "event-admin": APP_ICONS.eventAdmin,
  "admin-users": APP_ICONS.profile,
  "admin-resources": APP_ICONS.resources,
  "admin-gallery": APP_ICONS.gallery,
  "admin-announcements": APP_ICONS.contact,
  "admin-certificates": APP_ICONS.csi,
};
