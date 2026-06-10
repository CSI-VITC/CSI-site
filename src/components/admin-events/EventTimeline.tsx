"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminEvent } from "@/data/adminEventsData";
import { formatEventDate } from "@/data/adminEventsData";

interface EventTimelineProps {
  events: AdminEvent[];
  onOpenEvent: (event: AdminEvent) => void;
}

export function EventTimeline({ events, onOpenEvent }: EventTimelineProps) {
  const sorted = [...events]
    .filter((e) => e.status !== "archived")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const now = Date.now();
  const [activeCount, setActiveCount] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = wrapRef.current?.querySelectorAll("[data-timeline-item]");
    if (!nodes) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("aem-timeline-item--active");
        });
      },
      { threshold: 0.4, root: wrapRef.current }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sorted.length]);

  useEffect(() => {
    const past = sorted.filter((e) => new Date(e.date).getTime() < now).length;
    setActiveCount(past);
  }, [sorted, now]);

  const fillPercent = sorted.length ? (activeCount / sorted.length) * 100 : 0;

  if (sorted.length === 0) {
    return (
      <div className="aem-empty-state" role="status">
        <h3>No upcoming events on the timeline</h3>
        <p>Published and draft events appear here in chronological order once you create them.</p>
      </div>
    );
  }

  return (
    <div className="aem-timeline-wrap" ref={wrapRef}>
      <div className="aem-timeline">
        <div className="aem-timeline-line">
          <div className="aem-timeline-line-fill" style={{ height: `${fillPercent}%` }} />
        </div>
        {sorted.map((event) => {
          const t = new Date(event.date).getTime();
          const isPast = t < now;
          const isUpcoming = t > now && t - now < 14 * 86400000;
          return (
            <div
              key={event.id}
              data-timeline-item
              className={`aem-timeline-item${isPast ? " aem-timeline-item--past" : ""}${isUpcoming ? " aem-timeline-item--upcoming" : ""}`}
              onClick={() => onOpenEvent(event)}
              style={{ cursor: "pointer" }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onOpenEvent(event)}
            >
              <div className="aem-timeline-node" />
              <h4 style={{ margin: "0 0 4px", fontSize: "0.95rem", fontWeight: 600 }}>{event.title}</h4>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(240,235,225,0.45)" }}>
                {formatEventDate(event.date)} · {event.status}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "0.75rem", color: "rgba(240,235,225,0.35)" }}>
                {event.registrations.length} registrations · {event.venue}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
