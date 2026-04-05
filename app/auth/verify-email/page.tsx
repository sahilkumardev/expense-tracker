import { ResendVerificationButton } from "@/components/auth-ui";
import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function VerifyEmailPage() {
  const { user } = await getServerSession();

  if (!user) return redirect("/sign-in?redirect=/auth/verify-email");

  if (user?.emailVerified) redirect("/dashboard");

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-muted-foreground">
          A verification email was sent to your inbox.
        </p>
      </div>
      <ResendVerificationButton email={user.email} />
    </div>
  );
}
