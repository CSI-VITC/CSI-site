"use client";

import { Lock } from "lucide-react";
import "./Rbac.css";

interface RestrictedWorkspaceProps {
  onReturn: () => void;
  onContact: () => void;
}

export function RestrictedWorkspace({ onReturn, onContact }: RestrictedWorkspaceProps) {
  return (
    <div className="rbac-restricted" role="alert" aria-live="polite">
      <div className="rbac-restricted-panel">
        <div className="rbac-restricted-icon" aria-hidden="true">
          <Lock size={28} strokeWidth={1.5} />
        </div>
        <h2 className="rbac-restricted-title">🔒 Administrative Workspace</h2>
        <p className="rbac-restricted-msg">
          This workspace is reserved for authorized CSI administrators.
          <br />
          <br />
          Please sign in with an approved administrator account to continue.
        </p>
        <div className="rbac-restricted-actions">
          <button type="button" className="rbac-restricted-btn rbac-restricted-btn--primary" onClick={onReturn}>
            Return to Dashboard
          </button>
          <button type="button" className="rbac-restricted-btn" onClick={onContact}>
            Contact Administrator
          </button>
        </div>
      </div>
    </div>
  );
}
