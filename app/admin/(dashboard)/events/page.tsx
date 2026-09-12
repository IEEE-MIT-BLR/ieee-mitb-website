import Link from "next/link";
import { deleteEventAction } from "@/lib/actions/events";
import { listEventsAdmin } from "@/lib/data/events";
import DeleteButton from "@/components/admin/delete-button";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<{ page?: string }>;

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const { rows, total } = await listEventsAdmin(current);

  return (
    <div>
      <PageHeader
        title="Events"
        description={`${total} total`}
        action={{ label: "+ New event", href: "/admin/events/new" }}
      />
      <AdminTable
        headers={["Title", "Society", "Date", "Status", ""]}
        isEmpty={rows.length === 0}
        empty="No events yet. Create your first one."
      >
        {rows.map((e) => (
          <tr key={e.id} className="hover:bg-[var(--surface)]">
            <td className="px-4 py-3 font-medium text-[var(--ink)]">
              {e.title}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {e.societyName ?? "—"}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {formatDate(e.startAt)}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={e.status} />
            </td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <Link
                href={`/admin/events/${e.id}/edit`}
                className="rounded-md px-2 py-1 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                Edit
              </Link>
              <DeleteButton action={deleteEventAction} id={e.id} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
