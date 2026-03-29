import * as React from "react";

export function MaxWidthWrapper({ children }: React.ComponentProps<"main">) {
  return (
    <main className="mx-auto relative max-h-dvh lg:min-h-screen max-w-screen-2xl">
      {children}
    </main>
  );
}
