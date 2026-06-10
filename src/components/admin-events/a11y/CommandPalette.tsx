"use client";

import { useEffect, useState } from "react";
import { AccessibleModal } from "./AccessibleModal";
import { useAdminA11y } from "./AdminA11yContext";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AccessibleModal
      open={open}
      onClose={onCancel}
      title={title}
      description={message}
      className="aem-panel aem-confirm"
      style={{
        top: "50%",
        left: "50%",
        width: "min(400px, 90%)",
        transform: "translate(-50%, -50%)",
        padding: "22px 24px",
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: 600 }} aria-hidden="true">
        {title}
      </h3>
      <p style={{ margin: "0 0 20px", fontSize: "0.85rem", color: "rgba(240,235,225,0.65)", lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button type="button" className="aem-btn" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`aem-btn${destructive ? "" : " aem-btn--primary"}`}
          onClick={onConfirm}
          style={destructive ? { color: "rgba(255,120,120,0.95)", borderColor: "rgba(255,120,120,0.3)" } : undefined}
          autoFocus
        >
          {confirmLabel}
        </button>
      </div>
    </AccessibleModal>
  );
}

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const { reducedMotion } = useAdminA11y();

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.hint?.toLowerCase().includes(query.toLowerCase())
  );

  const run = (cmd: CommandItem) => {
    cmd.action();
    onClose();
  };

  if (!open) return null;

  return (
    <AccessibleModal
      open={open}
      onClose={onClose}
      title="Command palette"
      description="Search and run admin commands"
      className="aem-panel aem-command-palette"
      style={{
        top: "18%",
        left: "50%",
        width: "min(520px, 92%)",
        transform: "translateX(-50%)",
        padding: 0,
        overflow: "hidden",
      }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <label htmlFor="aem-cmd-input" className="sr-only">
          Search commands
        </label>
        <input
          id="aem-cmd-input"
          className="aem-input"
          placeholder="Type a command…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          style={{ width: "100%" }}
        />
      </div>
      <ul role="listbox" aria-label="Commands" className="aem-cmd-list">
        {filtered.length === 0 ? (
          <li className="aem-cmd-empty">No commands match your search.</li>
        ) : (
          filtered.map((cmd) => (
            <li key={cmd.id}>
              <button type="button" className="aem-cmd-item" role="option" onClick={() => run(cmd)}>
                <span>{cmd.label}</span>
                {cmd.shortcut && <kbd className="aem-kbd">{cmd.shortcut}</kbd>}
              </button>
            </li>
          ))
        )}
      </ul>
    </AccessibleModal>
  );
}
