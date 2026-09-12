"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, X } from "lucide-react";
import type { EventListItem } from "@/lib/data/events";
import { formatDateTime, safeUrl } from "@/lib/utils";

export default function EventCard({
  event,
  isUpcoming,
}: {
  event: EventListItem;
  isUpcoming: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const society = event.societyName ?? "IEEE MIT Bengaluru";
  const img = safeUrl(event.imageUrl);
  const reg = safeUrl(event.registrationUrl);

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
              alt={event.title}
              className="h-full w-full object-cover grayscale-[0.15] transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="kicker truncate">{society}</span>
            {isUpcoming && (
              <span className="kicker shrink-0 text-(--accent)">Upcoming</span>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 text-xl leading-snug text-(--ink) transition-colors group-hover:text-(--accent)">
            {event.title}
          </h3>

          <p className="mt-2 font-mono text-xs text-(--muted)">
            {formatDateTime(event.startAt)}
          </p>

          {event.venue && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-(--muted)">
              <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
              {event.venue}
            </p>
          )}

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-(--muted)">
            {event.description}
          </p>
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
                <p className="kicker">{society}</p>
                <h2 className="mt-3 text-2xl sm:text-3xl">{event.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-(--muted)">
                  <span>{formatDateTime(event.startAt)}</span>
                  {event.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} strokeWidth={1.75} />
                      {event.venue}
                    </span>
                  )}
                </div>
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
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mt-6 leading-relaxed whitespace-pre-line text-(--ink-2)">
              {event.description}
            </div>

            {reg && (
              <div className="mt-8">
                <a
                  href={reg}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Register / more info
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
