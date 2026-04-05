import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-server-session";
import { MailIcon } from "lucide-react";
import Link from "next/link";
// import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { user } = await getServerSession();

  // if (!user) {
  //   redirect("/sign-in?redirect=/dashboard/settings");
  // }

  return (
    <section>
      <h1>Settings Page</h1>
      {user?.emailVerified && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MailIcon className="size-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-200">
                Please verify your email address to access all features.
              </span>
            </div>
            <Button size="sm" asChild>
              <Link href="/verify-email">Verify Email</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
