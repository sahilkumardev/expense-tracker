import { GoogleButton } from "@/components/google-button";
import { PaymentButton } from "@/components/payment-button";
import { Profile } from "@/components/profile";
import { getServerSession } from "@/lib/get-server-session";

export default async function Home() {
  const { session, user } = await getServerSession();

  return (
    <div className="flex min-h-svh items-center justify-center gap-10">
      <Profile />

      {!session && <GoogleButton />}

      {user?.stripeCustomerId}

      <div>Hello {user?.isPro ? "true" : "false "}</div>

      {session && <PaymentButton />}
    </div>
  );
}
