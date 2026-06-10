"use client";

import { useMemo } from "react";
import { useAdminEvents } from "@/hooks/useAdminEvents";
import { generateNovaAdminInsights } from "@/data/adminEventsData";
import { useRequireAdmin } from "@/hooks/usePermissions";
import { LiveAnalytics } from "@/components/admin-events/LiveAnalytics";
import { NovaAdminInsights } from "@/components/admin-events/NovaAdminInsights";
import "../auth/Rbac.css";

export function AdminAnalyticsPanel() {
  useRequireAdmin();
  const { events } = useAdminEvents();
  const insights = useMemo(() => generateNovaAdminInsights(events), [events]);

  return (
    <div className="rbac-mgmt-panel" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px 0" }}>
        <h1 className="rbac-mgmt-title">Platform Analytics</h1>
        <p className="rbac-mgmt-desc">Administrative metrics — registration data, fill rates, and Nova insights.</p>
      </div>
      <NovaAdminInsights insights={insights} />
      <LiveAnalytics events={events} />
    </div>
  );
}
