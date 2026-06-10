"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Plus, Undo2, Command } from "lucide-react";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { generateNovaAdminInsights, type AdminEvent } from "@/data/adminEventsData";
import { EventKanban } from "./EventKanban";
import { EventTimeline } from "./EventTimeline";
import { LiveAnalytics } from "./LiveAnalytics";
import { EventCreatePanel } from "./EventCreatePanel";
import { EventDetailPanel } from "./EventDetailPanel";
import { NovaAdminInsights } from "./NovaAdminInsights";
import { NovaAdminGuide } from "./NovaAdminGuide";
import { AdminA11yProvider } from "./a11y/AdminA11yContext";
import { CommandPalette, type CommandItem } from "./a11y/CommandPalette";
import { AccessibilityToolbar, AemToastBar, type AemToastData, AemTooltip } from "./a11y/AemUi";
import { AdminBadge } from "@/components/auth/AdminBadge";
import { usePermissions } from "@/hooks/usePermissions";
import "./AdminEvents.css";

type View = "board" | "timeline" | "analytics";

function AdminEventManagementInner() {
  const { canManageEvents } = usePermissions();
  const {
    events,
    ready,
    undo,
    canUndo,
    createEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    moveEvent,
    archiveEvent,
    publishEvent,
    addRegistration,
    removeRegistration,
  } = useAdminEvents();

  const [view, setView] = useState<View>("board");
  const [selected, setSelected] = useState<AdminEvent | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createOrigin, setCreateOrigin] = useState({ x: 0, y: 0 });
  const [showArchived, setShowArchived] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toast, setToast] = useState<AemToastData | null>(null);

  const notify = useCallback((message: string, type: AemToastData["type"] = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const displayEvents = useMemo(() => {
    const base = showArchived ? events : events.filter((e) => e.status !== "archived");
    if (!selected) return base;
    return base.filter((e) => e.id !== selected.id);
  }, [events, showArchived, selected]);

  const insights = useMemo(() => generateNovaAdminInsights(events), [events]);

  useEffect(() => {
    if (!selected) return;
    const next = events.find((e) => e.id === selected.id);
    if (next) setSelected(next);
    else setSelected(null);
  }, [events, selected?.id]);

  const openCreate = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCreateOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } else {
      setCreateOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
    }
    setCreateOpen(true);
  };

  const handleUndo = useCallback(() => {
    if (undo()) notify("Action undone", "info");
    else notify("Nothing to undo", "error");
  }, [undo, notify]);

  const commands: CommandItem[] = useMemo(
    () => [
      { id: "create", label: "Create Event", shortcut: "N", action: () => openCreate() },
      { id: "board", label: "Go to Board", shortcut: "1", action: () => setView("board") },
      { id: "timeline", label: "Go to Timeline", shortcut: "2", action: () => setView("timeline") },
      { id: "analytics", label: "Go to Analytics", shortcut: "3", action: () => setView("analytics") },
      { id: "undo", label: "Undo last action", shortcut: "⌘Z", action: handleUndo },
      { id: "archived", label: "Toggle archived events", action: () => setShowArchived((v) => !v) },
    ],
    [canUndo, handleUndo]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(true);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (cmdOpen || createOpen || selected) return;
      if (e.key === "n" && !e.metaKey && !e.ctrlKey) openCreate();
      if (e.key === "1") setView("board");
      if (e.key === "2") setView("timeline");
      if (e.key === "3") setView("analytics");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdOpen, createOpen, selected, handleUndo]);

  return (
    <LayoutGroup>
      <div className="aem-root" role="application" aria-label="CSI Event Management">
        <a href="#aem-main-content" className="aem-skip-link">
          Skip to main content
        </a>
        <header className="aem-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 className="aem-title" id="aem-main-heading">
                Event Management
              </h1>
              <AdminBadge />
            </div>
            <p className="aem-subtitle">Create, publish, and track CSI events</p>
            <NovaAdminGuide view={view} />
          </div>
          <div className="aem-header-actions">
            <AccessibilityToolbar />
            <div className="aem-view-tabs" role="tablist" aria-label="Dashboard views">
              {(["board", "timeline", "analytics"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  id={`tab-${v}`}
                  aria-selected={view === v}
                  aria-controls="aem-main-content"
                  className={`aem-view-tab${view === v ? " aem-view-tab--active" : ""}`}
                  onClick={() => setView(v)}
                >
                  {v === "board" ? "Board" : v === "timeline" ? "Timeline" : "Analytics"}
                </button>
              ))}
            </div>
            <AemTooltip label="Undo last action" shortcut="⌘Z">
              <button
                type="button"
                className="aem-btn"
                onClick={handleUndo}
                disabled={!canUndo}
                aria-label="Undo last action"
              >
                <Undo2 size={16} aria-hidden="true" />
              </button>
            </AemTooltip>
            <AemTooltip label="Command palette" description="Ctrl+K or ⌘K">
              <button type="button" className="aem-btn" onClick={() => setCmdOpen(true)} aria-label="Open command palette">
                <Command size={16} aria-hidden="true" />
              </button>
            </AemTooltip>
            <AemTooltip label="Create new event" description="Shortcut: N">
              <button type="button" className="aem-btn aem-btn--primary" onClick={openCreate} disabled={!canManageEvents()}>
                <Plus size={16} aria-hidden="true" /> Create Event
              </button>
            </AemTooltip>
          </div>
        </header>

        <NovaAdminInsights insights={insights} />

        <div className="aem-body" id="aem-main-content" role="tabpanel" aria-labelledby={`tab-${view}`}>
          {!ready ? (
            <div className="aem-loading-state" role="status" aria-live="polite">
              <div className="aem-loading-spinner" aria-hidden="true" />
              Loading events…
            </div>
          ) : view === "board" ? (
            displayEvents.filter((e) => e.status !== "archived").length === 0 && !showArchived ? (
              <div className="aem-empty-state" role="status">
                <h3>No events on the board</h3>
                <p>Create your first event to start managing registrations and publishing to students.</p>
                <button type="button" className="aem-btn aem-btn--primary" onClick={() => openCreate()}>
                  Create Event
                </button>
              </div>
            ) : (
              <>
                <EventKanban events={displayEvents} onMove={moveEvent} onOpenEvent={setSelected} />
                <div style={{ padding: "0 18px 12px" }}>
                  <button
                    type="button"
                    className="aem-archive-toggle"
                    onClick={() => setShowArchived(!showArchived)}
                    aria-pressed={showArchived}
                  >
                    {showArchived
                      ? "Hide archived events"
                      : `Show archived (${events.filter((e) => e.status === "archived").length})`}
                  </button>
                </div>
              </>
            )
          ) : view === "timeline" ? (
            <EventTimeline events={displayEvents} onOpenEvent={setSelected} />
          ) : (
            <LiveAnalytics events={events} />
          )}
        </div>

        <EventCreatePanel
          open={createOpen}
          origin={createOrigin}
          onClose={() => setCreateOpen(false)}
          onCreate={(data) => {
            createEvent(data);
            notify(`"${data.title}" created as draft`);
          }}
          onError={(msg) => notify(msg, "error")}
        />

        <AnimatePresence>
          {selected && (
            <EventDetailPanel
              event={selected}
              onClose={() => setSelected(null)}
              onUpdate={(patch) => updateEvent(selected.id, patch)}
              onDelete={() => {
                deleteEvent(selected.id);
                setSelected(null);
                notify("Event deleted", "info");
              }}
              onDuplicate={() => {
                const copy = duplicateEvent(selected.id);
                if (copy) {
                  setSelected(copy);
                  notify("Event duplicated");
                }
              }}
              onArchive={() => {
                archiveEvent(selected.id);
                setSelected(null);
                notify("Event archived");
              }}
              onPublish={() => {
                publishEvent(selected.id);
                notify("Event published");
              }}
              onAddRegistration={(name, email) => addRegistration(selected.id, { name, email })}
              onRemoveRegistration={(regId) => removeRegistration(selected.id, regId)}
              onNotify={notify}
            />
          )}
        </AnimatePresence>

        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} commands={commands} />
        <AemToastBar toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </LayoutGroup>
  );
}

export default function AdminEventManagement() {
  return (
    <AdminA11yProvider>
      <AdminEventManagementInner />
    </AdminA11yProvider>
  );
}
