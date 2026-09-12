import { updateMessageStatusAction } from "@/lib/actions/inbox";
import {
  listContactMessages,
  listNewsletterSubscribers,
} from "@/lib/data/inbox";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminInboxPage() {
  const [messages, subscribers] = await Promise.all([
    listContactMessages(),
    listNewsletterSubscribers(),
  ]);

  return (
    <div>
      <PageHeader title="Inbox" />

      <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">
        Contact messages
      </h2>
      <AdminTable
        headers={["From", "Subject", "Status", "Received", ""]}
        isEmpty={messages.length === 0}
        empty="No messages yet."
      >
        {messages.map((m) => (
          <tr key={m.id} className="hover:bg-[var(--surface)]">
            <td className="px-4 py-3">
              <div className="font-medium text-[var(--ink)]">{m.name}</div>
              <div className="text-[var(--muted)]">{m.email}</div>
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {m.subject ?? "—"}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={m.status} />
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {formatDate(m.createdAt)}
            </td>
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <form action={updateMessageStatusAction} className="inline">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="status" value="read" />
                <button
                  type="submit"
                  className="rounded-md px-2 py-1 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  Mark read
                </button>
              </form>
              <form action={updateMessageStatusAction} className="inline">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="status" value="archived" />
                <button
                  type="submit"
                  className="rounded-md px-2 py-1 text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
                >
                  Archive
                </button>
              </form>
            </td>
          </tr>
        ))}
      </AdminTable>

      <h2 className="mt-10 mb-4 text-lg font-semibold text-[var(--ink)]">
        Newsletter subscribers
      </h2>
      <AdminTable
        headers={["Email", "Confirmed", "Subscribed"]}
        isEmpty={subscribers.length === 0}
        empty="No subscribers yet."
      >
        {subscribers.map((s) => (
          <tr key={s.id} className="hover:bg-[var(--surface)]">
            <td className="px-4 py-3 font-medium text-[var(--ink)]">
              {s.email}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {s.isConfirmed ? "Yes" : "No"}
            </td>
            <td className="px-4 py-3 text-[var(--muted)]">
              {formatDate(s.createdAt)}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
