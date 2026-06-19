"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { useInteraction } from "@/context/InteractionContext";
import { ACHIEVEMENTS } from "@/data/interactionContent";

export interface ActivityItem {
  id: string;
  message: string;
  timeLabel: string;
  color: string;
  ts: number;
}

function timeLabel(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return "Earlier";
}

export function useActivityFeed() {
  const { events } = useAdminEvents();
  const { unlockedAchievements, activeAchievement } = useInteraction();
  const [announcements] = useState([
    { id: "ann-1", message: "CSI Nova is online — ask anything about events & resources.", ts: Date.now() - 120000 },
  ]);

  const items = useMemo(() => {
    const feed: ActivityItem[] = [];

    events
      .filter((e) => e.status === "published" || e.status === "live")
      .slice(0, 2)
      .forEach((e) => {
        feed.push({
          id: `evt-${e.id}`,
          message: `Event live: ${e.title}`,
          timeLabel: "Upcoming",
          color: "rgba(140, 220, 160, 0.85)",
          ts: new Date(e.date).getTime(),
        });
      });

    announcements.forEach((a) => {
      feed.push({
        id: a.id,
        message: a.message,
        timeLabel: timeLabel(a.ts),
        color: "rgba(100, 180, 255, 0.85)",
        ts: a.ts,
      });
    });

    if (unlockedAchievements.length > 0) {
      const latest = unlockedAchievements[unlockedAchievements.length - 1];
      const ach = ACHIEVEMENTS[latest];
      feed.push({
        id: `ach-${latest}`,
        message: `Achievement: ${ach.title}`,
        timeLabel: activeAchievement === latest ? "Just now" : "Session",
        color: "rgba(255, 200, 100, 0.9)",
        ts: Date.now(),
      });
    }

    feed.push({
      id: "res-hub",
      message: "New resources available in the Resource Hub",
      timeLabel: "Today",
      color: "rgba(180, 180, 255, 0.8)",
      ts: Date.now() - 3600000,
    });

    return feed.sort((a, b) => b.ts - a.ts).slice(0, 8);
  }, [events, announcements, unlockedAchievements, activeAchievement]);

  return { items };
}
