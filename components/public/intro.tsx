"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Brand intro — "IEEE × MANIPAL" in black + orange, which morphs (an orange
 * disc swells from the centre like the globe emerging) and dissolves into the
 * homescreen. Plays once per session; skipped entirely under
 * `prefers-reduced-motion`. Renders nothing on the server to avoid a flash.
 */
const EASE = [0.2, 0, 0, 1] as const;

export default function Intro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("ieee-intro")) return;
    sessionStorage.setItem("ieee-intro", "1");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setShow(true));
    const t = setTimeout(() => setShow(false), 2900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--canvas)]"
        >
          {/* Morph disc — swells from globe-size to fill, then fades */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0.7, 22], opacity: [0, 0.55, 0] }}
            transition={{
              duration: 2.7,
              times: [0, 0.32, 1],
              ease: "easeInOut",
            }}
            className="absolute h-64 w-64 rounded-full bg-[var(--accent)] blur-2xl"
          />

          {/* Wordmark */}
          <div className="relative z-10 flex items-baseline gap-[0.2em] font-display text-[clamp(2.25rem,11vw,8rem)] leading-none tracking-tight text-[var(--ink)]">
            {[
              { t: "IEEE", c: "text-[var(--ink)]", d: 0.1 },
              { t: "×", c: "text-[var(--accent)]", d: 0.28 },
              { t: "MANIPAL", c: "text-[var(--ink)]", d: 0.42 },
            ].map((w) => (
              <span key={w.t} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: EASE, delay: w.d }}
                  className={`block ${w.c}`}
                >
                  {w.t}
                </motion.span>
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
