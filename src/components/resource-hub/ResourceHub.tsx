"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bookmark,
  Sparkles,
  Brain,
  Globe,
  Smartphone,
  Shield,
  Code,
  Palette,
  GitBranch,
  MessageSquare,
  FileText,
  Briefcase,
  Wrench,
  Star,
  ChevronDown,
  ChevronRight,
  Check,
  ExternalLink,
  Bot,
  type LucideIcon,
} from "lucide-react";
import {
  RESOURCE_CATEGORIES,
  RESOURCES,
  DIFFICULTIES,
  RESOURCE_TYPES,
  getRoadmapForCategory,
  getFeaturedResources,
  type Resource,
  type ResourceCategoryId,
  type Difficulty,
  type ResourceType,
  type Roadmap,
} from "@/data/resourceHubData";
import { useResourceBookmarks } from "@/hooks/useResourceBookmarks";
import { useRoadmapProgress } from "@/hooks/useRoadmapProgress";
import { useInteraction } from "@/context/InteractionContext";
import "./ResourceHub.css";

type ViewId = ResourceCategoryId | "saved" | "featured";
type ContentTab = "resources" | "roadmap";

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  bookmark: Bookmark,
  brain: Brain,
  globe: Globe,
  smartphone: Smartphone,
  shield: Shield,
  code: Code,
  palette: Palette,
  "git-branch": GitBranch,
  "message-square": MessageSquare,
  "file-text": FileText,
  briefcase: Briefcase,
  wrench: Wrench,
  star: Star,
};

function difficultyClass(d: Difficulty) {
  if (d === "Beginner") return "rh-badge--beginner";
  if (d === "Advanced") return "rh-badge--advanced";
  return "rh-badge--intermediate";
}

function ResourceCard({
  resource,
  isBookmarked,
  onBookmark,
  onSelect,
}: {
  resource: Resource;
  isBookmarked: boolean;
  onBookmark: (e: React.MouseEvent) => void;
  onSelect: () => void;
}) {
  return (
    <motion.div
      className="rh-card"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <div className="rh-card-top">
        <span className="rh-card-type">{resource.type}</span>
        <button
          type="button"
          className={`rh-bookmark-btn${isBookmarked ? " rh-bookmark-btn--saved" : ""}`}
          onClick={onBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      <h3 className="rh-card-title">{resource.title}</h3>
      <p className="rh-card-desc">{resource.description}</p>
      <div className="rh-card-meta">
        <span className={`rh-badge ${difficultyClass(resource.difficulty)}`}>{resource.difficulty}</span>
        <span className="rh-badge">{resource.estimatedTime}</span>
        {resource.csiRecommended && <span className="rh-badge rh-badge--featured">CSI Pick</span>}
        {resource.trending && <span className="rh-badge">Trending</span>}
      </div>
    </motion.div>
  );
}

function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const { toggleStep, isStepComplete, getProgressPercent } = useRoadmapProgress();
  const { recordRoadmapProgress } = useInteraction();
  const [expanded, setExpanded] = useState<string | null>(roadmap.steps[0]?.id ?? null);
  const progress = getProgressPercent(roadmap.id, roadmap.steps.length);

  const handleToggleStep = (stepId: string) => {
    const wasDone = isStepComplete(roadmap.id, stepId);
    toggleStep(roadmap.id, stepId);
    if (!wasDone) recordRoadmapProgress();
  };

  return (
    <div>
      <div className="rh-roadmap-header">
        <h2 className="rh-roadmap-title">{roadmap.title}</h2>
        <p className="rh-roadmap-desc">{roadmap.description}</p>
        <div className="rh-progress-bar">
          <motion.div
            className="rh-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
        <p className="rh-progress-label">{progress}% complete · {roadmap.steps.length} milestones</p>
      </div>
      <div className="rh-roadmap-steps rh-roadmap-steps--tree">
        <motion.div
          className="rh-skill-tree-line"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
        {roadmap.steps.map((step, i) => {
          const done = isStepComplete(roadmap.id, step.id);
          const isOpen = expanded === step.id;
          return (
            <motion.div
              key={step.id}
              className={`rh-roadmap-step${done ? " rh-roadmap-step--complete" : ""}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <div className="rh-roadmap-step-header">
                <button
                  type="button"
                  className={`rh-step-check${done ? " rh-step-check--done" : ""}`}
                  onClick={() => handleToggleStep(step.id)}
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done && <Check size={13} />}
                </button>
                <button
                  type="button"
                  className="rh-step-info"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}
                  onClick={() => setExpanded(isOpen ? null : step.id)}
                >
                  <p className="rh-step-title">
                    {i + 1}. {step.title}
                  </p>
                  <p className="rh-step-desc">{step.description}</p>
                </button>
                {isOpen ? <ChevronDown size={16} color="rgba(240,235,225,0.4)" /> : <ChevronRight size={16} color="rgba(240,235,225,0.4)" />}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="rh-step-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {step.substeps.map((sub, si) => (
                      <motion.div
                        key={sub.title}
                        className="rh-substep"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: si * 0.05 }}
                      >
                        <p className="rh-substep-title">{sub.title}</p>
                        <p className="rh-substep-desc">{sub.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FeaturedSections({
  resources,
  isBookmarked,
  onBookmark,
  onSelect,
}: {
  resources: Resource[];
  isBookmarked: (id: string) => boolean;
  onBookmark: (id: string, e: React.MouseEvent) => void;
  onSelect: (r: Resource) => void;
}) {
  const sections = [
    { title: "Recommended by CSI", filter: (r: Resource) => r.csiRecommended },
    { title: "Trending Now", filter: (r: Resource) => r.trending },
    { title: "Beginner Friendly", filter: (r: Resource) => r.beginnerFriendly },
    { title: "Most Popular", filter: (r: Resource) => r.popular },
  ];

  return (
    <>
      {sections.map(({ title, filter }) => {
        const items = resources.filter(filter).slice(0, 4);
        if (!items.length) return null;
        return (
          <div key={title} className="rh-featured-block">
            <h3 className="rh-section-title">{title}</h3>
            <div className="rh-featured-grid">
              {items.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  isBookmarked={isBookmarked(r.id)}
                  onBookmark={(e) => onBookmark(r.id, e)}
                  onSelect={() => onSelect(r)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function ResourceHub() {
  const [activeView, setActiveView] = useState<ViewId>("featured");
  const [contentTab, setContentTab] = useState<ContentTab>("resources");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "">("");
  const [selected, setSelected] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const { bookmarks, toggleBookmark, isBookmarked, ready } = useResourceBookmarks();
  const { recordBookmark } = useInteraction();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const handleBookmark = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const wasSaved = isBookmarked(id);
      toggleBookmark(id);
      if (!wasSaved) recordBookmark();
      showToast(wasSaved ? "Removed from saved resources" : "Saved to your collection");
    },
    [isBookmarked, toggleBookmark, showToast, recordBookmark]
  );

  const filteredResources = useMemo(() => {
    let list = RESOURCES;

    if (activeView === "saved") {
      list = list.filter((r) => bookmarks.includes(r.id));
    } else if (activeView === "featured") {
      list = getFeaturedResources();
    } else if (activeView) {
      list = list.filter((r) => r.category === activeView);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.category.replace(/-/g, " ").includes(q)
      );
    }

    if (difficultyFilter) list = list.filter((r) => r.difficulty === difficultyFilter);
    if (typeFilter) list = list.filter((r) => r.type === typeFilter);

    return list;
  }, [activeView, bookmarks, search, difficultyFilter, typeFilter]);

  const roadmap =
    activeView !== "saved" && activeView !== "featured"
      ? getRoadmapForCategory(activeView as ResourceCategoryId)
      : undefined;

  const handleViewChange = (id: ViewId) => {
    setActiveView(id);
    setContentTab("resources");
    setSearch("");
    setDifficultyFilter("");
    setTypeFilter("");
  };

  return (
    <div className="rh-root">
      <div className="rh-topbar">
        <div className="rh-topbar-header">
          <div>
            <h1 className="rh-title">Resource Hub</h1>
            <p className="rh-subtitle">Curated learning paths, guides & workshop materials</p>
          </div>
          <div className="rh-nova-hint">
            <Bot size={14} />
            Ask CSI Nova for learning recommendations
          </div>
        </div>
        <div className="rh-search-row">
          <div className="rh-search-wrap">
            <Search size={16} className="rh-search-icon" />
            <input
              type="search"
              className="rh-search-input"
              placeholder="Search resources, roadmaps, topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rh-filter-select"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | "")}
            aria-label="Filter by difficulty"
          >
            <option value="">All levels</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className="rh-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ResourceType | "")}
            aria-label="Filter by type"
          >
            <option value="">All types</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rh-body">
        <nav className="rh-sidebar" aria-label="Resource categories">
          {RESOURCE_CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] ?? Star;
            const isActive = activeView === cat.id;
            return (
              <div key={cat.id}>
                {i === 2 && <div className="rh-sidebar-divider" />}
                <button
                  type="button"
                  className={`rh-sidebar-item${isActive ? " rh-sidebar-item--active" : ""}`}
                  onClick={() => handleViewChange(cat.id as ViewId)}
                >
                  <Icon size={16} />
                  {cat.label}
                  {cat.id === "saved" && bookmarks.length > 0 && (
                    <span style={{ marginLeft: "auto", fontSize: "0.7rem", opacity: 0.5 }}>{bookmarks.length}</span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        <main className="rh-main">
          {roadmap && activeView !== "featured" && activeView !== "saved" && (
            <div className="rh-tabs">
              <button
                type="button"
                className={`rh-tab${contentTab === "resources" ? " rh-tab--active" : ""}`}
                onClick={() => setContentTab("resources")}
              >
                Resources
              </button>
              <button
                type="button"
                className={`rh-tab${contentTab === "roadmap" ? " rh-tab--active" : ""}`}
                onClick={() => setContentTab("roadmap")}
              >
                Roadmap
              </button>
            </div>
          )}

          {loading || !ready ? (
            <div className="rh-cards-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rh-skeleton" />
              ))}
            </div>
          ) : contentTab === "roadmap" && roadmap ? (
            <RoadmapView roadmap={roadmap} />
          ) : activeView === "featured" && !search && !difficultyFilter && !typeFilter ? (
            <FeaturedSections
              resources={RESOURCES}
              isBookmarked={isBookmarked}
              onBookmark={handleBookmark}
              onSelect={setSelected}
            />
          ) : (
            <>
              <p className="rh-results-count">
                {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
              </p>
              {filteredResources.length === 0 ? (
                <div className="rh-empty">
                  {activeView === "saved"
                    ? "No saved resources yet. Bookmark any card to build your collection."
                    : "No resources match your search. Try different filters."}
                </div>
              ) : (
                <div className="rh-cards-grid">
                  <AnimatePresence mode="popLayout">
                    {filteredResources.map((r) => (
                      <ResourceCard
                        key={r.id}
                        resource={r}
                        isBookmarked={isBookmarked(r.id)}
                        onBookmark={(e) => handleBookmark(r.id, e)}
                        onSelect={() => setSelected(r)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="rh-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="rh-preview-panel"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="rh-card-type">{selected.type}</span>
              <h2 className="rh-roadmap-title" style={{ marginTop: 12 }}>
                {selected.title}
              </h2>
              <p className="rh-roadmap-desc">{selected.description}</p>
              <div className="rh-card-meta" style={{ marginTop: 12 }}>
                <span className={`rh-badge ${difficultyClass(selected.difficulty)}`}>{selected.difficulty}</span>
                <span className="rh-badge">{selected.estimatedTime}</span>
              </div>
              <div className="rh-preview-actions">
                <button
                  type="button"
                  className="rh-btn rh-btn--primary"
                  onClick={() => {
                    handleBookmark(selected.id, { stopPropagation: () => {} } as React.MouseEvent);
                  }}
                >
                  <Bookmark size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  {isBookmarked(selected.id) ? "Saved" : "Save Resource"}
                </button>
                {selected.url && (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rh-btn rh-btn--ghost"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                  >
                    Open <ExternalLink size={14} />
                  </a>
                )}
                {selected.type === "Roadmap" && (
                  <button
                    type="button"
                    className="rh-btn rh-btn--ghost"
                    onClick={() => {
                      setActiveView(selected.category);
                      setContentTab("roadmap");
                      setSelected(null);
                    }}
                  >
                    View Roadmap
                  </button>
                )}
                <button type="button" className="rh-btn rh-btn--ghost" onClick={() => setSelected(null)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="rh-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
