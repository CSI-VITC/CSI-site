"use client";

import { useCallback, useEffect, useState } from "react";

const PROGRESS_KEY = "csi-roadmap-progress";

type ProgressMap = Record<string, string[]>;

export function useRoadmapProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: ProgressMap) => {
    setProgress(next);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  }, []);

  const toggleStep = useCallback(
    (roadmapId: string, stepId: string) => {
      setProgress((prev) => {
        const current = prev[roadmapId] ?? [];
        const nextSteps = current.includes(stepId)
          ? current.filter((s) => s !== stepId)
          : [...current, stepId];
        const next = { ...prev, [roadmapId]: nextSteps };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isStepComplete = useCallback(
    (roadmapId: string, stepId: string) => (progress[roadmapId] ?? []).includes(stepId),
    [progress]
  );

  const getProgressPercent = useCallback(
    (roadmapId: string, totalSteps: number) => {
      if (totalSteps === 0) return 0;
      return Math.round(((progress[roadmapId] ?? []).length / totalSteps) * 100);
    },
    [progress]
  );

  return { toggleStep, isStepComplete, getProgressPercent };
}
