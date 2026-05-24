type ProsType = {
  connected: boolean;
  onClear: () => void;
};

export const Header = ({ connected, onClear }: ProsType) => {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs mb-3">
          Realtime observability
        </p>

        <h1 className="text-5xl font-bold">Tracebeam Studio ⚡</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Local dev session · ws://localhost:8080
        </p>
      </div>

      <div
        className={`px-4 py-2 rounded-full text-sm border ${
          connected
            ? "border-green-500 text-green-400"
            : "border-red-500 text-red-400"
        }`}
      >
        {connected ? "Connected" : "Disconnected"}
      </div>
      <button
        onClick={onClear}
        className="px-4 py-2 rounded-full text-sm border border-zinc-700 text-zinc-300 hover:border-red-400 hover:text-red-300 transition"
      >
        Clear events
      </button>
    </div>
  );
};
