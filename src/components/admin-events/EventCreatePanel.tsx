"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AdminEvent, EventCategory } from "@/data/adminEventsData";
import { EVENT_CATEGORIES } from "@/data/adminEventsData";
import { AccessibleModal } from "./a11y/AccessibleModal";
import { useAdminA11y } from "./a11y/AdminA11yContext";

interface EventCreatePanelProps {
  open: boolean;
  origin: { x: number; y: number };
  onClose: () => void;
  onCreate: (data: Omit<AdminEvent, "id" | "createdAt" | "updatedAt" | "registrations" | "attendance">) => void;
  onError: (msg: string) => void;
}

type FormErrors = Partial<Record<"title" | "date" | "capacity" | "poster", string>>;

export function EventCreatePanel({ open, origin, onClose, onCreate, onError }: EventCreatePanelProps) {
  const { reducedMotion } = useAdminA11y();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("workshop");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [posterUrl, setPosterUrl] = useState<string | undefined>();
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!title.trim()) next.title = "Event title is required";
    if (!date) next.date = "Date and time are required";
    else if (new Date(date).getTime() < Date.now() - 60000) next.date = "Event date must be in the future";
    if (capacity < 1) next.capacity = "Capacity must be at least 1";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePoster = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, poster: "Poster must be under 5 MB" }));
      onError("Poster file is too large. Please choose an image under 5 MB.");
      return;
    }
    setErrors((prev) => ({ ...prev, poster: undefined }));
    const reader = new FileReader();
    reader.onerror = () => onError("Could not read poster file. Please try another image.");
    reader.onload = () => setPosterUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onError("Please fix the highlighted fields before creating the event.");
      return;
    }
    onCreate({
      title: title.trim(),
      description: description.trim(),
      category,
      status: "draft",
      date: new Date(date).toISOString(),
      venue: venue.trim() || "TBD",
      capacity,
      posterUrl,
      tags: [category],
    });
    setTitle("");
    setDescription("");
    setDate("");
    setVenue("");
    setCapacity(50);
    setPosterUrl(undefined);
    setErrors({});
    onClose();
  };

  const panelMotion = reducedMotion
    ? { initial: { opacity: 1, scale: 1, x: "-50%", y: "-50%" }, animate: { opacity: 1, scale: 1, x: "-50%", y: "-50%" } }
    : {
        initial: {
          opacity: 0,
          scale: 0.3,
          x: origin.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0),
          y: origin.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 0),
        },
        animate: { opacity: 1, scale: 1, x: "-50%", y: "-50%" },
      };

  return (
    <AccessibleModal
      open={open}
          onClose={onClose}
          title="Create Event"
          description="Fill in the details to create a new draft event"
          className="aem-panel"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "min(520px, 92%)",
            maxHeight: "85%",
            transform: "translate(-50%, -50%)",
          }}
          initial={panelMotion.initial}
          animate={panelMotion.animate}
        >
          <form className="aem-form" onSubmit={submit} noValidate>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }} aria-hidden="true">
                Create Event
              </h2>
              <button type="button" className="aem-btn" onClick={onClose} aria-label="Close create event dialog">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="aem-form-grid">
              <div className="aem-field aem-field--full">
                <label className="aem-label" htmlFor="evt-title">
                  Title <span aria-hidden="true">*</span>
                </label>
                <input
                  id="evt-title"
                  className={`aem-input${errors.title ? " aem-input--error" : ""}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "evt-title-err" : undefined}
                />
                {errors.title && (
                  <span id="evt-title-err" className="aem-field-error" role="alert">
                    {errors.title}
                  </span>
                )}
              </div>
              <div className="aem-field aem-field--full">
                <label className="aem-label" htmlFor="evt-desc">
                  Description
                </label>
                <textarea
                  id="evt-desc"
                  className="aem-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="aem-field">
                <label className="aem-label" htmlFor="evt-cat">
                  Category
                </label>
                <select
                  id="evt-cat"
                  className="aem-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="aem-field">
                <label className="aem-label" htmlFor="evt-date">
                  Date & Time <span aria-hidden="true">*</span>
                </label>
                <input
                  id="evt-date"
                  className={`aem-input${errors.date ? " aem-input--error" : ""}`}
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-required="true"
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? "evt-date-err" : undefined}
                />
                {errors.date && (
                  <span id="evt-date-err" className="aem-field-error" role="alert">
                    {errors.date}
                  </span>
                )}
              </div>
              <div className="aem-field">
                <label className="aem-label" htmlFor="evt-venue">
                  Venue
                </label>
                <input id="evt-venue" className="aem-input" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>
              <div className="aem-field">
                <label className="aem-label" htmlFor="evt-cap">
                  Capacity
                </label>
                <input
                  id="evt-cap"
                  className={`aem-input${errors.capacity ? " aem-input--error" : ""}`}
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  aria-invalid={!!errors.capacity}
                />
                {errors.capacity && (
                  <span className="aem-field-error" role="alert">
                    {errors.capacity}
                  </span>
                )}
              </div>
              <div className="aem-field aem-field--full">
                <label className="aem-label" htmlFor="evt-poster">
                  Event Poster
                </label>
                <input id="evt-poster" className="aem-input" type="file" accept="image/*" onChange={handlePoster} />
                {errors.poster && (
                  <span className="aem-field-error" role="alert">
                    {errors.poster}
                  </span>
                )}
                {posterUrl && <img src={posterUrl} alt="Poster preview" className="aem-poster-preview" />}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button type="submit" className="aem-btn aem-btn--primary">
                Create Draft
              </button>
              <button type="button" className="aem-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </AccessibleModal>
  );
}
