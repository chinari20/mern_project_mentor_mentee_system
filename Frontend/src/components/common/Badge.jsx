import { cn } from "../../utils/cn";

const variants = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-primary-100 text-primary-700",
};

export function Badge({ children, variant = "info" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        variants[variant],
      )}
    >
      {children}
    </span>
  );
}
