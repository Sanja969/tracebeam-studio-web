import type { Event } from "../types/event";

type Props = {
  event: Event | null;
  onClose: () => void;
};

export const EventDetailDrawer = ({ event, onClose }: Props) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">
              Event details
            </p>

            <h2 className="text-2xl font-bold text-white">
              {event.name}
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              {event.type}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-red-400 hover:text-red-300"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <Detail label="ID" value={event.id} />
          <Detail label="Trace ID" value={event.traceId || "—"} />
          <Detail
            label="Timestamp"
            value={new Date(event.timestamp).toLocaleString()}
          />
          {event.receivedAt && (
            <Detail
              label="Received At"
              value={new Date(event.receivedAt).toLocaleString()}
            />
          )}
          {event.duration && (
            <Detail label="Duration" value={`${event.duration}ms`} />
          )}

          <div>
            <p className="text-zinc-500 mb-2">Raw JSON</p>
            <pre className="rounded-2xl bg-black/50 border border-zinc-800 p-4 text-xs text-zinc-300 overflow-auto">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-zinc-500 mb-1">{label}</p>
      <p className="text-zinc-100 break-all">{value}</p>
    </div>
  );
};