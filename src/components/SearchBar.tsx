type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: Props) => {
  return (
    <div className="relative mb-6">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-zinc-400">
        ⌕
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search events, metadata, errors..."
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 py-4 pl-12 pr-5 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-400"
      />
    </div>
  );
};
