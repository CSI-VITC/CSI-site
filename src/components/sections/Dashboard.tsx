"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminBadge } from "@/components/auth/AdminBadge";
import type { WindowId } from "@/components/nova/types";
import "../auth/Rbac.css";

interface DashboardProps {
  onNavigate: (id: WindowId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, isAdmin } = useAuth();
  const name = profile?.displayName?.split(" ")[0] ?? "Member";

  const userCards: { id: WindowId; title: string; desc: string }[] = [
    { id: "events", title: "Events", desc: "Browse upcoming workshops, hackathons, and register." },
    { id: "resources", title: "Resources", desc: "Learning paths, bookmarks, and CSI Recommended picks." },
    { id: "gallery", title: "Gallery", desc: "Moments from hackathons, workshops, and chapter life." },
    { id: "team", title: "Team", desc: "Meet the people behind CSI VIT Chennai." },
    { id: "profile", title: "Profile", desc: "Your account, role, and membership details." },
  ];

  const adminCards: { id: WindowId; title: string; desc: string }[] = [
    { id: "admin-console", title: "Admin Console", desc: "Privileged workspace for platform management." },
    { id: "event-admin", title: "Event Manager", desc: "Create, publish, and track events." },
    { id: "admin-analytics", title: "Analytics", desc: "Registration metrics and chapter insights." },
    { id: "admin-users", title: "User Management", desc: "Manage member accounts and roles." },
  ];

  return (
    <div className="rbac-dash">
      <header className="rbac-dash-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 className="rbac-dash-greeting">Welcome back, {name}</h1>
          {isAdmin && <AdminBadge />}
        </div>
        <p className="rbac-dash-sub">
          {isAdmin
            ? "Elevated access enabled — manage events, resources, and chapter operations."
            : "Your CSI member workspace — explore events, resources, and community."}
        </p>
      </header>

      <section aria-label="Quick access">
        <h2 style={{ fontSize: "0.78rem", color: "rgba(240,235,225,0.4)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {isAdmin ? "Member & Admin" : "Member Features"}
        </h2>
        <div className="rbac-dash-grid">
          {userCards.map((c) => (
            <button
              key={c.id}
              type="button"
              className="rbac-dash-card"
              onClick={() => onNavigate(c.id)}
              style={{ textAlign: "left", cursor: "pointer" }}
            >
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {isAdmin && (
        <section aria-label="Administrative shortcuts" style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: "0.78rem", color: "rgba(255,200,100,0.6)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Administrative
          </h2>
          <div className="rbac-dash-grid">
            {adminCards.map((c) => (
              <button
                key={c.id}
                type="button"
                className="rbac-dash-card rbac-dash-card--admin"
                onClick={() => onNavigate(c.id)}
                style={{ textAlign: "left", cursor: "pointer" }}
              >
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
