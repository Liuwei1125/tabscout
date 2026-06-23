import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "accent" | "warning" | "danger" | "success";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className="badge inline-flex h-5 shrink-0 items-center px-2 text-[11px] leading-none" data-tone={tone}>
      {children}
    </span>
  );
}
