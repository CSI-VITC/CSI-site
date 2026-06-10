"use client";

import { useAuth } from "@/context/AuthContext";
import {
  canAccessWindow,
  canManageEvents,
  canManageGallery,
  canManageResources,
  canManageUsers,
  canUseMemberFeatures,
  canViewAnalytics,
  getWindowGate,
  isAdminRole,
} from "@/lib/rbac/permissions";
import type { WindowId } from "@/components/nova/types";

export function usePermissions() {
  const { role, isAuthenticated, isAdmin, isGuest, profile } = useAuth();

  return {
    role,
    profile,
    isAuthenticated,
    isGuest,
    isAdmin,
    canAccessWindow: (windowId: WindowId) => canAccessWindow(isAuthenticated, role, windowId),
    getWindowGate: (windowId: WindowId) => getWindowGate(isAuthenticated, role, windowId),
    canUseMemberFeatures: () => canUseMemberFeatures(isAuthenticated),
    canManageEvents: () => canManageEvents(role),
    canManageResources: () => canManageResources(role),
    canManageGallery: () => canManageGallery(role),
    canViewAnalytics: () => canViewAnalytics(role),
    canManageUsers: () => canManageUsers(role),
    requireAdmin: () => isAdminRole(role),
  };
}

export function useRequireAdmin() {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  return { isAdmin, isAuthenticated, loading, allowed: isAuthenticated && isAdmin };
}
