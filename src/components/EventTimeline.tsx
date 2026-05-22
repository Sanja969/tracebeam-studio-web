import type { Event } from "../types/event";
import { EventFilters } from "./EventFIlters";
import { SearchBar } from "./SearchBar";
import { TraceList } from "./TraceList";
import { useState } from "react";
import { TraceSummaries } from "./TraceSummaries";
import { ViewMode } from "./ViewMode";
import { StatsCards } from "./StatsCards";
import { SessionList } from "./SessionList";
import { EventList } from "./EventList";

type ProsType = {
  events: Event[];
  onSelectEvent: (event) => void;
};

type ViewMode = "events" | "traces" | "sessions";

export const EventTimeline = ({ events, onSelectEvent }: ProsType) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("events");

  const filteredEvents = events.filter((event) => {
    const matchedType = activeFilter === "all" || event.type === activeFilter;
    const matchedSearch = JSON.stringify(event)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchedType && matchedSearch;
  });

  const groupedTraces = filteredEvents.reduce<Record<string, Event[]>>(
    (groups, event) => {
      const traceKey = event.traceId || "ungrouped";

      if (!groups[traceKey]) {
        groups[traceKey] = [];
      }

      groups[traceKey].push(event);

      return groups;
    },
    {},
  );

  const groupedSessions = filteredEvents.reduce<Record<string, Event[]>>(
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
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <StatsCards events={events} />

      <EventFilters activeFilter={activeFilter} onChange={setActiveFilter} />
      <TraceSummaries groupedTraces={groupedTraces} />
      <ViewMode
        viewMode={viewMode}
        onChange={(viewMode: ViewMode) => setViewMode(viewMode)}
      />
      <div className="space-y-4">
        {filteredEvents.length === 0 && (
          <div className="border border-zinc-800 rounded-2xl p-6 text-zinc-500">
            Waiting for events...
          </div>
        )}

        {viewMode === "events" ? (
          <EventList events={filteredEvents} onSelectEvent={onSelectEvent} />
        ) : viewMode === "traces" ? (
          <TraceList groupedTraces={groupedTraces} onSelectEvent={onSelectEvent} />
        ) : (
          <SessionList groupedSessions={groupedSessions} onSelectEvent={onSelectEvent}/>
        )}
      </div>
    </>
  );
};
