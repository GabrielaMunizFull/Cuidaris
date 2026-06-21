export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-[var(--line)] rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-[var(--line)] rounded-[10px]" />
          <div className="h-4 w-24 bg-[var(--line)] rounded-[10px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-[var(--line)] rounded-[var(--radius)]" />
        ))}
      </div>
      <div className="h-48 bg-[var(--line)] rounded-[var(--radius)]" />
    </div>
  );
}
