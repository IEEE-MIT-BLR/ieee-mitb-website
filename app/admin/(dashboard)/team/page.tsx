import Link from "next/link";
import { deleteTeamMemberAction } from "@/lib/actions/team";
import { listTeamAdmin } from "@/lib/data/team";
import DeleteButton from "@/components/admin/delete-button";
import { AdminTable, PageHeader } from "@/components/admin/ui";

export default async function AdminTeamPage() {
  const rows = await listTeamAdmin();

  return (
    <div>
      <PageHeader
        title="Team"
        description={`${rows.length} total`}
        action={{ label: "+ New member", href: "/admin/team/new" }}
      />
      <AdminTable
        headers={["Name", "Position", "Term", "Current", ""]}
        isEmpty={rows.length === 0}
        empty="No team members yet. Create your first one."
      >
        {rows.map((m) => (
          <tr key={m.id} className="hover:bg-card">
            <td className="px-4 py-3 font-medium text-(--ink)">{m.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{m.position}</td>
            <td className="px-4 py-3 text-muted-foreground">{m.term ?? "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">
              {m.isCurrent ? "Yes" : "No"}
            </td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <Link
                href={`/admin/team/${m.id}/edit`}
                className="rounded-md px-2 py-1 text-sm font-medium text-(--accent) hover:bg-(--accent-soft)"
              >
                Edit
              </Link>
              <DeleteButton action={deleteTeamMemberAction} id={m.id} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
