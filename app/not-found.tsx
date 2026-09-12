import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl text-(--ink) sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl">Page not found</h1>
      <p className="mt-3 max-w-md text-(--muted)">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
        <ArrowUpRight size={16} strokeWidth={1.75} />
      </Link>
    </div>
  );
}
