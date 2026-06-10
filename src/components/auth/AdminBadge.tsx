"use client";

import { Shield } from "lucide-react";
import "./Rbac.css";

export function AdminBadge() {
  return (
    <span className="rbac-admin-badge" aria-label="Administrator">
      <Shield size={11} aria-hidden="true" />
      Admin
    </span>
  );
}
