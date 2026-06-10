export type NovaMessageRole = "assistant" | "user";

export interface NovaMessage {
  id: string;
  role: NovaMessageRole;
  content: string;
}

export type QuickActionId =
  | "events"
  | "domains"
  | "workshops"
  | "hackathons"
  | "team"
  | "resources"
  | "contact";

export interface QuickAction {
  id: QuickActionId;
  label: string;
  emoji: string;
}

export type WindowId =
  | "dashboard"
  | "profile"
  | "events"
  | "gallery"
  | "about"
  | "depts"
  | "projects"
  | "team"
  | "contact"
  | "csi"
  | "resources"
  | "admin-console"
  | "admin-analytics"
  | "event-admin"
  | "admin-users"
  | "admin-resources"
  | "admin-gallery"
  | "admin-announcements"
  | "admin-certificates";

export interface CsiNovaAssistantProps {
  onNavigate?: (windowId: string) => void;
}
