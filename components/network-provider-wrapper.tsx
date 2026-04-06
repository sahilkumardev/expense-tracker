"use client";

import { useNetwork } from "@/hooks/use-network";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NetworkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetwork();

  if (!isOnline) {
    return (
      <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl sm:h-80 sm:w-80" />

        <Card className="max-w-xl gap-4">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              No Internet Connection
            </h2>

            <Badge
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 px-3 py-3 text-xs font-medium text-amber-700 dark:text-amber-400 gap-1.5"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Offline Mode
            </Badge>
          </div>

          <CardContent className="space-y-2">
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              You are currently offline. Reconnect to sync your latest expenses
              and continue where you left off.
            </p>
            <div className="rounded-xl border border-border/70 bg-background/70 p-3">
              Check Wi-Fi or mobile data
            </div>
            <div className="rounded-xl border border-border/70 bg-background/70 p-3">
              Disable VPN or proxy temporarily
            </div>
            <Button
              type="button"
              // onClick={() => window.location.reload()}
              variant="secondary"
              className="mt-3 h-12 px-8 rounded-lg cursor-pointer"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
