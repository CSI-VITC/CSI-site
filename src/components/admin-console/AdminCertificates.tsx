"use client";

import { useRequireAdmin } from "@/hooks/usePermissions";
import "../auth/Rbac.css";

export function AdminCertificates() {
  useRequireAdmin();

  return (
    <div className="rbac-mgmt-panel">
      <h1 className="rbac-mgmt-title">Certificate Management</h1>
      <p className="rbac-mgmt-desc">Issue and manage event completion certificates for attendees.</p>
      <div className="rbac-perm-note">Certificate issuance requires administrator privileges.</div>
      <button type="button" className="rbac-btn-sm rbac-btn-sm--primary">Issue Certificate</button>
    </div>
  );
}
