import Link from "next/link";
import { deleteSocietyAction } from "@/lib/actions/societies";
import { listSocietiesAdmin } from "@/lib/data/societies";
import DeleteButton from "@/components/admin/delete-button";
import { AdminTable, PageHeader } from "@/components/admin/ui";

export default async function AdminSocietiesPage() {
  const rows = await listSocietiesAdmin();

  return (
    <div>
      <PageHeader
        title="Societies"
        description={`${rows.length} total`}
        action={{ label: "+ New society", href: "/admin/societies/new" }}
      />
      <AdminTable
        headers={["Name", "Slug", "Type", "Order", ""]}
        isEmpty={rows.length === 0}
        empty="No societies yet. Create your first one."
      >
        {rows.map((s) => (
          <tr key={s.id} className="hover:bg-(--surface)">
            <td className="px-4 py-3 font-medium text-(--ink)">{s.name}</td>
            <td className="px-4 py-3 text-(--muted)">{s.slug}</td>
            <td className="px-4 py-3 text-(--muted)">{s.type}</td>
            <td className="px-4 py-3 text-(--muted)">{s.displayOrder}</td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <Link
                href={`/admin/societies/${s.id}/edit`}
                className="rounded-md px-2 py-1 text-sm font-medium text-(--accent) hover:bg-(--accent-soft)"
              >
                Edit
              </Link>
              <Link
                href={`/admin/societies/${s.id}/members`}
                className="rounded-md px-2 py-1 text-sm font-medium text-(--accent) hover:bg-(--accent-soft)"
              >
                Members
              </Link>
              <DeleteButton action={deleteSocietyAction} id={s.id} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
