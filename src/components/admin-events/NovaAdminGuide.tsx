"use client";

import { Bot } from "lucide-react";

const GUIDES: Record<string, { title: string; steps: string[] }> = {
  board: {
    title: "Nova: Board navigation",
    steps: [
      "Drag event cards between Draft, Published, Live, and Completed columns.",
      "Use the status dropdown on each card if drag-and-drop is difficult.",
      "Press Enter on a focused card to open details and manage registrations.",
    ],
  },
  timeline: {
    title: "Nova: Timeline view",
    steps: [
      "Scroll through the timeline to see upcoming and past events.",
      "Upcoming events within two weeks pulse gently for visibility.",
      "Click any event node to open its full details panel.",
    ],
  },
  analytics: {
    title: "Nova: Analytics interpretation",
    steps: [
      "Total Registrations shows all sign-ups across active events.",
      "Avg Fill Rate indicates how full your events are on average.",
      "Use the data table below the chart for screen-reader-friendly exact values.",
    ],
  },
};

export function NovaAdminGuide({ view }: { view: string }) {
  const guide = GUIDES[view] ?? GUIDES.board;

  return (
    <details className="aem-nova-guide">
      <summary>
        <Bot size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} aria-hidden="true" />
        {guide.title}
      </summary>
      <ol style={{ margin: "8px 0 0", paddingLeft: 18 }}>
        {guide.steps.map((step) => (
          <li key={step} style={{ marginBottom: 4 }}>
            {step}
          </li>
        ))}
      </ol>
      <p style={{ margin: "8px 0 0", opacity: 0.7, fontSize: "0.72rem" }}>
        Ask CSI Nova: &quot;How do I create an event?&quot; or &quot;Help with registrations&quot;
      </p>
    </details>
  );
}
