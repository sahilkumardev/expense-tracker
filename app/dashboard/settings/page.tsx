import {
  EmailForm,
  PasswordForm,
  ProfileDetailsForm,
  SessionManagement,
} from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { getServerSession } from "@/lib/get-server-session";
import { MailIcon } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const { user } = await getServerSession();

  return (
    <section>
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

      <ProfileDetailsForm user={user as User} />

      <PasswordForm />
      <EmailForm currentEmail={user?.email as string} />

      <div>
        {/* Session Management */}

        <h2 className="text-lg font-medium mb-4">Session Management</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your active sessions and sign out from other devices.
        </p>

        <SessionManagement />
      </div>
    </section>
  );
}
