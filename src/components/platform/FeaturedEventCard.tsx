"use client";

import type { AdminEvent } from "@/data/adminEventsData";
import { formatFeaturedEventDate, getSeatsLabel } from "@/hooks/useFeaturedEvent";
import type { WindowId } from "@/components/nova/types";

interface FeaturedEventCardProps {
  event: AdminEvent | null;
  loading?: boolean;
  onOpenEvents: (id: WindowId) => void;
  variant?: "featured" | "quiet";
}

export function FeaturedEventCard({
  event,
  loading,
  onOpenEvents,
  variant = "featured",
}: FeaturedEventCardProps) {
  const cardClass = `csi-platform-card${variant === "quiet" ? " csi-platform-card--quiet" : " csi-platform-card--primary"}`;

  if (loading) {
    return (
      <div className={cardClass} aria-busy="true">
        <div className="csi-platform-card-label">Upcoming Event</div>
        <div className="csi-platform-skeleton" style={{ width: "70%", marginBottom: 8 }} />
        <div className="csi-platform-skeleton" style={{ width: "90%" }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className={cardClass}>
        <div className="csi-platform-card-label">Upcoming Event</div>
        <p className="csi-platform-empty">No published events right now. Check back soon for workshops and hackathons.</p>
        <button type="button" className="csi-platform-btn" onClick={() => onOpenEvents("events")}>
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="csi-platform-card-label">Featured · {event.status === "live" ? "Live Now" : "Upcoming"}</div>
      <h3>{event.title}</h3>
      <p>{event.description || "Join CSI members for a hands-on technical session."}</p>
      <p className="csi-platform-card-meta">
        {formatFeaturedEventDate(event.date)} · {event.venue} · {getSeatsLabel(event)}
      </p>
      <button type="button" className="csi-platform-btn" onClick={() => onOpenEvents("events")}>
        View & Register
      </button>
    </div>
  );
}
