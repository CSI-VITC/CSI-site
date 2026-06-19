"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { WindowId } from "@/components/nova/types";
import {
  ACHIEVEMENTS,
  CORE_APP_IDS,
  type AchievementId,
} from "@/data/interactionContent";

const ACH_STORAGE_KEY = "csi-achievements";

export interface NovaSessionContext {
  hour: number;
  openWindows: WindowId[];
  visitedApps: WindowId[];
  achievements: AchievementId[];
  novaOpened: boolean;
}

interface InteractionContextValue {
  openWindows: WindowId[];
  visitedApps: WindowId[];
  syncOpenWindows: (windows: WindowId[]) => void;
  recordAppVisit: (id: WindowId) => void;
  recordNovaOpen: () => void;
  recordCommandPalette: () => void;
  recordBookmark: () => void;
  recordEventRegistration: () => void;
  recordRoadmapProgress: () => void;
  unlockAchievement: (id: AchievementId) => void;
  getNovaContext: () => NovaSessionContext;
  unlockedAchievements: AchievementId[];
  activeAchievement: AchievementId | null;
  dismissAchievement: () => void;
  registerHeroClick: () => void;
}

const InteractionContext = createContext<InteractionContextValue | null>(null);

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

function loadAchievements(): Set<AchievementId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(ACH_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as AchievementId[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveAchievements(ids: Set<AchievementId>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACH_STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [openWindows, setOpenWindows] = useState<WindowId[]>([]);
  const [visitedApps, setVisitedApps] = useState<Set<WindowId>>(new Set());
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(new Set());
  const [ready, setReady] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState<AchievementId | null>(null);
  const [novaOpened, setNovaOpened] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const konamiIndex = useRef(0);
  const heroClicks = useRef<number[]>([]);

  useEffect(() => {
    setUnlocked(loadAchievements());
    setReady(true);
  }, []);

  const unlockAchievement = useCallback((id: AchievementId) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveAchievements(next);
      setActiveAchievement(id);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      dismissTimer.current = setTimeout(() => setActiveAchievement(null), 3800);
      return next;
    });
  }, []);

  const dismissAchievement = useCallback(() => {
    setActiveAchievement(null);
  }, []);

  const recordAppVisit = useCallback(
    (id: WindowId) => {
      setVisitedApps((prev) => {
        const next = new Set(prev);
        const isFirst = next.size === 0;
        next.add(id);
        if (isFirst) unlockAchievement("first_explore");
        if (CORE_APP_IDS.every((app) => next.has(app))) {
          unlockAchievement("desktop_master");
        }
        return next;
      });
    },
    [unlockAchievement]
  );

  const recordNovaOpen = useCallback(() => {
    setNovaOpened(true);
    unlockAchievement("nova_connected");
  }, [unlockAchievement]);

  const recordCommandPalette = useCallback(() => {
    unlockAchievement("command_master");
  }, [unlockAchievement]);

  const recordBookmark = useCallback(() => {
    unlockAchievement("resource_hunter");
  }, [unlockAchievement]);

  const recordEventRegistration = useCallback(() => {
    unlockAchievement("event_enthusiast");
  }, [unlockAchievement]);

  const recordRoadmapProgress = useCallback(() => {
    unlockAchievement("roadmap_starter");
  }, [unlockAchievement]);

  const registerHeroClick = useCallback(() => {
    const now = Date.now();
    heroClicks.current = heroClicks.current.filter((t) => now - t < 600);
    heroClicks.current.push(now);
    if (heroClicks.current.length >= 3) {
      heroClicks.current = [];
      unlockAchievement("power_explorer");
    }
  }, [unlockAchievement]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0;
          unlockAchievement("power_explorer");
        }
      } else {
        konamiIndex.current = 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [unlockAchievement]);

  const getNovaContext = useCallback((): NovaSessionContext => {
    return {
      hour: new Date().getHours(),
      openWindows,
      visitedApps: Array.from(visitedApps),
      achievements: Array.from(unlocked),
      novaOpened,
    };
  }, [openWindows, visitedApps, unlocked, novaOpened]);

  const syncOpenWindows = useCallback((windows: WindowId[]) => {
    setOpenWindows(windows);
  }, []);

  const unlockedAchievements = useMemo(() => Array.from(unlocked), [unlocked]);
  const visitedAppsList = useMemo(() => Array.from(visitedApps), [visitedApps]);

  const value = useMemo(
    () => ({
      openWindows,
      visitedApps: visitedAppsList,
      syncOpenWindows,
      recordAppVisit,
      recordNovaOpen,
      recordCommandPalette,
      recordBookmark,
      recordEventRegistration,
      recordRoadmapProgress,
      unlockAchievement,
      getNovaContext,
      unlockedAchievements: ready ? unlockedAchievements : [],
      activeAchievement,
      dismissAchievement,
      registerHeroClick,
    }),
    [
      openWindows,
      visitedAppsList,
      syncOpenWindows,
      recordAppVisit,
      recordNovaOpen,
      recordCommandPalette,
      recordBookmark,
      recordEventRegistration,
      recordRoadmapProgress,
      unlockAchievement,
      getNovaContext,
      unlockedAchievements,
      ready,
      activeAchievement,
      dismissAchievement,
      registerHeroClick,
    ]
  );

  return (
    <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>
  );
}

export function useInteraction() {
  const ctx = useContext(InteractionContext);
  if (!ctx) throw new Error("useInteraction must be used within InteractionProvider");
  return ctx;
}

export { ACHIEVEMENTS };
