type Props = {
  title: string;
  description?: string;
  className?: string;
};

export const EmptyState = ({ title, description, className = "" }: Props) => {
  return (
    <div
      className={`flex min-h-[220px] items-center justify-center rounded-xl border border-zinc-800 bg-black/20 px-6 text-center ${className}`}
    >
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        {description && (
          <p className="mt-2 text-sm text-zinc-600">{description}</p>
        )}
      </div>
    </div>
  );
};