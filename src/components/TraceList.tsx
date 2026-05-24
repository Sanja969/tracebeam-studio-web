import type { Event } from "../types/event";
import { safeKey } from "../utils/utils";

type Props = {
  groupedTraces: Record<string, Event[]>;
  onSelectEvent: (event: Event) => void;
};

const getTraceDuration = (events: Event[]) => {
  const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);

  const start = sorted[0]?.timestamp ?? 0;
  const end = sorted[sorted.length - 1]?.timestamp ?? start;

  return end - start;
};

export const TraceList = ({ groupedTraces, onSelectEvent }: Props) => {
  return (
    <div className="space-y-5">
      {Object.entries(groupedTraces).map(([traceId, traceEvents], i) => {
        const sortedEvents = [...traceEvents].sort(
          (a, b) => a.timestamp - b.timestamp,
        );

        const duration = getTraceDuration(traceEvents);

        return (
          <div
            key={safeKey("trace-m", traceId, i)}
            className="border border-zinc-800 rounded-2xl bg-zinc-900 p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-purple-400">
                  Trace
                </p>

                <h2 className="text-xl font-semibold">{traceId}</h2>
              </div>

              <div className="text-right text-sm text-zinc-500">
                <p>{sortedEvents.length} events</p>
                <p className="text-cyan-400">{duration}ms</p>
              </div>
            </div>

            <div className="relative space-y-3 pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-800" />

              {sortedEvents.map((event, i) => (
                <div
                  key={safeKey("trace", event.id, event.name, i)}
                  className="relative"
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="absolute -left-[22px] top-2 h-3 w-3 rounded-full bg-purple-500 border border-purple-300" />

                  <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 cursor-pointer hover:border-purple-500/40 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.name}</p>
                        <p className="text-xs text-zinc-500">{event.type}</p>
                      </div>

                      <div className="text-right text-xs text-zinc-500">
                        <p>{new Date(event.timestamp).toLocaleTimeString()}</p>

                        {event.duration && (
                          <p className="text-cyan-400">{event.duration}ms</p>
                        )}
                      </div>
                    </div>
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
