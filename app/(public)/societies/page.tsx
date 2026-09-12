import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listSocieties } from "@/lib/data/societies";

export const metadata: Metadata = {
  title: "Societies",
  description:
    "Explore the diverse technical societies and affinity groups at IEEE MIT Bengaluru.",
};

function SocietyRow({
  index,
  name,
  about,
  slug,
}: {
  index: string;
  name: string;
  about: string | null;
  slug: string;
}) {
  return (
    <li>
      <Link
        href={`/societies/${slug}`}
        className="group grid grid-cols-[auto_1fr] items-start gap-5 border-b border-(--line) py-7 transition-colors hover:bg-(--canvas-deep) sm:grid-cols-[auto_1fr_auto] sm:gap-8"
      >
        <span className="pt-1.5 font-mono text-xs text-(--faint)">{index}</span>
        <div className="min-w-0">
          <h2 className="text-2xl text-(--ink) transition-colors group-hover:text-(--accent) sm:text-3xl">
            {name}
          </h2>
          {about && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-(--muted)">
              {about}
            </p>
          )}
        </div>
        <ArrowUpRight
          size={20}
          strokeWidth={1.5}
          className="col-start-2 row-start-1 justify-self-end text-(--faint) transition-all group-hover:translate-x-1 group-hover:text-(--ink) sm:col-start-3"
        />
      </Link>
    </li>
  );
}

export default async function SocietiesPage() {
  const societies = await listSocieties();
  const proper = societies.filter((s) => s.type === "society");
  const affinities = societies.filter((s) => s.type === "affinity");

  return (
    <div className="min-h-screen">
      <section className="border-b border-(--line) pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="eyebrow">Chapters & groups</span>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
            Societies
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--muted)">
            Each society offers a distinct path through modern engineering —
            learning, networking, and professional growth across the breadth of
            the field.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ul className="border-t border-(--line)">
          {proper.map((soc, idx) => (
            <SocietyRow
              key={soc.id}
              index={String(idx + 1).padStart(2, "0")}
              name={soc.name}
              about={soc.tagline ?? soc.about}
              slug={soc.slug}
            />
          ))}
        </ul>

        {affinities.length > 0 && (
          <>
            <h2 className="mt-20 mb-2 text-2xl sm:text-3xl">Affinity groups</h2>
            <ul className="border-t border-(--line)">
              {affinities.map((soc) => (
                <SocietyRow
                  key={soc.id}
                  index="—"
                  name={soc.name}
                  about={soc.tagline ?? soc.about}
                  slug={soc.slug}
                />
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
