import { AccountSettingsForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-server-session";
import { MailIcon } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const { user } = await getServerSession();

  if (!user?.id) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-linear-to-r from-primary/10 via-transparent to-primary/5 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Preferences
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Control how your profile appears, secure your account, and review
          active sessions.
        </p>
      </div>

      {!user?.emailVerified && (
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

      <AccountSettingsForm user={user} />
    </section>
  );
}
