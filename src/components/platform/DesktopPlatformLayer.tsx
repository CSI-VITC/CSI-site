"use client";

import { useAdminEvents } from "@/hooks/useAdminEvents";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useFeaturedEvent } from "@/hooks/useFeaturedEvent";
import { TECH_DOMAINS_SHORT } from "@/data/platformContent";
import type { WindowId } from "@/components/nova/types";
import { PlatformStatsBar } from "./PlatformStatsBar";
import { FeaturedEventCard } from "./FeaturedEventCard";
import { AnnouncementsPanel } from "./AnnouncementsPanel";
import { ProjectSpotlight } from "./ProjectSpotlight";
import "./Platform.css";

interface DesktopPlatformLayerProps {
  visible: boolean;
  onNavigate: (id: WindowId) => void;
}

export function DesktopPlatformLayer({ visible, onNavigate }: DesktopPlatformLayerProps) {
  const { events, ready: eventsReady } = useAdminEvents();
  const { announcements, ready: annReady } = useAnnouncements();
  const featured = useFeaturedEvent(events, eventsReady);

  return (
    <div className={`csi-platform${visible ? "" : " csi-platform--dimmed"}`} aria-hidden={!visible}>
      <header className="csi-platform-intro">
        <h2>CSI · VIT Chennai</h2>
        <p>Student chapter for builders — hackathons, workshops, and real-world projects.</p>
      </header>

      <div className="csi-platform-event-slot">
        <FeaturedEventCard event={featured} loading={!eventsReady} onOpenEvents={onNavigate} variant="featured" />
      </div>

      <div className="csi-platform-meta">
        <p className="csi-platform-domains-line">{TECH_DOMAINS_SHORT.join(" · ")}</p>
        <PlatformStatsBar />
      </div>

      <div className="csi-platform-bottom">
        <AnnouncementsPanel items={announcements} loading={!annReady} limit={2} variant="quiet" />
        <ProjectSpotlight onNavigate={onNavigate} variant="quiet" />
      </div>
    </div>
  );
}
