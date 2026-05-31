import * as React from "react";

type BadgeVariant =
  | "confirmado"
  | "pendente"
  | "cancelado"
  | "remarcado"
  | "pago"
  | "atrasado"
  | "trial"
  | "ativo"
  | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  confirmado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pago: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ativo: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pendente: "bg-amber-50 text-amber-700 border-amber-200",
  trial: "bg-amber-50 text-amber-700 border-amber-200",
  cancelado: "bg-red-50 text-red-700 border-red-200",
  atrasado: "bg-red-50 text-red-700 border-red-200",
  remarcado: "bg-blue-50 text-blue-700 border-blue-200",
  default: "bg-[var(--bg)] text-[var(--ink-2)] border-[var(--line)]",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
