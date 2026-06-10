"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AdminEvent, EventStatus } from "@/data/adminEventsData";
import { EVENT_STATUSES, KANBAN_COLUMNS } from "@/data/adminEventsData";
import { EventGlassCard } from "./EventGlassCard";
import { useOptionalAdminA11y } from "./a11y/AdminA11yContext";

interface EventKanbanProps {
  events: AdminEvent[];
  onMove: (id: string, status: EventStatus) => void;
  onOpenEvent: (event: AdminEvent) => void;
}

export function EventKanban({ events, onMove, onOpenEvent }: EventKanbanProps) {
  const a11y = useOptionalAdminA11y();
  const reduced = a11y?.reducedMotion ?? false;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<EventStatus | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; col: EventStatus } | null>(null);

  const visible = events.filter((e) => e.status !== "archived");

  const handleDrop = (status: EventStatus, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/event-id");
    if (id) {
      onMove(id, status);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, col: status });
      setTimeout(() => setRipple(null), 600);
    }
    setDragOverCol(null);
    setDraggingId(null);
  };

  return (
    <div className="aem-kanban" role="region" aria-label="Event board">
      <p className="sr-only">
        Use drag and drop to move events between columns, or open an event with Enter. Press Tab to navigate.
      </p>
      {KANBAN_COLUMNS.map((colId) => {
        const meta = EVENT_STATUSES.find((s) => s.id === colId)!;
        const colEvents = visible.filter((e) => e.status === colId);
        const isOver = dragOverCol === colId;

        return (
          <motion.section
            key={colId}
            className={`aem-column${isOver ? " aem-column--drag-over" : ""}`}
            aria-label={`${meta.label} column, ${colEvents.length} events`}
            animate={reduced ? {} : { x: draggingId && !isOver ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(colId);
            }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(colId, e)}
          >
            <div className="aem-column-header">
              <span className="aem-column-title" style={{ color: meta.color }}>
                {meta.label}
              </span>
              <span className="aem-column-count" aria-label={`${colEvents.length} events`}>
                {colEvents.length}
              </span>
            </div>
            <div className="aem-column-body">
              {colEvents.length === 0 ? (
                <p className="aem-empty-state" style={{ padding: "16px 8px", fontSize: "0.75rem" }} role="status">
                  No {meta.label.toLowerCase()} events
                </p>
              ) : (
                <AnimatePresence mode="popLayout">
                  {colEvents.map((event) => (
                    <EventGlassCard
                      key={event.id}
                      event={event}
                      isDragging={draggingId === event.id}
                      onOpen={() => onOpenEvent(event)}
                      onDragStart={() => setDraggingId(event.id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDragOverCol(null);
                      }}
                      onMoveStatus={(status) => onMove(event.id, status)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
            {ripple?.col === colId && !reduced && (
              <motion.span
                className="aem-drop-ripple"
                style={{ left: ripple.x, top: ripple.y }}
                initial={{ width: 0, height: 0, opacity: 0.6 }}
                animate={{ width: 120, height: 120, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                aria-hidden="true"
              />
            )}
          </motion.section>
        );
      })}
    </div>
  );
}
