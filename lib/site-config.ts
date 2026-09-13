/**
 * Single source of truth for organisation-level site metadata that was
 * previously hardcoded across Navbar/Footer. Plain module — safe to import in
 * both Server and Client Components.
 */
export const siteConfig = {
  name: "IEEE MIT Bengaluru",
  shortName: "IEEE MITB",
  description:
    "The epicenter for all IEEE MIT Bengaluru events, societies, articles, and activities.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  address: "BSF Campus, Yelahanka Airforce Base, Bengaluru 560064",
  /**
   * The branch's official contact address — the single mailbox used for the
   * public site, the Supabase account and admin access. Change it here and it
   * updates the navbar and footer together.
   */
  email: "ieee.mitblr@manipal.edu",
  logo: "/logo.png",
  favicon: "/ieee.svg",
  socials: {
    linkedin: "https://www.linkedin.com/company/ieee-mit-bangalore/",
    instagram: "https://instagram.com/ieee.mitb",
    /** Public join link for the branch community group. */
    whatsapp: "https://chat.whatsapp.com/G4ObpTcWYVlC1Vba2UTHWb",
  },
  /** Primary navigation shown in the navbar. */
  nav: [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Societies", href: "/societies" },
    { name: "Membership", href: "/membership" },
    { name: "Articles", href: "/articles" },
  ],
  /** Footer quick links. */
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Articles", href: "/articles" },
    { name: "Membership", href: "/membership" },
  ],
  credit: {
    name: "Aditya Sinha",
    url: "https://linkedin.com/in/adityasinha2006/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
