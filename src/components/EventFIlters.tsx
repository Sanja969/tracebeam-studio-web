import { safeKey } from "../utils/utils";

type Props = {
  activeFilter: string;
  onChange: (filter: string) => void;
};

export const EventFilters = ({ activeFilter, onChange }: Props) => {
  const filters = ["all", "track", "measure", "error"];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter, i) => (
        <button
          key={safeKey("filter", filter, i)}
          onClick={() => onChange(filter)}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            activeFilter === filter
              ? "border-cyan-400 text-cyan-300 bg-cyan-400/10"
              : "border-zinc-800 text-zinc-400 hover:border-zinc-600"
          }`}
        >
          {filter.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
