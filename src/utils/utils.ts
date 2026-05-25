import { API_URL } from "../constants/constants";
import type { Event, EventQuery } from "../types/event";

export const getEventColor = (type: string) => {
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

export const getThroughputData = (events: Event[]) => {

  const buckets = new Map<number, number>();

  events.forEach((event) => {

    const bucket = Math.floor(event.timestamp / 1000) * 1000;

    buckets.set(bucket, (buckets.get(bucket) || 0) + 1);

  });

  return Array.from(buckets.entries())

    .sort(([a], [b]) => a - b)

    .map(([timestamp, count]) => ({

      id: String(timestamp),

      time: new Date(timestamp).toLocaleTimeString(),

      count,

    }));

};

export const getSeverityColor = (severity?: unknown) => {
  switch (severity) {
    case "critical":
      return "text-red-300 border-red-500/40 bg-red-500/10";

    case "warning":
      return "text-yellow-300 border-yellow-500/40 bg-yellow-500/10";

    case "info":
      return "text-blue-300 border-blue-500/40 bg-blue-500/10";

    default:
      return "text-zinc-300 border-zinc-700 bg-zinc-800/60";
  }
};

export const cards = [
  {
    label: "Total Events",
    getValue: (events: Event[]) => events.length,
    className: "border-zinc-800 bg-zinc-900 text-white",
    labelClassName: "text-zinc-500",
  },
  {
    label: "Track",
    getValue: (events: Event[]) => events.filter((e) => e.type === "track").length,
    className: "border-blue-500/20 bg-blue-500/5 text-blue-400",
    labelClassName: "text-blue-300",
  },
  {
    label: "Measure",
    getValue: (events: Event[]) => events.filter((e) => e.type === "measure").length,
    className: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400",
    labelClassName: "text-cyan-300",
  },
  {
    label: "Errors",
    getValue: (events: Event[]) => events.filter((e) => e.type === "error").length,
    className: "border-red-500/20 bg-red-500/5 text-red-400",
    labelClassName: "text-red-300",
  },
];

export const getEventStats = (events: Event[]) => {
  const error = events.filter((event) => event.type === "error").length;

  return {
    total: events.length,
    track: events.filter((event) => event.type === "track").length,
    measure: events.filter((event) => event.type === "measure").length,
    error,
    errorRate:
      events.length === 0 ? 0 : Math.round((error / events.length) * 100),
  };
};

export const buildEventsUrl = (query: EventQuery) => {
  const params = new URLSearchParams();

  params.set("limit", String(query.limit ?? 100));

  if (query.type && query.type !== "all") {
    params.set("type", query.type);
  }

  if (query.traceId) {
    params.set("traceId", query.traceId);
  }

  if (query.sessionId) {
    params.set("sessionId", query.sessionId);
  }

  console.log(`url *********: ${API_URL}/events?${params.toString()}`)
  return `${API_URL}/events?${params.toString()}`;
};

export const matchesQuery = (event: Event, query: EventQuery) => {
  if (query.type && query.type !== "all" && event.type !== query.type) {
    return false;
  }

  if (query.traceId && event.traceId !== query.traceId) {
    return false;
  }

  if (query.sessionId && event.sessionId !== query.sessionId) {
    return false;
  }

  return true;
};

export const safeKey = (...parts: unknown[]) => {
  return parts
    .map((part) => String(part || "unknown"))
    .join("-");
};

export const getMethodColor = (method: string) => {
  switch (method) {
    case "POST":
      return "border-emerald-500/30 text-emerald-300";

    case "DELETE":
      return "border-red-500/30 text-red-300";

    case "PUT":
      return "border-yellow-500/30 text-yellow-300";

    default:
      return "border-cyan-500/30 text-cyan-300";
  }
};

export const getStatusColor = (status: number | undefined) => {
  if (typeof status !== "number") {
    return "border-zinc-700 text-zinc-300";
  }

  if (status >= 500) {
    return "border-red-500/30 text-red-300";
  }

  if (status >= 400) {
    return "border-orange-500/30 text-orange-300";
  }

  if (status >= 300) {
    return "border-yellow-500/30 text-yellow-300";
  }

  return "border-emerald-500/30 text-emerald-300";
};