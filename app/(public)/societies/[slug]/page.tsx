import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { SocietyMember } from "@/db/schema";
import { getSocietyBySlug } from "@/lib/data/societies";
import { safeUrl } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSocietyBySlug(slug);
  if (!data) return { title: "Society not found" };
  return {
    title: data.society.name,
    description:
      data.society.tagline ?? (data.society.about.slice(0, 160) || undefined),
  };
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function MemberTile({ member }: { member: SocietyMember }) {
  return (
    <div className="group">
      <div className="aspect-[4/5] w-full overflow-hidden border border-(--line) bg-(--canvas-deep)">
        {member.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={safeUrl(member.photoUrl)}
            alt={member.name}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-(--faint)">
            {initials(member.name)}
          </div>
        )}
      </div>
      <h4 className="mt-3 text-base leading-tight">{member.name}</h4>
      {member.roleTitle && (
        <p className="font-mono text-xs text-(--muted)">{member.roleTitle}</p>
      )}
      {(member.email || member.linkedin) && (
        <div className="mt-1.5 flex gap-3 text-xs">
          {member.email && (
            <a href={`mailto:${member.email}`} className="link">
              Email
            </a>
          )}
          {member.linkedin && (
            <a
              href={safeUrl(member.linkedin)}
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default async function SocietyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getSocietyBySlug(slug);
  if (!data) notFound();

  const { society, students, faculty } = data;

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-(--line) pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="eyebrow">
            {society.type === "affinity"
              ? "Affinity group"
              : "Technical society"}
          </span>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-(--line) bg-(--surface)">
              {society.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={safeUrl(society.logoUrl)}
                  alt={`${society.name} logo`}
                  className="h-20 w-20 object-contain"
                />
              ) : (
                <span className="font-display text-2xl text-(--faint)">
                  {initials(society.name)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-4xl leading-[1.05] md:text-6xl">
                {society.name}
              </h1>
              {society.tagline && (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--muted)">
                  {society.tagline}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/events?society=${society.slug}`}
                  className="btn-primary"
                >
                  View events
                  <ArrowUpRight size={16} strokeWidth={1.75} />
                </Link>
                <a href="#about" className="btn-ghost">
                  About
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="eyebrow">
                About the {society.type === "affinity" ? "group" : "society"}
              </span>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed whitespace-pre-line text-(--ink-2) md:col-span-8">
              {society.about || "More details coming soon."}
            </p>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="border-t border-(--line) py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-baseline justify-between border-b border-(--line) pb-4">
            <h3 className="text-2xl sm:text-3xl">Core members</h3>
            <span className="kicker">{students.length} people</span>
          </div>
          {students.length === 0 ? (
            <p className="mt-8 text-(--muted)">No members added yet.</p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
              {students.map((s) => (
                <MemberTile key={s.id} member={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Faculty */}
      {faculty.length > 0 && (
        <section className="border-t border-(--line) bg-(--canvas-deep) py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h3 className="border-b border-(--line) pb-4 text-2xl sm:text-3xl">
              Faculty advisors
            </h3>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              {faculty.map((f) => (
                <div key={f.id} className="border-t border-(--line) pt-5">
                  <h4 className="text-lg">{f.name}</h4>
                  {f.roleTitle && (
                    <p className="font-mono text-xs text-(--muted)">
                      {f.roleTitle}
                    </p>
                  )}
                  <div className="mt-2 flex gap-3 text-sm">
                    {f.email && (
                      <a href={`mailto:${f.email}`} className="link">
                        Email
                      </a>
                    )}
                    {f.linkedin && (
                      <a
                        href={safeUrl(f.linkedin)}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {(society.email || society.instagram || society.linkedin) && (
        <section className="border-t border-(--line) py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <span className="eyebrow">Get in touch</span>
              </div>
              <dl className="space-y-4 md:col-span-8">
                {society.email && (
                  <div className="flex flex-col gap-1 border-b border-(--line) pb-4 sm:flex-row sm:justify-between">
                    <dt className="kicker">Email</dt>
                    <dd>
                      <a href={`mailto:${society.email}`} className="link">
                        {society.email}
                      </a>
                    </dd>
                  </div>
                )}
                {society.instagram && (
                  <div className="flex flex-col gap-1 border-b border-(--line) pb-4 sm:flex-row sm:justify-between">
                    <dt className="kicker">Instagram</dt>
                    <dd>
                      <a
                        href={safeUrl(society.instagram)}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        {society.instagram}
                      </a>
                    </dd>
                  </div>
                )}
                {society.linkedin && (
                  <div className="flex flex-col gap-1 border-b border-(--line) pb-4 sm:flex-row sm:justify-between">
                    <dt className="kicker">LinkedIn</dt>
                    <dd>
                      <a
                        href={safeUrl(society.linkedin)}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        {society.linkedin}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
