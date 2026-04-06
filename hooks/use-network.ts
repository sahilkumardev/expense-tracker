"use client";

import * as React from "react";

export function useNetwork() {
  const [isOnline, setNetwork] = React.useState<boolean>(
    window.navigator.onLine,
  );

  React.useEffect(() => {
    window.addEventListener("offline", () =>
      setNetwork(window.navigator.onLine),
    );
    window.addEventListener("online", () =>
      setNetwork(window.navigator.onLine),
    );
  });

  return isOnline;
}
