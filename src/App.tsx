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

function App() {
  const { events, connected, clearEvents } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10 max-w-5xl mx-auto">
      <Header connected={connected} onClear={clearEvents} />
      <EventTimeline events={events} onSelectEvent={setSelectedEvent} />
      <LatencyChart events={events} />
      <ThroughputChart events={events} />
      <EventDetailDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
      <ErrorClusters events={events} onSelectEvent={setSelectedEvent} />
      <HealthSummary events={events} />
      <NetworkRequests events={events} onSelectEvent={setSelectedEvent} />
      <TraceWaterfall events={events} onSelectEvent={setSelectedEvent} />
    </main>
  );
}

export default App;
