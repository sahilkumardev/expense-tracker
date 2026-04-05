"use client";

import { LoadingButton } from "@/components/loading-button";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    startTransition(async () => {
      try {
        await authClient.requestPasswordReset({
          email,
          redirectTo: "/reset-password",
          fetchOptions: {
            onError: (error) => {
              toast.error(error.error.message);
              console.error("Error sending password reset email:", error);
            },
            onSuccess: () => {
              toast.success("we've sent a password reset link.");
              form.reset();
            },
          },
        });
      } catch (error) {
        console.error("Error sending password reset email:", error);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupInput
                type="email"
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="expense@tracker.com"
                {...field}
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
      <LoadingButton type="submit" className="w-full" loading={isPending}>
        Send reset link
      </LoadingButton>
    </form>
  );
}
