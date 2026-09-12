"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const selectClass =
  "w-full rounded-[3px] border border-(--line-strong) bg-(--canvas) px-3.5 py-2.5 text-sm text-(--ink) transition-colors focus:border-(--ink) focus:outline-none";

/**
 * URL-driven filter bar for the Events and Articles pages. Each change rewrites
 * the query string (resetting to page 1); the server page re-queries. Search is
 * debounced. Replaces the legacy client-only filtering that only searched the
 * already-loaded page.
 */
export default function ContentFilters({
  societies,
  showScope = false,
}: {
  societies: { slug: string; name: string }[];
  showScope?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Debounce search → URL.
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search === current) return;
    const t = setTimeout(() => setParam("search", search), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";

  return (
    <div className="panel p-5">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, description, author…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-[3px] border border-(--line-strong) bg-(--canvas) px-3.5 py-2.5 text-sm text-(--ink) transition-colors placeholder:text-(--faint) focus:border-(--ink) focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {showScope && (
          <select
            aria-label="Event type"
            value={searchParams.get("scope") ?? "all"}
            onChange={(e) => setParam("scope", e.target.value)}
            className={selectClass}
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        )}

        <select
          aria-label="Society"
          value={searchParams.get("society") ?? ""}
          onChange={(e) => setParam("society", e.target.value)}
          className={selectClass}
        >
          <option value="">All Societies</option>
          {societies.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Year"
          value={year}
          onChange={(e) => setParam("year", e.target.value)}
          className={selectClass}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          aria-label="Month"
          value={month}
          disabled={!year}
          onChange={(e) => setParam("month", e.target.value)}
          className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <option value="">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          aria-label="Date"
          value={searchParams.get("date") ?? ""}
          onChange={(e) => setParam("date", e.target.value)}
          className={selectClass}
        />

        <button
          onClick={() => {
            setSearch("");
            router.replace(pathname);
          }}
          className="rounded-[3px] border border-(--line-strong) bg-transparent px-3.5 py-2.5 text-sm font-medium text-(--ink) transition-colors hover:border-(--ink) hover:bg-(--canvas)"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
