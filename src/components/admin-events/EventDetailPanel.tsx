"use client";

import { useState } from "react";
import { Archive, Copy, Send, Trash2, X } from "lucide-react";
import type { AdminEvent } from "@/data/adminEventsData";
import { engagementRate, formatEventDate, seatsRemaining } from "@/data/adminEventsData";
import { AnimatedCounter, AnimatedProgress } from "./AnimatedCounter";
import { AccessibleModal } from "./a11y/AccessibleModal";
import { ConfirmDialog } from "./a11y/CommandPalette";
import { AemTooltip } from "./a11y/AemUi";
import { useAdminA11y } from "./a11y/AdminA11yContext";

interface EventDetailPanelProps {
  event: AdminEvent;
  onClose: () => void;
  onUpdate: (patch: Partial<AdminEvent>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onPublish: () => void;
  onAddRegistration: (name: string, email: string) => { ok: boolean; error?: string };
  onRemoveRegistration: (regId: string) => void;
  onNotify: (msg: string, type?: "success" | "error") => void;
}

export function EventDetailPanel({
  event,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  onArchive,
  onPublish,
  onAddRegistration,
  onRemoveRegistration,
  onNotify,
}: EventDetailPanelProps) {
  const { reducedMotion } = useAdminA11y();
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const fill = Math.round((event.registrations.length / event.capacity) * 100);

  const addReg = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName.trim()) {
      setRegError("Name is required");
      return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegError("Enter a valid email address");
      return;
    }
    const result = onAddRegistration(regName.trim(), regEmail.trim());
    if (!result.ok) {
      setRegError(result.error ?? "Could not add registration");
      onNotify(result.error ?? "Registration failed", "error");
      return;
    }
    onNotify(`${regName.trim()} registered successfully`);
    setRegName("");
    setRegEmail("");
  };

  return (
    <>
      <AccessibleModal
        open
        onClose={onClose}
        title={`Event details: ${event.title}`}
        description={event.description}
        className="aem-panel aem-detail"
        style={{
          top: "50%",
          left: "50%",
          width: "min(560px, 94%)",
          transform: "translate(-50%, -50%)",
        }}
        initial={reducedMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
      >
        <div className="aem-detail-hero">
          {event.posterUrl && <img src={event.posterUrl} alt={`${event.title} poster`} />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="aem-btn"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.5)",
              padding: 6,
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="aem-detail-content">
          <span className="aem-stat-pill" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {event.status} · {event.category}
          </span>
          <h2 style={{ margin: "10px 0 6px", fontSize: "1.35rem", fontWeight: 600 }} aria-hidden="true">
            {event.title}
          </h2>
          <p style={{ color: "rgba(240,235,225,0.55)", fontSize: "0.85rem", lineHeight: 1.55, margin: "0 0 16px" }}>
            {event.description}
          </p>
          <div
            className="aem-analytics-grid"
            style={{ padding: 0, gridTemplateColumns: "repeat(2, 1fr)" }}
            role="group"
            aria-label="Event statistics"
          >
            <div className="aem-analytic-card">
              <AnimatedCounter value={event.registrations.length} />
              <div className="aem-analytic-label">Registrations</div>
            </div>
            <div className="aem-analytic-card">
              <AnimatedCounter value={event.attendance} />
              <div className="aem-analytic-label">Attendance</div>
            </div>
            <div className="aem-analytic-card">
              <AnimatedCounter value={seatsRemaining(event)} />
              <div className="aem-analytic-label">Seats Remaining</div>
            </div>
            <div className="aem-analytic-card">
              <AnimatedCounter value={engagementRate(event)} />
              <div className="aem-analytic-label">Engagement %</div>
            </div>
          </div>
          <p style={{ fontSize: "0.72rem", color: "rgba(240,235,225,0.4)", margin: "12px 0 4px" }}>Capacity fill</p>
          <AnimatedProgress percent={fill} />
          <p style={{ fontSize: "0.78rem", color: "rgba(240,235,225,0.45)", marginTop: 14 }}>
            {formatEventDate(event.date)} · {event.venue}
          </p>

          <div className="aem-reg-list">
            <h4 style={{ margin: "0 0 10px", fontSize: "0.8rem", fontWeight: 600 }} id="reg-heading">
              Registrations
            </h4>
            <form onSubmit={addReg} style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }} aria-labelledby="reg-heading">
              <label className="sr-only" htmlFor="reg-name">
                Attendee name
              </label>
              <input
                id="reg-name"
                className="aem-input"
                placeholder="Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                style={{ flex: 1, minWidth: 100 }}
                aria-invalid={!!regError}
              />
              <label className="sr-only" htmlFor="reg-email">
                Attendee email
              </label>
              <input
                id="reg-email"
                className="aem-input"
                placeholder="Email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{ flex: 1, minWidth: 120 }}
              />
              <button type="submit" className="aem-btn aem-btn--primary">
                Add
              </button>
            </form>
            {regError && (
              <p className="aem-field-error" role="alert">
                {regError}
              </p>
            )}
            {event.registrations.length === 0 ? (
              <p style={{ fontSize: "0.78rem", color: "rgba(240,235,225,0.35)" }} role="status">
                No registrations yet. Add attendees using the form above.
              </p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Registered attendees">
                {event.registrations.slice(0, 8).map((r) => (
                  <li key={r.id} className="aem-reg-row">
                    <span>
                      {r.name} <span style={{ opacity: 0.45 }}>{r.email}</span>
                    </span>
                    <AemTooltip label="Remove registration">
                      <button
                        type="button"
                        className="aem-btn"
                        style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                        onClick={() => onRemoveRegistration(r.id)}
                        aria-label={`Remove ${r.name}`}
                      >
                        Remove
                      </button>
                    </AemTooltip>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="aem-field aem-field--full" style={{ marginTop: 16 }}>
            <label className="aem-label" htmlFor="edit-title">
              Edit title
            </label>
            <input
              id="edit-title"
              className="aem-input"
              value={event.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>
        </div>
        <div className="aem-detail-actions" role="toolbar" aria-label="Event actions">
          {event.status === "draft" && (
            <AemTooltip label="Publish event" description="Make visible to students">
              <button type="button" className="aem-btn aem-btn--primary" onClick={onPublish}>
                <Send size={14} aria-hidden="true" /> Publish
              </button>
            </AemTooltip>
          )}
          <AemTooltip label="Duplicate event">
            <button type="button" className="aem-btn" onClick={onDuplicate}>
              <Copy size={14} aria-hidden="true" /> Duplicate
            </button>
          </AemTooltip>
          <AemTooltip label="Archive event">
            <button type="button" className="aem-btn" onClick={() => setConfirmArchive(true)}>
              <Archive size={14} aria-hidden="true" /> Archive
            </button>
          </AemTooltip>
          <AemTooltip label="Delete permanently" description="This cannot be undone without Undo">
            <button
              type="button"
              className="aem-btn"
              onClick={() => setConfirmDelete(true)}
              style={{ color: "rgba(255,120,120,0.9)" }}
            >
              <Trash2 size={14} aria-hidden="true" /> Delete
            </button>
          </AemTooltip>
        </div>
      </AccessibleModal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete event?"
        message={`"${event.title}" will be permanently removed. You can undo immediately after.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={confirmArchive}
        title="Archive event?"
        message={`"${event.title}" will be moved to archived events.`}
        confirmLabel="Archive"
        onConfirm={() => {
          setConfirmArchive(false);
          onArchive();
        }}
        onCancel={() => setConfirmArchive(false)}
      />
    </>
  );
}
