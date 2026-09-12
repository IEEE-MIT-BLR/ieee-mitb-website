"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Root error boundary for the App Router. Client component (required by Next.js
 * for error boundaries). Logs the error and offers a recovery action.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd forward to an error reporter.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="kicker">Error</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-(--muted)">
        An unexpected error occurred. You can try again, or head back to the
        home page.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-ghost">
          Go home
        </Link>
      </div>
    </div>
  );
}
