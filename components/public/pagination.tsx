"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function pageNumbers(current: number, total: number): (number | "…")[] {
  const max = 7;
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  const baseBtn =
    "flex h-9 min-w-9 items-center justify-center rounded-[3px] px-3 font-mono text-sm transition-colors";

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-1.5">
        {currentPage > 1 ? (
          <Link
            href={hrefFor(currentPage - 1)}
            className={`${baseBtn} text-[var(--muted)] hover:bg-[var(--canvas-deep)] hover:text-[var(--ink)]`}
            aria-label="Previous page"
          >
            ‹
          </Link>
        ) : (
          <span
            className={`${baseBtn} cursor-not-allowed text-[var(--disabled)]`}
          >
            ‹
          </span>
        )}

        {pageNumbers(currentPage, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-2 text-[var(--faint)]">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={hrefFor(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={
                p === currentPage
                  ? `${baseBtn} bg-[var(--ink)] text-[var(--canvas)]`
                  : `${baseBtn} text-[var(--muted)] hover:bg-[var(--canvas-deep)] hover:text-[var(--ink)]`
              }
            >
              {p}
            </Link>
          ),
        )}

        {currentPage < totalPages ? (
          <Link
            href={hrefFor(currentPage + 1)}
            className={`${baseBtn} text-[var(--muted)] hover:bg-[var(--canvas-deep)] hover:text-[var(--ink)]`}
            aria-label="Next page"
          >
            ›
          </Link>
        ) : (
          <span
            className={`${baseBtn} cursor-not-allowed text-[var(--disabled)]`}
          >
            ›
          </span>
        )}
      </div>
    </div>
  );
}
