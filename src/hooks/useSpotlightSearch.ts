"use client";

import { useMemo } from "react";
import type { AdminEvent } from "@/data/adminEventsData";
import type { PlatformAnnouncement } from "@/data/platformContent";
import {
  DOMAIN_TOPIC_MAP,
  QUICK_ACTIONS,
  SPOTLIGHT_DOMAINS,
  SPOTLIGHT_GALLERY,
  SPOTLIGHT_PROJECTS,
  SPOTLIGHT_RESOURCES,
  SPOTLIGHT_TEAM,
  type SpotlightResultKind,
  type SpotlightStaticEntry,
} from "@/data/spotlightSearchData";
import type { LaunchpadItemDef } from "@/lib/rbac/navigation";
import { WINDOW_TITLES } from "@/lib/rbac/navigation";
import { normalizeSpotlightQuery, scoreText } from "@/lib/spotlightSearchUtils";
import type { WindowId } from "@/components/nova/types";
import type { UserRole } from "@/types/auth";

export type { SpotlightResultKind } from "@/data/spotlightSearchData";

const MIN_SCORE = 15;
const MAX_RESULTS = 16;

export interface SpotlightResult {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  kind: SpotlightResultKind;
  group: string;
  score: number;
  shortcut?: string;
  iconSrc?: string;
  action: () => void;
}

export interface SpotlightGroup {
  label: string;
  results: SpotlightResult[];
}

export interface SpotlightActions {
  openWindow: (id: WindowId) => void;
  openLaunchpad: () => void;
  goHome: () => void;
  askNova: (query: string) => void;
}

interface UseSpotlightSearchOptions {
  query: string;
  events: AdminEvent[];
  announcements: PlatformAnnouncement[];
  launchpadItems: LaunchpadItemDef[];
  visitedApps: WindowId[];
  recentSearches: string[];
  isAuthenticated: boolean;
  role: UserRole | null;
  actions: SpotlightActions;
}

function scoreEntry(entry: SpotlightStaticEntry, query: string): number {
  const parts = [entry.title, entry.subtitle, entry.description ?? "", entry.categoryLabel ?? "", ...entry.keywords].join(" ");
  return scoreText(parts, query);
}

function detectTopics(query: string): string[] {
  const q = normalizeSpotlightQuery(query).toLowerCase();
  return Object.entries(DOMAIN_TOPIC_MAP)
    .filter(([, words]) => words.some((w) => q.includes(w)))
    .map(([topic]) => topic);
}

function eventCategoryLabel(category: AdminEvent["category"]): string {
  const map: Record<AdminEvent["category"], string> = {
    workshop: "Workshop",
    hackathon: "Hackathon",
    talk: "Tech Talk",
    meetup: "Meetup",
    competition: "Competition",
  };
  return map[category] ?? "Event";
}

function buildFromStatic(
  entry: SpotlightStaticEntry,
  query: string,
  group: string,
  action: () => void
): SpotlightResult | null {
  const score = query ? scoreEntry(entry, query) : 0;
  if (query && score < MIN_SCORE) return null;
  return {
    id: entry.id,
    title: entry.title,
    subtitle: entry.subtitle,
    description: entry.description,
    kind: entry.kind,
    group,
    score: query ? score : 30,
    action,
  };
}

export function useSpotlightSearch({
  query,
  events,
  announcements,
  launchpadItems,
  visitedApps,
  recentSearches,
  isAuthenticated,
  role,
  actions,
}: UseSpotlightSearchOptions): { groups: SpotlightGroup[]; flatResults: SpotlightResult[] } {
  return useMemo(() => {
    const q = normalizeSpotlightQuery(query);
    const isAdmin = role === "admin";
    const results: SpotlightResult[] = [];

    const pushStatic = (
      entries: SpotlightStaticEntry[],
      group: string,
      getAction: (e: SpotlightStaticEntry) => () => void
    ) => {
      for (const entry of entries) {
        const r = buildFromStatic(entry, q, group, getAction(entry));
        if (r) results.push(r);
      }
    };

    if (!q) {
      for (const search of recentSearches.slice(0, 4)) {
        results.push({
          id: `recent-${search}`,
          title: search,
          subtitle: "Recent · Search",
          kind: "action",
          group: "Recent",
          score: 90,
          action: () => {},
          description: "Repeat this search",
        });
      }

      const freqApps = [...visitedApps].reverse().slice(0, 5);
      for (const appId of freqApps) {
        const label = WINDOW_TITLES[appId];
        if (!label) continue;
        const dockItem = launchpadItems.find((i) => i.id === appId);
        results.push({
          id: `freq-${appId}`,
          title: label,
          subtitle: "Frequent · App",
          kind: "app",
          group: "Frequently Used",
          score: 80,
          iconSrc: dockItem?.iconSrc,
          action: () => actions.openWindow(appId),
        });
      }

      for (const act of QUICK_ACTIONS) {
        if (act.adminOnly && !isAdmin) continue;
        if (act.windowId === "dashboard" && !isAuthenticated) continue;
        results.push({
          id: act.id,
          title: act.title,
          subtitle: act.subtitle,
          kind: "action",
          group: "Suggested",
          score: 70,
          action: () => {
            if (act.systemAction === "launchpad") actions.openLaunchpad();
            else if (act.systemAction === "home") actions.goHome();
            else if (act.systemAction === "nova") actions.askNova("How can CSI help me today?");
            else if (act.windowId) actions.openWindow(act.windowId);
          },
        });
      }

      for (const item of launchpadItems.slice(0, 8)) {
        if (results.some((r) => r.id === `app-${item.id}`)) continue;
        results.push({
          id: `app-${item.id}`,
          title: item.label,
          subtitle: "App · Launch",
          kind: "app",
          group: "Apps",
          score: 60,
          iconSrc: item.iconSrc,
          action: () => actions.openWindow(item.id),
        });
      }
    } else {
      for (const act of QUICK_ACTIONS) {
        if (act.adminOnly && !isAdmin) continue;
        if (act.windowId === "dashboard" && !isAuthenticated) continue;
        const score = scoreText([act.title, act.subtitle, ...act.keywords].join(" "), q);
        if (score >= MIN_SCORE) {
          results.push({
            id: act.id,
            title: act.title,
            subtitle: act.subtitle,
            kind: "action",
            group: "Actions",
            score: score + 10,
            action: () => {
              if (act.systemAction === "launchpad") actions.openLaunchpad();
              else if (act.systemAction === "home") actions.goHome();
              else if (act.systemAction === "nova") actions.askNova(q);
              else if (act.windowId) actions.openWindow(act.windowId);
            },
          });
        }
      }

      for (const item of launchpadItems) {
        const score = scoreText(`${item.label} app window open`, q);
        if (score >= MIN_SCORE) {
          results.push({
            id: `app-${item.id}`,
            title: item.label,
            subtitle: "App · Open",
            kind: "app",
            group: "Apps",
            score,
            iconSrc: item.iconSrc,
            action: () => actions.openWindow(item.id),
          });
        }
      }

      for (const event of events) {
        if (event.status === "draft" || event.status === "archived") continue;
        const domain =
          event.tags.includes("ai") || event.tags.includes("ml")
            ? "AI/ML"
            : event.tags.includes("web")
              ? "Web Dev"
              : event.tags.includes("security")
                ? "Cybersecurity"
                : event.tags.includes("design")
                  ? "UI/UX"
                  : eventCategoryLabel(event.category);
        const score = scoreText(
          [event.title, event.description, event.category, ...event.tags, domain].join(" "),
          q
        );
        if (score >= MIN_SCORE) {
          results.push({
            id: `evt-${event.id}`,
            title: event.title,
            subtitle: `Event · ${domain}`,
            description: event.description,
            kind: "event",
            group: "Events",
            score,
            action: () => actions.openWindow("events"),
          });
        }
      }

      pushStatic(SPOTLIGHT_RESOURCES, "Resources", () => () => actions.openWindow("resources"));
      pushStatic(SPOTLIGHT_PROJECTS, "Projects", (e) => () => actions.openWindow(e.windowId ?? "projects"));
      pushStatic(SPOTLIGHT_TEAM, "Team", () => () => actions.openWindow("team"));
      pushStatic(SPOTLIGHT_DOMAINS, "Domains", (e) => () => actions.openWindow(e.windowId ?? "depts"));
      pushStatic(SPOTLIGHT_GALLERY, "Gallery", () => () => actions.openWindow("gallery"));

      for (const ann of announcements) {
        const score = scoreText(`${ann.title} ${ann.body}`, q);
        if (score >= MIN_SCORE) {
          results.push({
            id: `ann-${ann.id}`,
            title: ann.title,
            subtitle: "Announcement · Chapter",
            description: ann.body,
            kind: "announcement",
            group: "Announcements",
            score,
            action: () => actions.openWindow(isAdmin ? "admin-announcements" : "dashboard"),
          });
        }
      }

      const topics = detectTopics(q);
      const novaScore = 78 + (topics.length > 0 ? 12 : 0);
      results.push({
        id: `nova-ask-${q}`,
        title: `Ask Nova about “${q}”`,
        subtitle: "CSI Nova · AI Assistant",
        description: "Get answers on events, resources, and how to get involved",
        kind: "nova",
        group: "CSI Nova",
        score: novaScore,
        action: () => actions.askNova(`Tell me about ${q} at CSI VIT Chennai`),
      });

      if (topics.includes("ai")) {
        results.push({
          id: "nova-topic-ai",
          title: "AI/ML events & resources",
          subtitle: "CSI Nova · Suggested",
          description: "Workshops, roadmaps, and projects in AI/ML",
          kind: "nova",
          group: "CSI Nova",
          score: 74,
          action: () => actions.askNova("What AI and ML events and resources does CSI offer?"),
        });
      }
      if (topics.includes("web")) {
        results.push({
          id: "nova-topic-web",
          title: "Web development at CSI",
          subtitle: "CSI Nova · Suggested",
          description: "Full-stack workshops, resources, and member projects",
          kind: "nova",
          group: "CSI Nova",
          score: 74,
          action: () => actions.askNova("What web development resources and projects does CSI have?"),
        });
      }
      if (topics.includes("security")) {
        results.push({
          id: "nova-topic-security",
          title: "Cybersecurity & CTF",
          subtitle: "CSI Nova · Suggested",
          kind: "nova",
          group: "CSI Nova",
          score: 72,
          action: () => actions.askNova("What cybersecurity events and resources does CSI offer?"),
        });
      }
    }

    results.sort((a, b) => b.score - a.score);

    const seen = new Set<string>();
    const deduped = results.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    const groupOrder = [
      "Recent",
      "Frequently Used",
      "Suggested",
      "Actions",
      "Apps",
      "Events",
      "Resources",
      "Projects",
      "Team",
      "Domains",
      "Gallery",
      "Announcements",
      "CSI Nova",
    ];

    const groupMap = new Map<string, SpotlightResult[]>();
    for (const r of deduped) {
      if (!groupMap.has(r.group)) groupMap.set(r.group, []);
      groupMap.get(r.group)!.push(r);
    }

    const groups: SpotlightGroup[] = groupOrder
      .filter((label) => groupMap.has(label))
      .map((label) => ({ label, results: groupMap.get(label)! }));

    for (const [label, items] of groupMap) {
      if (!groupOrder.includes(label)) groups.push({ label, results: items });
    }

    const flatResults = deduped.slice(0, MAX_RESULTS);

    return { groups, flatResults };
  }, [
    query,
    events,
    announcements,
    launchpadItems,
    visitedApps,
    recentSearches,
    isAuthenticated,
    role,
    actions,
  ]);
}
