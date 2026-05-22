import type { Event } from "../types/event";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ProsType = {
  events: Event[];
};

export const LatencyChart = ({ events }: ProsType) => {
  const durationEvents = events
    .filter(
      (event) => event.type === "measure" && typeof event.duration === "number",
    )
    .slice(0, 20)
    .reverse()
    .map((event) => ({
      name: event.name,
      duration: Number(event.duration?.toFixed(2)),
      time: new Date(event.timestamp).toLocaleTimeString(),
    }));

  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8 mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-sm">Latency</p>
          <h2 className="text-xl font-semibold">Measured operations</h2>
        </div>

        <p className="text-zinc-500 text-sm">
          Last {durationEvents.length} measure events
        </p>
      </div>

      {durationEvents.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={durationEvents}>
              <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-zinc-500">
          Waiting for measured operations...
        </div>
      )}
    </div>
  );
};
