"use client";

import * as React from "react";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    startTransition(async () => {
      try {
        await authClient.resetPassword({
          newPassword,
          token,
          fetchOptions: {
            onError: (error) => {
              toast.error(error.error.message);
              console.error("Error resetting password:", error);
            },
            onSuccess: () => {
              toast.success("Password has been reset. You can now sign in.");
              setTimeout(() => router.push("/sign-in"), 3000);
              form.reset();
            },
          },
        });
      } catch (error) {
        console.error("Error resetting password:", error);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="newPassword">Confirm Password</FieldLabel>
            <PasswordInput
              autoComplete="new-password"
              placeholder="Enter new password"
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <LoadingButton type="submit" className="mt-5" loading={isPending}>
        Reset password
      </LoadingButton>
    </form>
  );
}
