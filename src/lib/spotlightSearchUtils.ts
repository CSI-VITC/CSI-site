/** Spotlight query normalization and fuzzy scoring */

const COMMAND_PREFIXES = /^(?:open|go to|goto|show|launch|find|search for|search)\s+/i;

export function normalizeSpotlightQuery(raw: string): string {
  return raw.trim().replace(COMMAND_PREFIXES, "").trim();
}

export function scoreText(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = normalizeSpotlightQuery(query).toLowerCase();
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 88;
  if (t.includes(q)) return 62;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  let score = 0;
  for (const token of tokens) {
    if (t.includes(token)) {
      score += 32;
      continue;
    }
    // Acronym: "fs" matches "Full-Stack"
    const words = t.split(/[\s·\-/]+/).filter(Boolean);
    const acronym = words.map((w) => w[0]).join("");
    if (acronym.includes(token) || token.split("").every((c, i) => words[i]?.startsWith(c))) {
      score += 24;
    }
  }

  return score;
}

export const SPOTLIGHT_SUGGESTIONS = [
  { label: "Events", query: "events" },
  { label: "Resources", query: "resources" },
  { label: "AI / ML", query: "ai" },
  { label: "Team", query: "team" },
  { label: "Ask Nova", query: "nova" },
] as const;
