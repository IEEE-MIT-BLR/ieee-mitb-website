import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Globe from "@/components/ui/globe";

/**
 * Home hero — the spinning globe is the conjunction between "IEEE" and
 * "MITBLR". The two words flank the planet and tuck their inner edges just
 * behind its rim (globe on z-20, words on z-10), so the wordmark stays fully
 * legible while still reading as wrapping around the earth.
 */
export default function GlobeHero() {
  const word =
    "font-display leading-none tracking-tight text-(--ink) text-[clamp(2.75rem,11vw,8.5rem)]";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="grid-texture absolute inset-0" />
      <div className="glow-orange absolute inset-0" />

      {/* Wordmark flanking the globe */}
      <div className="relative flex flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:gap-0">
        <span className="relative z-10 sm:-mr-[0.32em] sm:text-right">
          <span className={word}>IEEE</span>
        </span>

        <div className="relative z-20 shrink-0 scale-[0.7] drop-shadow-[0_0_70px_rgba(255,106,26,0.3)] sm:scale-90 lg:scale-100">
          <Globe />
        </div>

        <span className="relative z-10 sm:-ml-[0.32em]">
          <span className={word}>MITBLR</span>
        </span>
      </div>

      {/* Foreground copy + CTA */}
      <div className="absolute right-0 bottom-12 left-0 z-30 mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <p className="max-w-xl text-base leading-relaxed text-(--ink-2) sm:text-lg">
          The IEEE Student Branch at Manipal Institute of Technology, Bengaluru
          — advancing technology for humanity.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/membership" className="btn-primary">
            Become a member
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </Link>
          <Link href="/events" className="btn-ghost">
            Explore events
          </Link>
        </div>
        <span className="kicker mt-2 animate-pulse">Scroll</span>
      </div>
    </section>
  );
}
