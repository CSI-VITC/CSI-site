import type { UserRole } from "@/types/auth";
import type { WindowId } from "@/components/nova/types";

/** Freely accessible without signing in */
export const GUEST_WINDOWS: WindowId[] = [
  "about",
  "events",
  "gallery",
  "resources",
  "team",
  "projects",
  "contact",
  "csi",
  "depts",
  "profile",
];

/** Require authenticated member (not guest) */
export const MEMBER_WINDOWS: WindowId[] = ["dashboard"];

/** Require authenticated admin */
export const ADMIN_ONLY_WINDOWS: WindowId[] = [
  "admin-console",
  "admin-analytics",
  "event-admin",
  "admin-users",
  "admin-resources",
  "admin-gallery",
  "admin-announcements",
  "admin-certificates",
];

export type WindowGate = "allowed" | "member" | "admin";

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function getWindowGate(
  isAuthenticated: boolean,
  role: UserRole | null | undefined,
  windowId: WindowId
): WindowGate {
  if (MEMBER_WINDOWS.includes(windowId)) {
    return isAuthenticated ? "allowed" : "member";
  }
  if (ADMIN_ONLY_WINDOWS.includes(windowId)) {
    return isAuthenticated && isAdminRole(role) ? "allowed" : "admin";
  }
  if (GUEST_WINDOWS.includes(windowId)) return "allowed";
  return "allowed";
}

export function canAccessWindow(
  isAuthenticated: boolean,
  role: UserRole | null | undefined,
  windowId: WindowId
): boolean {
  return getWindowGate(isAuthenticated, role, windowId) === "allowed";
}

export function canManageEvents(role: UserRole | null | undefined): boolean {
  return isAdminRole(role);
}

export function canManageResources(role: UserRole | null | undefined): boolean {
  return isAdminRole(role);
}

export function canManageGallery(role: UserRole | null | undefined): boolean {
  return isAdminRole(role);
}

export function canViewAnalytics(role: UserRole | null | undefined): boolean {
  return isAdminRole(role);
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return isAdminRole(role);
}

export function canUseMemberFeatures(isAuthenticated: boolean): boolean {
  return isAuthenticated;
}
