"use client";

import { useAuth } from "@/context/AuthContext";
import { AdminBadge } from "@/components/auth/AdminBadge";
import type { WindowId } from "@/components/nova/types";
import "../auth/Rbac.css";

const ADMIN_TOOLS: { id: WindowId; title: string; desc: string }[] = [
  { id: "event-admin", title: "Event Management", desc: "Create, edit, publish, and archive events." },
  { id: "admin-users", title: "User Management", desc: "View members and manage administrator access." },
  { id: "admin-resources", title: "Resource Management", desc: "Upload, edit, and remove learning resources." },
  { id: "admin-gallery", title: "Gallery Management", desc: "Upload photos and curate event galleries." },
  { id: "admin-announcements", title: "Announcements", desc: "Publish chapter-wide notices and updates." },
  { id: "admin-analytics", title: "Analytics", desc: "Event metrics, fill rates, and engagement data." },
  { id: "admin-certificates", title: "Certificates", desc: "Issue and manage event completion certificates." },
];

interface AdminConsoleProps {
  onNavigate: (id: WindowId) => void;
}

export function AdminConsole({ onNavigate }: AdminConsoleProps) {
  const { profile } = useAuth();

  return (
    <div className="rbac-admin-console">
      <div className="rbac-admin-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h2>Administrative Console</h2>
          <AdminBadge />
        </div>
        <p>
          Privileged workspace for {profile?.displayName ?? "Administrator"}. All actions are logged and require
          elevated permissions.
        </p>
      </div>

      <div className="rbac-dash-grid">
        {ADMIN_TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className="rbac-dash-card rbac-dash-card--admin"
            onClick={() => onNavigate(tool.id)}
            style={{ textAlign: "left", cursor: "pointer" }}
          >
            <h3>{tool.title}</h3>
            <p>{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
