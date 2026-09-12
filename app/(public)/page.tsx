import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GalleryScroll from "@/components/public/gallery-scroll";
import GlobeHero from "@/components/public/globe-hero";
import Intro from "@/components/public/intro";
import Marquee from "@/components/public/marquee";
import Reveal from "@/components/public/reveal";
import { Container, SectionHeading } from "@/components/public/section";
import EventCard from "@/components/public/event-card";
import HeroScroll from "@/components/ui/hero-scroll-animation";
import { TextMarquee } from "@/components/ui/text-marquee";
import { countPublishedEvents, getUpcomingEvents } from "@/lib/data/events";
import { listSocieties } from "@/lib/data/societies";
import { listCurrentTeam } from "@/lib/data/team";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

export default async function HomePage() {
  const [societies, team, upcoming, eventCount] = await Promise.all([
    listSocieties(),
    listCurrentTeam(),
    getUpcomingEvents(3),
    countPublishedEvents(),
  ]);

  // "Societies" means chapters proper. Women in Engineering is an affinity
  // group, so it is left out of the home page listing and marquee; it still
  // appears on /societies under its own "Affinity groups" heading.
  const chapters = societies.filter((s) => s.type === "society");
  const societyCount = chapters.length;

  const stats = [
    { value: String(societies.length), label: "Societies & groups" },
    { value: `${eventCount}+`, label: "Events & workshops" },
    { value: "400K+", label: "IEEE members worldwide" },
    { value: "160+", label: "Countries" },
  ];

  return (
    <div className="relative">
      <Intro />

      {/* ─── Globe hero ───────────────────────────────────────── */}
      <GlobeHero />

      {/* ─── Scroll story: IEEE × MIT Bengaluru ───────────────── */}
      <HeroScroll societyCount={societyCount} />

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-(--line) bg-(--canvas-deep)">
        <Container>
          <div className="grid grid-cols-2 divide-(--line) md:grid-cols-4 md:divide-x">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-2 py-10 ${i < 2 ? "border-b border-(--line) md:border-b-0" : ""}`}
              >
                <div className="font-display text-5xl text-(--ink) md:text-6xl">
                  {s.value}
                </div>
                <div className="kicker mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Vertical word marquee ────────────────────────────── */}
      <section className="border-b border-(--line) py-14">
        <Container>
          <TextMarquee
            height={120}
            speed={0.9}
            prefix={
              <span className="font-display text-3xl text-(--muted) sm:text-4xl">
                Built for&nbsp;
              </span>
            }
            className="font-display text-3xl text-(--accent) sm:text-4xl"
          >
            <span>innovators.</span>
            <span>builders.</span>
            <span>researchers.</span>
            <span>engineers.</span>
            <span>makers.</span>
          </TextMarquee>
        </Container>
      </section>

      {/* ─── Society marquee ──────────────────────────────────── */}
      {chapters.length > 0 && (
        <section className="border-b border-(--line) py-10">
          <Marquee items={chapters.map((s) => s.name)} />
        </section>
      )}

      {/* ─── Societies index ──────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Explore" title="Our societies" />
              <Link href="/societies" className="link text-sm">
                View all societies
              </Link>
            </div>
            <ul className="mt-12 border-t border-(--line)">
              {chapters.map((s, i) => (
                <li key={s.id}>
                  <Link
                    href={`/societies/${s.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b border-(--line) py-6 transition-colors hover:bg-(--canvas-deep) sm:gap-8"
                  >
                    <span className="font-mono text-xs text-(--faint)">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xl text-(--ink) transition-colors group-hover:text-(--accent) sm:text-2xl">
                        {s.name}
                      </span>
                      {(s.tagline ?? s.about) && (
                        <span className="mt-1 line-clamp-1 block text-sm text-(--muted)">
                          {s.tagline ?? s.about}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="text-(--faint) transition-all group-hover:translate-x-1 group-hover:text-(--accent)"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ─── Upcoming events ──────────────────────────────────── */}
      <section className="border-t border-(--line) py-24 md:py-32">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Mark your calendar"
                title="Upcoming events"
              />
              <Link href="/events" className="link text-sm">
                All events
              </Link>
            </div>
            {upcoming.length > 0 ? (
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} isUpcoming />
                ))}
              </div>
            ) : (
              <p className="mt-8 text-(--muted)">
                No upcoming events right now — check back soon.
              </p>
            )}
          </Reveal>
        </Container>
      </section>

      {/* ─── Team ─────────────────────────────────────────────── */}
      {team.length > 0 && (
        <section className="border-t border-(--line) py-24 md:py-32">
          <Container>
            <Reveal>
              <SectionHeading eyebrow="Leadership" title="Meet the team" />
              <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
                {team.map((m) => (
                  <div key={m.id}>
                    <div className="aspect-[4/5] w-full overflow-hidden border border-(--line) bg-(--canvas-deep)">
                      {m.photoUrl ? (
                        <Image
                          src={m.photoUrl}
                          alt={m.name}
                          width={300}
                          height={375}
                          className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-display text-3xl text-(--faint)">
                          {initials(m.name)}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 text-base leading-tight">{m.name}</h3>
                    <p className="font-mono text-xs text-(--muted)">
                      {m.position}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ─── Gallery showcase ─────────────────────────────────── */}
      <GalleryScroll societyCount={societyCount} />
    </div>
  );
}
