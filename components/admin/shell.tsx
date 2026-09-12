"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  FileText,
  Home,
  Inbox,
  Megaphone,
  Menu,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/societies", label: "Societies", icon: UsersRound },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href, item.exact)
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-[var(--line)] p-4 md:hidden">
        <Link href="/admin" className="font-display text-lg">
          IEEE <span className="text-[var(--accent)]">Admin</span>
        </Link>
        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[var(--line)] bg-[var(--canvas-deep)] p-4 transition-transform md:static md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="mb-8 hidden md:block">
            <Link
              href="/admin"
              className="font-display text-lg text-[var(--ink)]"
            >
              IEEE <span className="text-[var(--accent)]">×</span> Admin
            </Link>
          </div>
          {nav}
          <div className="mt-8 border-t border-[var(--line)] pt-4">
            <p className="mb-2 truncate px-3 text-xs text-[var(--faint)]">
              {email}
            </p>
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
            >
              View site ↗
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
