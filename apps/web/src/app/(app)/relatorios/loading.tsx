export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-[var(--line)] rounded-[10px]" />
      <div className="h-4 w-32 bg-[var(--line)] rounded-[10px]" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[var(--line)] rounded-[var(--radius)]" />
        ))}
      </div>
      <div className="h-64 bg-[var(--line)] rounded-[var(--radius)]" />
    </div>
  );
}
