"use client";

import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminBadge } from "./AdminBadge";
import "./Rbac.css";

interface MenuBarProps {
  activeLabel?: string | null;
  onOpenSpotlight?: () => void;
}

export function MenuBar({ activeLabel, onOpenSpotlight }: MenuBarProps) {
  const { profile, isAdmin, isGuest, signOut, openAuth } = useAuth();

  return (
    <div className="rbac-menu-bar" role="banner">
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>CSI VITC</span>
        {onOpenSpotlight && (
          <button
            type="button"
            className="csi-spotlight-trigger"
            onClick={onOpenSpotlight}
            aria-label="Open Spotlight Search (Command K)"
          >
            <Search size={13} aria-hidden />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
        )}
        {activeLabel && (
          <span className="rbac-menu-bar-active" aria-live="polite">
            {activeLabel}
          </span>
        )}
      </div>
      <div className="rbac-menu-bar-user">
        {isGuest ? (
          <>
            <span className="rbac-guest-label">Guest User</span>
            <button type="button" className="rbac-menu-auth-btn" onClick={() => openAuth("signin")}>
              Sign In
            </button>
            <button type="button" className="rbac-menu-auth-btn rbac-menu-auth-btn--primary" onClick={() => openAuth("signup")}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span>{profile?.displayName}</span>
            {isAdmin && <AdminBadge />}
            <button type="button" className="rbac-menu-signout" onClick={() => signOut()}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
