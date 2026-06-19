"use client";

import { useCallback, useEffect, useState } from "react";

const RECENT_KEY = "csi-spotlight-recent";
const MAX_RECENT = 6;

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(items: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

export function useSpotlightHistory() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecentSearches(loadRecent());
    setReady(true);
  }, []);

  const recordSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_RECENT
      );
      saveRecent(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    saveRecent([]);
  }, []);

  return { recentSearches: ready ? recentSearches : [], recordSearch, clearRecent };
}
