"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ImageHover, { type LinkHoverItem } from "@/components/ui/link-hover";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export type NavSociety = {
  slug: string;
  name: string;
  type: "society" | "affinity";
};

const NAV_ITEMS: LinkHoverItem[] = [
  {
    title: "Home",
    href: "/",
    imgUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  },
  {
    title: "Events",
    href: "/events",
    imgUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
  },
  {
    title: "Societies",
    href: "/societies",
    imgUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  },
  {
    title: "Articles",
    href: "/articles",
    imgUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
  },
  {
    title: "Membership",
    href: "/membership",
    imgUrl:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80",
  },
];

const EASE = [0.2, 0, 0, 1] as const;

export default function Navbar({ societies }: { societies: NavSociety[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while the fullscreen menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[95]">
        <div
          className={cn(
            "border-b transition-colors duration-300",
            scrolled && !open
              ? "border-[var(--line)] bg-[var(--canvas)]/70 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <nav className="flex h-20 w-full items-center justify-between px-5 sm:px-7">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3.5 transition-opacity hover:opacity-80 sm:gap-4"
              aria-label="IEEE MIT Bengaluru — home"
            >
              <Image
                src="/ieee-mitb.png"
                alt="IEEE MITB"
                width={144}
                height={100}
                className="h-11 w-auto sm:h-12"
                priority
              />
              <span aria-hidden className="h-9 w-px bg-[var(--line-strong)]" />
              <Image
                src="/logo.png"
                alt="Manipal Institute of Technology, Bengaluru"
                width={261}
                height={87}
                className="h-7 w-auto opacity-90 sm:h-8"
                priority
              />
            </Link>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex items-center gap-3"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-[var(--ink)] uppercase">
                {open ? "Close" : "Menu"}
              </span>
              <span className="relative flex h-3 w-6 flex-col justify-between">
                <span
                  className={cn(
                    "h-px w-full bg-[var(--ink)] transition-transform duration-300",
                    open && "translate-y-[5.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-[var(--ink)] transition-transform duration-300",
                    open && "-translate-y-[5.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Fullscreen glass overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass-panel fixed inset-0 z-[90] flex flex-col"
          >
            <div className="grid-texture absolute inset-0 opacity-60" />
            <div className="relative flex flex-1 items-center pt-16">
              <ImageHover items={NAV_ITEMS} onNavigate={() => setOpen(false)} />
            </div>

            {/* Footer: society quick links + contact */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              className="relative border-t border-[var(--line)] px-6 py-8 sm:px-20"
            >
              <p className="kicker">Societies</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {societies.slice(0, 8).map((s) => (
                  <Link
                    key={s.slug}
                    href={`/societies/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
              <a
                href={`mailto:${siteConfig.email}`}
                className="link mt-6 inline-block text-sm"
              >
                {siteConfig.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
