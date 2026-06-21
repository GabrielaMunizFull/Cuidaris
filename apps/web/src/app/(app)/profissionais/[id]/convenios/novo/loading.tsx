export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-[var(--line)] rounded-[10px]" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 w-24 bg-[var(--line)] rounded-[10px]" />
            <div className="h-10 bg-[var(--line)] rounded-[var(--radius)]" />
          </div>
        ))}
      </div>
      <div className="h-10 w-32 bg-[var(--line)] rounded-[var(--radius)]" />
    </div>
  );
}
