"use client";

import { useCallback, useEffect, useState } from "react";

const BOOKMARKS_KEY = "csi-resource-bookmarks";

export function useResourceBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    setBookmarks(next);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  }, []);

  const toggleBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => {
        const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked, ready };
}
