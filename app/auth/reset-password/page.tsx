import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/form-reset-password";

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
    <>
      {token ? (
        <main className="w-full space-y-6">
          <div className="space-y-2 text-center font-machine">
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="text-muted-foreground">
              Enter your new password below.
            </p>
          </div>
          <ResetPasswordForm token={token} />
        </main>
      ) : (
        <div
          role="alert"
          className="text-center font-machine text-destructive text-xl"
        >
          Token is missing.
        </div>
      )}
    </>
  );
}
