"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SEED_EVENTS, type AdminEvent, type EventStatus, type Registration } from "@/data/adminEventsData";

const STORAGE_KEY = "csi-admin-events";
const MAX_UNDO = 25;

function uid() {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useAdminEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [ready, setReady] = useState(false);
  const undoStack = useRef<AdminEvent[][]>([]);
  const [undoCount, setUndoCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setEvents(stored ? JSON.parse(stored) : SEED_EVENTS);
    } catch {
      setEvents(SEED_EVENTS);
    }
    setReady(true);
  }, []);

  const pushUndo = useCallback((snapshot: AdminEvent[]) => {
    undoStack.current = [...undoStack.current.slice(-(MAX_UNDO - 1)), snapshot];
    setUndoCount(undoStack.current.length);
  }, []);

  const persist = useCallback(
    (next: AdminEvent[], recordUndo = true) => {
      if (recordUndo) pushUndo(events);
      setEvents(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    },
    [events, pushUndo]
  );

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (!prev) return false;
    setEvents(prev);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
    setUndoCount(undoStack.current.length);
    return true;
  }, []);

  const canUndo = undoCount > 0;

  const createEvent = useCallback(
    (partial: Omit<AdminEvent, "id" | "createdAt" | "updatedAt" | "registrations" | "attendance">) => {
      const now = new Date().toISOString();
      const event: AdminEvent = {
        ...partial,
        id: uid(),
        registrations: [],
        attendance: 0,
        createdAt: now,
        updatedAt: now,
      };
      persist([event, ...events]);
      return event;
    },
    [events, persist]
  );

  const updateEvent = useCallback(
    (id: string, patch: Partial<AdminEvent>) => {
      persist(
        events.map((e) =>
          e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
        )
      );
    },
    [events, persist]
  );

  const deleteEvent = useCallback(
    (id: string) => {
      persist(events.filter((e) => e.id !== id));
    },
    [events, persist]
  );

  const duplicateEvent = useCallback(
    (id: string) => {
      const source = events.find((e) => e.id === id);
      if (!source) return;
      const now = new Date().toISOString();
      const copy: AdminEvent = {
        ...source,
        id: uid(),
        title: `${source.title} (Copy)`,
        status: "draft",
        registrations: [],
        attendance: 0,
        createdAt: now,
        updatedAt: now,
      };
      persist([copy, ...events]);
      return copy;
    },
    [events, persist]
  );

  const moveEvent = useCallback(
    (id: string, status: EventStatus) => {
      updateEvent(id, { status });
    },
    [updateEvent]
  );

  const archiveEvent = useCallback(
    (id: string) => {
      updateEvent(id, { status: "archived" });
    },
    [updateEvent]
  );

  const publishEvent = useCallback(
    (id: string) => {
      updateEvent(id, { status: "published" });
    },
    [updateEvent]
  );

  const addRegistration = useCallback(
    (eventId: string, reg: Omit<Registration, "id" | "registeredAt">) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return { ok: false as const, error: "Event not found" };
      if (event.registrations.length >= event.capacity) {
        return { ok: false as const, error: "Event is at full capacity" };
      }
      const registration: Registration = {
        ...reg,
        id: `reg-${Date.now()}`,
        registeredAt: new Date().toISOString(),
      };
      updateEvent(eventId, {
        registrations: [...event.registrations, registration],
      });
      return { ok: true as const };
    },
    [events, updateEvent]
  );

  const removeRegistration = useCallback(
    (eventId: string, regId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;
      updateEvent(eventId, {
        registrations: event.registrations.filter((r) => r.id !== regId),
      });
    },
    [events, updateEvent]
  );

  return {
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
  };
}
