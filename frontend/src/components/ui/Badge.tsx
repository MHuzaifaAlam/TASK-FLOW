import type { ReactNode } from "react";

type Tone = "teal" | "amber" | "ink" | "success" | "danger";

const toneClasses: Record<Tone, string> = {
  teal: "bg-teal-50 text-teal-700",
  amber: "bg-amber-50 text-amber-500",
  ink: "bg-ink-100 text-ink-600",
  success: "bg-success-50 text-success-500",
  danger: "bg-danger-50 text-danger-500",
};

export function Badge({ tone = "ink", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
