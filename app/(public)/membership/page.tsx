import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join IEEE — the world's largest technical professional organization dedicated to advancing technology for humanity.",
};

const benefits = [
  {
    title: "Global network",
    body: "Connect with over 400,000 members in more than 160 countries.",
  },
  {
    title: "Professional development",
    body: "Conferences, workshops, webinars, and continuing-education resources.",
  },
  {
    title: "Technical resources",
    body: "Free or discounted access to IEEE Xplore, journals, magazines, and standards.",
  },
  {
    title: "Career opportunities",
    body: "Job boards, mentoring, leadership roles, and volunteering.",
  },
  {
    title: "Member discounts",
    body: "Reduced rates for conferences, publications, and insurance programs.",
  },
  {
    title: "Local activities",
    body: "Participate in local IEEE sections, student branches, and technical societies.",
  },
];

const types = [
  ["Student member", "For undergraduate students."],
  ["Graduate student member", "For those pursuing graduate studies."],
  ["Professional member", "For working professionals in technology fields."],
  [
    "Society membership",
    "Join one or more of IEEE's 39 technical societies for specialised resources.",
  ],
];

const steps = [
  "Visit the official IEEE membership portal.",
  "Create an IEEE account, or log in if you already have one.",
  "Choose your membership type and complete the application.",
  "Pay the membership fee online.",
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-(--line) pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="eyebrow">Join IEEE</span>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[1.02] md:text-7xl">
            The world&apos;s largest technical professional organisation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-(--muted)">
            IEEE is dedicated to advancing technology for the benefit of
            humanity. Membership opens doors to a global community of engineers,
            technologists, and innovators.
          </p>
          <a
            href="https://www.ieee.org/membership/join/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8"
          >
            Join IEEE now
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </a>
        </div>
      </section>

      {/* Why join */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="eyebrow">Why join</span>
            </div>
            <div className="md:col-span-8">
              <div className="grid gap-px border border-(--line) bg-(--line) sm:grid-cols-2">
                {benefits.map((b) => (
                  <div key={b.title} className="bg-(--canvas) p-6">
                    <h3 className="text-lg">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-(--muted)">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership types */}
      <section className="border-t border-(--line) bg-(--canvas-deep) py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="eyebrow">Membership types</span>
            </div>
            <ul className="border-t border-(--line) md:col-span-8">
              {types.map(([title, body]) => (
                <li
                  key={title}
                  className="flex flex-col gap-1 border-b border-(--line) py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="text-lg text-(--ink) sm:w-2/5">{title}</span>
                  <span className="text-sm leading-relaxed text-(--muted) sm:w-3/5">
                    {body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="eyebrow">How to join</span>
            </div>
            <ol className="border-t border-(--line) md:col-span-8">
              {steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-5 border-b border-(--line) py-5"
                >
                  <span className="font-mono text-xs text-(--faint)">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-(--ink-2)">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-(--muted) md:pl-[33.333%]">
            <span>For more information, visit the</span>
            <a
              href="https://www.ieee.org/membership/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              IEEE Membership page
            </a>
            <span>.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
