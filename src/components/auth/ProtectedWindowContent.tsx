"use client";

import type { ReactNode } from "react";
import type { WindowId } from "@/components/nova/types";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/context/AuthContext";
import { RestrictedWorkspace } from "./RestrictedWorkspace";
import { MemberUnlockDialog } from "./MemberUnlockDialog";

interface ProtectedWindowContentProps {
  windowId: WindowId;
  onReturn: () => void;
  onContact: () => void;
  children: ReactNode;
}

export function ProtectedWindowContent({
  windowId,
  onReturn,
  onContact,
  children,
}: ProtectedWindowContentProps) {
  const { getWindowGate } = usePermissions();
  const { openAuth } = useAuth();
  const gate = getWindowGate(windowId);

  if (gate === "member") {
    return (
      <MemberUnlockDialog
        onContinueGuest={onReturn}
        onSignIn={() => openAuth("signin")}
        onSignUp={() => openAuth("signup")}
      />
    );
  }

  if (gate === "admin") {
    return <RestrictedWorkspace onReturn={onReturn} onContact={onContact} />;
  }

  return <>{children}</>;
}
