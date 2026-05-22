import type { Event } from "../types/event";

type ProsType = {
  groupedTraces: Record<string, Event[]>;
};

export const TraceSummaries = ({ groupedTraces }: ProsType) => {
  const traceSummaries = Object.entries(groupedTraces).map(
    ([traceId, traceEvents]) => {
      const sortedEvents = [...traceEvents].sort(
        (a, b) => a.timestamp - b.timestamp,
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
    },
  );

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-sm">Traces</p>
          <h2 className="text-xl font-semibold">Trace summaries</h2>
        </div>

        <p className="text-zinc-500 text-sm">{traceSummaries.length} traces</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {traceSummaries.map((trace) => (
          <div
            key={trace.traceId}
            className="border border-zinc-800 rounded-xl p-4 bg-black/30"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-purple-300">{trace.traceId}</p>

              <p className="text-sm text-zinc-500">{trace.count} events</p>
            </div>

            <p className="text-sm text-zinc-400">
              Flow duration:{" "}
              <span className="text-cyan-400">{trace.duration}ms</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
