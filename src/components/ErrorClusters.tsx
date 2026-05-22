import type { Event } from "../types/event";

type Props = {
  events: Event[];
  onSelectEvent: (event: Event) => void;
};

export const ErrorClusters = ({ events, onSelectEvent }: Props) => {
  const errorClusters = events
  .filter((event) => event.type === "error")
  .reduce<Record<string, Event[]>>((clusters, event) => {
    const key = event.name;

    if (!clusters[key]) {
      clusters[key] = [];
    }

    clusters[key].push(event);

    return clusters;
  }, {});
  const clusters = Object.entries(errorClusters);

  if (clusters.length === 0) {
    return null;
  }

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-sm">Errors</p>
          <h2 className="text-xl font-semibold">Error clusters</h2>
        </div>

        <p className="text-zinc-500 text-sm">
          {clusters.length} unique errors
        </p>
      </div>

      <div className="space-y-3">
        {clusters.map(([name, clusterEvents]) => {
          const latestEvent = clusterEvents[0];

          return (
            <button
              key={name}
              onClick={() => onSelectEvent(latestEvent)}
              className="w-full text-left rounded-xl border border-red-500/20 bg-red-500/5 p-4 hover:border-red-400/50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-300">{name}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Latest:{" "}
                    {new Date(latestEvent.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                <span className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">
                  {clusterEvents.length} occurrences
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};