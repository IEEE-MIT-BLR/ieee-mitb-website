import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  const external = [
    { name: "LinkedIn", href: siteConfig.socials.linkedin },
    { name: "Instagram", href: siteConfig.socials.instagram },
    { name: "WhatsApp", href: siteConfig.socials.whatsapp },
    { name: "Email", href: `mailto:${siteConfig.email}` },
  ];

  return (
    <footer className="mt-24 border-t border-(--line) bg-(--canvas-deep)">
      <div className="mx-auto max-w-6xl px-6">
        {/* Sign-off line */}
        <div className="border-b border-(--line) py-16">
          <p className="eyebrow">IEEE Student Branch · MIT Bengaluru</p>
          <h2 className="mt-6 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">
            Advancing technology
            <br />
            for <span className="italic text-(--accent)">humanity</span>.
          </h2>
          <Link href="/membership" className="btn-primary mt-8">
            Become a member
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="kicker">Index</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-(--muted) transition-colors hover:text-(--ink)"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/societies"
                  className="text-(--muted) transition-colors hover:text-(--ink)"
                >
                  Societies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="kicker">Connect</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {external.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-(--muted) transition-colors hover:text-(--ink)"
                  >
                    {s.name}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.75}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <p className="kicker">Find us</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-(--muted)">
              {siteConfig.address}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="link mt-3 inline-block text-sm"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col gap-3 border-t border-(--line) py-7 font-mono text-xs tracking-wide text-(--faint) sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
