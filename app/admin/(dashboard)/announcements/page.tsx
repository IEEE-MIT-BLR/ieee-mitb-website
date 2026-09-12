import Link from "next/link";
import { deleteAnnouncementAction } from "@/lib/actions/announcements";
import { listAnnouncementsAdmin } from "@/lib/data/announcements";
import DeleteButton from "@/components/admin/delete-button";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/ui";

export default async function AdminAnnouncementsPage() {
  const rows = await listAnnouncementsAdmin();

  return (
    <div>
      <PageHeader
        title="Announcements"
        description={`${rows.length} total`}
        action={{
          label: "+ New announcement",
          href: "/admin/announcements/new",
        }}
      />
      <AdminTable
        headers={["Title", "Kind", "Society", "Status", ""]}
        isEmpty={rows.length === 0}
        empty="No announcements yet. Create your first one."
      >
        {rows.map((a) => (
          <tr key={a.id} className="hover:bg-(--surface)">
            <td className="px-4 py-3 font-medium text-(--ink)">{a.title}</td>
            <td className="px-4 py-3 text-(--muted)">{a.kind}</td>
            <td className="px-4 py-3 text-(--muted)">{a.societyName ?? "—"}</td>
            <td className="px-4 py-3">
              <StatusBadge status={a.status} />
            </td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <Link
                href={`/admin/announcements/${a.id}/edit`}
                className="rounded-md px-2 py-1 text-sm font-medium text-(--accent) hover:bg-(--accent-soft)"
              >
                Edit
              </Link>
              <DeleteButton action={deleteAnnouncementAction} id={a.id} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
