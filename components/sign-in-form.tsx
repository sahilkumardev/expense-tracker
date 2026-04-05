"use client";

import * as React from "react";
import { GoogleButton } from "@/components/auth-ui";
import { ExternalLink } from "@/components/external-link";
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

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
    <div>
      <h1 className="text-3xl md:text-4xl font-medium font-mono tracking-tight mb-4">
        Welcome back!
      </h1>
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

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
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

        <LoadingButton type="submit" className="w-full" loading={isPending}>
          Login
        </LoadingButton>
      </form>

      <div className="flex items-center my-6">
        <Separator className="shrink" />
        <span className="text-nowrap mx-3 text-sm text-muted-foreground">
          or continue with
        </span>
        <Separator className="shrink" />
      </div>

      <GoogleButton />

      <div className="text-center mt-5 text-muted-foreground text-sm">
        Don&apos;t have an account?
        <ExternalLink href="/sign-up" className="ml-1">
          Sign up
        </ExternalLink>
      </div>
    </div>
  );
}
