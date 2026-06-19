"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  BookOpen,
  FolderKanban,
  Users,
  Megaphone,
  LayoutGrid,
  Sparkles,
  Bot,
  ArrowRight,
  Image,
  Layers,
  Zap,
  Clock,
} from "lucide-react";
import type { AdminEvent } from "@/data/adminEventsData";
import type { PlatformAnnouncement } from "@/data/platformContent";
import type { LaunchpadItemDef } from "@/lib/rbac/navigation";
import type { WindowId } from "@/components/nova/types";
import type { UserRole } from "@/types/auth";
import {
  useSpotlightSearch,
  type SpotlightResult,
  type SpotlightResultKind,
} from "@/hooks/useSpotlightSearch";
import { useSpotlightHistory } from "@/hooks/useSpotlightHistory";
import { useNovaController } from "@/context/NovaControllerContext";
import { SPOTLIGHT_SUGGESTIONS } from "@/lib/spotlightSearchUtils";
import "./SpotlightSearch.css";

export interface SpotlightSearchProps {
  open: boolean;
  onClose: () => void;
  events: AdminEvent[];
  announcements: PlatformAnnouncement[];
  launchpadItems: LaunchpadItemDef[];
  visitedApps: WindowId[];
  isAuthenticated: boolean;
  role: UserRole | null;
  eventsReady?: boolean;
  onOpenWindow: (id: WindowId) => void;
  onOpenLaunchpad: () => void;
  onGoHome: () => void;
}

function ResultIcon({ kind, iconSrc }: { kind: SpotlightResultKind; iconSrc?: string }) {
  const size = 16;

  if (iconSrc && kind === "app") {
    return (
      <div className="csi-spotlight-icon">
        <img src={iconSrc} alt="" width={20} height={20} style={{ borderRadius: 5 }} draggable={false} />
      </div>
    );
  }

  const className = `csi-spotlight-icon csi-spotlight-icon--${kind === "event" || kind === "resource" || kind === "nova" || kind === "team" ? kind : ""}`;

  const icon = (() => {
    switch (kind) {
      case "event":
        return <Calendar size={size} />;
      case "resource":
        return <BookOpen size={size} />;
      case "project":
        return <FolderKanban size={size} />;
      case "team":
        return <Users size={size} />;
      case "announcement":
        return <Megaphone size={size} />;
      case "domain":
        return <Layers size={size} />;
      case "gallery":
        return <Image size={size} />;
      case "nova":
        return <Bot size={size} />;
      case "app":
        return <LayoutGrid size={size} />;
      case "action":
        return <Zap size={size} />;
      default:
        return <Sparkles size={size} />;
    }
  })();

  return <div className={className}>{icon}</div>;
}

export function SpotlightSearch({
  open,
  onClose,
  events,
  announcements,
  launchpadItems,
  visitedApps,
  isAuthenticated,
  role,
  eventsReady = true,
  onOpenWindow,
  onOpenLaunchpad,
  onGoHome,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, recordSearch } = useSpotlightHistory();
  const { askNova } = useNovaController();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const actions = useMemo(
    () => ({
      openWindow: onOpenWindow,
      openLaunchpad: onOpenLaunchpad,
      goHome: onGoHome,
      askNova,
    }),
    [onOpenWindow, onOpenLaunchpad, onGoHome, askNova]
  );

  const { flatResults } = useSpotlightSearch({
    query,
    events,
    announcements,
    launchpadItems,
    visitedApps,
    recentSearches,
    isAuthenticated,
    role,
    actions,
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(".csi-spotlight-result--active");
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const run = useCallback(
    (result: SpotlightResult) => {
      if (result.id.startsWith("recent-")) {
        setQuery(result.title);
        return;
      }
      if (query.trim().length >= 2) recordSearch(query);
      result.action();
      onClose();
    },
    [query, recordSearch, onClose]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(flatResults.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flatResults[activeIndex]) {
        e.preventDefault();
        run(flatResults[activeIndex]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flatResults, activeIndex, onClose, run]);

  let lastGroup = "";
  const isLoading = !eventsReady && query.trim().length > 0;
  const trimmedQuery = query.trim();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="csi-spotlight-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="CSI Spotlight Search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={onClose}
        >
          <motion.div
            className="csi-spotlight-panel"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="csi-spotlight-input-row">
              <Search size={18} color="rgba(240,235,225,0.4)" aria-hidden />
              <input
                ref={inputRef}
                className="csi-spotlight-input"
                placeholder="Search or type a command — try “open events” or “ai”"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Spotlight search"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="csi-spotlight-kbd">esc</kbd>
            </div>

            <div className="csi-spotlight-body" ref={listRef}>
              {isLoading ? (
                <div className="csi-spotlight-shimmer" aria-busy="true">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="csi-spotlight-shimmer-row" />
                  ))}
                </div>
              ) : flatResults.length === 0 ? (
                <div className="csi-spotlight-empty">
                  {trimmedQuery ? (
                    <>
                      <p>No results for &ldquo;{trimmedQuery}&rdquo;</p>
                      <button
                        type="button"
                        className="csi-spotlight-fallback"
                        onClick={() => {
                          recordSearch(trimmedQuery);
                          askNova(`Tell me about ${trimmedQuery} at CSI`);
                          onClose();
                        }}
                      >
                        <Bot size={16} aria-hidden />
                        Ask Nova about this
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Search events, resources, team, projects, and apps</p>
                      <div className="csi-spotlight-chips">
                        {SPOTLIGHT_SUGGESTIONS.map((s) => (
                          <button
                            key={s.query}
                            type="button"
                            className="csi-spotlight-chip"
                            onClick={() => setQuery(s.query)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                flatResults.map((result, index) => {
                  const showHeader = result.group !== lastGroup;
                  if (showHeader) lastGroup = result.group;
                  const isRecent = result.id.startsWith("recent-");
                  return (
                    <div key={result.id}>
                      {showHeader && <div className="csi-spotlight-group-label">{result.group}</div>}
                      <button
                        type="button"
                        className={`csi-spotlight-result${index === activeIndex ? " csi-spotlight-result--active" : ""}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => run(result)}
                      >
                        {isRecent ? (
                          <div className="csi-spotlight-icon">
                            <Clock size={16} />
                          </div>
                        ) : (
                          <ResultIcon kind={result.kind} iconSrc={result.iconSrc} />
                        )}
                        <span className="csi-spotlight-text">
                          <span className="csi-spotlight-title">{result.title}</span>
                          <span className="csi-spotlight-subtitle">{result.subtitle}</span>
                          {result.description && index === activeIndex && (
                            <span className="csi-spotlight-desc">{result.description}</span>
                          )}
                        </span>
                        {result.shortcut && <kbd className="csi-spotlight-kbd">{result.shortcut}</kbd>}
                        {index === activeIndex && (
                          <ArrowRight size={14} color="rgba(240,235,225,0.35)" aria-hidden />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="csi-spotlight-footer">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate · <kbd>↵</kbd> open · <kbd>esc</kbd> close
              </span>
              <span>{flatResults.length > 0 ? `${flatResults.length} results` : "CSI Spotlight"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SpotlightSearch as DesktopCommandPalette };
