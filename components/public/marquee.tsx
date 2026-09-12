import { Fragment, type ReactNode } from "react";

/**
 * Editorial ticker — a single horizontal rule of items that scrolls at a
 * constant pace and pauses on hover. The track holds two identical copies so
 * a -50% translate loops seamlessly. Motion is stripped under
 * `prefers-reduced-motion` (handled in globals.css), leaving a static row.
 *
 * Motion pattern borrowed from React Bits' marquee, hand-built to stay on the
 * hairline/serif vocabulary rather than importing a generic component.
 */
export default function Marquee({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  // Two copies: the first is read, the second is decorative (-50% loop point).
  const copies = [
    { items, hidden: false },
    { items, hidden: true },
  ];

  return (
    <div className={`marquee font-display ${className ?? ""}`}>
      <div className="marquee__track">
        {copies.map((copy, c) => (
          <div
            key={c}
            className="flex shrink-0 items-center"
            aria-hidden={copy.hidden || undefined}
          >
            {copy.items.map((item, i) => (
              <Fragment key={i}>
                <span className="px-8 text-2xl text-(--ink) sm:px-12 sm:text-3xl">
                  {item}
                </span>
                <span className="text-(--accent)">/</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
