"use client";

import { LoadingButton } from "@/components/loading-button";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import React from "react";

export function GoogleButton() {
  const [isPending, startTransition] = React.useTransition();

  const handleGoogleLogin = () => {
    startTransition(() => {
      try {
        authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
          fetchOptions: {
            onError: (error) => {
              console.error("Error during Google login:", error);
            },
            onSuccess: () => {
              toast.success("Redirecting to Google for authentication...");
            },
          },
        });
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    });
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full py-6 rounded-full font-machine tracking-wider [&_svg:not([class*='size-'])]:size-5"
      variant={"secondary"}
    >
      {isPending ? (
        <span>Redirecting to Google...</span>
      ) : (
        <span className="flex items-center justify-center gap-2 mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 262"
            className="-mt-0.5"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            />
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>
          Sign in with Google
        </span>
      )}
    </Button>
  );
}

export function LogoutButton() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        authClient.signOut({
          fetchOptions: {
            onError: (error) => {
              console.error("Error logging out:", error);
            },
            onSuccess: () => {
              router.refresh();
              toast.success("Logged out successfully!");
            },
          },
        });
      } catch (error) {
        console.error("Error logging out:", error);
      }
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

export function ResendVerificationButton({ email }: { email: string }) {
  const [isPending, startTransition] = React.useTransition();
  const [cooldownSeconds, setCooldownSeconds] = React.useState(0);

  React.useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const isCoolingDown = cooldownSeconds > 0;

  async function resendVerificationEmail() {
    if (isCoolingDown || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        await authClient.sendVerificationEmail({
          email,
          callbackURL: "/auth/email-verified",
          fetchOptions: {
            onError: (error) => {
              console.error("Error sending verification email:", error);
            },
            onSuccess: () => {
              toast.success("Verification email sent successfully!");
              setCooldownSeconds(60);
            },
          },
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    });
  }

  return (
    <LoadingButton
      onClick={resendVerificationEmail}
      className="w-full"
      loading={isPending}
      disabled={isCoolingDown}
    >
      {isCoolingDown
        ? `Resend verification email in ${cooldownSeconds}s`
        : "Resend verification email"}
    </LoadingButton>
  );
}
