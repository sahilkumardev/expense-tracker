"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import React from "react";

export function GoogleButton() {
  const [isPending, startTransition] = React.useTransition();

  const handleGoogleLogin = () => {
    startTransition(() => {
      authClient.signIn.social({ provider: "google" });
    });
  };

  return (
    <Button onClick={handleGoogleLogin}>
      {isPending ? "Loading..." : "Login with Google"}
    </Button>
  );
}
