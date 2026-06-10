"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NovaOrb from "./NovaOrb";
import NovaChatPanel from "./NovaChatPanel";
import NovaRobot from "./NovaRobot";
import {
  buildWelcomeMessage,
  getResponseForAction,
  getResponseForQuery,
} from "./novaKnowledge";
import type { CsiNovaAssistantProps, NovaMessage, QuickActionId } from "./types";
import { useInteraction } from "@/context/InteractionContext";
import { useAuth } from "@/context/AuthContext";
import type { AchievementId } from "@/data/interactionContent";
import "./NovaAssistant.css";

function createMessage(role: NovaMessage["role"], content: string): NovaMessage {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, content };
}

const TYPING_DELAY_MS = 900;

export default function CsiNovaAssistant({ onNavigate }: CsiNovaAssistantProps) {
  const { getNovaContext, recordNovaOpen, unlockAchievement } = useInteraction();
  const { isGuest, isAuthenticated, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<NovaMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const respond = useCallback(
    (userContent: string, actionId?: QuickActionId) => {
      const context = {
        ...getNovaContext(),
        isGuest,
        isAuthenticated,
        isAdmin,
      };
      const userMsg = createMessage("user", userContent);
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      const response = actionId
        ? getResponseForAction(actionId, context)
        : getResponseForQuery(userContent, context);

      setTimeout(() => {
        setMessages((prev) => [...prev, createMessage("assistant", response.message)]);
        setIsTyping(false);

        const achievement = (response as { unlockAchievement?: AchievementId }).unlockAchievement;
        if (achievement) unlockAchievement(achievement);

        if (response.navigateTo && onNavigate) {
          setTimeout(() => onNavigate(response.navigateTo!), 600);
        }
      }, TYPING_DELAY_MS);
    },
    [getNovaContext, onNavigate, unlockAchievement, isGuest, isAuthenticated, isAdmin]
  );

  const openNova = () => {
    setIsOpen(true);
    setIsMinimized(false);
    recordNovaOpen();

    if (!hasWelcomed) {
      setHasWelcomed(true);
      setMessages([createMessage("assistant", buildWelcomeMessage({
        ...getNovaContext(),
        isGuest,
        isAuthenticated,
        isAdmin,
      }))]);
    }
  };

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false);
      return;
    }
    if (isOpen) {
      setIsOpen(false);
      setIsExpanded(false);
      return;
    }
    openNova();
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setIsExpanded(false);
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;
    setInputValue("");
    respond(trimmed);
  };

  const handleQuickAction = (id: QuickActionId, label: string) => {
    if (isTyping) return;
    respond(label, id);
  };

  return (
    <div className="nova-root">
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            type="button"
            className="nova-minimized-bar"
            onClick={() => setIsMinimized(false)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            aria-label="Restore CSI Nova"
          >
            <NovaRobot size={22} />
            <span className="nova-minimized-label">CSI Nova</span>
            <span className="nova-minimized-dot" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <NovaChatPanel
        isOpen={isOpen}
        isMinimized={isMinimized}
        isExpanded={isExpanded}
        messages={messages}
        isTyping={isTyping}
        inputValue={inputValue}
        onClose={handleClose}
        onMinimize={() => setIsMinimized(true)}
        onMaximize={() => setIsExpanded((prev) => !prev)}
        onInputChange={setInputValue}
        onSend={handleSend}
        onQuickAction={handleQuickAction}
      />
      <NovaOrb isOpen={isOpen && !isMinimized} onClick={handleToggle} />
    </div>
  );
}
