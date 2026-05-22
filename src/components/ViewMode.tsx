type Props = {
  viewMode: string;
  onChange: (viewMode: string) => void;
};

export const ViewMode = ({ viewMode, onChange }: Props) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange("events")}
        className={`px-4 py-2 rounded-full text-sm border transition ${
          viewMode === "events"
            ? "border-purple-400 text-purple-300 bg-purple-400/10"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
        }`}
      >
        Events
      </button>

      <button
        onClick={() => onChange("traces")}
        className={`px-4 py-2 rounded-full text-sm border transition ${
          viewMode === "traces"
            ? "border-purple-400 text-purple-300 bg-purple-400/10"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
        }`}
      >
        Traces
      </button>
      <button
        onClick={() => onChange("sessions")}
        className={`px-4 py-2 rounded-full text-sm border transition ${
          viewMode === "sessions"
            ? "border-purple-400 text-purple-300 bg-purple-400/10"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
        }`}
      >
        Sessions
      </button>
    </div>
  );
};
