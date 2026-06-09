"use client";

import React, { useState } from "react";
import DesktopWindow from "@/components/DesktopWindow";
import { AboutUs, Departments, Events, Projects, Team, Contact, CsiOfficial } from "@/components/sections";
import MacDock from "@/components/MacDock";
import CursorEyes from "@/components/CursorEyes";
import Launchpad from "@/components/Launchpad";
import LoadingScreen from "@/components/LoadingScreen";
import LiquidBackground from "@/components/LiquidBackground";

type WindowId = "about" | "depts" | "events" | "projects" | "team" | "contact" | "csi";

const windowOrder: WindowId[] = ["about", "depts", "events", "projects", "team", "contact", "csi"];

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<WindowId[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([]);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleWindow = (id: string) => {
    if (id === "more") {
      setIsLaunchpadOpen(!isLaunchpadOpen);
      return;
    }

    const winId = id as WindowId;
    if (openWindows.includes(winId)) {
      if (minimizedWindows.includes(winId)) {
        // Restore minimized window
        setMinimizedWindows(minimizedWindows.filter((w) => w !== winId));
        setActiveWindow(winId);
      } else if (activeWindow === winId) {
        // Minimize active window
        setMinimizedWindows([...minimizedWindows, winId]);
        setActiveWindow(openWindows.find((w) => w !== winId && !minimizedWindows.includes(w)) || null);
      } else {
        // Switch focus to the clicked window
        setActiveWindow(winId);
      }
    } else {
      // Open new window
      setOpenWindows([...openWindows, winId]);
      setActiveWindow(winId);
    }
  };

  const closeWindow = (id: WindowId) => {
    setOpenWindows(openWindows.filter((w) => w !== id));
    setMinimizedWindows(minimizedWindows.filter((w) => w !== id));
    if (activeWindow === id) {
      const remaining = openWindows.filter((w) => w !== id && !minimizedWindows.includes(w));
      setActiveWindow(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const minimizeWindow = (id: WindowId) => {
    if (!minimizedWindows.includes(id)) {
      setMinimizedWindows([...minimizedWindows, id]);
    }
    if (activeWindow === id) {
      const remaining = openWindows.filter((w) => w !== id && !minimizedWindows.includes(w));
      setActiveWindow(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const goToNextPage = (currentId: WindowId) => {
    const currentIndex = windowOrder.indexOf(currentId);
    const nextIndex = (currentIndex + 1) % windowOrder.length;
    const nextId = windowOrder[nextIndex];
    
    // Close current, open next
    const updated = openWindows.filter((w) => w !== currentId);
    if (!updated.includes(nextId)) {
      updated.push(nextId);
    }
    setOpenWindows(updated);
    setActiveWindow(nextId);
    setMinimizedWindows(minimizedWindows.filter((w) => w !== nextId));
  };

  const goToPrevPage = (currentId: WindowId) => {
    const currentIndex = windowOrder.indexOf(currentId);
    const prevIndex = (currentIndex - 1 + windowOrder.length) % windowOrder.length;
    const prevId = windowOrder[prevIndex];
    
    // Close current, open prev
    const updated = openWindows.filter((w) => w !== currentId);
    if (!updated.includes(prevId)) {
      updated.push(prevId);
    }
    setOpenWindows(updated);
    setActiveWindow(prevId);
    setMinimizedWindows(minimizedWindows.filter((w) => w !== prevId));
  };

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case "about": return <AboutUs />;
      case "depts": return <Departments />;
      case "events": return <Events />;
      case "projects": return <Projects />;
      case "team": return <Team />;
      case "contact": return <Contact />;
      case "csi": return <CsiOfficial />;
      default: return null;
    }
  };

  const getWindowTitle = (id: WindowId) => {
    switch (id) {
      case "about": return "About Us";
      case "depts": return "Departments";
      case "events": return "Events";
      case "projects": return "Projects";
      case "team": return "Team";
      case "contact": return "Contact";
      case "csi": return "CSI Official Site";
      default: return "Window";
    }
  };

  const launchpadItems = [
    { id: "about", label: "About Us", iconSrc: "/icons/Finder.png" },
    { id: "depts", label: "Departments", iconSrc: "/icons/Domains.jpg" },
    { id: "events", label: "Events", iconSrc: "/icons/Calendar.png" },
    { id: "projects", label: "Projects", iconSrc: "/icons/Terminal.png" },
    { id: "team", label: "Team", iconSrc: "/icons/Notion.png" },
    { id: "contact", label: "Contact", iconSrc: "/icons/Mail.png" },
    { id: "csi", label: "CSI Official", iconSrc: "/icons/CSI.png" },
  ];

  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#050505" }}>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* wallpaper background */}
      <LiquidBackground />

      {/* Eyes Layer that follows cursor */}
      <CursorEyes />

      {/* Window Manager Layer */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {openWindows.map((id, index) => (
          <div key={id} style={{ pointerEvents: "auto" }}>
            <DesktopWindow
              id={id}
              title={getWindowTitle(id)}
              isActive={activeWindow === id}
              onFocus={() => setActiveWindow(id)}
              onClose={() => closeWindow(id)}
              defaultPosition={{ x: 100 + index * 40, y: 80 + index * 40 }}
              isMinimized={minimizedWindows.includes(id)}
              onMinimize={() => minimizeWindow(id)}
              onNextPage={() => goToNextPage(id)}
              onPrevPage={() => goToPrevPage(id)}
            >
              {renderWindowContent(id)}
            </DesktopWindow>
          </div>
        ))}
      </div>

      <Launchpad 
        isOpen={isLaunchpadOpen} 
        onClose={() => setIsLaunchpadOpen(false)} 
        onOpenApp={toggleWindow} 
        items={launchpadItems} 
      />

      {/* Mac Dock Layer */}
      <MacDock 
        onOpen={toggleWindow} 
        openWindows={openWindows}
        minimizedWindows={minimizedWindows}
      />
    </main>
  );
}
