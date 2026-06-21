import * as React from "react";
import Image from "next/image";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

const sizePx = { sm: 28, md: 36, lg: 48 };

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const colors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

function getColor(name: string) {
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? colors[0];
}

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={sizePx[size]}
        height={sizePx[size]}
        quality={75}
        className={[
          "rounded-full object-cover flex-shrink-0",
          sizeClasses[size],
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0",
        sizeClasses[size],
        getColor(name),
        className,
      ].join(" ")}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
