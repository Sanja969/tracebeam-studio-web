import { safeKey } from "../utils/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const limits = [2, 100, 250, 500];

export const LimitSelector = ({ value, onChange }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-zinc-500">Limit</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 outline-none hover:border-zinc-600 focus:border-cyan-400"
      >
        {limits.map((limit, i) => (
          <option key={safeKey("limit", limit, i, value)} value={limit}>
            {limit} events
          </option>
        ))}
      </select>
    </div>
  );
};
