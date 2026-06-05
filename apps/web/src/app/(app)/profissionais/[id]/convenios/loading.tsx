export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-40 bg-[var(--line)] rounded-[10px]" />
      <div className="h-48 bg-[var(--line)] rounded-[var(--radius)]" />
    </div>
  );
}
