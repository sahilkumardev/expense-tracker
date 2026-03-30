import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/google-button";
import { Profile } from "@/components/profile";
import { PaymentButton } from "@/components/payment-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-svh items-center justify-center gap-10">
      <Profile />

      <Button>Click me</Button>

      {!session && <GoogleButton />}

      {session && <PaymentButton />}
    </div>
  );
}
