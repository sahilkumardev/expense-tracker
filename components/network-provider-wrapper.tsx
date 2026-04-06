"use client";

import { useNetwork } from "@/hooks/use-network";

export function NetworkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetwork();

  if (!isOnline) {
    return (
      <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl sm:h-80 sm:w-80" />

        <div className="relative w-full max-w-xl rounded-3xl border border-border/70 bg-card/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            Offline Mode
          </div>

          <div className="mt-5 space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              No Internet Connection
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              You are currently offline. Reconnect to sync your latest expenses
              and continue where you left off.
            </p>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/70 p-3">
              Check Wi-Fi or mobile data
            </div>
            <div className="rounded-xl border border-border/70 bg-background/70 p-3">
              Disable VPN or proxy temporarily
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl bg-foreground px-4 text-sm font-medium text-background transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
}
