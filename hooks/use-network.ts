"use client";

import * as React from "react";

export function useNetwork() {
  const isOnline = React.useSyncExternalStore(
    subscribe,
    () => (typeof navigator !== "undefined" ? navigator.onLine : true),
    () => true,
  );

  return isOnline;
}

function subscribe(callback: () => void) {
  window.addEventListener("offline", callback);
  window.addEventListener("online", callback);

  return () => {
    window.removeEventListener("offline", callback);
    window.removeEventListener("online", callback);
  };
}
