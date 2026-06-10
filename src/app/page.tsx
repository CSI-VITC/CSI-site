"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import DesktopWindow, { WINDOW_WIDTH, WINDOW_HEIGHT, MENU_BAR_INSET } from "@/components/DesktopWindow";
import {
  AboutUs,
  Departments,
  UserEvents,
  Gallery,
  Projects,
  Team,
  Contact,
  CsiOfficial,
  ResourceHub,
  AdminEventManagement,
  Dashboard,
  ProfilePanel,
} from "@/components/sections";
import MacDock from "@/components/MacDock";
import CursorEyes from "@/components/CursorEyes";
import Launchpad from "@/components/Launchpad";
import LoadingScreen from "@/components/LoadingScreen";
import { CsiNovaAssistant } from "@/components/nova";
import MinimizedWindowStrip from "@/components/MinimizedWindowStrip";
import AchievementToast from "@/components/interactions/AchievementToast";
import { InteractionProvider, useInteraction } from "@/context/InteractionContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { MenuBar } from "@/components/auth/MenuBar";
import { ProtectedWindowContent } from "@/components/auth/ProtectedWindowContent";
import { AdminConsole } from "@/components/admin-console/AdminConsole";
import { AdminAnalyticsPanel } from "@/components/admin-console/AdminAnalyticsPanel";
import { AdminUsers } from "@/components/admin-console/AdminUsers";
import { AdminResourceMgmt } from "@/components/admin-console/AdminResourceMgmt";
import { AdminGalleryMgmt } from "@/components/admin-console/AdminGalleryMgmt";
import { AdminAnnouncements } from "@/components/admin-console/AdminAnnouncements";
import { AdminCertificates } from "@/components/admin-console/AdminCertificates";
import { usePermissions } from "@/hooks/usePermissions";
import { getDockItems, getLaunchpadItems, WINDOW_TITLES } from "@/lib/rbac/navigation";
import type { WindowId } from "@/components/nova/types";

function getWindowPosition(index: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const workspaceH = vh - MENU_BAR_INSET;
  return {
    x: Math.max(40, (vw - WINDOW_WIDTH) / 2 + index * 34),
    y: Math.max(8, (workspaceH - WINDOW_HEIGHT) / 2 - 48 + index * 34),
  };
}

function DesktopContent() {
  const { isAuthenticated, role } = useAuth();
  const { getWindowGate } = usePermissions();
  const [openWindows, setOpenWindows] = useState<WindowId[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [windowPositions, setWindowPositions] = useState<Partial<Record<WindowId, { x: number; y: number }>>>({});
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    syncOpenWindows,
    recordAppVisit,
    activeAchievement,
    dismissAchievement,
    registerHeroClick,
  } = useInteraction();

  const dockItems = useMemo(() => getDockItems(isAuthenticated, role), [isAuthenticated, role]);
  const launchpadItems = useMemo(
    () =>
      getLaunchpadItems(isAuthenticated, role).map((item) => ({
        id: item.id,
        label: item.label,
        iconSrc: item.iconSrc,
      })),
    [isAuthenticated, role]
  );

  useEffect(() => {
    syncOpenWindows(openWindows);
  }, [openWindows, syncOpenWindows]);

  const openWindow = useCallback(
    (id: WindowId) => {
      setOpenWindows((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        setWindowPositions((positions) => ({
          ...positions,
          [id]: positions[id] ?? getWindowPosition(next.length - 1),
        }));
        return next;
      });
      setMinimizedWindows((prev) => prev.filter((w) => w !== id));
      setActiveWindow(id);
      recordAppVisit(id);
    },
    [recordAppVisit]
  );

  const goHome = useCallback(() => {
    openWindow(isAuthenticated ? "dashboard" : "about");
  }, [isAuthenticated, openWindow]);

  const handleAuthenticated = useCallback(() => {
    openWindow("dashboard");
  }, [openWindow]);

  const updateWindowPosition = (id: WindowId, position: { x: number; y: number }) => {
    setWindowPositions((prev) => ({ ...prev, [id]: position }));
  };

  const minimizeWindow = (id: WindowId) => {
    setMinimizedWindows((prev) => {
      if (prev.includes(id)) return prev;
      const nextMin = [...prev, id];
      setOpenWindows((open) => {
        setActiveWindow((current) => {
          if (current !== id) return current;
          const candidates = open.filter((w) => w !== id && !nextMin.includes(w));
          return candidates.length ? candidates[candidates.length - 1] : null;
        });
        return open;
      });
      return nextMin;
    });
  };

  const restoreWindow = (id: WindowId) => {
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setActiveWindow(id);
  };

  const toggleWindow = useCallback(
    (id: string) => {
      if (id === "more") {
        setIsLaunchpadOpen((v) => !v);
        return;
      }

      const winId = id as WindowId;

      if (!openWindows.includes(winId)) {
        openWindow(winId);
        return;
      }

      if (minimizedWindows.includes(winId)) {
        restoreWindow(winId);
        return;
      }

      if (activeWindow === winId) {
        minimizeWindow(winId);
      } else {
        setActiveWindow(winId);
      }
    },
    [openWindows, minimizedWindows, activeWindow, openWindow]
  );

  const closeWindow = (id: WindowId) => {
    setMinimizedWindows((prevMin) => {
      const nextMin = prevMin.filter((w) => w !== id);
      setOpenWindows((prevOpen) => {
        const nextOpen = prevOpen.filter((w) => w !== id);
        setActiveWindow((current) => {
          if (current !== id) return current;
          const remaining = nextOpen.filter((w) => !nextMin.includes(w));
          return remaining.length ? remaining[remaining.length - 1] : null;
        });
        return nextOpen;
      });
      return nextMin;
    });
  };

  const renderWindowContent = (id: WindowId) => {
    const inner = (() => {
      switch (id) {
        case "dashboard":
          return <Dashboard onNavigate={openWindow} />;
        case "profile":
          return <ProfilePanel />;
        case "events":
          return <UserEvents />;
        case "gallery":
          return <Gallery />;
        case "about":
          return <AboutUs />;
        case "depts":
          return <Departments />;
        case "projects":
          return <Projects />;
        case "team":
          return <Team />;
        case "contact":
          return <Contact />;
        case "csi":
          return <CsiOfficial />;
        case "resources":
          return <ResourceHub />;
        case "admin-console":
          return <AdminConsole onNavigate={openWindow} />;
        case "admin-analytics":
          return <AdminAnalyticsPanel />;
        case "event-admin":
          return <AdminEventManagement />;
        case "admin-users":
          return <AdminUsers />;
        case "admin-resources":
          return <AdminResourceMgmt />;
        case "admin-gallery":
          return <AdminGalleryMgmt />;
        case "admin-announcements":
          return <AdminAnnouncements />;
        case "admin-certificates":
          return <AdminCertificates />;
        default:
          return null;
      }
    })();

    return (
      <ProtectedWindowContent
        windowId={id}
        onReturn={() => {
          closeWindow(id);
          goHome();
        }}
        onContact={() => {
          closeWindow(id);
          openWindow("contact");
        }}
      >
        {inner}
      </ProtectedWindowContent>
    );
  };

  const getWindowTitle = (id: WindowId) => WINDOW_TITLES[id] ?? "Window";

  const guardedNavigate = useCallback(
    (id: string) => {
      if (id === "more") {
        toggleWindow(id);
        return;
      }
      const winId = id as WindowId;
      const gate = getWindowGate(winId);
      if (gate !== "allowed" && !openWindows.includes(winId)) {
        openWindow(winId);
        return;
      }
      toggleWindow(id);
    },
    [getWindowGate, openWindows, openWindow, toggleWindow]
  );

  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#050505" }}>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <MenuBar />
      <AuthModal onAuthenticated={handleAuthenticated} />
      <CursorEyes onHeroInteract={registerHeroClick} />

      <div
        style={{
          position: "absolute",
          top: MENU_BAR_INSET,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {openWindows.map((id, index) => (
            <DesktopWindow
              key={id}
              id={id}
              title={getWindowTitle(id)}
              isActive={activeWindow === id}
              isMinimized={minimizedWindows.includes(id)}
              onFocus={() => {
                if (minimizedWindows.includes(id)) {
                  restoreWindow(id);
                } else {
                  setActiveWindow(id);
                }
              }}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onPositionChange={(position) => updateWindowPosition(id, position)}
              stackIndex={index}
              minimizedSlotIndex={minimizedWindows.includes(id) ? minimizedWindows.indexOf(id) : 0}
              position={windowPositions[id] ?? getWindowPosition(index)}
            >
              {renderWindowContent(id)}
            </DesktopWindow>
          ))}
        </AnimatePresence>
      </div>

      <MinimizedWindowStrip windows={minimizedWindows} onRestore={(id) => restoreWindow(id as WindowId)} />

      <Launchpad
        isOpen={isLaunchpadOpen}
        onClose={() => setIsLaunchpadOpen(false)}
        onOpenApp={guardedNavigate}
        items={launchpadItems}
      />

      <MacDock onOpen={guardedNavigate} openApps={openWindows} activeApp={activeWindow} items={dockItems} />
      <CsiNovaAssistant onNavigate={guardedNavigate} />
      <AchievementToast activeId={activeAchievement} onDismiss={dismissAchievement} />
    </main>
  );
}

export default function Desktop() {
  return (
    <AuthProvider>
      <InteractionProvider>
        <DesktopContent />
      </InteractionProvider>
    </AuthProvider>
  );
}
