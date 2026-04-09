import { Categories } from "@/components/categories";
import { AccountSettingsForm } from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-server-session";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/lib/categories";

export default async function SettingsPage() {
  const { user } = await getServerSession();

  if (!user?.id) {
    return null;
  }

  const categories = getCategories();

  return (
    <section className="space-y-6">
      {!user?.emailVerified && (
        <div className="overflow-hidden rounded-xl border border-yellow-300/70 bg-linear-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 shadow-sm dark:border-yellow-800/60 dark:from-yellow-950/50 dark:via-amber-950/30 dark:to-orange-950/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="mt-0.5 rounded-lg bg-yellow-500/15 p-2 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
                <MailIcon className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                  Verify your email to unlock all features
                </p>
                <p className="text-sm text-yellow-800/90 dark:text-yellow-300/90">
                  Confirming your email secures your account and enables all
                  settings.
                </p>
              </div>
            </div>

            <Button size="sm" asChild>
              <Link href="/verify-email">Verify Email</Link>
            </Button>
          </div>
        </div>
      )}

      <AccountSettingsForm user={user} />
      <Categories categoriesPromise={categories} />
    </section>
  );
}
