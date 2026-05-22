type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar = ({ value, onChange }: Props) => {
  return (
    <div className="mb-4">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search events, metadata, errors..."
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-400"
      />
    </div>
  );
};