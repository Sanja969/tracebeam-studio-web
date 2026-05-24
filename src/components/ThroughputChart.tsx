import type { Event } from "../types/event";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getThroughputData } from "../utils/utils";

type ProsType = {
  events: Event[];
};

export const ThroughputChart = ({ events }: ProsType) => {
  const throughputData = getThroughputData(events);
  return (
    <div className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 mb-8 min-h-0 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-500 text-sm">Throughput</p>
          <h2 className="text-xl font-semibold">Events over time</h2>
        </div>

        <p className="text-zinc-500 text-sm">{events.length} total events</p>
      </div>

      {throughputData.length > 0 ? (
        <div className="h-64 min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
            <LineChart data={throughputData}>
              <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
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
                dataKey="count"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-zinc-500">
          Waiting for events...
        </div>
      )}
    </div>
  );
};
