"use client";

import { useEffect, useState } from "react";
import { SEED_ANNOUNCEMENTS, type PlatformAnnouncement } from "@/data/platformContent";

const STORAGE_KEY = "csi-platform-announcements";

export function useAnnouncements() {
  const [items, setItems] = useState<PlatformAnnouncement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as PlatformAnnouncement[]) : SEED_ANNOUNCEMENTS);
    } catch {
      setItems(SEED_ANNOUNCEMENTS);
    }
    setReady(true);
  }, []);

  return { announcements: items, ready };
}
