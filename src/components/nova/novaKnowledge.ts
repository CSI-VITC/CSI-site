import type { QuickActionId, WindowId } from "./types";

export interface NovaSessionContext {
  hour: number;
  openWindows: WindowId[];
  visitedApps: WindowId[];
  achievements: string[];
  novaOpened: boolean;
  isGuest?: boolean;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export function getTimeGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Hey night owl";
}

export function buildWelcomeMessage(context?: NovaSessionContext): string {
  const hour = context?.hour ?? new Date().getHours();
  const greeting = getTimeGreeting(hour);

  if (context?.isGuest) {
    const lines = [
      `${greeting}! I'm CSI Nova 👋`,
      "Explore events, resources, domains, and the gallery — no sign-in needed.",
      "Sign in anytime to save resources, track registrations, and unlock your member dashboard.",
    ];
    if (context.visitedApps.length >= 3) {
      lines.push("\nYou're getting the lay of the land — ask me anything about CSI!");
    }
    return lines.join("\n");
  }

  const lines = [
    `${greeting}! I'm CSI Nova 👋`,
    context?.isAdmin
      ? "Your admin workspace is ready — I can help with events, analytics, and platform management."
      : "Welcome back! I can help with your dashboard, saved resources, and event registrations.",
    "Ask me about events, domains, workshops, resources, or anything related to CSI.",
  ];

  if (context?.visitedApps.length) {
    const count = context.visitedApps.length;
    if (count >= 5) {
      lines.push("\nYou've been exploring — ask me anything you've missed.");
    } else if (context.openWindows.length > 0) {
      lines.push("\nI can see you're browsing the desktop. How can I help?");
    }
  }

  return lines.join("\n");
}

export const QUICK_ACTIONS = [
  { id: "events" as const, label: "Upcoming Events", emoji: "📅" },
  { id: "domains" as const, label: "CSI Domains", emoji: "🎯" },
  { id: "workshops" as const, label: "Workshops", emoji: "🛠️" },
  { id: "hackathons" as const, label: "Hackathons", emoji: "⚡" },
  { id: "team" as const, label: "Team Info", emoji: "👥" },
  { id: "resources" as const, label: "Resources", emoji: "📚" },
  { id: "contact" as const, label: "Contact CSI", emoji: "✉️" },
];

const ACTION_RESPONSES: Record<
  QuickActionId,
  { message: string; navigateTo?: WindowId }
> = {
  events: {
    message:
      "CSI hosts 40+ events every year — from tech talks and coding sessions to community meetups. Open the Events window from the dock to browse our gallery of hackathons, workshops, and chapter highlights!",
    navigateTo: "events",
  },
  domains: {
    message:
      "CSI VITC has four core domains:\n\n• Management — led by Sudeep & Suyash\n• Technical — led by Yeswanth & Syed\n• Design — led by Janet\n• Social & Content — led by Nityasri\n\nEach domain drives projects, events, and growth in its specialty. I can open the Departments window for you!",
    navigateTo: "depts",
  },
  workshops: {
    message:
      "Our workshops cover hands-on skills — from web development and AI/ML to design and cybersecurity. Past sessions include technical deep-dives and collaborative build days. Check the Events section for workshop photos and upcoming sessions!",
    navigateTo: "events",
  },
  hackathons: {
    message:
      "Hackathons are a CSI signature! We run intensive build sprints where teams ship real projects overnight. Our gallery features past hackathon moments — open Events to see them, or join our community to participate in the next one!",
    navigateTo: "events",
  },
  team: {
    message:
      "Meet the CSI leadership:\n\n• Arjun Selvam — President (Web Dev)\n• Karthik Rajan — Vice President (AI/ML)\n• Meera Krishnan — Design Lead (UI/UX)\n• Vikram Anand — Security Lead (Cybersecurity)\n• Priya Nair — Tech Lead (Web Dev)\n\n150 members strong. Open the Team window to browse the full roster!",
    navigateTo: "team",
  },
  resources: {
    message:
      "The Resource Hub is your learning command center! 📚\n\n• 12 curated categories — AI/ML, Web Dev, CP, Cybersecurity & more\n• Interactive roadmaps with progress tracking\n• Bookmark resources for later\n• CSI workshop recordings & exclusive guides\n\nOpen Resource Hub from the dock — or ask me \"How do I start AI/ML?\" for a personalized path!",
    navigateTo: "resources",
  },
  contact: {
    message:
      "Reach CSI anytime:\n\n📧 csi.vitc@gmail.com\n📍 VIT Chennai, Vandalur-Kelambakkam Road, Chennai — 600127\n📱 Instagram: @csi.vitc\n\nWhether you want to collaborate, speak at an event, or just say hi — our inbox is open!",
    navigateTo: "contact",
  },
};

const KEYWORD_RESPONSES: { keywords: string[]; actionId: QuickActionId }[] = [
  { keywords: ["event", "calendar", "upcoming"], actionId: "events" },
  { keywords: ["domain", "department", "management", "technical", "design"], actionId: "domains" },
  { keywords: ["workshop", "session", "learn"], actionId: "workshops" },
  { keywords: ["hackathon", "hack", "competition"], actionId: "hackathons" },
  { keywords: ["team", "president", "lead", "member", "who"], actionId: "team" },
  { keywords: ["resource", "roadmap", "learn", "study", "hub", "bookmark", "placement", "resume", "interview prep"], actionId: "resources" },
  { keywords: ["project", "github", "open source", "campusos"], actionId: "resources" },
  { keywords: ["contact", "email", "reach", "instagram", "location"], actionId: "contact" },
  { keywords: ["about", "mission", "value", "csi", "chapter"], actionId: "resources" },
];

const WINDOW_LABELS: Record<WindowId, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  events: "Events",
  gallery: "Gallery",
  about: "About Us",
  depts: "Departments",
  projects: "Projects",
  team: "Team",
  contact: "Contact",
  csi: "CSI Official",
  resources: "Resource Hub",
  "admin-console": "Admin Console",
  "admin-analytics": "Analytics",
  "event-admin": "Event Management",
  "admin-users": "User Management",
  "admin-resources": "Resource Management",
  "admin-gallery": "Gallery Management",
  "admin-announcements": "Announcements",
  "admin-certificates": "Certificate Management",
};

function getContextualPrefix(context?: NovaSessionContext): string | null {
  if (!context?.openWindows.length) return null;
  const focused = context.openWindows[context.openWindows.length - 1];
  const label = WINDOW_LABELS[focused];
  const hints: Partial<Record<WindowId, string>> = {
    dashboard: "Your home base — quick links to events, resources, and admin tools if you're an administrator.",
    events: "Browse and register for published CSI events here.",
    gallery: "Since Gallery is open — ask about hackathons or workshop highlights anytime.",
    depts: "Exploring domains? Ask me about any team and their focus areas.",
    about: "You're in About Us — check Statistics for live counters.",
    projects: "Browsing projects? CampusOS and SentinelX are member favorites.",
    resources: "You're in the Resource Hub — bookmark anything useful or follow a roadmap!",
    "event-admin": "Managing events? Nova insights appear in the top-right — drag cards between columns to update status.",
    "admin-console": "Administrative console open — elevated permissions active.",
  };
  return hints[focused] ? `Noticed you're in ${label}. ${hints[focused]}` : null;
}

export function getResponseForAction(actionId: QuickActionId, context?: NovaSessionContext) {
  const base = ACTION_RESPONSES[actionId];
  const prefix = getContextualPrefix(context);
  if (!prefix) return base;
  return { ...base, message: `${prefix}\n\n${base.message}` };
}

export function getResponseForQuery(query: string, context?: NovaSessionContext) {
  const normalized = query.toLowerCase().trim();

  if (!normalized) {
    return {
      message: "Feel free to ask me anything about CSI — or tap a quick action below!",
    };
  }

  if (normalized.match(/(sign.?in|log.?in|create account|register.*account|member dashboard|my dashboard)/)) {
    if (context?.isGuest) {
      return {
        message:
          "Sign in to unlock your CSI member experience:\n\n• Member Dashboard\n• Saved Resources\n• Event Registrations & History\n• Certificates\n• Personalized Nova recommendations\n\nTap Sign In in the menu bar, or open Profile from the dock!",
      };
    }
    return {
      message: "You're already signed in! Open your Dashboard from the dock for quick access to member features.",
      navigateTo: "dashboard" as WindowId,
    };
  }

  if (normalized.match(/(admin|manage event|event management|publish event)/)) {
    if (context?.isGuest || !context?.isAdmin) {
      return {
        message:
          "Event Management is an administrator workspace. Sign in with an approved admin account to create, publish, and manage CSI events.\n\nAs a guest, you can browse and discover events anytime!",
        navigateTo: context?.isGuest ? ("events" as WindowId) : undefined,
      };
    }
    return {
      message:
        "Open Event Management from Launchpad to create, publish, and track CSI events.\n\n• Drag cards between Draft → Published → Live → Completed\n• Timeline view for scheduling\n• Live analytics and Nova admin insights\n\nI can open it for you now.",
      navigateTo: "event-admin" as WindowId,
    };
  }

  if (normalized.match(/(how.*create.*event|create.*event|new event)/)) {
    if (!context?.isAdmin) {
      return {
        message: context?.isGuest
          ? "Browse upcoming events from the Events app — no account needed!\n\nTo organize CSI events, an administrator account is required."
          : "Creating events requires administrator access. Browse and register for events from the Events app!",
        navigateTo: "events" as WindowId,
      };
    }
    return {
      message:
        "To create an event in Event Management:\n\n1. Open Event Admin from Launchpad\n2. Click Create Event (or press N)\n3. Fill title, date, venue, and capacity\n4. Upload a poster (optional)\n5. Save as Draft, then Publish when ready\n\nUse ⌘K for the command palette!",
      navigateTo: "event-admin" as WindowId,
    };
  }

  if (normalized.match(/(registration|registrant|attendee)/)) {
    if (context?.isAdmin) {
      return {
        message:
          "Manage registrations in Event Management:\n\n1. Open an event card (Enter or click)\n2. Use the Registrations section to add name + email\n3. Remove attendees with the Remove button\n4. Watch Seats Remaining update in real time\n\nNova tip: events near capacity trigger insight alerts.",
        navigateTo: "event-admin" as WindowId,
      };
    }
    return {
      message: context?.isGuest
        ? "Sign in to register for CSI events and track your registrations.\n\nYou can browse all published events right now from the Events app!"
        : "Open Events to register for workshops and hackathons. Your registrations appear in your member dashboard.",
      navigateTo: "events" as WindowId,
    };
  }

  if (normalized.match(/(analytics|metrics|fill rate|attendance data)/)) {
    if (context?.isAdmin) {
      return {
        message:
          "Analytics in Event Management:\n\n• Switch to the Analytics tab (or press 3)\n• View registrations, attendance, and fill rate\n• Bar chart shows per-event sign-ups\n• Data table provides accessible exact values\n\nAsk me to interpret any metric!",
        navigateTo: "event-admin" as WindowId,
      };
    }
    if (context?.isGuest) {
      return {
        message: "Sign in to access your member dashboard and track your event activity.\n\nBrowse public events anytime from the Events app!",
        navigateTo: "events" as WindowId,
      };
    }
    return {
      message: "Open your Dashboard for member insights, or browse events to see what's coming up!",
      navigateTo: "dashboard" as WindowId,
    };
  }

  if (normalized.match(/\b(ship|build|craft)\b/)) {
    return {
      message:
        "Craft over credentials — that's core CSI. 🛠️\n\nThe best way to learn here is to build something real. Check the Resource Hub for roadmaps and project guides, or Projects for what members have shipped.",
      navigateTo: "resources" as WindowId,
      unlockAchievement: "builder_mindset" as const,
    };
  }

  if (normalized.match(/(how.*start|begin|get into|learn).*(ai|ml|machine learning|deep learning)/)) {
    return {
      message:
        "Great choice! Here's your AI/ML path in the Resource Hub:\n\n1️⃣ Python & NumPy/Pandas\n2️⃣ Statistics fundamentals\n3️⃣ Machine Learning with scikit-learn\n4️⃣ Deep Learning (PyTorch/TensorFlow)\n5️⃣ LLMs & RAG\n6️⃣ Capstone project\n\nOpen Resource Hub → AI / ML → Roadmap tab to track your progress step by step!",
      navigateTo: "resources" as WindowId,
    };
  }

  if (normalized.match(/(how.*start|begin|learn).*(web|frontend|full.?stack|react)/)) {
    return {
      message:
        "Start web development in the Resource Hub:\n\nHTML & CSS → JavaScript → React → Node.js → Deployment\n\nCheck the Full-Stack Web Development Roadmap under Web Development. Bookmark resources as you go!",
      navigateTo: "resources" as WindowId,
    };
  }

  if (normalized.match(/(interview|placement|resume|aptitude|coding round)/)) {
    return {
      message:
        "Placement prep lives in the Resource Hub! 📋\n\n• Interview Preparation — DSA + system design + STAR method\n• Resume Building — CSI alumni template\n• Placement Preparation — full semester timeline\n\nI can open the Resource Hub for you now.",
      navigateTo: "resources" as WindowId,
    };
  }

  if (normalized.match(/(cyber|security|hack|ctf|ethical)/)) {
    return {
      message:
        "Cybersecurity resources are ready in the Hub:\n\n• Cybersecurity Learning Path roadmap\n• OWASP Top 10 deep dive\n• CTF Preparation Handbook\n\nOpen Resource Hub → Cybersecurity to get started.",
      navigateTo: "resources" as WindowId,
    };
  }

  if (normalized.match(/(competitive programming|cp|codeforces|leetcode|dsa)/)) {
    return {
      message:
        "Level up CP in the Resource Hub:\n\n• Competitive Programming Roadmap\n• STL & Algorithm Patterns\n• Curated LeetCode Playlist\n\nOpen Resource Hub → Competitive Programming → Roadmap tab!",
      navigateTo: "resources" as WindowId,
    };
  }

  if (normalized.match(/\b(konami|easter|secret|hidden)\b/)) {
    return {
      message:
        "You're curious — I like that. 👀\n\nTry exploring every dock app, triple-clicking the hero eyes, or typing the classic gamer sequence on your keyboard. Achievements await power users.",
    };
  }

  for (const { keywords, actionId } of KEYWORD_RESPONSES) {
    if (keywords.some((kw) => normalized.includes(kw))) {
      return getResponseForAction(actionId, context);
    }
  }

  if (normalized.match(/^(hi|hello|hey|yo|sup|good morning|good evening|good afternoon)/)) {
    const greeting = getTimeGreeting(context?.hour ?? new Date().getHours());
    return {
      message: `${greeting}! I'm Nova, your CSI guide. Pick a quick action below or ask me about events, domains, workshops, the team, or how to get in touch!`,
    };
  }

  if (normalized.match(/(thank|thanks|ty)/)) {
    return {
      message: "Happy to help! If you need anything else about CSI, I'm right here.",
    };
  }

  if (context && context.visitedApps.length >= 5) {
    return {
      message:
        "You've explored most of the CSI desktop — impressive! 🎯\n\nI can still help with specifics: events, domains, team contacts, or project resources. What would you like to dive into?",
    };
  }

  const prefix = getContextualPrefix(context);
  const fallback =
    "Great question! I can help with events, CSI domains, workshops, hackathons, team info, resources, and contact details. Try a quick action below, or rephrase your question!";

  return {
    message: prefix ? `${prefix}\n\n${fallback}` : fallback,
  };
}

export type NovaQueryResponse = ReturnType<typeof getResponseForQuery> & {
  navigateTo?: WindowId;
  unlockAchievement?: "builder_mindset";
};
