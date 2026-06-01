import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  trend?: string;
  highlight?: "amber" | "red";
}

const highlightClasses = {
  amber: "text-amber-600",
  red: "text-red-600",
};

const iconBgClasses = {
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  default: "bg-[var(--accent-soft)] text-[var(--accent)]",
};

export function StatCard({ icon: Icon, label, value, trend, highlight }: StatCardProps) {
  const iconBg = highlight ? iconBgClasses[highlight] : iconBgClasses.default;
  const valueColor = highlight ? highlightClasses[highlight] : "text-[var(--ink)]";

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${iconBg}`}>
          <Icon size={18} strokeWidth={1.75} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-[var(--ink-3)]">{trend}</span>
        )}
      </div>
      <p className={`text-3xl font-bold tabular-nums tracking-tight ${valueColor}`}>
        {value}
      </p>
      <p className="text-sm text-[var(--ink-2)] mt-1">{label}</p>
    </div>
  );
}
