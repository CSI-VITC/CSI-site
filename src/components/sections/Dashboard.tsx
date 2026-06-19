"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminBadge } from "@/components/auth/AdminBadge";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useFeaturedEvent } from "@/hooks/useFeaturedEvent";
import type { WindowId } from "@/components/nova/types";
import { PlatformStatsBar } from "@/components/platform/PlatformStatsBar";
import { FeaturedEventCard } from "@/components/platform/FeaturedEventCard";
import { AnnouncementsPanel } from "@/components/platform/AnnouncementsPanel";
import { ProjectSpotlight } from "@/components/platform/ProjectSpotlight";
import "../auth/Rbac.css";
import "../platform/Platform.css";

interface DashboardProps {
  onNavigate: (id: WindowId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, isAdmin } = useAuth();
  const { events, ready: eventsReady } = useAdminEvents();
  const { announcements, ready: annReady } = useAnnouncements();
  const featured = useFeaturedEvent(events, eventsReady);
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

      <section aria-label="Chapter snapshot" className="csi-dash-snapshot">
        <h2 className="csi-section-eyebrow">Chapter Snapshot</h2>
        <PlatformStatsBar />
        <div className="csi-dash-snapshot-grid">
          <FeaturedEventCard event={featured} loading={!eventsReady} onOpenEvents={onNavigate} />
          <AnnouncementsPanel items={announcements} loading={!annReady} limit={2} />
        </div>
        <div style={{ marginTop: 20 }}>
          <ProjectSpotlight onNavigate={onNavigate} />
        </div>
      </section>

      <section aria-label="Quick access" style={{ marginTop: 8 }}>
        <h2 className="csi-section-eyebrow">
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
        <section aria-label="Administrative shortcuts" style={{ marginTop: 40 }}>
          <h2 className="csi-section-eyebrow" style={{ color: "rgba(255,200,100,0.5)" }}>
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
