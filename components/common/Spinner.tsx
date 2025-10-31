"use client";

type SpinnerProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  colorClass?: string;
  label?: string;
};

export default function Spinner({
  size = "md",
  className = "",
  colorClass = "text-primary",
  label,
}: SpinnerProps) {
  const sizeClass =
    size === "xs"
      ? "loading-xs"
      : size === "sm"
        ? "loading-sm"
        : size === "lg"
          ? "loading-lg"
          : "loading-md";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`loading loading-spinner ${sizeClass} ${colorClass}`} />
      {label ? <span className="text-sm opacity-80">{label}</span> : null}
    </span>
  );
}
