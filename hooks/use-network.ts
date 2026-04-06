"use client";

import * as React from "react";

export function useNetwork() {
  const [isOnline, setNetwork] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const updateNetworkStatus = () => setNetwork(window.navigator.onLine);

    updateNetworkStatus();
    window.addEventListener("offline", updateNetworkStatus);
    window.addEventListener("online", updateNetworkStatus);

    return () => {
      window.removeEventListener("offline", updateNetworkStatus);
      window.removeEventListener("online", updateNetworkStatus);
    };
  }, []);

  return isOnline;
}
