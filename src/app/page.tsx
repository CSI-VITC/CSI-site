"use client";

import React, { useState, useEffect, useCallback } from "react";
import DesktopWindow from "@/components/DesktopWindow";
import dynamic from "next/dynamic";

const AboutUs = dynamic(() => import("@/components/sections/AboutUs").then((m) => m.AboutUs), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading About Us...</div>,
  ssr: false
});

const Departments = dynamic(() => import("@/components/sections/Departments").then((m) => m.Departments), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Departments...</div>,
  ssr: false
});

const Events = dynamic(() => import("@/components/sections/Events").then((m) => m.Events), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Events...</div>,
  ssr: false
});

const Projects = dynamic(() => import("@/components/sections/Projects").then((m) => m.Projects), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Projects...</div>,
  ssr: false
});

const Team = dynamic(() => import("@/components/sections/Team").then((m) => m.Team), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Team...</div>,
  ssr: false
});

const Contact = dynamic(() => import("@/components/sections/Contact").then((m) => m.Contact), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Contact...</div>,
  ssr: false
});

const CsiOfficial = dynamic(() => import("@/components/sections/CsiOfficial").then((m) => m.CsiOfficial), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Official Site...</div>,
  ssr: false
});

const NeuralHub = dynamic(() => import("@/components/sections/NeuralHub").then((m) => m.NeuralHub), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Neural Hub...</div>,
  ssr: false
});

const Terminal = dynamic(() => import("@/components/sections/Terminal").then((m) => m.Terminal), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Terminal...</div>,
  ssr: false
});

const Arcade = dynamic(() => import("@/components/sections/Arcade").then((m) => m.Arcade), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Arcade...</div>,
  ssr: false
});

const CodeEditor = dynamic(() => import("@/components/sections/CodeEditor").then((m) => m.CodeEditor), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Editor...</div>,
  ssr: false
});

const VipTicket = dynamic(() => import("@/components/sections/VipTicket").then((m) => m.VipTicket), {
  loading: () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.5)" }}>Loading Ticket...</div>,
  ssr: false
});

import MacDock from "@/components/MacDock";
import Launchpad from "@/components/Launchpad";
import LoadingScreen from "@/components/LoadingScreen";
import Menubar from "@/components/Menubar";
import ContextMenu from "@/components/ContextMenu";
import Wallpaper, { WallpaperType } from "@/components/Wallpaper";
import CursorGlow from "@/components/CursorGlow";
import ActionCenter from "@/components/ActionCenter";
import DesktopWidgets from "@/components/DesktopWidgets";
import SpotlightSearch from "@/components/SpotlightSearch";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type WindowId = "about" | "depts" | "events" | "projects" | "team" | "contact" | "csi" | "neural" | "terminal" | "arcade" | "editor" | "ticket";

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<WindowId[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<WindowId[]>([]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChallengeUnlocked, setIsChallengeUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wallpaper, setWallpaper] = useState<WallpaperType>("neural");

  // Spotlight Search keyboard listener (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const moveX = useTransform(springX, [-1000, 1000], [-15, 15]);
  const moveY = useTransform(springY, [-1000, 1000], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = clientX - (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
    const y = clientY - (typeof window !== "undefined" ? window.innerHeight / 2 : 0);
    mouseX.set(x);
    mouseY.set(y);
  };

  const toggleWindow = (id: string) => {
    if (id === "more") {
      setIsLaunchpadOpen(!isLaunchpadOpen);
      return;
    }

    if (id === "control") {
      setIsActionCenterOpen(!isActionCenterOpen);
      return;
    }

    const winId = id as WindowId;
    
    // If minimized, restore it
    if (minimizedWindows.includes(winId)) {
      setMinimizedWindows(minimizedWindows.filter(w => w !== winId));
      setActiveWindow(winId);
      return;
    }

    if (openWindows.includes(winId)) {
      if (activeWindow === winId) {
        // If already active and clicked again in dock, minimize it (optional macOS behavior)
        setMinimizedWindows([...minimizedWindows, winId]);
        setActiveWindow(null);
      } else {
        // Bring to front
        setActiveWindow(winId);
      }
    } else {
      // Open new
      setOpenWindows([...openWindows, winId]);
      setActiveWindow(winId);
    }
  };

  const closeWindow = (id: WindowId) => {
    setOpenWindows(openWindows.filter((w) => w !== id));
    setMinimizedWindows(minimizedWindows.filter((w) => w !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const minimizeWindow = (id: WindowId) => {
    setMinimizedWindows([...minimizedWindows, id]);
    setActiveWindow(null);
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
      case "neural": return <NeuralHub />;
      case "terminal": return <Terminal />;
      case "arcade": return <Arcade />;
      case "editor": return <CodeEditor onUnlockChallenge={() => setIsChallengeUnlocked(true)} />;
      case "ticket": return <VipTicket />;
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
      case "neural": return "Interactive Neural Hub";
      case "terminal": return "Terminal";
      case "arcade": return "CSI Arcade Game";
      case "editor": return "CSI Code Editor Challenge";
      case "ticket": return "CSI VIP Access Ticket";
      default: return "Window";
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const desktopIcons = [
    { id: "csi", label: "CSI Official", icon: "/icons/CSI_Doodle.svg" },
    { id: "about", label: "Read Me", icon: "/icons/Readme_Doodle.svg" },
    { id: "neural", label: "Neural Hub", icon: "/icons/Neural_Doodle.svg" },
    { id: "terminal", label: "Terminal", icon: "/icons/Terminal_Doodle.svg" },
    { id: "editor", label: "Challenge.js", icon: "/icons/Editor_Doodle.svg" },
    ...(isChallengeUnlocked ? [{ id: "ticket", label: "VIP Ticket", icon: "/icons/Ticket_Doodle.svg" }] : [])
  ];

  const launchpadItems = [
    { id: "about", label: "About Us", iconSrc: "/icons/Readme_Doodle.svg" },
    { id: "depts", label: "Departments", iconSrc: "/icons/Domains_Doodle.svg" },
    { id: "events", label: "Events", iconSrc: "/icons/Events_Doodle.svg" },
    { id: "projects", label: "Projects", iconSrc: "/icons/Projects_Doodle.svg" },
    { id: "team", label: "Team", iconSrc: "/icons/Team_Doodle.svg" },
    { id: "contact", label: "Contact", iconSrc: "/icons/Mail_Doodle.svg" },
    { id: "csi", label: "CSI Official", iconSrc: "/icons/CSI_Doodle.svg" },
    { id: "neural", label: "Neural Hub", iconSrc: "/icons/Neural_Doodle.svg" },
    { id: "terminal", label: "Terminal", iconSrc: "/icons/Terminal_Doodle.svg" },
    { id: "arcade", label: "Arcade Game", iconSrc: "/icons/Arcade_Doodle.svg" },
    { id: "editor", label: "Code Editor", iconSrc: "/icons/Editor_Doodle.svg" },
    ...(isChallengeUnlocked ? [{ id: "ticket", label: "VIP Ticket", iconSrc: "/icons/Ticket_Doodle.svg" }] : [])
  ];

  return (
    <main 
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
      style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#050505" }}
    >
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <ActionCenter 
        isOpen={isActionCenterOpen} 
        onClose={() => setIsActionCenterOpen(false)} 
        currentWallpaper={wallpaper}
        onWallpaperChange={setWallpaper}
      />

      {/* Interactive Background Layers with Parallax */}
      <motion.div style={{ x: moveX, y: moveY, position: "absolute", inset: "-50px", zIndex: 0 }}>
        <Wallpaper type={wallpaper} />
      </motion.div>
      <CursorGlow />
      <DesktopWidgets />

      {/* Desktop Icons - Pinned to Desktop Grid */}
      <div 
        style={{ 
          position: "absolute", 
          top: "30px", 
          right: "20px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "24px", 
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {desktopIcons.map((icon) => (
          <motion.div
            key={icon.id}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onDoubleClick={() => toggleWindow(icon.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", width: "85px" }}
          >
            <div style={{ 
              width: "60px", 
              height: "60px", 
              marginBottom: "8px",
              filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.4))",
            }}>
              <img src={icon.icon} alt={icon.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <span style={{ 
              color: "rgba(255,255,255,0.95)", 
              fontSize: "12px", 
              fontWeight: 500,
              textShadow: "0 1px 3px rgba(0,0,0,0.6)", 
              textAlign: "center", 
              background: "rgba(255,255,255,0.06)", 
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "3px 8px", 
              borderRadius: "6px" 
            }}>
              {icon.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Window Manager Layer */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, pointerEvents: "none" }}>
        <AnimatePresence>
          {openWindows.map((id) => (
            <DesktopWindow
              key={id}
              id={id}
              title={getWindowTitle(id)}
              isActive={activeWindow === id}
              isMinimized={minimizedWindows.includes(id)}
              onFocus={() => setActiveWindow(id)}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              defaultPosition={{ x: 80 + (openWindows.indexOf(id) * 40), y: 80 + (openWindows.indexOf(id) * 40) }}
            >
              {renderWindowContent(id)}
            </DesktopWindow>
          ))}
        </AnimatePresence>
      </div>

      <Launchpad 
        isOpen={isLaunchpadOpen} 
        onClose={() => setIsLaunchpadOpen(false)} 
        onOpenApp={toggleWindow} 
        items={launchpadItems} 
      />

      {/* Mac Dock Layer */}
      <MacDock onOpen={toggleWindow} openApps={openWindows} isChallengeUnlocked={isChallengeUnlocked} />

      {/* Spotlight Search Panel */}
      <SpotlightSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={toggleWindow} 
      />

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            items={[
              { label: "New Folder", onClick: () => console.log("New Folder") },
              { label: "Get Info", onClick: () => toggleWindow("about") },
              { label: "Change Wallpaper...", onClick: () => setIsActionCenterOpen(true), separator: true },
              { label: "Use Stacks", onClick: () => console.log("Stacks") },
              { label: "Sort By", onClick: () => console.log("Sort") },
              { label: "Clean Up By", onClick: () => console.log("Clean Up"), separator: true },
              { label: "Show View Options", onClick: () => console.log("Options") },
            ]}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
