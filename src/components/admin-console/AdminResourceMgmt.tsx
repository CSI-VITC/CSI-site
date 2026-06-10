"use client";

import { useRequireAdmin } from "@/hooks/usePermissions";
import { RESOURCES } from "@/data/resourceHubData";
import "../auth/Rbac.css";

export function AdminResourceMgmt() {
  useRequireAdmin();

  return (
    <div className="rbac-mgmt-panel">
      <h1 className="rbac-mgmt-title">Resource Management</h1>
      <p className="rbac-mgmt-desc">Upload, edit, and delete learning resources. Members can browse and bookmark only.</p>
      <div className="rbac-perm-note">Administrator access verified — you can manage all resources.</div>
      <div className="rbac-dash-grid">
        {RESOURCES.slice(0, 8).map((r) => (
          <div key={r.id} className="rbac-dash-card" style={{ cursor: "default" }}>
            <h3>{r.title}</h3>
            <p>{r.type} · {r.difficulty}</p>
            <div className="rbac-event-actions" style={{ marginTop: 10 }}>
              <button type="button" className="rbac-btn-sm">Edit</button>
              <button type="button" className="rbac-btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="rbac-btn-sm rbac-btn-sm--primary" style={{ marginTop: 16 }}>
        Upload Resource
      </button>
    </div>
  );
}
