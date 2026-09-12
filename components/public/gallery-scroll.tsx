"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  BentoCell,
  BentoGrid,
  ContainerScale,
  ContainerScroll,
} from "@/components/ui/hero-gallery-scroll-animation";

// Engineering / research / event imagery (Unsplash, known-stable IDs).
const IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
];

export default function GalleryScroll({
  societyCount,
}: {
  societyCount: number;
}) {
  return (
    <ContainerScroll className="h-[300vh]">
      <BentoGrid className="sticky top-0 left-0 z-0 h-screen w-full p-4">
        {IMAGES.map((url, i) => (
          <BentoCell
            key={i}
            className="overflow-hidden rounded-[4px] border border-(--line)"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="size-full object-cover object-center grayscale-[0.25]"
              src={url}
              alt=""
            />
          </BentoCell>
        ))}
      </BentoGrid>

      <ContainerScale className="relative z-10 px-6 text-center">
        <p className="eyebrow justify-center">Glimpses</p>
        <h2 className="mt-5 text-5xl tracking-tight sm:text-7xl">
          From the <span className="italic text-(--accent)">branch</span>
        </h2>
        <p className="mx-auto my-6 max-w-xl text-(--ink-2)">
          Workshops, builds, and competitions across our {societyCount}{" "}
          societies — a year of advancing technology, together.
        </p>
        <div className="flex items-center justify-center">
          <Link href="/events" className="btn-primary">
            Explore events
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </ContainerScale>
    </ContainerScroll>
  );
}
