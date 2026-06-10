"use client";

import { useRequireAdmin } from "@/hooks/usePermissions";
import "../auth/Rbac.css";

const DEMO_USERS = [
  { name: "CSI Member", email: "member@csi.vitc.ac.in", role: "user" },
  { name: "CSI Administrator", email: "admin@csi.vitc.ac.in", role: "admin" },
];

export function AdminUsers() {
  useRequireAdmin();

  return (
    <div className="rbac-mgmt-panel">
      <h1 className="rbac-mgmt-title">User Management</h1>
      <p className="rbac-mgmt-desc">View members and manage administrator roles via Firebase Firestore profiles.</p>
      <div className="rbac-perm-note">Role data is stored in Firestore under users/&#123;uid&#125;.role</div>
      {DEMO_USERS.map((u) => (
        <div key={u.email} className="rbac-event-card">
          <h3>{u.name}</h3>
          <p className="rbac-event-meta">{u.email} · {u.role}</p>
          {u.role === "user" && (
            <button type="button" className="rbac-btn-sm">Promote to Admin</button>
          )}
        </div>
      ))}
    </div>
  );
}
