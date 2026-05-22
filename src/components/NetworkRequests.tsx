import type { Event } from "../types/event";

type Props = {
  events: Event[];
  onSelectEvent: (event: Event) => void;
};

export const NetworkRequests = ({ events, onSelectEvent }: Props) => {
  const fetchEvents = events.filter(
    (event) =>
      event.type === "measure" && event.metadata?.source === "fetch",
  );

  if (fetchEvents.length === 0) {
    return null;
  }

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-sm">Network</p>
          <h2 className="text-xl font-semibold">Fetch requests</h2>
        </div>

        <p className="text-zinc-500 text-sm">
          {fetchEvents.length} requests
        </p>
      </div>

      <div className="space-y-3">
        {fetchEvents.map((event) => {
          const method = String(event.metadata?.method || "GET");
          const url = String(event.metadata?.url || "unknown");
          const status = event.metadata?.status;
          const isError =
            typeof status === "number" ? status >= 400 : false;

          return (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className={`w-full text-left rounded-xl border p-4 transition ${
                isError
                  ? "border-red-500/30 bg-red-500/5 hover:border-red-400/50"
                  : "border-zinc-800 bg-black/30 hover:border-cyan-500/40"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full border border-cyan-500/30 px-2 py-0.5 text-xs text-cyan-300">
                      {method}
                    </span>

                    {status && (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${
                          isError
                            ? "border-red-500/30 text-red-300"
                            : "border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        {String(status)}
                      </span>
                    )}
                  </div>

                  <p className="truncate text-sm text-zinc-100">
                    {url}
                  </p>
                </div>

                <div className="shrink-0 text-right text-sm">
                  {event.duration && (
                    <p
                      className={
                        event.duration > 1000
                          ? "text-yellow-300"
                          : "text-cyan-400"
                      }
                    >
                      {event.duration.toFixed(2)}ms
                    </p>
                  )}

                  <p className="text-xs text-zinc-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};