"use client";

import * as React from "react";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
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
              console.error("Error during sign-up:", error);
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
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
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
                <Separator
                  orientation="vertical"
                  className="ml-2 my-1.5 data-vertical:w-0.5 rounded-2xl"
                />
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
                <Separator
                  orientation="vertical"
                  className="ml-2 my-1.5 data-vertical:w-0.5 rounded-2xl"
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

        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </FieldGroup>

      <LoadingButton type="submit" className="mt-5" loading={isPending}>
        Create an account
      </LoadingButton>
    </form>
  );
}
