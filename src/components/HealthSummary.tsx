import type { Event } from "../types/event";
import { getEventStats } from "../utils/utils";

type Props = {
  events: Event[];
};

export const HealthSummary = ({ events }: Props) => {
  const stats = getEventStats(events);

  const status =
    stats.errorRate >= 30
      ? "Critical"
      : stats.errorRate >= 10
        ? "Warning"
        : "Healthy";

  const color =
    status === "Critical"
      ? "text-red-300 border-red-500/30 bg-red-500/10"
      : status === "Warning"
        ? "text-yellow-300 border-yellow-500/30 bg-yellow-500/10"
        : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";

  return (
    <div className={`border rounded-2xl p-5 mb-8 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">System health</p>
          <h2 className="text-2xl font-bold">{status}</h2>
        </div>

        <div className="text-right text-sm">
          <p>{stats.errorRate}% error rate</p>
          <p className="opacity-70">
            {stats.error} errors / {stats.total} events
          </p>
        </div>
      </div>
    </div>
  );
};