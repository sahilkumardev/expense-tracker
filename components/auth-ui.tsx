"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

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

export function LogoutButton() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(() => {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh();
          },
        },
      });
      toast.success("Logged out successfully!");
    });
  };

  return (
    <Button onClick={handleLogout} variant={"destructive"} className="mt-2">
      {isPending ? (
        <span>Logging out...</span>
      ) : (
        <span className="flex items-center justify-between w-full">
          Logout
          <LogOutIcon />
        </span>
      )}
    </Button>
  );
}
