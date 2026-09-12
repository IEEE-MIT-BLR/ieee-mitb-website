"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { ArticleListItem } from "@/lib/data/articles";
import { formatDate, safeUrl } from "@/lib/utils";

export default function ArticleCard({ article }: { article: ArticleListItem }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const byline = [
    article.author ? `By ${article.author}` : null,
    article.publication,
  ]
    .filter(Boolean)
    .join(" · ");

  const img = safeUrl(article.imageUrl);
  const ext = safeUrl(article.externalUrl);

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="card-surface focus-ring group flex cursor-pointer flex-col overflow-hidden"
      >
        {img && (
          <div className="relative aspect-[16/10] overflow-hidden border-b border-(--line)">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={article.title}
              className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          {article.societyName && (
            <span className="kicker truncate">{article.societyName}</span>
          )}
          <h3 className="mt-3 line-clamp-2 text-xl leading-snug text-(--ink) transition-colors group-hover:text-(--accent)">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-(--muted)">
              {article.excerpt}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 font-mono text-xs text-(--faint)">
            {byline && <span>{byline}</span>}
            {article.publicationDate && (
              <span>{formatDate(article.publicationDate)}</span>
            )}
          </div>
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <div
            className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-auto border border-(--line-strong) bg-(--surface) p-8 text-(--ink)"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {article.societyName && (
                  <p className="kicker">{article.societyName}</p>
                )}
                <h2 className="mt-3 text-2xl sm:text-3xl">{article.title}</h2>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="text-(--faint) transition-colors hover:text-(--ink)"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            {img && (
              <div className="mt-6 aspect-[16/9] w-full overflow-hidden border border-(--line)">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="mt-6 leading-relaxed whitespace-pre-line text-(--ink-2)">
              {article.excerpt}
            </div>
            {byline && (
              <p className="mt-4 font-mono text-xs text-(--faint)">{byline}</p>
            )}
            {ext && (
              <div className="mt-8">
                <a
                  href={ext}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Read full article
                  <ArrowUpRight size={16} strokeWidth={1.75} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
