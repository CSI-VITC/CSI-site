"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { AdminEvent } from "@/data/adminEventsData";
import { AnimatedCounter, AnimatedProgress } from "./AnimatedCounter";
import { useOptionalAdminA11y } from "./a11y/AdminA11yContext";
import { AemEmptyState } from "./a11y/AemUi";

export function LiveAnalytics({ events }: { events: AdminEvent[] }) {
  const a11y = useOptionalAdminA11y();
  const reduced = a11y?.reducedMotion ?? false;
  const active = events.filter((e) => e.status !== "archived");

  const stats = useMemo(() => {
    const totalRegs = active.reduce((s, e) => s + e.registrations.length, 0);
    const totalAtt = active.reduce((s, e) => s + e.attendance, 0);
    const live = active.filter((e) => e.status === "live").length;
    const avgEng =
      active.length === 0
        ? 0
        : Math.round(
            active.reduce((s, e) => s + (e.registrations.length / Math.max(e.capacity, 1)) * 100, 0) /
              active.length
          );
    return { totalRegs, totalAtt, live, avgEng };
  }, [active]);

  const barData = useMemo(() => {
    return active.slice(0, 6).map((e) => ({
      id: e.id,
      label: e.title.slice(0, 12),
      fullTitle: e.title,
      value: e.registrations.length,
      max: Math.max(...active.map((x) => x.registrations.length), 1),
    }));
  }, [active]);

  const summaryText = useMemo(() => {
    return `Dashboard summary: ${stats.totalRegs} total registrations, ${stats.totalAtt} total attendance, ${stats.live} live events, and an average capacity fill rate of ${stats.avgEng} percent across ${active.length} active events.`;
  }, [stats, active.length]);

  if (active.length === 0) {
    return (
      <AemEmptyState
        title="No analytics yet"
        description="Create and publish events to see registration trends and engagement metrics here."
      />
    );
  }

  return (
    <div style={{ overflowY: "auto", height: "100%" }} role="region" aria-label="Event analytics dashboard">
      <p className="sr-only" aria-live="polite">
        {summaryText}
      </p>
      <p className="aem-graph-summary" aria-hidden="true">
        {summaryText}
      </p>

      <div className="aem-analytics-grid" role="group" aria-label="Key metrics">
        {[
          { label: "Total Registrations", value: stats.totalRegs, desc: "All sign-ups across active events" },
          { label: "Total Attendance", value: stats.totalAtt, desc: "Checked-in participants" },
          { label: "Live Events", value: stats.live, desc: "Events currently in progress" },
          { label: "Avg Fill Rate %", value: stats.avgEng, desc: "Average capacity utilization" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="aem-analytic-card"
            title={s.desc}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { delay: i * 0.08, type: "spring", stiffness: 300, damping: 28 }}
          >
            <AnimatedCounter value={s.value} />
            <div className="aem-analytic-label">{s.label}</div>
            {s.label.includes("Fill") && <AnimatedProgress percent={stats.avgEng} />}
          </motion.div>
        ))}
      </div>

      <h3 className="aem-section-title" style={{ padding: "0 22px" }} id="chart-heading">
        Registrations by Event
      </h3>
      <div
        className="aem-graph-bars"
        role="img"
        aria-labelledby="chart-heading"
        aria-describedby="chart-desc"
      >
        <p id="chart-desc" className="sr-only">
          Bar chart showing registration counts per event. See the data table below for exact values.
        </p>
        {barData.map((b, i) => (
          <div key={b.id} className="aem-graph-bar-wrap" title={`${b.fullTitle}: ${b.value} registrations`}>
            {reduced ? (
              <div
                className="aem-graph-bar"
                style={{ height: 72, transform: `scaleY(${b.value / b.max})` }}
                aria-hidden="true"
              />
            ) : (
              <motion.div
                className="aem-graph-bar"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: b.value / b.max }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: 72 }}
                aria-hidden="true"
              />
            )}
            <span className="aem-graph-label" aria-hidden="true">
              {b.label}
            </span>
          </div>
        ))}
      </div>

      <h3 className="aem-section-title" style={{ padding: "0 22px" }}>
        Data table
      </h3>
      <table className="aem-analytics-table" aria-label="Event registration data">
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Registrations</th>
            <th scope="col">Capacity</th>
            <th scope="col">Fill %</th>
          </tr>
        </thead>
        <tbody>
          {active.map((e) => {
            const fill = Math.round((e.registrations.length / Math.max(e.capacity, 1)) * 100);
            return (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.registrations.length}</td>
                <td>{e.capacity}</td>
                <td>{fill}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
