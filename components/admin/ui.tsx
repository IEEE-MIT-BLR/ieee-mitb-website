import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl text-(--ink)">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-(--muted)">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="rounded-[3px] bg-(--accent) px-4 py-2 text-sm font-semibold text-(--on-accent) transition-colors hover:bg-(--accent-bright)"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-500/20 text-emerald-300",
    draft: "bg-amber-500/20 text-amber-300",
    archived: "bg-slate-500/20 text-slate-300",
    new: "bg-sky-500/20 text-sky-300",
    read: "bg-slate-500/20 text-slate-300",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] ?? "bg-slate-500/20 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

/** Shared table shell for admin list pages. */
export function AdminTable({
  headers,
  children,
  empty,
  isEmpty,
}: {
  headers: string[];
  children: React.ReactNode;
  empty: string;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return (
      <div className="rounded-[4px] border border-(--line) bg-(--surface) p-10 text-center text-(--muted)">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-[4px] border border-(--line) bg-(--surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-(--line) text-xs text-(--faint) uppercase">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-(--line)">{children}</tbody>
      </table>
    </div>
  );
}
