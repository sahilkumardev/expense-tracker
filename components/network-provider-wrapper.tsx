"use client"

import { useNetwork } from "@/hooks/use-network";

export function NetworkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOnline = useNetwork();

  if (!isOnline) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 rounded-md border border-muted bg-popover p-4">
          <h2 className="text-lg font-semibold">No Internet Connection</h2>
          <p className="text-sm text-muted-foreground">
            Please check your network settings and try again.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
