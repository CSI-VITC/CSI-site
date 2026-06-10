"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminBadge } from "./AdminBadge";
import "./Rbac.css";

export function MenuBar() {
  const { profile, isAdmin, isGuest, signOut, openAuth } = useAuth();

  return (
    <div className="rbac-menu-bar" role="banner">
      <span>CSI VITC</span>
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
