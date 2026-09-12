"use client";

// Scroll-driven two-panel reveal. Integrated from the provided component;
// the scroll mechanics (sticky panels that scale + counter-rotate against
// scroll progress) are kept, while copy/imagery are rewritten for IEEE × MIT
// Bengaluru and recoloured to the dark-premium / orange system (no emoji, no
// filler, no giant footer — it composes into the page below it).

import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import React, { useRef, forwardRef } from "react";

const GRID =
  "absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop",
    alt: "Earth from orbit",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop",
    alt: "Circuit board macro",
  },
  {
    src: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=900&auto=format&fit=crop",
    alt: "Microelectronics",
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=900&auto=format&fit=crop",
    alt: "Engineering workstation",
  },
];

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

/** Section 2 also names how many societies the branch runs. */
interface Section2Props extends SectionProps {
  societyCount: number;
}

const Section1: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  return (
    <motion.section
      style={{ scale, rotate }}
      className="sticky top-0 flex h-screen flex-col items-center justify-center bg-(--canvas-deep) text-(--ink)"
    >
      <div className={GRID} />
      <div className="relative px-8 text-center">
        <p className="eyebrow justify-center">Who we are</p>
        <h1 className="mt-6 text-5xl leading-[1.05] tracking-tight sm:text-6xl 2xl:text-7xl">
          Advancing technology
          <br />
          for <span className="italic text-(--accent)">humanity</span>,
          <br />
          from Bengaluru.
        </h1>
      </div>
    </motion.section>
  );
};

const Section2: React.FC<Section2Props> = ({
  scrollYProgress,
  societyCount,
}) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className="relative h-screen overflow-hidden bg-background text-(--ink)"
    >
      <div className={GRID} />
      <article className="relative z-10 container mx-auto px-6">
        <p className="eyebrow py-8">IEEE · MIT Bengaluru</p>
        <h2 className="max-w-4xl pb-10 text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          A student branch of IEEE at{" "}
          <span className="text-(--accent)">
            Manipal Institute of Technology, Bengaluru
          </span>{" "}
          — {societyCount} societies, one charter.
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {IMAGES.map((img) => (
            <div
              key={img.src}
              className="overflow-hidden rounded-md border border-(--line)"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </article>
    </motion.section>
  );
};

const HeroScroll = forwardRef<HTMLElement, { societyCount: number }>(
  ({ societyCount }, _ref) => {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ["start start", "end end"],
    });

    return (
      <main ref={container} className="relative h-[200vh] bg-background">
        <Section1 scrollYProgress={scrollYProgress} />
        <Section2
          scrollYProgress={scrollYProgress}
          societyCount={societyCount}
        />
      </main>
    );
  },
);

HeroScroll.displayName = "HeroScroll";

export default HeroScroll;
