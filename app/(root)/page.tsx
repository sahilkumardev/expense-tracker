import { GoogleButton } from "@/components/google-button";
import { PaymentButton } from "@/components/payment-button";
import { Profile } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-server-session";
import Link from "next/link";

export default async function Home() {
  const { session, user } = await getServerSession();

  return (
    <div className="flex min-h-svh items-center justify-center gap-10">
      <Profile />

      {!session && <GoogleButton />}

      {user?.stripeCustomerId}

      <div>Hello user, {user?.isPro ? <h1>IsPro</h1> : <PaymentButton />}</div>

      <Link href={"/dashboard"} prefetch={false}>
        <Button>Dashboard</Button>
      </Link>
    </div>
  );
}
