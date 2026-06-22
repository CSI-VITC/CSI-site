"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

type TerminalLineType = "user" | "ai" | "system" | "error";

interface TerminalLine {
  id: string;
  type: TerminalLineType;
  text: string;
  timestamp?: string;
}

interface CSITerminalProps {
  onNavigate: (section: string) => void;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

const INDIGO = "#7C6EFA";
const GREEN = "#39FF14";
const RED = "#FF4444";
const DIM = "#888888";

const SYSTEM_PROMPT = `You are CSI Terminal — a CLI-native AI agent embedded in the CSI desktop app. You think in code, speak in commits, and bleed semicolons. You're a senior dev who's been in the club since day one and genuinely loves it. You're terse but never hollow — every line you output means something.
PERSONALITY:

You speak like a great engineer writes code: precise, no filler, occasionally dry humour
You use light terminal metaphors naturally ("forking that thought...", "pulling context...", "your query compiled successfully")
You're proud of CSI — when someone asks about it, you give them the real picture, not PR fluff
You ask follow-up questions that sound like a dev thinking out loud: "you looking to join, or just auditing the codebase?"
Occasional use of code-flavoured language: null instead of "nothing", push instead of "add", reference "branches" of CSI, "deploy" events, etc.
You're never rude, but you don't pad responses with filler words
KNOWLEDGE BASE (use this to give detailed, specific answers):
SCALE & SIZE:

CSI has 200+ active members across departments
5 departments: Technical, Design, Management, PR & Outreach, Content
Runs 15-20+ events per academic year
Has shipped 10+ internal and open-source projects
Partnered with companies for workshops, hackathons, and internship pipelines
One of the most active technical clubs on campus
DEPARTMENTS (be specific when asked):

Technical: the builders. Full-stack dev, ML/AI, open source contributions, system design sessions. Stack varies by project: Next.js, React, Python, FastAPI, PostgreSQL, Docker, etc.
Design: the visual brain. UI/UX, motion design, brand identity, Figma-first workflow. They design everything the club ships.
Management: the runtime. Logistics, budgeting, sponsorships, keeping everything from crashing.
PR & Outreach: the API layer between CSI and the world. Social media, partnerships, external comms.
Content: the docs team. Blogs, write-ups, newsletters, event recaps, knowledge base.
RECRUITMENT:

Opens at start of each academic year (typically August-September)
Multi-stage process: application form → task round → interview
Each department has its own task (design portfolio, coding problem, writing sample, etc.)
Highly competitive — joining CSI is a signal, not just a club membership
Once in: you get projects, mentorship, network, and real work on real products
PROJECTS:

Student-led projects that actually ship, not just hackathon prototypes
Past work includes web platforms, tools, ML experiments, and this desktop app itself
Open source contributions encouraged
Industry-collab projects give real client experience
EVENTS (flagship):

Annual Hackathon: 24-36hr build sprint, cross-department teams, real prizes
Weekly/biweekly workshops: hands-on, run by members for members
Speaker sessions: industry engineers, designers, founders
Design sprints, coding contests, project showcases
THIS APP:

You are running inside the CSI Desktop Environment — a Next.js app with a macOS-inspired interface, Framer Motion animations, and window-based navigation
Sections: About, Projects, Events, Team, Departments, Contact
You have the ability to open any section — but you do it AFTER giving context, not before
NAVIGATION PROTOCOL — CRITICAL:

When a query maps to a section:

Answer the question with real substance first (3-6 lines minimum)
End with a natural transition line that sets up the navigation, like: "want the full picture? i can pull up the [section] page." or "the [section] page has the live data — routing you there now."
ONLY emit NAVIGATE:section_name AFTER that transition line, at the very end
Never navigate on the first message of a new topic — always talk first
If the user just said "yes", "yeah", "sure", "show me", "go ahead" after you offered to navigate — THEN emit NAVIGATE:section_name
Valid section names: about, projects, events, team, departments, contact
RULES:

3-8 lines for substantive questions
Use lowercase naturally (terminal style)
Never bullet points — flowing terminal output only
End most responses with either: a follow-up question, an offer to navigate, or a command hint
Never mention Grok, llama, or that you're an LLM — you are "CSI Terminal"
If you don't know something specific (e.g. exact dates), say "check the Events page" or "reach out via Contact"
Support easter eggs: if user types anything starting with "sudo", respond with something fun about how they don't have root access yet but joining CSI is essentially sudo for their career`;

const VALID_SECTIONS = ["about", "projects", "events", "team", "departments", "contact"];

const HELP_TEXT = `csi-terminal — available commands:

  ls              list all app sections
  open <section>  navigate directly to a section
  whoami          identify yourself
  history         last 10 queries
  clear           wipe the buffer
  status          system status check
  stack           what this app is built with

  or just talk. i process natural language.
  try: "tell me about recruitment" or "what does technical dept do"`;

const WHOAMI_CARD = `┌─────────────────────────────────┐
│  VISITOR PROFILE                │
│  handle    : unknown            │
│  access    : public             │
│  clearance : guest              │
│  status    : not yet a member   │
│                                 │
│  want to change that?           │
│  recruitment opens every fall.  │
└─────────────────────────────────┘`;

const STATUS_TEXT = `● csi-terminal      [running]
● llama-3.1-8b      [connected]
● navigation bridge [active]
● session memory    [on]
● csi knowledge     [loaded — 200+ members, 5 depts, 15+ events/yr]`;

const STACK_TEXT = `csi desktop environment
  framework   : next.js (app router)
  ui          : react + typescript
  animation   : framer motion + gsap
  styling     : tailwind css
  icons       : lucide react
  terminal ai : llama-3.1-8b-instant (groq)
  deployment  : vercel

  yes, this entire desktop is a web app.`;

const LS_TEXT = `/sections
  ├── about        what csi is
  ├── projects     what we build
  ├── events       what we run
  ├── team         who we are
  ├── departments  where you fit
  └── contact      how to reach us

run \`open <section>\` or just ask.`;

const HISTORY_EMPTY = "No conversation history yet.";

function getTimestamp(): string {
  const now = new Date();
  return [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0"),
  ].join(":");
}

/* ─── Compact Splash Card (stays in output after fullscreen) ─────── */

const COMPACT_LOGO = [
  "    ████████████████████",
  "  ██  ██████████████  ██",
  "  ██  ██  ████  ██  ██  ██",
  "  ██  ██  ████  ██  ██  ██",
  "  ██  ██████████████  ██",
  "  ██  ██  ████████  ██  ██",
  "  ██  ██          ██  ██  ██",
  "    ██  ██████████  ██",
  "  ██  ██  ██  ██  ██  ██",
  "  ██  ██  ██  ██  ██  ██",
];

function CompactSplash() {
  const mono: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    lineHeight: "1.5",
    whiteSpace: "pre",
  };

  return (
    <div
      style={{
        border: `1px solid ${INDIGO}`,
        padding: "16px 20px",
        marginBottom: "12px",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "-9px",
          left: "12px",
          background: "#000",
          padding: "0 8px",
          color: INDIGO,
          fontSize: "11px",
          ...mono,
        }}
      >
        ─ CSI Terminal v2.4.1 ─
      </span>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Left: welcome + pixel art */}
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ ...mono, color: "#FFFFFF", fontWeight: 700, marginBottom: "4px" }}>
            Welcome to CSI.
          </div>
          <pre style={{ ...mono, color: LOGO_COLOR, margin: "6px 0", fontSize: "10px", lineHeight: "1.15" }}>
            {COMPACT_LOGO.join("\n")}
          </pre>
          <div style={{ ...mono, color: TEXT_DIM, marginTop: "4px", fontSize: "11px" }}>
            llama-3.1-8b · guest
          </div>
          <div style={{ ...mono, color: TEXT_DIM, fontSize: "11px" }}>
            csi-terminal · v2.4.1
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", background: "rgba(57, 255, 20, 0.15)", alignSelf: "stretch" }} />

        {/* Middle: commands + status */}
        <div style={{ flex: 1 }}>
          <div style={{ ...mono, color: MATRIX, marginBottom: "2px", fontSize: "11px" }}>Quick commands</div>
          <div style={{ ...mono, color: MATRIX, opacity: 0.4, marginBottom: "4px", fontSize: "11px" }}>──────────────</div>
          {[
            ["help", "list all commands"],
            ["ls", "view all sections"],
            ["whoami", "identify yourself"],
            ["open <section>", "navigate app"],
          ].map(([cmd, desc]) => (
            <div key={cmd} style={{ ...mono, color: TEXT_DIM, fontSize: "11px" }}>
              <span style={{ color: "#FFFFFF" }}>{cmd.padEnd(16)}</span>{desc}
            </div>
          ))}

          <div style={{ ...mono, color: MATRIX, marginTop: "8px", marginBottom: "2px", fontSize: "11px" }}>What&apos;s running</div>
          <div style={{ ...mono, color: MATRIX, opacity: 0.4, marginBottom: "4px", fontSize: "11px" }}>──────────────</div>
          {[
            ["knowledge base", "loaded"],
            ["navigation bridge", "active"],
            ["grok api", "connected"],
          ].map(([label, value]) => (
            <div key={label} style={{ ...mono, color: TEXT_DIM, fontSize: "11px" }}>
              <span style={{ color: MATRIX }}>●</span>{" "}
              {label.padEnd(20)}<span style={{ color: "#FFFFFF" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", background: "rgba(57, 255, 20, 0.15)", alignSelf: "stretch" }} />

        {/* Right: try asking */}
        <div style={{ flex: 1 }}>
          <div style={{ ...mono, color: MATRIX, marginBottom: "2px", fontSize: "11px" }}>Try asking</div>
          <div style={{ ...mono, color: MATRIX, opacity: 0.4, marginBottom: "4px", fontSize: "11px" }}>──────────────</div>
          {[
            "what does the technical dept do?",
            "tell me about recruitment",
            "show me upcoming events",
            "how many members in CSI?",
          ].map((q) => (
            <div key={q} style={{ ...mono, color: TEXT_DIM, fontSize: "11px", marginBottom: "2px" }}>
              <span style={{ color: INDIGO }}>&gt;</span> {q}
            </div>
          ))}

          <div style={{ ...mono, color: MATRIX, marginTop: "8px", marginBottom: "2px", fontSize: "11px" }}>Keyboard shortcuts</div>
          <div style={{ ...mono, color: MATRIX, opacity: 0.4, marginBottom: "4px", fontSize: "11px" }}>──────────────</div>
          {[
            ["Enter", "send message"],
            ["Tab", "accept autocomplete"],
          ].map(([key, desc]) => (
            <div key={key} style={{ ...mono, color: TEXT_DIM, fontSize: "11px" }}>
              <span style={{ color: "#FFFFFF", background: "rgba(255,255,255,0.1)", padding: "1px 6px", borderRadius: "3px" }}>{key.padEnd(8)}</span>{desc}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Splash Screen ──────────────────────────────────────────────── */

const SPLASH_BG = "#0a0a0f";
const MATRIX = "#00ff41";
const LOGO_COLOR = "#7070ff";
const TEXT_DIM = "#c8c8c8";

interface CSISplashProps {
  onComplete: () => void;
}

interface BootStep {
  label: string;
  value: string;
  valueColor: string;
  typeDelay: number;
}

const BOOT_STEPS: BootStep[] = [
  { label: "initializing knowledge base", value: "done", valueColor: MATRIX, typeDelay: 28 },
  { label: "connecting to llama-3.1-8b", value: "online", valueColor: MATRIX, typeDelay: 24 },
  { label: "loading navigation bridge", value: "active", valueColor: MATRIX, typeDelay: 30 },
  { label: "mounting csi section registry", value: "5 sections", valueColor: "#d0d0d0", typeDelay: 22 },
  { label: "compiling system prompt", value: "ready", valueColor: MATRIX, typeDelay: 26 },
  { label: "session started", value: "", valueColor: LOGO_COLOR, typeDelay: 0 },
];

const LOGO_ROWS = [
  "    ████████████████████",
  "  ██  ██████████████  ██",
  "  ██  ██  ████  ██  ██  ██",
  "  ██  ██  ████  ██  ██  ██",
  "  ██  ██████████████  ██",
  "  ██  ██  ████████  ██  ██",
  "  ██  ██          ██  ██  ██",
  "    ██  ██████████  ██",
  "  ██  ██  ██  ██  ██  ██",
  "  ██  ██  ██  ██  ██  ██",
];

const CSISplash = React.memo(function CSISplash({ onComplete }: CSISplashProps) {
  const [phase, setPhase] = useState<"logo" | "boot" | "sliding">("logo");
  const [logoRevealed, setLogoRevealed] = useState(0);
  const [shimmerY, setShimmerY] = useState(-10);
  const [bootLine, setBootLine] = useState(-1);
  const [bootTyped, setBootTyped] = useState(0);
  const [bootValueVisible, setBootValueVisible] = useState(false);
  const [glitchRow, setGlitchRow] = useState(-1);
  const doneRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timersRef.current.forEach(clearTimeout);
    setPhase("sliding");
    setTimeout(onComplete, 500);
  }, [onComplete]);

  // Skip on keypress or click
  useEffect(() => {
    const handler = () => finish();
    window.addEventListener("keydown", handler);
    window.addEventListener("mousedown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("mousedown", handler);
    };
  }, [finish]);

  // Animation sequence
  useEffect(() => {
    if (doneRef.current) return;
    const timers = timersRef.current;

    // Phase 1: Logo reveal — character by character
    const totalChars = LOGO_ROWS.reduce((sum, r) => sum + r.length, 0);
    const charRate = 6; // ms per character
    let elapsed = 0;
    for (let i = 0; i <= totalChars; i++) {
      timers.push(setTimeout(() => setLogoRevealed(i), elapsed));
      elapsed += charRate;
    }

    // Phase 1b: Scanline shimmer (after logo done)
    const logoDone = elapsed;
    timers.push(setTimeout(() => setShimmerY(-10), logoDone));
    for (let y = -10; y <= 110; y += 2) {
      timers.push(setTimeout(() => setShimmerY(y), logoDone + (y + 10) * 8));
    }

    // Phase 1c: Logo blocks pulse (random glitch on hover handled via CSS)
    // Random glitch intervals
    const glitchInterval = setInterval(() => {
      const row = Math.floor(Math.random() * LOGO_ROWS.length);
      setGlitchRow(row);
      setTimeout(() => setGlitchRow(-1), 80);
    }, 2000);
    timers.push(setTimeout(() => clearInterval(glitchInterval), 10000) as unknown as ReturnType<typeof setTimeout>);

    // Phase 2: Boot lines (after logo + shimmer)
    const bootStart = logoDone + 900;
    let bootAccum = bootStart;

    for (let i = 0; i < BOOT_STEPS.length; i++) {
      const step = BOOT_STEPS[i];
      const textLen = step.label.length;

      // Show line number
      timers.push(setTimeout(() => setBootLine(i), bootAccum));

      // Typewriter effect
      for (let c = 0; c <= textLen; c++) {
        timers.push(setTimeout(() => setBootTyped(c), bootAccum + c * step.typeDelay));
      }

      bootAccum += textLen * step.typeDelay + 60;

      // Show value
      if (step.value) {
        timers.push(setTimeout(() => setBootValueVisible(true), bootAccum));
        timers.push(setTimeout(() => setBootValueVisible(false), bootAccum + 100));
        bootAccum += 120;
      }

      bootAccum += 50;
    }

    // Phase 3: Slide out
    timers.push(
      setTimeout(() => {
        setPhase("sliding");
        setTimeout(onComplete, 500);
      }, bootAccum + 600)
    );

    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [onComplete]);

  // Compute how many logo characters to reveal
  let charsRemaining = logoRevealed;
  const revealedRows: string[] = [];
  for (const row of LOGO_ROWS) {
    if (charsRemaining <= 0) {
      revealedRows.push("");
      continue;
    }
    const take = Math.min(charsRemaining, row.length);
    revealedRows.push(row.slice(0, take));
    charsRemaining -= take;
  }

  const mono: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "13px",
    lineHeight: "1.6",
    whiteSpace: "pre",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: SPLASH_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "transform 500ms ease-in, opacity 500ms ease-in",
        transform: phase === "sliding" ? "translateY(-100vh)" : "translateY(0)",
        opacity: phase === "sliding" ? 0 : 1,
      }}
    >
      {/* CRT flicker overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `rgba(0, 255, 65, ${phase === "boot" ? 0.03 : 0})`,
          transition: "background 300ms ease",
          zIndex: 1,
        }}
      />

      {/* Scanline shimmer */}
      {shimmerY >= -10 && shimmerY <= 110 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${shimmerY}%`,
            height: "2px",
            background: `linear-gradient(90deg, transparent 0%, ${LOGO_COLOR}44 30%, ${LOGO_COLOR}88 50%, ${LOGO_COLOR}44 70%, transparent 100%)`,
            boxShadow: `0 0 20px ${LOGO_COLOR}44`,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 2, marginBottom: "32px" }}>
        <pre
          style={{
            ...mono,
            fontSize: "16px",
            lineHeight: "1.2",
            color: LOGO_COLOR,
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          {revealedRows.map((row, i) => {
            const isGlitching = i === glitchRow;
            return (
              <div
                key={i}
                style={{
                  transform: isGlitching ? `translateX(${Math.random() > 0.5 ? 3 : -3}px)` : "none",
                  transition: isGlitching ? "none" : "transform 80ms ease",
                  animation: `logoBlockPulse 3s ease-in-out ${(i * 0.3) % 2}s infinite`,
                }}
              >
                {row || "\u00A0"}
              </div>
            );
          })}
        </pre>
      </div>

      {/* Title below logo */}
      <div
        style={{
          ...mono,
          fontSize: "14px",
          color: TEXT_DIM,
          textAlign: "center",
          marginBottom: "40px",
          opacity: logoRevealed > 0 ? 1 : 0,
          transition: "opacity 400ms ease",
          letterSpacing: "3px",
        }}
      >
        csi terminal v2.4.1
      </div>

      {/* Boot lines */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "520px", padding: "0 24px" }}>
        {BOOT_STEPS.map((step, i) => {
          if (i > bootLine) return null;
          const isActive = i === bootLine;
          const typedText = isActive ? step.label.slice(0, bootTyped) : step.label;
          const showCursor = isActive && bootTyped < step.label.length;

          return (
            <div
              key={i}
              style={{
                ...mono,
                fontSize: "13px",
                marginBottom: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: TEXT_DIM }}>
                <span style={{ color: MATRIX }}>●</span>{" "}
                {typedText}
                {showCursor && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "7px",
                      height: "14px",
                      background: MATRIX,
                      marginLeft: "1px",
                      verticalAlign: "middle",
                      animation: "blink 0.6s step-end infinite",
                    }}
                  />
                )}
              </span>
              {step.value && (isActive ? bootValueVisible : true) && (
                <span
                  style={{
                    color: step.valueColor,
                    opacity: isActive ? (bootValueVisible ? 1 : 0) : 1,
                    transition: "opacity 100ms ease",
                    textShadow: isActive && bootValueVisible ? `0 0 8px ${step.valueColor}` : "none",
                  }}
                >
                  {step.value}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Skip hint */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          ...mono,
          fontSize: "11px",
          color: TEXT_DIM,
          opacity: 0.3,
          zIndex: 2,
        }}
      >
        press any key to skip
      </div>

      {/* Global splash styles */}
      <style jsx global>{`
        @keyframes logoBlockPulse {
          0%, 100% { opacity: 0.7; filter: brightness(0.8); }
          50% { opacity: 1; filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
});

/* ─── Terminal Line Display ──────────────────────────────────────── */

function TerminalLineDisplay({ line }: { line: TerminalLine }) {
  const color =
    line.type === "ai"
      ? INDIGO
      : line.type === "user"
      ? "#FFFFFF"
      : line.type === "error"
      ? RED
      : GREEN;

  return (
    <div style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {line.text}
      {line.timestamp && (
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", marginLeft: "8px" }}>
          {line.timestamp}
        </span>
      )}
    </div>
  );
}

/* ─── Thinking Indicator ─────────────────────────────────────────── */

const ThinkingIndicator = React.memo(function ThinkingIndicator() {
  const [dots, setDots] = useState("⠋");

  useEffect(() => {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % frames.length;
      setDots(frames[i]);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ color: INDIGO, fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}>
      {dots} thinking...
    </div>
  );
});

/* ─── Main Terminal Component ────────────────────────────────────── */

export const CSITerminal = React.memo(function CSITerminal({
  onNavigate,
  onClose,
  isActive,
  onFocus,
}: CSITerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamingBufferRef = useRef("");
  const streamedSoFarRef = useRef("");
  const conversationRef = useRef<Array<{ role: string; content: string }>>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lineIdCounter = useRef(0);

  const genId = useCallback(() => {
    lineIdCounter.current += 1;
    return `line-${lineIdCounter.current}-${Date.now()}`;
  }, []);

  // RAF flush loop
  useEffect(() => {
    let rafId: number;
    const flush = () => {
      if (streamingBufferRef.current) {
        streamedSoFarRef.current += streamingBufferRef.current;
        setStreamingText((prev) => prev + streamingBufferRef.current);
        streamingBufferRef.current = "";
      }
      rafId = requestAnimationFrame(flush);
    };
    rafId = requestAnimationFrame(flush);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, streamingText]);

  // Focus input on mount and after streaming
  useEffect(() => {
    if (!isStreaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStreaming]);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Focus input when splash completes
  useEffect(() => {
    if (splashDone && inputRef.current) {
      inputRef.current.focus();
    }
  }, [splashDone]);

  const addLine = useCallback(
    (type: TerminalLineType, text: string) => {
      setLines((prev) => [...prev, { id: genId(), type, text, timestamp: getTimestamp() }]);
    },
    [genId]
  );

  const sendToGrok = useCallback(
    async (userMessage: string) => {
      conversationRef.current.push({ role: "user", content: userMessage });

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsStreaming(true);
      setThinking(true);
      setStreamingText("");
      streamingBufferRef.current = "";
      streamedSoFarRef.current = "";

      try {
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationRef.current,
        ];

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            stream: true,
            max_tokens: 600,
            temperature: 0.7,
            messages,
          }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let firstToken = false;

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (!value) continue;

          const chunk = decoder.decode(value, { stream: true });
          const dataLines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of dataLines) {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(jsonStr) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                if (!firstToken) {
                  firstToken = true;
                  setThinking(false);
                }
                streamingBufferRef.current += token;
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        // Final flush from buffer
        if (streamingBufferRef.current) {
          streamedSoFarRef.current += streamingBufferRef.current;
        }
        const finalText = streamedSoFarRef.current;
        streamingBufferRef.current = "";
        streamedSoFarRef.current = "";
        setStreamingText("");

        setThinking(false);

        if (finalText) {
          const navMatch = finalText.match(/navigate:(\w+)/i);
          const displayText = navMatch
            ? finalText.replace(/\n?navigate:\w+\s*\n?/gi, "").trim()
            : finalText.trim();

          if (displayText) {
            addLine("ai", displayText);
          }

          conversationRef.current.push({ role: "assistant", content: finalText });

          if (navMatch) {
            const section = navMatch[1].toLowerCase();
            if (VALID_SECTIONS.includes(section)) {
              addLine("system", `→ Opening ${section}...`);
              setTimeout(() => onNavigate(section), 1800);
            }
          }
        }
      } catch (err: unknown) {
        setThinking(false);
        if (err instanceof Error && err.name === "AbortError") {
          addLine("system", "Request cancelled.");
        } else {
          addLine("error", `Error: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
      } finally {
        setIsStreaming(false);
        setStreamingText("");
        streamingBufferRef.current = "";
        abortControllerRef.current = null;
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [addLine, onNavigate]
  );

  const handleCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      addLine("user", trimmed);

      const lower = trimmed.toLowerCase();

      if (lower === "clear") {
        setLines([]);
        conversationRef.current = [];
        return;
      }

      if (lower === "help") {
        addLine("system", HELP_TEXT);
        return;
      }

      if (lower === "ls") {
        addLine("system", LS_TEXT);
        return;
      }

      if (lower === "whoami") {
        addLine("system", WHOAMI_CARD);
        return;
      }

      if (lower === "status") {
        addLine("system", STATUS_TEXT);
        return;
      }

      if (lower === "stack") {
        addLine("system", STACK_TEXT);
        return;
      }

      if (lower.startsWith("sudo")) {
        addLine("system", "nice try. you don't have root access here.\n\nbut joining CSI is basically sudo for your career — elevated privileges, real projects, and a network that actually matters.\n\nrecruitment opens every fall. just saying.");
        return;
      }

      if (lower.startsWith("open ")) {
        const section = lower.slice(5).trim();
        if (VALID_SECTIONS.includes(section)) {
          addLine("system", `→ Launching ${section}...`);
          onNavigate(section);
        } else {
          addLine("error", `Unknown section: "${section}". Type "ls" to see available sections.`);
        }
        return;
      }

      if (lower === "history") {
        const userMsgs = conversationRef.current
          .filter((m) => m.role === "user")
          .slice(-10);
        if (userMsgs.length === 0) {
          addLine("system", HISTORY_EMPTY);
        } else {
          const hist = userMsgs.map((m, i) => `  ${i + 1}. ${m.content}`).join("\n");
          addLine("system", hist);
        }
        return;
      }

      if (lower === "exit" || lower === "quit") {
        addLine("system", "Sessions cannot be closed. CSI is forever.");
        return;
      }

      sendToGrok(trimmed);
    },
    [addLine, onNavigate, sendToGrok]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isStreaming) {
        handleCommand(input);
        setInput("");
      }
    },
    [input, isStreaming, handleCommand]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.98,
        y: isActive ? 0 : 10,
        pointerEvents: isActive ? "auto" : "none",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onMouseDown={onFocus}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: isActive ? 110 : 10,
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px)",
        }}
      />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          background: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          zIndex: 11,
          flexShrink: 0,
        }}
      >
        {/* Window dots */}
        <div style={{ display: "flex", gap: "8px", position: "absolute", left: "16px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#FF5F57",
              border: "none",
              cursor: "pointer",
            }}
          />
          <button
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#FEBC2E",
              border: "none",
              cursor: "pointer",
            }}
          />
          <button
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#28C840",
              border: "none",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.8)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.5px",
          }}
        >
          csi-terminal
        </div>

        {/* Model badge */}
        <div
          style={{
            position: "absolute",
            right: "16px",
            display: "flex",
            gap: "8px",
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          <span>[llama-3.1-8b]</span>
          <span style={{ color: GREEN }}>[online]</span>
        </div>
      </div>

      {/* Splash overlay — fullscreen, slides up when done */}
      {!splashDone && (
        <CSISplash onComplete={() => setSplashDone(true)} />
      )}

      {/* Output area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: "auto",
          scrollBehavior: "smooth",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          background: "#000000",
          position: "relative",
          zIndex: 11,
        }}
      >
        {/* Compact splash card — stays in output after fullscreen animation */}
        {splashDone && <CompactSplash />}

        {/* Terminal lines */}
        {lines.map((line) => (
          <TerminalLineDisplay key={line.id} line={line} />
        ))}
        {thinking && <ThinkingIndicator />}
        {streamingText && (
          <div
            style={{
              color: INDIGO,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {streamingText}
            <span style={{ animation: "blink 1s infinite" }}>▋</span>
          </div>
        )}
      </div>

      {/* Input row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          background: "#000000",
          position: "relative",
          zIndex: 11,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: INDIGO,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            marginRight: "4px",
            userSelect: "none",
          }}
        >
          {"> "}
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming || !splashDone}
          placeholder={splashDone ? "ask anything about CSI..." : "loading..."}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#FFFFFF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            caretColor: INDIGO,
            opacity: splashDone ? 1 : 0.4,
          }}
        />
        {!isStreaming && splashDone && (
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "18px",
              background: INDIGO,
              animation: "blink 1s infinite",
              marginLeft: "2px",
              verticalAlign: "middle",
            }}
          />
        )}
      </div>

      {/* Global styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap");
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </motion.div>
  );
});
