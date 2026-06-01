import { Skeleton } from "@/components/skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Saudação */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-40 shrink-0" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Grid de profissionais */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--line)]">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="text-center space-y-1">
                    <Skeleton className="h-6 w-8 mx-auto" />
                    <Skeleton className="h-3 w-10 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listas inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)]">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="px-5 py-3.5 flex items-center gap-3 border-b border-[var(--line)] last:border-0">
                  <Skeleton className="h-4 w-11 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
