"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { useAuth } from "@/context/AuthContext";
import { useInteraction } from "@/context/InteractionContext";
import { formatEventDate } from "@/data/adminEventsData";
import { MemberFeaturePrompt } from "@/components/auth/MemberUnlockDialog";
import { EmptyState } from "@/components/platform/EmptyState";
import "../auth/Rbac.css";
import "../platform/Platform.css";

const SAVED_KEY = "csi-saved-events";

function loadSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveSaved(ids: string[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

function useCountdown(targetDate: string) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("Starting soon");
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      if (days > 0) setLabel(`${days}d ${hours}h until start`);
      else if (hours > 0) setLabel(`${hours}h ${mins}m until start`);
      else setLabel(`${mins}m until start`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [targetDate]);

  return label;
}

function EventCountdown({ date }: { date: string }) {
  const label = useCountdown(date);
  if (!label) return null;
  return <div className="event-countdown">{label}</div>;
}

export function UserEvents() {
  const { events, ready, addRegistration } = useAdminEvents();
  const { profile, isGuest, openAuth } = useAuth();
  const { recordEventRegistration } = useInteraction();
  const [saved, setSaved] = useState<string[]>(loadSaved);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [activeReg, setActiveReg] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const publicEvents = useMemo(
    () => events.filter((e) => e.status === "published" || e.status === "live"),
    [events]
  );

  const requireMember = (action: () => void) => {
    if (isGuest) {
      openAuth("signin");
      return;
    }
    action();
  };

  const toggleSave = (id: string) => {
    requireMember(() => {
      setSaved((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        saveSaved(next);
        return next;
      });
    });
  };

  const startRegister = (eventId: string) => {
    requireMember(() => {
      setActiveReg(activeReg === eventId ? null : eventId);
      setMsg(null);
    });
  };

  const submitReg = (eventId: string) => {
    const name = regName.trim() || profile?.displayName || "Member";
    const email = regEmail.trim() || profile?.email || "";
    if (!email) {
      setMsg("Email is required to register.");
      return;
    }
    const result = addRegistration(eventId, { name, email });
    if (result.ok) {
      setMsg("Registration successful!");
      setSuccessId(eventId);
      recordEventRegistration();
      setActiveReg(null);
      setRegName("");
      setRegEmail("");
      setTimeout(() => setSuccessId(null), 2400);
    } else {
      setMsg(result.error ?? "Could not register.");
    }
  };

  if (!ready) {
    return (
      <div className="rbac-user-events" role="status" aria-busy="true">
        <div className="csi-platform-skeleton" style={{ width: "40%", marginBottom: 12 }} />
        <div className="csi-platform-skeleton" style={{ height: 80, borderRadius: 12 }} />
      </div>
    );
  }

  return (
    <div className="rbac-user-events">
      <h1 style={{ margin: "0 0 6px", fontSize: "1.2rem", fontWeight: 600, color: "#f0ebe1" }}>Events</h1>
      <p style={{ margin: "0 0 16px", fontSize: "0.84rem", color: "rgba(240,235,225,0.45)" }}>
        Browse upcoming CSI events. {isGuest ? "Sign in to register and save favorites." : "Register and save your favorites."}
      </p>

      {isGuest && (
        <MemberFeaturePrompt
          message="Sign in to save resources and track event registrations."
          onSignIn={() => openAuth("signin")}
        />
      )}

      <AnimatePresence>
        {msg && (
          <motion.p
            key={msg}
            className={`rbac-perm-note reg-success-pop${successId ? " reg-success-pop" : ""}`}
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: 16, marginTop: 12 }}
          >
            {msg}
          </motion.p>
        )}
      </AnimatePresence>

      {publicEvents.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          description="Published workshops and hackathons will appear here. Check back soon or ask CSI Nova for updates."
        />
      ) : (
        publicEvents.map((event) => {
          const isSaved = saved.includes(event.id);
          const seatsLeft = event.capacity - event.registrations.length;
          const fillPct = Math.min(100, Math.round((event.registrations.length / event.capacity) * 100));
          const isRegistered = profile?.email
            ? event.registrations.some((r) => r.email === profile.email)
            : false;
          const justRegistered = successId === event.id;

          return (
            <article key={event.id} className="rbac-event-card">
              <EventCountdown date={event.date} />
              <h3>{event.title}</h3>
              <p className="rbac-event-meta">
                {formatEventDate(event.date)} · {event.venue}
              </p>
              <div className="event-seats-bar" aria-hidden>
                <motion.div
                  className="event-seats-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(240,235,225,0.45)", margin: "0 0 8px" }}>
                {seatsLeft > 0 ? `${seatsLeft} of ${event.capacity} seats available` : "Event at capacity"}
              </p>
              {event.description && (
                <p style={{ fontSize: "0.82rem", color: "rgba(240,235,225,0.55)", marginBottom: 10 }}>
                  {event.description}
                </p>
              )}
              <div className="rbac-event-actions">
                <button
                  type="button"
                  className="rbac-btn-sm"
                  onClick={() => toggleSave(event.id)}
                  aria-pressed={isSaved}
                >
                  {isSaved ? "Saved" : "Save Event"}
                </button>
                {isRegistered || justRegistered ? (
                  <motion.span
                    className="reg-success-pop"
                    initial={justRegistered ? { scale: 0.9, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: "0.8rem", color: "rgba(140,220,160,0.9)", alignSelf: "center" }}
                  >
                    Registered ✓
                  </motion.span>
                ) : (
                  <button
                    type="button"
                    className="rbac-btn-sm rbac-btn-sm--primary"
                    disabled={seatsLeft <= 0}
                    onClick={() => startRegister(event.id)}
                  >
                    {seatsLeft <= 0 ? "Full" : "Register"}
                  </button>
                )}
              </div>
              {activeReg === event.id && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    className="rbac-auth-input"
                    style={{ flex: 1, minWidth: 120 }}
                    placeholder="Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    aria-label="Registration name"
                  />
                  <input
                    className="rbac-auth-input"
                    style={{ flex: 1, minWidth: 140 }}
                    placeholder="Email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    aria-label="Registration email"
                  />
                  <button type="button" className="rbac-btn-sm rbac-btn-sm--primary" onClick={() => submitReg(event.id)}>
                    Confirm
                  </button>
                </div>
              )}
            </article>
          );
        })
      )}
    </div>
  );
}
