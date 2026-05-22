import { AnimatePresence, motion } from "framer-motion";
import type { Event } from "../types/event";
import { getEventColor, getSeverityColor } from "../utils/utils";

type ProsType = {
  events: Event[];
  onSelectEvent: (event) => void;
};

export const EventList = ({ events, onSelectEvent }: ProsType) => {
  return (
    <AnimatePresence>
      {events.map((event, index) => {
        const severity = event.metadata?.severity;
        return (
          <div className="relative pl-10">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-zinc-800" />
            <div
              className={`absolute left-[9px] top-8 w-3 h-3 rounded-full border-2 ${
                event.type === "error"
                  ? "bg-red-500 border-red-300"
                  : event.type === "measure"
                    ? "bg-cyan-500 border-cyan-300"
                    : "bg-blue-500 border-blue-300"
              }`}
            />
            <motion.div
              key={`${event.id}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border border-zinc-800 rounded-2xl p-5 bg-zinc-900 cursor-pointer hover:border-purple-500/40 transition"
              onClick={() => onSelectEvent(event)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold">{event.name}</h2>

                  {event.traceId && (
                    <p className="text-xs text-purple-300 mt-1">
                      trace: {event.traceId}
                    </p>
                  )}

                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getEventColor(
                      event.type,
                    )}`}
                  >
                    {event.type}
                  </div>
                </div>

                <div className="text-zinc-400 text-sm">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {event.duration && (
                <div className="text-cyan-400 text-sm mb-2">
                  Duration: {event.duration}ms
                </div>
              )}

              {event.metadata && (
                <pre className="bg-black/40 rounded-xl p-4 text-xs overflow-auto text-zinc-300">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              )}
              {event.type === "error" && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getSeverityColor(
                    severity,
                  )}`}
                >
                  {String(severity || "error")}
                </span>
              )}
            </motion.div>
          </div>
        );
      })}
    </AnimatePresence>
  );
};
