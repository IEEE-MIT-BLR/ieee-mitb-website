import Link from "next/link";
import { deleteArticleAction } from "@/lib/actions/articles";
import { listArticlesAdmin } from "@/lib/data/articles";
import DeleteButton from "@/components/admin/delete-button";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

type SearchParams = Promise<{ page?: string }>;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const { rows, total } = await listArticlesAdmin(current);

  return (
    <div>
      <PageHeader
        title="Articles"
        description={`${total} total`}
        action={{ label: "+ New article", href: "/admin/articles/new" }}
      />
      <AdminTable
        headers={["Title", "Society", "Date", "Status", ""]}
        isEmpty={rows.length === 0}
        empty="No articles yet. Create your first one."
      >
        {rows.map((a) => (
          <tr key={a.id} className="hover:bg-(--surface)">
            <td className="px-4 py-3 font-medium text-(--ink)">{a.title}</td>
            <td className="px-4 py-3 text-(--muted)">{a.societyName ?? "—"}</td>
            <td className="px-4 py-3 text-(--muted)">
              {a.publicationDate ? formatDate(a.publicationDate) : "—"}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={a.status} />
            </td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <Link
                href={`/admin/articles/${a.id}/edit`}
                className="rounded-md px-2 py-1 text-sm font-medium text-(--accent) hover:bg-(--accent-soft)"
              >
                Edit
              </Link>
              <DeleteButton action={deleteArticleAction} id={a.id} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
