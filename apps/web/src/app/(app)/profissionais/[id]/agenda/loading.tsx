import { Skeleton } from "@/components/skeleton";

export default function AgendaLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6">
        {/* Controles de semana */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-10 ml-auto" />
        </div>

        {/* Grade semanal */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="text-center space-y-1">
                <Skeleton className="h-3 w-8 mx-auto" />
                <Skeleton className="h-7 w-7 mx-auto rounded-full" />
              </div>
              <div className="flex flex-col gap-1.5 min-h-[120px]">
                {i % 3 !== 2 && (
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-2 space-y-1.5">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                )}
                {i % 4 === 0 && (
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[10px] p-2 space-y-1.5">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
