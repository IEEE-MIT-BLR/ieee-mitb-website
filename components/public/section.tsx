import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centered max-width content wrapper used across public pages. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}

/** Consistent eyebrow + title + subtitle block for section headers. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", align === "center" && "justify-center")}>
          {eyebrow}
        </span>
      )}
      <h2 className="mt-5 text-3xl sm:text-4xl md:text-[2.75rem]">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-(--muted)">
          {subtitle}
        </p>
      )}
    </div>
  );
}
