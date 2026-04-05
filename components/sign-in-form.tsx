"use client";

import * as React from "react";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail } from "lucide-react";

const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    startTransition(async () => {
      try {
        await authClient.signIn.email({
          email,
          password,
          rememberMe,
          fetchOptions: {
            onError: (error) => {
              toast.error(error.error.message);
              console.error("Error during sign-in:", error);
            },
            onSuccess: () => {
              toast.success("Signed in successfully");
              router.push(redirect ?? "/dashboard");
            },
          },
        });
      } catch (error) {
        console.error("Error during sign-in:", error);
        toast.error("Failed to sign in");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
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
                <Separator
                  orientation="vertical"
                  className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
                />
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

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-foreground/90 underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </div>

              <PasswordInput
                autoComplete="current-password"
                placeholder="Password"
                {...field}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel htmlFor="rememberMe">Remember me</FieldLabel>
              </div>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>
      <LoadingButton type="submit" className="mt-5" loading={isPending}>
        Login
      </LoadingButton>
    </form>
  );
}
