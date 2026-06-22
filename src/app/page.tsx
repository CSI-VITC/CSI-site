"use client";

import React, { useState, useEffect } from "react";
import DesktopWindow from "@/components/DesktopWindow";
import { AboutUs, Departments, Events, Projects, Team, Contact, CsiOfficial, CSITerminal } from "@/components/sections";
import MacDock from "@/components/MacDock";
import CursorEyes from "@/components/CursorEyes";
import Launchpad from "@/components/Launchpad";
import LoadingScreen from "@/components/LoadingScreen";
import Spotlight from "@/components/Spotlight";

type WindowId = "about" | "depts" | "events" | "projects" | "team" | "contact" | "csi" | "terminal";

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<WindowId[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Ctrl+K or Cmd+K opens Spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleWindow = (id: string) => {
    if (id === "more") {
      setIsLaunchpadOpen(!isLaunchpadOpen);
      return;
    }

    const winId = id as WindowId;
    if (openWindows.includes(winId)) {
      if (activeWindow === winId) {
        setOpenWindows(openWindows.filter((w) => w !== winId));
        setActiveWindow(openWindows.length > 1 ? openWindows[0] : null);
      } else {
        setActiveWindow(winId);
      }
    } else {
      setOpenWindows([...openWindows, winId]);
      setActiveWindow(winId);
    }
  };

  const closeWindow = (id: WindowId) => {
    setOpenWindows(openWindows.filter((w) => w !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.length > 1 ? openWindows[0] : null);
    }
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
      case "terminal": return null; // CSITerminal renders its own UI
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
      case "terminal": return "CSI Terminal";
      
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
    { id: "terminal", label: "CSI Terminal", iconSrc: "/icons/Terminal.png" },
  ];

  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#050505" }}>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {/* Eyes Layer that follows cursor */}
      <CursorEyes />

      {/* Window Manager Layer */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {openWindows.map((id, index) => (
          <div key={id} style={{ pointerEvents: "auto" }}>
            {id === "terminal" ? (
              <CSITerminal
                onNavigate={toggleWindow}
                onClose={() => closeWindow("terminal")}
                isActive={activeWindow === "terminal"}
                onFocus={() => setActiveWindow("terminal")}
              />
            ) : (
              <DesktopWindow
                id={id}
                title={getWindowTitle(id)}
                isActive={activeWindow === id}
                onFocus={() => setActiveWindow(id)}
                onClose={() => closeWindow(id)}
                defaultPosition={{ x: 100 + index * 40, y: 100 + index * 40 }}
              >
                {renderWindowContent(id)}
              </DesktopWindow>
            )}
          </div>
        ))}
      </div>

      <Launchpad 
        isOpen={isLaunchpadOpen} 
        onClose={() => setIsLaunchpadOpen(false)} 
        onOpenApp={toggleWindow} 
        items={launchpadItems} 
      />

      {/* Spotlight */}
      <Spotlight isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} onOpen={toggleWindow} />

      {/* Mac Dock Layer */}
      <MacDock onOpen={toggleWindow} />
    </main>
  );
}