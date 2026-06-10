"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminBadge } from "@/components/auth/AdminBadge";
import "../auth/Rbac.css";

export function ProfilePanel() {
  const { profile, role, isGuest, isDemoMode, signOut, openAuth } = useAuth();

  if (isGuest) {
    return (
      <div className="rbac-dash">
        <header className="rbac-dash-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 className="rbac-dash-greeting">Guest User</h1>
            <span className="rbac-guest-badge">Guest</span>
          </div>
          <p className="rbac-dash-sub">You&apos;re exploring CSI as a guest. Sign in anytime to unlock member features.</p>
        </header>

        <div className="rbac-dash-card" style={{ maxWidth: 400, cursor: "default" }}>
          <h3>Member Benefits</h3>
          <ul className="rbac-unlock-list" style={{ textAlign: "left", marginBottom: 16 }}>
            <li>Member Dashboard</li>
            <li>Saved Resources</li>
            <li>Registered Events & History</li>
            <li>Certificates</li>
            <li>Personalized CSI Nova</li>
            <li>Achievement Tracking</li>
          </ul>
          <div className="rbac-event-actions">
            <button type="button" className="rbac-btn-sm rbac-btn-sm--primary" onClick={() => openAuth("signin")}>
              Sign In
            </button>
            <button type="button" className="rbac-btn-sm" onClick={() => openAuth("signup")}>
              Create Account
            </button>
          </div>
        </div>

        <p style={{ marginTop: 20, fontSize: "0.82rem", color: "rgba(240,235,225,0.4)", lineHeight: 1.55 }}>
          Sign in to save resources and track events — no account needed to browse events, gallery, resources, and team.
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="rbac-dash">
      <header className="rbac-dash-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 className="rbac-dash-greeting">{profile.displayName}</h1>
          {role === "admin" && <AdminBadge />}
        </div>
        <p className="rbac-dash-sub">{profile.email}</p>
      </header>

      <div className="rbac-dash-card" style={{ maxWidth: 360, cursor: "default" }}>
        <h3>Account Details</h3>
        <p style={{ marginBottom: 8 }}>
          <strong style={{ color: "rgba(240,235,225,0.7)" }}>Role:</strong>{" "}
          {role === "admin" ? "Administrator" : "Member"}
        </p>
        <p style={{ marginBottom: 8 }}>
          <strong style={{ color: "rgba(240,235,225,0.7)" }}>Member since:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        {isDemoMode && (
          <p className="rbac-perm-note" style={{ marginTop: 12, marginBottom: 0 }}>
            Demo mode active. Configure Firebase for production authentication.
          </p>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: "0.85rem", color: "rgba(240,235,225,0.5)", marginBottom: 10 }}>Your Access</h3>
        {role === "admin" ? (
          <p style={{ fontSize: "0.84rem", color: "rgba(240,235,225,0.45)", lineHeight: 1.6 }}>
            You have elevated administrator privileges including event management, resource uploads, gallery curation,
            analytics, and user administration.
          </p>
        ) : (
          <p style={{ fontSize: "0.84rem", color: "rgba(240,235,225,0.45)", lineHeight: 1.6 }}>
            Your member dashboard, saved resources, event registrations, certificates, and personalized Nova are active.
          </p>
        )}
      </div>

      <button type="button" className="rbac-btn-sm" style={{ marginTop: 24 }} onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
