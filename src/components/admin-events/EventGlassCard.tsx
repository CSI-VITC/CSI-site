"use client";

import { useRef } from "react";
import type { AdminEvent, EventStatus } from "@/data/adminEventsData";
import { EVENT_STATUSES, KANBAN_COLUMNS, formatEventDate, seatsRemaining } from "@/data/adminEventsData";

interface EventGlassCardProps {
  event: AdminEvent;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMoveStatus?: (status: EventStatus) => void;
  isDragging?: boolean;
}

export function EventGlassCard({
  event,
  onOpen,
  onDragStart,
  onDragEnd,
  onMoveStatus,
  isDragging,
}: EventGlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mouse-x", `${x}%`);
    ref.current.style.setProperty("--mouse-y", `${y}%`);
  };

  const label = `${event.title}, ${formatEventDate(event.date)}, ${event.registrations.length} registered, ${seatsRemaining(event)} seats left, status ${event.status}`;

  return (
    <article
      ref={ref}
      draggable
      onDragStart={(e: React.DragEvent) => {
        e.dataTransfer.setData("text/event-id", event.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onMouseMove={handleMouseMove}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`aem-event-card${isDragging ? " aem-event-card--dragging" : ""}`}
      style={{ animation: "aem-card-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      aria-label={label}
      tabIndex={0}
    >
      <div className="aem-card-shine" aria-hidden="true" />
      {event.posterUrl && (
        <img src={event.posterUrl} alt="" className="aem-card-poster" draggable={false} />
      )}
      <div className="aem-card-body">
        <h4 className="aem-card-title">{event.title}</h4>
        <p className="aem-card-meta">{formatEventDate(event.date)}</p>
        <div className="aem-card-stats" aria-hidden="true">
          <span className="aem-stat-pill">{event.registrations.length} registered</span>
          <span className="aem-stat-pill">{seatsRemaining(event)} left</span>
        </div>
        {onMoveStatus && (
          <label className="aem-card-move" style={{ display: "block", marginTop: 8 }}>
            <span className="sr-only">Move {event.title} to status</span>
            <select
              className="aem-select"
              style={{ width: "100%", fontSize: "0.68rem", padding: "4px 8px" }}
              value={event.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                onMoveStatus(e.target.value as EventStatus);
              }}
              aria-label={`Change status for ${event.title}`}
            >
              {KANBAN_COLUMNS.map((id) => {
                const s = EVENT_STATUSES.find((x) => x.id === id)!;
                return (
                  <option key={id} value={id}>
                    Move to {s.label}
                  </option>
                );
              })}
            </select>
          </label>
        )}
      </div>
    </article>
  );
}
