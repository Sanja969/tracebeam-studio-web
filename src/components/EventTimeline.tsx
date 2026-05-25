import type { Event, ViewModeType } from "../types/event";
import { TraceList } from "./TraceList";
import { useState } from "react";
import { ViewMode } from "./ViewMode";
import { SessionList } from "./SessionList";
import { EventList } from "./EventList";

type Props = {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  groupedTraces: Record<string, Event[]>;
};

export const EventTimeline = ({
  events,
  groupedTraces,
  onSelectEvent,
}: Props) => {
  const [viewMode, setViewMode] = useState<ViewModeType>("events");

  const groupedSessions = events.reduce<Record<string, Event[]>>(
    (groups, event) => {
      const sessionKey = event.sessionId || "unknown-session";

      if (!groups[sessionKey]) {
        groups[sessionKey] = [];
      }

      groups[sessionKey].push(event);

      return groups;
    },
    {},
  );

  return (
    <>
      <ViewMode
        viewMode={viewMode}
        onChange={(viewMode: ViewModeType) => setViewMode(viewMode)}
      />
      <div className="space-y-4">
        {events.length === 0 && (
          <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900 mb-8">
            <p className="text-zinc-500 text-sm">
              No events match the current filters.
            </p>
          </div>
        )}

        {viewMode === "events" ? (
          <EventList events={events} onSelectEvent={onSelectEvent} />
        ) : viewMode === "traces" ? (
          <TraceList
            groupedTraces={groupedTraces}
            onSelectEvent={onSelectEvent}
          />
        ) : (
          <SessionList
            groupedSessions={groupedSessions}
            onSelectEvent={onSelectEvent}
          />
        )}
      </div>
    </>
  );
};
