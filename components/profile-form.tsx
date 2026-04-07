"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User as UserIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { UserAvatar } from "@/components/user-avatar";
import { PasswordInput } from "@/components/password-input";
import { passwordSchema } from "@/lib/validation";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  image: z.string().optional().nullable(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: passwordSchema,
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

function useImagePreview(
  form: ReturnType<typeof useForm<UpdateProfileValues>>,
) {
  return form.watch("image");
}

export function ProfileDetailsForm({ user }: { user: User }) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? null,
    },
  });

  async function onSubmit({ name, image }: UpdateProfileValues) {
    startTransition(async () => {
      try {
        await authClient.updateUser({
          name,
          image,
          fetchOptions: {
            onError(error) {
              console.error("Failed to update profile", error);
              toast.error(error.error.message);
            },
            onSuccess() {
              toast.success("Profile updated");
              router.refresh();
            },
          },
        });
      } catch (error) {
        console.error("Failed to update profile", error);
      }
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        form.setValue("image", base64, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  }

  const imagePreview = useImagePreview(form);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
              <Separator
                orientation="vertical"
                className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
              />
              <InputGroupInput
                type="text"
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Full name"
                {...field}
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
              <Separator
                orientation="vertical"
                className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
              />
              <InputGroupInput
                type="text"
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Full name"
                {...field}
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        name="image"
        control={form.control}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="image">Profile image</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <UserIcon />
              </InputGroupAddon>
              <Separator
                orientation="vertical"
                className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
              />
              <InputGroupInput
                type="file"
                accept="image/*"
                id="image"
                aria-invalid={fieldState.invalid}
                placeholder="Select an image"
                onChange={(e) => handleImageChange(e)}
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {imagePreview && (
        <div className="relative size-16">
          <UserAvatar
            className="size-16"
            name={user.name}
            image={imagePreview}
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute -top-2 -right-2 size-6 rounded-full"
            onClick={() => form.setValue("image", null)}
            aria-label="Remove image"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}

      <LoadingButton type="submit" loading={isPending}>
        Save changes
      </LoadingButton>
    </form>
  );
}

export function PasswordForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit({
    currentPassword,
    newPassword,
  }: UpdatePasswordValues) {
    startTransition(async () => {
      try {
        await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });
      } catch (error) {
        console.error("Failed to change password", error);
        toast.error("Failed to change password");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="currentPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Current Password</FieldLabel>
            <PasswordInput
              {...field}
              placeholder="Current password"
              autoComplete="current-password"
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <Controller
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <PasswordInput
              autoComplete="new-password"
              placeholder="New password"
              {...field}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <LoadingButton type="submit" loading={isPending}>
        Change password
      </LoadingButton>
    </form>
  );
}

export const updateEmailSchema = z.object({
  newEmail: z.email({ message: "Enter a valid email" }),
});

export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;

interface EmailFormProps {
  currentEmail: string;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: currentEmail,
    },
  });

  async function onSubmit({ newEmail }: UpdateEmailValues) {
    startTransition(async () => {
      try {
        await authClient.changeEmail({
          newEmail,
          callbackURL: "/email-verified",
        });
      } catch (error) {
        console.error("Failed to request email change", error);
        toast.error("Failed to request email change");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="newEmail"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="new-email">New Email</FieldLabel>
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
                id="new-email"
                aria-invalid={fieldState.invalid}
                placeholder="expense@tracker.com"
                {...field}
              />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      <LoadingButton type="submit" loading={isPending}>
        Request change
      </LoadingButton>
    </form>
  );
}

export function SessionManagement() {
  type Session = NonNullable<
    Awaited<ReturnType<typeof authClient.listSessions>>["data"]
  >[number];

  const [isPending, startTransition] = React.useTransition();
  const [sessions, setSessions] = React.useState<Session[]>([]);

  React.useEffect(() => {
    startTransition(async () => {
      try {
        const session = await authClient.listSessions();
        setSessions(session.data || []);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
      }
    });
  }, []);

  return (
    <React.Suspense fallback={isPending ? "Loading sessions..." : null}>
      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-lg border p-3 text-sm space-y-1"
            >
              <p className="font-medium">
                {session.userAgent || "Unknown device"}
              </p>
              <p className="text-muted-foreground">
                IP: {session.ipAddress || "Unknown"}
              </p>
              <p className="text-muted-foreground">
                Created: {new Date(session.createdAt).toLocaleString()}
              </p>
              <p className="text-muted-foreground">
                Expires: {new Date(session.expiresAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No active sessions found.
        </p>
      )}
    </React.Suspense>
  );
}
