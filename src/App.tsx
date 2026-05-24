import { ThroughputChart } from "./components/ThroughputChart";
import { LatencyChart } from "./components/LatencyChart";
import { Header } from "./components/Header";
import { EventTimeline } from "./components/EventTimeline";
import { useEvents } from "./hooks/useEvents";
import { useState } from "react";
import { EventDetailDrawer } from "./components/EventDetailDrawer";
import type { Event } from "./types/event";
import { ErrorClusters } from "./components/ErrorClusters";
import { HealthSummary } from "./components/HealthSummary";
import { NetworkRequests } from "./components/NetworkRequests";
import { TraceWaterfall } from "./components/TraceWaterfall";
import { EventFilters } from "./components/EventFIlters";
import { SearchBar } from "./components/SearchBar";
import { StatsCards } from "./components/StatsCards";
import { LimitSelector } from "./components/LimitSelector";
import { TraceSummaries } from "./components/TraceSummaries";

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [limit, setLimit] = useState(100);
  const { events, connected, clearEvents } = useEvents({
    limit,
    type: activeFilter,
  });

  const searchedEvents = events.filter((event) => {
    return JSON.stringify(event)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const groupedTraces = events.reduce<Record<string, Event[]>>(
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10 max-w-5xl mx-auto">
      <Header connected={connected} onClear={clearEvents} />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <StatsCards events={events} />

      <HealthSummary events={events} />

      <div className="flex items-center justify-between gap-4 mb-6">
        <EventFilters activeFilter={activeFilter} onChange={setActiveFilter} />
        <LimitSelector value={limit} onChange={setLimit} />
      </div>

      <NetworkRequests
        events={searchedEvents}
        onSelectEvent={setSelectedEvent}
      />

      <ErrorClusters events={searchedEvents} onSelectEvent={setSelectedEvent} />

      <TraceWaterfall
        events={searchedEvents}
        onSelectEvent={setSelectedEvent}
      />

      <TraceSummaries groupedTraces={groupedTraces} />

      <div className="grid gap-6 lg:grid-cols-2">
        <LatencyChart events={searchedEvents} />

        <ThroughputChart events={searchedEvents} />
      </div>

      <EventTimeline
        events={searchedEvents}
        groupedTraces={groupedTraces}
        onSelectEvent={setSelectedEvent}
      />

      <EventDetailDrawer
        event={selectedEvent}
        events={events}
        onClose={() => setSelectedEvent(null)}
      />
    </main>
  );
}

export default App;
