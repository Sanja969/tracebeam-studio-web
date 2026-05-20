import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Event = {
  id: string;
  traceId: string;
  name: string;
  timestamp: number;
  type: string;
  duration?: number;
  metadata?: Record<string, unknown>;
};

const getThroughputData = (events: Event[]) => {
  const buckets = new Map<string, number>();

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    const key = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    buckets.set(key, (buckets.get(key) || 0) + 1);
  });

  return Array.from(buckets.entries()).map(([time, count]) => ({
    time,
    count,
  }));
};

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [connected, setConnected] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"events" | "traces">("events");

  const filters = ["all", "track", "measure", "error"];

  const stats = {
    total: events.length,
    track: events.filter((e) => e.type === "track").length,
    measure: events.filter((e) => e.type === "measure").length,
    error: events.filter((e) => e.type === "error").length,
  };

  useEffect(() => {
    let reconnectTimeout: number = null;
    let socket: WebSocket | null = null;

    const loadEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/events");

        const data = await response.json();

        setEvents(data.reverse());
      } catch (err) {
        console.log("Failed to load existing events", err);
      }
    };

    const connect = () => {
      socket = new WebSocket("ws://localhost:8080/ws");
      socket.onopen = () => {
        setConnected(true);
        console.log("ws connected....");
      };

      socket.onclose = () => {
        setConnected(false);

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 1500);
        console.log("ws disconnected....");
      };

      socket.onerror = () => {
        setConnected(false);
        socket.close();
        console.log("ws disconnected due error....");
      };

      socket.onmessage = (message) => {
        const event = JSON.parse(message.data);

        setEvents((prev) => {
          if (prev.some((existingEvent) => existingEvent.id === event.id)) {
            return prev;
          }
          return [event, ...prev];
        });
      };
    };

    loadEvents();
    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      socket.close();
    };
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchedType = activeFilter === "all" || event.type === activeFilter;
    const matchedSearch = JSON.stringify(event)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchedType && matchedSearch;
  });

  const clearEvents = async () => {
    await fetch("http://localhost:8080/events", {
      method: "DELETE",
    });

    setEvents([]);
  };

  const durationEvents = events
    .filter(
      (event) => event.type === "measure" && typeof event.duration === "number",
    )
    .slice(0, 20)
    .reverse()
    .map((event) => ({
      name: event.name,
      duration: Number(event.duration?.toFixed(2)),
      time: new Date(event.timestamp).toLocaleTimeString(),
    }));

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

  const throughputData = getThroughputData(events);


  const traceSummaries = Object.entries(groupedTraces).map(
  ([traceId, traceEvents]) => {
    const sortedEvents = [...traceEvents].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    const start = sortedEvents[0]?.timestamp ?? 0;
    const end = sortedEvents[sortedEvents.length - 1]?.timestamp ?? start;

    return {
      traceId,
      count: traceEvents.length,
      duration: end - start,
      start,
      end,
    };
  }
);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs mb-3">
              Realtime observability
            </p>

            <h1 className="text-5xl font-bold">Tracebeam Studio ⚡</h1>
          </div>

          <div
            className={`px-4 py-2 rounded-full text-sm border ${
              connected
                ? "border-green-500 text-green-400"
                : "border-red-500 text-red-400"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </div>
          <button
            onClick={clearEvents}
            className="px-4 py-2 rounded-full text-sm border border-zinc-700 text-zinc-300 hover:border-red-400 hover:text-red-300 transition"
          >
            Clear events
          </button>
        </div>

        <div className="mb-4">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search events, metadata, errors..."
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-400"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900">
            <p className="text-zinc-500 text-sm mb-2">Total Events</p>
            <h2 className="text-3xl font-bold">{stats.total}</h2>
          </div>

          <div className="border border-blue-500/20 rounded-2xl p-5 bg-blue-500/5">
            <p className="text-blue-300 text-sm mb-2">Track</p>
            <h2 className="text-3xl font-bold text-blue-400">{stats.track}</h2>
          </div>

          <div className="border border-cyan-500/20 rounded-2xl p-5 bg-cyan-500/5">
            <p className="text-cyan-300 text-sm mb-2">Measure</p>
            <h2 className="text-3xl font-bold text-cyan-400">
              {stats.measure}
            </h2>
          </div>

          <div className="border border-red-500/20 rounded-2xl p-5 bg-red-500/5">
            <p className="text-red-300 text-sm mb-2">Errors</p>
            <h2 className="text-3xl font-bold text-red-400">{stats.error}</h2>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                activeFilter === filter
                  ? "border-cyan-400 text-cyan-300 bg-cyan-400/10"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-zinc-500 text-sm">Traces</p>
      <h2 className="text-xl font-semibold">Trace summaries</h2>
    </div>

    <p className="text-zinc-500 text-sm">
      {traceSummaries.length} traces
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    {traceSummaries.map((trace) => (
      <div
        key={trace.traceId}
        className="border border-zinc-800 rounded-xl p-4 bg-black/30"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-purple-300">
            {trace.traceId}
          </p>

          <p className="text-sm text-zinc-500">
            {trace.count} events
          </p>
        </div>

        <p className="text-sm text-zinc-400">
          Flow duration:{" "}
          <span className="text-cyan-400">
            {trace.duration}ms
          </span>
        </p>
      </div>
    ))}
  </div>
</div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("events")}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              viewMode === "events"
                ? "border-purple-400 text-purple-300 bg-purple-400/10"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            Events
          </button>

          <button
            onClick={() => setViewMode("traces")}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              viewMode === "traces"
                ? "border-purple-400 text-purple-300 bg-purple-400/10"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            Traces
          </button>
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 && (
            <div className="border border-zinc-800 rounded-2xl p-6 text-zinc-500">
              Waiting for events...
            </div>
          )}

          {viewMode === "events" ? (
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <div className="relative pl-10">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-zinc-800" />
                  <div
                    className={`absolute left-[9px] top-8 w-3 h-3 rounded-full border-2 ${
                      event.type === "error"
                        ? "bg-red-500 border-red-300"
                        : event.type === "measure"
                          ? "bg-cyan-500 border-cyan-300"
                          : "bg-blue-500 border-blue-300"
                    }`}
                  />
                  <motion.div
                    key={`${event.id}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-xl font-semibold">{event.name}</h2>

                        {event.traceId && (
                          <p className="text-xs text-purple-300 mt-1">
                            trace: {event.traceId}
                          </p>
                        )}

                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getEventColor(
                            event.type,
                          )}`}
                        >
                          {event.type}
                        </div>
                      </div>

                      <div className="text-zinc-400 text-sm">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    {event.duration && (
                      <div className="text-cyan-400 text-sm mb-2">
                        Duration: {event.duration}ms
                      </div>
                    )}

                    {event.metadata && (
                      <pre className="bg-black/40 rounded-xl p-4 text-xs overflow-auto text-zinc-300">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedTraces).map(([traceId, traceEvents]) => (
                <div
                  key={traceId}
                  className="border border-zinc-800 rounded-2xl bg-zinc-900 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-purple-400">
                        Trace
                      </p>

                      <h2 className="text-xl font-semibold">{traceId}</h2>
                    </div>

                    <p className="text-sm text-zinc-500">
                      {traceEvents.length} events
                    </p>
                  </div>

                  <div className="space-y-3">
                    {traceEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 p-4"
                      >
                        <div>
                          <p className="font-medium">{event.name}</p>

                          <p className="text-xs text-zinc-500">{event.type}</p>
                        </div>

                        <div className="text-right text-sm text-zinc-400">
                          <p>
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>

                          {event.duration && (
                            <p className="text-cyan-400">{event.duration}ms</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-zinc-500 text-sm">Latency</p>
              <h2 className="text-xl font-semibold">Measured operations</h2>
            </div>

            <p className="text-zinc-500 text-sm">
              Last {durationEvents.length} measure events
            </p>
          </div>

          {durationEvents.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={durationEvents}>
                  <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-zinc-500">
              Waiting for measured operations...
            </div>
          )}
        </div>
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-zinc-500 text-sm">Throughput</p>
      <h2 className="text-xl font-semibold">Events over time</h2>
    </div>

    <p className="text-zinc-500 text-sm">
      {events.length} total events
    </p>
  </div>

  {throughputData.length > 0 ? (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={throughputData}>
          <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div className="h-40 flex items-center justify-center text-zinc-500">
      Waiting for events...
    </div>
  )}
</div>
    </main>
  );
}

const getEventColor = (type: string) => {
  switch (type) {
    case "track":
      return "text-blue-400 border-blue-500/30 bg-blue-500/10";

    case "measure":
      return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";

    case "error":
      return "text-red-400 border-red-500/30 bg-red-500/10";

    default:
      return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10";
  }
};

export default App;
