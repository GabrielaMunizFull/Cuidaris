interface CuidarisLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 44, text: "text-2xl" },
};

export function CuidarisLogo({ size = "md", variant = "dark" }: CuidarisLogoProps) {
  const { icon, text } = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-[var(--ink)]";

  return (
    <div className="flex items-center gap-2.5">
      <div
        style={{ width: icon, height: icon }}
        className="rounded-[10px] bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center flex-shrink-0 shadow-sm"
      >
        <svg
          width={icon * 0.6}
          height={icon * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21.593c-.525-.437-10.5-8.862-10.5-13.093A6.5 6.5 0 0 1 12 3.6a6.5 6.5 0 0 1 10.5 4.9c0 4.231-9.975 12.656-10.5 13.093Z"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </div>
      <span className={`font-bold tracking-tight ${text} ${textColor}`}>
        Cuida<span className={variant === "light" ? "text-emerald-300" : "text-[var(--accent)]"}>ris</span>
      </span>
    </div>
  );
}
