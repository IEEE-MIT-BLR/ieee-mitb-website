import type { Metadata } from "next";
import ArticleCard from "@/components/public/article-card";
import ContentFilters from "@/components/public/content-filters";
import Pagination from "@/components/public/pagination";
import { listArticles } from "@/lib/data/articles";
import { listSocieties } from "@/lib/data/societies";
import { flattenSearchParams, listQuerySchema } from "@/lib/validations/common";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Explore research, publications, and insights shared by IEEE MIT Bengaluru societies.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const parsed = listQuerySchema.safeParse(flattenSearchParams(sp));
  const q = parsed.success ? parsed.data : listQuerySchema.parse({});

  const [societies, result] = await Promise.all([
    listSocieties(),
    listArticles(q),
  ]);
  const societyOptions = societies.map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <div className="min-h-screen">
      <section className="border-b border-(--line) pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="eyebrow">Writing & research</span>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
            Articles
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--muted)">
            Research, publications, and insights shared by IEEE MIT Bengaluru
            societies and members.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-6xl px-6">
        <ContentFilters societies={societyOptions} />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mt-8 mb-10 font-mono text-xs tracking-wide text-(--faint)">
          {result.total > 0
            ? `${result.total} article${result.total === 1 ? "" : "s"} found`
            : "No articles published yet."}
        </p>

        {result.rows.length === 0 ? (
          <div className="border-y border-(--line) py-20 text-center">
            <h3 className="text-xl">No articles found</h3>
            <p className="mt-2 text-(--muted)">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.rows.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-12">
              <Pagination
                totalPages={result.totalPages}
                currentPage={result.page}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
