"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import TrafficLights from "@/components/TrafficLights";
import type { NovaMessage, QuickActionId } from "./types";
import NovaTypingIndicator from "./NovaTypingIndicator";
import NovaQuickActions from "./NovaQuickActions";
import NovaRobot from "./NovaRobot";

interface NovaChatPanelProps {
  isOpen: boolean;
  isMinimized: boolean;
  isExpanded: boolean;
  messages: NovaMessage[];
  isTyping: boolean;
  inputValue: string;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onQuickAction: (id: QuickActionId, label: string) => void;
}

export default function NovaChatPanel({
  isOpen,
  isMinimized,
  isExpanded,
  messages,
  isTyping,
  inputValue,
  onClose,
  onMinimize,
  onMaximize,
  onInputChange,
  onSend,
  onQuickAction,
}: NovaChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const showPanel = isOpen && !isMinimized;

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          className={`nova-panel-shell${isExpanded ? " nova-panel-shell--expanded" : ""}`}
          role="dialog"
          aria-label="CSI Nova chat"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        >
          <div className="nova-panel">
            <div className="nova-titlebar">
              <TrafficLights
                variant="nova"
                onClose={onClose}
                onMinimize={onMinimize}
                onMaximize={onMaximize}
              />
            </div>

            <header className="nova-panel-header">
              <div className="nova-panel-avatar">
                <NovaRobot size={28} floating />
              </div>
              <div className="nova-panel-title">
                <h3>CSI Nova</h3>
                <p className="nova-panel-subtitle">AI Campus Assistant</p>
                <p className="nova-panel-status">
                  <span className="nova-status-dot" aria-hidden="true" />
                  Online
                </p>
              </div>
            </header>

            <div className="nova-messages">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`nova-message ${msg.role}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {msg.role === "assistant" ? (
                      <div className="nova-message-avatar">
                        <NovaRobot size={26} />
                      </div>
                    ) : (
                      <div className="nova-message-avatar nova-message-avatar--user" aria-hidden="true">
                        U
                      </div>
                    )}
                    <div className="nova-message-bubble">{msg.content}</div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && <NovaTypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <p className="nova-quick-actions-label">Suggestions</p>
            <NovaQuickActions onSelect={onQuickAction} disabled={isTyping} />

            <div className="nova-input-section">
              <div className="nova-input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  className="nova-input"
                  placeholder="Message CSI Nova..."
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  aria-label="Message CSI Nova"
                />
                <button
                  type="button"
                  className="nova-send-btn"
                  onClick={onSend}
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
