"use client";

import { EVENT_STORIES } from "@/data/interactionContent";
import { useRequireAdmin } from "@/hooks/usePermissions";
import "../auth/Rbac.css";

export function AdminGalleryMgmt() {
  useRequireAdmin();

  return (
    <div className="rbac-mgmt-panel">
      <h1 className="rbac-mgmt-title">Gallery Management</h1>
      <p className="rbac-mgmt-desc">Upload photos, edit galleries, and delete media. Members can view and filter only.</p>
      <div className="rbac-perm-note">Administrator access verified — gallery uploads enabled.</div>
      <div className="rbac-dash-grid">
        {EVENT_STORIES.map((img, i) => (
          <div key={i} className="rbac-dash-card" style={{ cursor: "default", padding: 0, overflow: "hidden" }}>
            <img src={img.src} alt={img.title} style={{ width: "100%", height: 100, objectFit: "cover" }} />
            <div style={{ padding: "12px 14px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>{img.title}</h3>
              <div className="rbac-event-actions">
                <button type="button" className="rbac-btn-sm">Edit</button>
                <button type="button" className="rbac-btn-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="rbac-btn-sm rbac-btn-sm--primary" style={{ marginTop: 16 }}>
        Upload Photo
      </button>
    </div>
  );
}
