import type { Event } from "../types/event";
import { TraceList } from "./TraceList";
import { useState } from "react";
import { ViewMode } from "./ViewMode";
import { SessionList } from "./SessionList";
import { EventList } from "./EventList";

type ProsType = {
  events: Event[];
  onSelectEvent: (event) => void;
  groupedTraces: Record<string, Event[]>
};

type ViewMode = "events" | "traces" | "sessions";

export const EventTimeline = ({ events, groupedTraces, onSelectEvent }: ProsType) => {
  const [viewMode, setViewMode] = useState<ViewMode>("events");

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
        onChange={(viewMode: ViewMode) => setViewMode(viewMode)}
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
