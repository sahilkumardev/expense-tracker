import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <div className="w-full space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="text-muted-foreground">
              Enter your new password below.
            </p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      ) : (
        <div role="alert" className="text-red-600">
          Token is missing.
        </div>
      )}
    </main>
  );
}
