"use client";

import type { ActivityItem } from "@/hooks/useActivityFeed";
import "./DesktopOS.css";

interface LiveActivityFeedProps {
  items: ActivityItem[];
}

export function LiveActivityFeed({ items }: LiveActivityFeedProps) {
  if (items.length === 0) return null;

  return (
    <aside className="csi-activity-feed" aria-label="Live activity">
      <div className="csi-activity-feed-header">Activity</div>
      <ul className="csi-activity-list">
        {items.slice(0, 2).map((item) => (
          <li key={item.id} className="csi-activity-item">
            <span className="csi-activity-dot" style={{ background: item.color }} aria-hidden />
            <span>
              {item.message}
              <span className="csi-activity-time">{item.timeLabel}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
