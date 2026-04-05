import { getServerSession } from "@/lib/get-server-session";
import { Profile } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const { Session } = await getServerSession();

  if (Session) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh items-center justify-center gap-10">
      <Profile />

      {/* {user.stripeCustomerId} */}

      {/* <div>Hello user, {user?.isPro ? <h1>IsPro</h1> : <PaymentButton />}</div> */}
      <Link href={"/dashboard"} prefetch={false}>
        <Button>Dashboard</Button>
      </Link>
    </div>
  );
}
