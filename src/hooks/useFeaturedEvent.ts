"use client";

import { useMemo } from "react";
import type { AdminEvent } from "@/data/adminEventsData";
import { formatEventDate } from "@/data/adminEventsData";

export function useFeaturedEvent(events: AdminEvent[], ready: boolean) {
  return useMemo(() => {
    if (!ready) return null;
    const upcoming = events
      .filter((e) => e.status === "published" || e.status === "live")
      .filter((e) => new Date(e.date).getTime() >= Date.now() - 86400000)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] ?? null;
  }, [events, ready]);
}

export function formatFeaturedEventDate(date: string) {
  return formatEventDate(date);
}

export function getSeatsLabel(event: AdminEvent) {
  const left = event.capacity - event.registrations.length;
  return left > 0 ? `${left} seats left` : "At capacity";
}
