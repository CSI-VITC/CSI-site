"use client";

import type { PlatformAnnouncement } from "@/data/platformContent";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface AnnouncementsPanelProps {
  items: PlatformAnnouncement[];
  loading?: boolean;
  limit?: number;
  variant?: "featured" | "quiet";
}

export function AnnouncementsPanel({ items, loading, limit = 3, variant = "featured" }: AnnouncementsPanelProps) {
  const cardClass = `csi-platform-card csi-platform-announcements${variant === "quiet" ? " csi-platform-card--quiet" : ""}`;

  if (loading) {
    return (
      <div className={cardClass} aria-busy="true">
        <div className="csi-platform-card-label">Announcements</div>
        <div className="csi-platform-skeleton" style={{ marginBottom: 8 }} />
        <div className="csi-platform-skeleton" style={{ width: "85%" }} />
      </div>
    );
  }

  const visible = items.slice(0, limit);

  return (
    <div className={cardClass}>
      <div className="csi-platform-card-label">Latest Announcements</div>
      {visible.length === 0 ? (
        <p className="csi-platform-empty">No announcements yet. Chapter updates will appear here.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong>
              <span>
                {a.body} · {timeAgo(a.publishedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
