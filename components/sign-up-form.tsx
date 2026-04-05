"use client";

import * as React from "react";
import { GoogleButton } from "@/components/auth-ui";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { Mail, User } from "lucide-react";
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
import { useRouter } from "next/navigation";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Please enter a valid email" }),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit({ email, password, name }: SignUpValues) {
    startTransition(async () => {
      try {
        await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/auth/email-verified",
          fetchOptions: {
            onError: (error) => {
              toast.error(error.error.message);
            },
            onSuccess: () => {
              toast.success("Signed up successfully");
              router.push("/dashboard");
            },
          },
        });
      } catch (error) {
        console.error("Error during sign-up:", error);
        toast.error("Failed to sign up");
      }
    });
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-medium font-mono tracking-tight mb-4">
        Create your account
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="text"
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Your Name"
                    {...field}
                  />
                </InputGroup>
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

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
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Password"
                  {...field}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="passwordConfirmation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="passwordConfirmation">
                  Confirm Password
                </FieldLabel>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  {...field}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </FieldGroup>

        <LoadingButton type="submit" className="w-full" loading={isPending}>
          Create an account
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

      <div className="flex w-full justify-center border-t pt-4">
        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
