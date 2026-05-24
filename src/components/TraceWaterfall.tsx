import type { Event } from "../types/event";
import { safeKey } from "../utils/utils";

type Props = {
  events: Event[];
  onSelectEvent: (event: Event) => void;
};

const getTraceGroups = (events: Event[]) => {
  return events.reduce<Record<string, Event[]>>((groups, event) => {
    const traceKey = event.traceId || "ungrouped";

    if (!groups[traceKey]) {
      groups[traceKey] = [];
    }

    groups[traceKey].push(event);

    return groups;
  }, {});
};

export const TraceWaterfall = ({ events, onSelectEvent }: Props) => {
  const traces = Object.fromEntries(
    Object.entries(getTraceGroups(events))
      .map(([traceId, traceEvents]) => [
        traceId,
        traceEvents.filter((event) => typeof event.duration === "number"),
      ])
      .filter(([, traceEvents]) => traceEvents.length > 0),
  );

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-zinc-500 text-sm">Performance</p>
          <h2 className="text-xl font-semibold">Trace waterfall</h2>
        </div>
        {Object.keys(traces).length === 0 && (
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-zinc-500">
            No measured trace data yet.
          </div>
        )}

        <p className="text-zinc-500 text-sm">
          {Object.keys(traces).length} traces
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(traces).map(([traceId, traceEvents]: [string, Event[]], i) => {
          const sortedEvents = [...traceEvents].sort(
            (a, b) => a.timestamp - b.timestamp,
          );

          const maxDuration = Math.max(
            ...sortedEvents.map((event) => event.duration || 0),
            1,
          );

          return (
            <div
              key={safeKey("trace-w", traceId, i)}
              className="rounded-xl border border-zinc-800 bg-black/30 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-purple-300">{traceId}</p>

                <p className="text-xs text-zinc-500">
                  {sortedEvents.length} events
                </p>
              </div>

              <div className="space-y-3">
                {sortedEvents.map((event, i) => {
                  const duration = event.duration || 0;
                  const width = Math.max(
                    6,
                    Math.round((duration / maxDuration) * 100),
                  );

                  return (
                    <button
                      key={safeKey("waterfall", event.id, event.name, i)}
                      onClick={() => onSelectEvent(event)}
                      className="w-full text-left group"
                    >
                      <div className="grid grid-cols-[180px_1fr_80px] gap-4 items-center">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-zinc-100 group-hover:text-cyan-300 transition">
                            {event.name}
                          </p>

                          <p className="text-xs text-zinc-500">{event.type}</p>
                        </div>

                        <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              event.type === "error"
                                ? "bg-red-500"
                                : event.type === "measure"
                                  ? "bg-cyan-500"
                                  : "bg-blue-500"
                            }`}
                            style={{ width: `${width}%` }}
                          />
                        </div>

                        <p className="text-right text-xs text-zinc-400">
                          {duration > 0 ? `${duration.toFixed(2)}ms` : "—"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
