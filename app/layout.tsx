import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Editorial display serif (Domaine/Tiempos-class substitute). Optical sizing
// engaged for headline contrast; italics kept for in-prose emphasis.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

// Technical voice for eyebrows, metadata, and numerals.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "IEEE MIT Bengaluru",
    template: "%s | IEEE MIT Bengaluru",
  },
  description:
    "IEEE MIT Bengaluru — the epicenter for all IEEE Manipal Institute of Technology Bengaluru events, societies, articles, and activities.",
  icons: { icon: "/ieee.svg" },
  openGraph: {
    title: "IEEE MIT Bengaluru",
    description:
      "The epicenter for all IEEE MIT Bengaluru events, societies, and activities.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060605",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        {/* Vercel Web Analytics — no-ops outside Vercel, so local dev and any
            other host are unaffected. Page views only; no cookies, no PII. */}
        <Analytics />
      </body>
    </html>
  );
}
