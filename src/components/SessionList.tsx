import type { Event } from "../types/event";

type Props = {
  groupedSessions: Record<string, Event[]>;
  onSelectEvent: (event: Event) => void;
};

const groupEventsByTrace = (events: Event[]) => {
  return events.reduce<Record<string, Event[]>>((groups, event) => {
    const traceKey = event.traceId || "ungrouped";

    if (!groups[traceKey]) {
      groups[traceKey] = [];
    }

    groups[traceKey].push(event);

    return groups;
  }, {});
};

export const SessionList = ({ groupedSessions, onSelectEvent }: Props) => {
  return (
    <div className="space-y-5">
      {Object.entries(groupedSessions).map(([sessionId, sessionEvents]) => {
        const traces = groupEventsByTrace(sessionEvents);

        return (
          <div
            key={sessionId}
            className="border border-zinc-800 rounded-2xl bg-zinc-900 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                  Session
                </p>

                <h2 className="text-xl font-semibold">{sessionId}</h2>
              </div>

              <p className="text-sm text-zinc-500">
                {sessionEvents.length} events
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(traces).map(([traceId, traceEvents]) => (
                <div
                  key={traceId}
                  className="rounded-xl border border-zinc-800 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-purple-300">{traceId}</p>

                    <p className="text-xs text-zinc-500">
                      {traceEvents.length} events
                    </p>
                  </div>

                  <div className="space-y-2">
                    {traceEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between border-l border-zinc-700 pl-4 py-2 cursor-pointer hover:border-purple-500/40 transition"
                        onClick={() => onSelectEvent(event)}
                      >
                        <div>
                          <p className="text-sm text-zinc-100">{event.name}</p>
                          <p className="text-xs text-zinc-500">{event.type}</p>
                        </div>

                        <p className="text-xs text-zinc-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};