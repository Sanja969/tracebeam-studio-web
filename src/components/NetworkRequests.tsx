import type { Event } from "../types/event";
import { getMethodColor, getStatusColor, safeKey } from "../utils/utils";

type Props = {
  events: Event[];
  onSelectEvent: (event: Event) => void;
};

export const NetworkRequests = ({ events, onSelectEvent }: Props) => {
  const fetchEvents = events.filter(
    (event) => event.type === "measure" && event.metadata?.source === "fetch",
  );

  if (fetchEvents.length === 0) {
    return null;
  }

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-zinc-500 text-sm">Network</p>
          <h2 className="text-xl font-semibold">Fetch requests</h2>
        </div>

        <p className="text-zinc-500 text-sm">{fetchEvents.length} requests</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <div className="grid grid-cols-[90px_1fr_100px_120px_100px] gap-4 border-b border-zinc-800 bg-zinc-900 px-4 py-3 text-xs uppercase tracking-wide text-zinc-500">
          <span>Method</span>
          <span>URL</span>
          <span>Status</span>
          <span>Duration</span>
          <span className="text-right">Time</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {fetchEvents.map((event, i) => {
            const method = String(event.metadata?.method || "GET");
            const url = String(event.metadata?.url || "unknown");
            const status = event.metadata?.status;

            const isError = typeof status === "number" && status >= 400;

            const isSlow =
              typeof event.duration === "number" && event.duration > 1000;

            return (
              <button
                key={safeKey(
                  "request",
                  event.id,
                  event.name,
                  event.timestamp,
                  i,
                )}
                onClick={() => onSelectEvent(event)}
                className={`grid w-full grid-cols-[90px_1fr_100px_120px_100px] items-center gap-4 px-4 py-4 text-left transition hover:bg-zinc-800/40 ${
                  isError ? "bg-red-500/5" : ""
                }`}
              >
                <span
                  className={`w-fit rounded-full border px-2 py-0.5 text-xs ${getMethodColor(method)}`}
                >
                  {method}
                </span>

                <span className="truncate text-sm text-zinc-100">{url}</span>

                <div>
                  {status ? (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${getStatusColor(status)}`}
                    >
                      {String(status)}
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={
                      event.duration && event.duration > 1000
                        ? "text-yellow-300"
                        : "text-cyan-400"
                    }
                  >
                    {event.duration ? `${event.duration.toFixed(2)}ms` : "—"}
                  </span>

                  {isSlow && (
                    <span className="rounded-full border border-yellow-500/30 px-2 py-0.5 text-[10px] text-yellow-300">
                      Slow
                    </span>
                  )}
                </div>

                <span className="text-right text-xs text-zinc-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
