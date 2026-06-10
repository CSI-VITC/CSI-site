"use client";

import { useRequireAdmin } from "@/hooks/usePermissions";
import "../auth/Rbac.css";

export function AdminAnnouncements() {
  useRequireAdmin();

  return (
    <div className="rbac-mgmt-panel">
      <h1 className="rbac-mgmt-title">Announcements</h1>
      <p className="rbac-mgmt-desc">Publish chapter-wide notices visible to all authenticated members.</p>
      <div className="rbac-perm-note">Only administrators can create and publish announcements.</div>
      <textarea
        className="rbac-auth-input"
        rows={4}
        placeholder="Write an announcement…"
        style={{ marginBottom: 12, resize: "vertical" }}
        aria-label="Announcement content"
      />
      <button type="button" className="rbac-btn-sm rbac-btn-sm--primary">Publish Announcement</button>
    </div>
  );
}
