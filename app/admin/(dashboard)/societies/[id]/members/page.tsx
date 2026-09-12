import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteMemberAction } from "@/lib/actions/societies";
import { getSocietyById, listMembersBySociety } from "@/lib/data/societies";
import DeleteButton from "@/components/admin/delete-button";
import { AdminTable, PageHeader } from "@/components/admin/ui";

type Params = Promise<{ id: string }>;

export default async function SocietyMembersPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const [society, members] = await Promise.all([
    getSocietyById(id),
    listMembersBySociety(id),
  ]);
  if (!society) notFound();

  return (
    <div>
      <PageHeader
        title={`Members — ${society.name}`}
        action={{
          label: "+ New member",
          href: `/admin/societies/${id}/members/new`,
        }}
      />
      <AdminTable
        headers={["Name", "Type", "Role", ""]}
        isEmpty={members.length === 0}
        empty="No members yet. Add your first one."
      >
        {members.map((m) => (
          <tr key={m.id} className="hover:bg-[var(--surface)]">
            <td className="px-4 py-3 font-medium text-[var(--ink)]">
              {m.name}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">{m.memberType}</td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {m.roleTitle ?? "—"}
            </td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <Link
                href={`/admin/societies/${id}/members/${m.id}/edit`}
                className="rounded-md px-2 py-1 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                Edit
              </Link>
              <DeleteButton action={deleteMemberAction} id={m.id} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
