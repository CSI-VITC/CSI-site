"use client";

import { useMemo, useState } from "react";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { useAuth } from "@/context/AuthContext";
import { formatEventDate } from "@/data/adminEventsData";
import { MemberFeaturePrompt } from "@/components/auth/MemberUnlockDialog";
import "../auth/Rbac.css";

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

export function UserEvents() {
  const { events, ready, addRegistration } = useAdminEvents();
  const { profile, isGuest, openAuth } = useAuth();
  const [saved, setSaved] = useState<string[]>(loadSaved);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [activeReg, setActiveReg] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

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
      setActiveReg(null);
      setRegName("");
      setRegEmail("");
    } else {
      setMsg(result.error ?? "Could not register.");
    }
  };

  if (!ready) {
    return (
      <div className="rbac-user-events" role="status">
        Loading events…
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

      {msg && (
        <p className="rbac-perm-note" role="status" style={{ marginBottom: 16, marginTop: 12 }}>
          {msg}
        </p>
      )}

      {publicEvents.length === 0 ? (
        <div className="rbac-dash-card" style={{ cursor: "default" }}>
          <h3>No published events yet</h3>
          <p>Check back soon for workshops, hackathons, and chapter events.</p>
        </div>
      ) : (
        publicEvents.map((event) => {
          const isSaved = saved.includes(event.id);
          const seatsLeft = event.capacity - event.registrations.length;
          const isRegistered = profile?.email
            ? event.registrations.some((r) => r.email === profile.email)
            : false;

          return (
            <article key={event.id} className="rbac-event-card">
              <h3>{event.title}</h3>
              <p className="rbac-event-meta">
                {formatEventDate(event.date)} · {event.venue} · {seatsLeft} seats left
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
                {isRegistered ? (
                  <span style={{ fontSize: "0.8rem", color: "rgba(140,220,160,0.9)", alignSelf: "center" }}>
                    Registered
                  </span>
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
