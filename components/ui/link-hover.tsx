"use client";

/**
 * Link hover effect with GSAP — hovering a menu item flings a preview image
 * into the frame. Integrated from the provided component (@codegrid, MIT) and
 * extended: items take an `href` (rendered as a Next link) and an optional
 * `onNavigate` callback so it can drive the fullscreen navbar. Colours use the
 * dark-premium tokens via the shadcn `foreground`/`muted-foreground` mapping.
 */
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export type LinkHoverItem = {
  imgUrl: string;
  title: string;
  href: string;
};

const DefaultItems: LinkHoverItem[] = [
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

export default function ImageHover({
  items = DefaultItems,
  onNavigate,
}: {
  items?: LinkHoverItem[];
  onNavigate?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const previewContainer = previewContainerRef.current;
      if (!previewContainer) return;
      const menuLinkItems =
        sectionRef.current.querySelectorAll(".menu-link-item");

      let lastHoveredIndex: number | null = null;

      const handleMouseOver = (index: number) => {
        const data = items[index];
        if (!data || index === lastHoveredIndex) return;
        lastHoveredIndex = index;

        // Full-frame overlay that slides up over whatever is currently shown.
        const layer = document.createElement("div");
        layer.className = "temp-image absolute inset-0 overflow-hidden";
        const img = document.createElement("img");
        img.src = data.imgUrl;
        img.alt = "";
        img.className = "h-full w-full object-cover";
        layer.appendChild(img);
        previewContainer.appendChild(layer);

        gsap.fromTo(
          layer,
          { yPercent: 116, rotate: 6, opacity: 0.5 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            onComplete: () => {
              // Collapse the stack: keep only the newest layer.
              const all = previewContainer.querySelectorAll(".temp-image");
              all.forEach((c, i) => {
                if (i < all.length - 1) c.remove();
              });
            },
          },
        );
      };

      const cleanups: Array<() => void> = [];
      menuLinkItems.forEach((item, index) => {
        const fn = () => handleMouseOver(index);
        item.addEventListener("mouseover", fn);
        cleanups.push(() => item.removeEventListener("mouseover", fn));
      });

      return () => cleanups.forEach((c) => c());
    },
    { scope: sectionRef, dependencies: [items] },
  );

  return (
    <section
      ref={sectionRef}
      className="flex h-full w-full items-center justify-between gap-16 px-8 py-16 max-md:flex-col max-md:items-start max-md:justify-center max-md:gap-8 sm:px-16 lg:px-24"
    >
      <div className="flex-1">
        <ul className="flex flex-col gap-5 font-display text-6xl leading-[1.05] text-(--muted) max-md:gap-3 max-md:text-4xl [&>li:hover]:text-(--accent) [&>li]:transition-colors [&>li]:duration-300">
          {items.map(({ title, href }) => (
            <li key={title} className="menu-link-item w-fit">
              <Link href={href} onClick={onNavigate} className="block">
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={previewContainerRef}
        className="relative aspect-[3/4] w-[19rem] shrink-0 overflow-hidden border border-(--line) max-md:hidden"
      >
        {/* Base layer — shown before any hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={items[0]?.imgUrl ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
          alt=""
        />
      </div>
    </section>
  );
}
