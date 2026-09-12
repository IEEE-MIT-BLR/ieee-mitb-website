import type { Metadata } from "next";
import ContentFilters from "@/components/public/content-filters";
import EventCard from "@/components/public/event-card";
import Pagination from "@/components/public/pagination";
import { listEvents, type EventListItem } from "@/lib/data/events";
import { listSocieties } from "@/lib/data/societies";
import {
  eventsQuerySchema,
  flattenSearchParams,
} from "@/lib/validations/common";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming and past technology events, workshops, and conferences hosted by IEEE MIT Bengaluru societies.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function EventGrid({
  events,
  isUpcoming,
}: {
  events: EventListItem[];
  isUpcoming: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isUpcoming={isUpcoming} />
      ))}
    </div>
  );
}

function GroupHeading({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between border-b border-(--line) pb-4">
      <h3 className="text-2xl sm:text-3xl">{children}</h3>
      <span className="kicker">{kicker}</span>
    </div>
  );
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const parsed = eventsQuerySchema.safeParse(flattenSearchParams(sp));
  const q = parsed.success ? parsed.data : eventsQuerySchema.parse({});

  const societies = await listSocieties();
  const societyOptions = societies.map((s) => ({ slug: s.slug, name: s.name }));

  // For "all", show every upcoming event plus a paginated list of past events.
  const upcoming =
    q.scope === "all" || q.scope === "upcoming"
      ? await listEvents("upcoming", {
          ...q,
          ...(q.scope === "all" ? { page: 1, pageSize: 50 } : {}),
        })
      : null;
  const past =
    q.scope === "all" || q.scope === "past"
      ? await listEvents("past", q)
      : null;

  const total = (upcoming?.total ?? 0) + (past?.total ?? 0);
  const empty =
    (upcoming?.rows.length ?? 0) === 0 && (past?.rows.length ?? 0) === 0;

  return (
    <div className="min-h-screen">
      <section className="border-b border-(--line) pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="eyebrow">Mark your calendar</span>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
            Events
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--muted)">
            Cutting-edge technology events, workshops, and conferences hosted by
            IEEE MIT Bengaluru societies.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-6xl px-6">
        <ContentFilters societies={societyOptions} showScope />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mt-8 mb-10 font-mono text-xs tracking-wide text-(--faint)">
          {total > 0
            ? `${total} event${total === 1 ? "" : "s"} found`
            : "Nothing scheduled yet — check back soon."}
        </p>

        {empty ? (
          <div className="border-y border-(--line) py-20 text-center">
            <h3 className="text-xl">No events found</h3>
            <p className="mt-2 text-(--muted)">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {upcoming && upcoming.rows.length > 0 && (
              <div>
                <GroupHeading kicker="Upcoming">Upcoming events</GroupHeading>
                <EventGrid events={upcoming.rows} isUpcoming />
                {q.scope === "upcoming" && (
                  <div className="mt-12">
                    <Pagination
                      totalPages={upcoming.totalPages}
                      currentPage={upcoming.page}
                    />
                  </div>
                )}
              </div>
            )}

            {past && past.rows.length > 0 && (
              <div>
                <GroupHeading kicker="Archive">Past events</GroupHeading>
                <EventGrid events={past.rows} isUpcoming={false} />
                <div className="mt-12">
                  <Pagination
                    totalPages={past.totalPages}
                    currentPage={past.page}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
