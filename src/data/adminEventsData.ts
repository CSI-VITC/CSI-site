export type EventStatus = "draft" | "published" | "live" | "completed" | "archived";

export type EventCategory = "workshop" | "hackathon" | "talk" | "meetup" | "competition";

export interface Registration {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  date: string;
  endDate?: string;
  venue: string;
  capacity: number;
  registrations: Registration[];
  attendance: number;
  posterUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const EVENT_STATUSES: { id: EventStatus; label: string; color: string }[] = [
  { id: "draft", label: "Draft", color: "rgba(240,235,225,0.45)" },
  { id: "published", label: "Published", color: "rgba(100,180,255,0.85)" },
  { id: "live", label: "Live", color: "rgba(120,200,140,0.9)" },
  { id: "completed", label: "Completed", color: "rgba(240,235,225,0.35)" },
];

export const KANBAN_COLUMNS: EventStatus[] = ["draft", "published", "live", "completed"];

export const EVENT_CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: "workshop", label: "Workshop" },
  { id: "hackathon", label: "Hackathon" },
  { id: "talk", label: "Tech Talk" },
  { id: "meetup", label: "Meetup" },
  { id: "competition", label: "Competition" },
];

function reg(name: string, email: string, daysAgo: number): Registration {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `reg-${Math.random().toString(36).slice(2, 9)}`,
    name,
    email,
    registeredAt: d.toISOString(),
  };
}

export const SEED_EVENTS: AdminEvent[] = [
  {
    id: "evt-1",
    title: "Full-Stack Build Day",
    description: "Hands-on workshop covering React, Next.js, and deployment pipelines used in CSI projects.",
    category: "workshop",
    status: "published",
    date: new Date(Date.now() + 7 * 86400000).toISOString(),
    venue: "Lab Block — Room 204",
    capacity: 80,
    registrations: [
      reg("Arjun K.", "arjun@vitstudent.ac.in", 2),
      reg("Meera S.", "meera@vitstudent.ac.in", 3),
      reg("Vikram R.", "vikram@vitstudent.ac.in", 5),
      reg("Priya N.", "priya@vitstudent.ac.in", 1),
    ],
    attendance: 0,
    posterUrl: "/images/workshop1.jpg",
    tags: ["web", "react", "csi"],
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-2",
    title: "CSI Hackathon 2026",
    description: "24-hour build sprint. Teams ship real products with mentor support and prizes.",
    category: "hackathon",
    status: "live",
    date: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
    venue: "Main Auditorium + Labs",
    capacity: 200,
    registrations: Array.from({ length: 42 }, (_, i) =>
      reg(`Member ${i + 1}`, `member${i + 1}@vitstudent.ac.in`, Math.floor(Math.random() * 10))
    ),
    attendance: 38,
    posterUrl: "/images/hackathon1.jpg",
    tags: ["hackathon", "build", "prizes"],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-3",
    title: "AI / ML Deep Dive",
    description: "From scikit-learn to LLM applications — notebook session with live Q&A.",
    category: "workshop",
    status: "draft",
    date: new Date(Date.now() + 21 * 86400000).toISOString(),
    venue: "Seminar Hall B",
    capacity: 60,
    registrations: [],
    attendance: 0,
    posterUrl: "/images/workshop2.jpg",
    tags: ["ai", "ml", "workshop"],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-4",
    title: "Cybersecurity CTF Night",
    description: "Capture-the-flag challenges for beginners and advanced players.",
    category: "competition",
    status: "published",
    date: new Date(Date.now() + 14 * 86400000).toISOString(),
    venue: "Cyber Lab — 102",
    capacity: 50,
    registrations: [
      reg("Syed A.", "syed@vitstudent.ac.in", 4),
      reg("Janet L.", "janet@vitstudent.ac.in", 6),
      reg("Nityasri P.", "nitya@vitstudent.ac.in", 2),
    ],
    attendance: 0,
    posterUrl: "/images/Computer1.jpg",
    tags: ["security", "ctf"],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evt-5",
    title: "Design Systems Talk",
    description: "How CSI Design domain builds cohesive brand experiences across events and products.",
    category: "talk",
    status: "completed",
    date: new Date(Date.now() - 20 * 86400000).toISOString(),
    venue: "Online — Zoom",
    capacity: 120,
    registrations: Array.from({ length: 89 }, (_, i) =>
      reg(`Attendee ${i + 1}`, `att${i + 1}@vitstudent.ac.in`, 25)
    ),
    attendance: 76,
    posterUrl: "/images/design.jpg",
    tags: ["design", "ui"],
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
];

export function seatsRemaining(event: AdminEvent): number {
  return Math.max(0, event.capacity - event.registrations.length);
}

export function engagementRate(event: AdminEvent): number {
  if (event.registrations.length === 0) return 0;
  if (event.status === "completed") {
    return Math.round((event.attendance / event.registrations.length) * 100);
  }
  return Math.round((event.registrations.length / event.capacity) * 100);
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateNovaAdminInsights(events: AdminEvent[]): string[] {
  const insights: string[] = [];
  const active = events.filter((e) => e.status !== "archived");
  const totalRegs = active.reduce((s, e) => s + e.registrations.length, 0);
  const lastWeekRegs = active.reduce((s, e) => {
    const weekAgo = Date.now() - 7 * 86400000;
    return s + e.registrations.filter((r) => new Date(r.registeredAt).getTime() > weekAgo).length;
  }, 0);

  if (lastWeekRegs > 0) {
    const pct = Math.min(28, Math.round((lastWeekRegs / Math.max(totalRegs, 1)) * 100));
    insights.push(`Registrations increased ${pct}% this week across active events.`);
  }

  const almostFull = active.find(
    (e) => e.status === "published" && seatsRemaining(e) <= 5 && seatsRemaining(e) > 0
  );
  if (almostFull) {
    insights.push(`"${almostFull.title}" is almost full — ${seatsRemaining(almostFull)} seats left.`);
  }

  const workshops = active.filter((e) => e.category === "workshop" && e.status !== "completed");
  if (workshops.length) {
    const avgFill =
      workshops.reduce((s, e) => s + e.registrations.length / e.capacity, 0) / workshops.length;
    if (avgFill > 0.5) {
      insights.push("Workshop attendance is trending above average for this semester.");
    }
  }

  const live = active.find((e) => e.status === "live");
  if (live) {
    insights.push(`"${live.title}" is live now with ${live.attendance} checked in.`);
  }

  if (insights.length === 0) {
    insights.push("All systems nominal. Create a new event to grow engagement.");
  }

  return insights.slice(0, 3);
}
