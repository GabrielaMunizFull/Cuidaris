import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--ink)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "h-10 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm",
          "text-[var(--ink)] placeholder:text-[var(--ink-3)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent",
          "disabled:bg-[var(--bg)] disabled:cursor-not-allowed",
          error ? "border-red-400 focus:ring-red-400" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-[var(--ink-3)]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
