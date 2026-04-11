"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PasswordInput } from "@/components/password-input";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck, User as UserIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const accountSettingsSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    image: z.string().nullable().optional(),
    newEmail: z.string().trim().email({ message: "Enter a valid email" }),
    currentPassword: z.string(),
    newPassword: z.string(),
  })
  .superRefine((values, ctx) => {
    const hasNewPassword = values.newPassword.trim().length > 0;
    const hasCurrentPassword = values.currentPassword.trim().length > 0;

    if (hasNewPassword && !hasCurrentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentPassword"],
        message: "Current password is required",
      });
      return;
    }

    if (hasNewPassword) {
      const parsedPassword = passwordSchema.safeParse(values.newPassword);
      if (!parsedPassword.success) {
        for (const issue of parsedPassword.error.issues) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["newPassword"],
            message: issue.message,
          });
        }
      }
    }
  });

type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;

interface AccountSettingsFormProps {
  user: User;
}

export function ManageProfile({ user }: AccountSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<AccountSettingsValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? null,
      newEmail: user.email,
      currentPassword: "",
      newPassword: "",
    },
  });

  const imagePreview = useWatch({
    control: form.control,
    name: "image",
  });

  const watchedName = useWatch({
    control: form.control,
    name: "name",
  });

  const watchedEmail = useWatch({
    control: form.control,
    name: "newEmail",
  });

  const watchedCurrentPassword = useWatch({
    control: form.control,
    name: "currentPassword",
  });

  const watchedNewPassword = useWatch({
    control: form.control,
    name: "newPassword",
  });

  const hasProfileChanges =
    watchedName.trim() !== (user.name ?? "") ||
    imagePreview !== (user.image ?? null);
  const hasEmailChanges = watchedEmail.trim() !== user.email;
  const hasPasswordChanges =
    watchedCurrentPassword.trim().length > 0 &&
    watchedNewPassword.trim().length > 0;
  const canSubmit = hasProfileChanges || hasEmailChanges || hasPasswordChanges;

  const handleImageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image", reader.result as string, {
          shouldDirty: true,
          shouldTouch: true,
        });
      };
      reader.readAsDataURL(file);
    },
    [form],
  );

  const removeImage = React.useCallback(() => {
    form.setValue("image", null, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [form]);

  const onSubmit = React.useCallback(
    async (values: AccountSettingsValues) => {
      startTransition(async () => {
        try {
          const trimmedName = values.name.trim();
          const trimmedEmail = values.newEmail.trim();
          const profileChanged =
            trimmedName !== (user.name ?? "") ||
            values.image !== (user.image ?? null);
          const emailChanged = trimmedEmail !== user.email;
          const passwordChanged =
            values.currentPassword.trim().length > 0 &&
            values.newPassword.trim().length > 0;

          if (!profileChanged && !emailChanged && !passwordChanged) {
            toast.info("No changes to save");
            return;
          }

          if (profileChanged) {
            await authClient.updateUser({
              name: trimmedName,
              image: values.image,
            });
          }

          if (emailChanged) {
            await authClient.changeEmail({
              newEmail: trimmedEmail,
              callbackURL: "/email-verified",
            });
          }

          if (passwordChanged) {
            await authClient.changePassword({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
              revokeOtherSessions: true,
            });
          }

          toast.success(
            emailChanged
              ? "Settings saved. Verify your new email from your inbox."
              : "Settings saved",
          );

          form.reset({
            name: trimmedName,
            image: values.image,
            newEmail: trimmedEmail,
            currentPassword: "",
            newPassword: "",
          });

          router.refresh();
        } catch (error) {
          console.error("Failed to save settings", error);
          toast.error("Failed to save settings");
        }
      });
    },
    [form, router, startTransition, user.email, user.image, user.name],
  );

  return (
    <Card className="border-border/60 bg-linear-to-b from-card via-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldCheck className="size-5 text-primary" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Update your identity, email, and password from one secure place.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-6 md:grid-cols-[1fr_155px]"
          id="account-settings-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2 ">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <UserIcon />
                    </InputGroupAddon>
                    <Separator
                      orientation="vertical"
                      className="my-1 ml-2 rounded-2xl data-vertical:w-0.5"
                    />
                    <InputGroupInput
                      type="text"
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      {...field}
                    />
                  </InputGroup>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              name="newEmail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-email">Email Address</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                    <Separator
                      orientation="vertical"
                      className="my-1 ml-2 rounded-2xl data-vertical:w-0.5"
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

            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="current-password">
                    Current Password
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="current-password"
                    placeholder="Current password"
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
                  <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="new-password"
                    placeholder="New password"
                    autoComplete="new-password"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">
                Note :- Saving password changes signs out other devices
                automatically.
              </p>
              <LoadingButton
                type="submit"
                form="account-settings-form"
                loading={isPending}
                disabled={!canSubmit}
              >
                Save Changes
              </LoadingButton>
            </div>
          </div>
          <div className="grid grid-cols-1 content-between">
            <div>
              <FieldLabel htmlFor="image" className="mb-1">
                Profile Photo
              </FieldLabel>
              <div className="relative flex">
                <UserAvatar
                  className="h-full w-full mb- ring-2 ring-primary/30 rounded size-38"
                  name={watchedName || user.name || "User"}
                  image={imagePreview}
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute -right-2 -top-2 size-7 rounded-full"
                    onClick={removeImage}
                    aria-label="Remove image"
                  >
                    <XIcon className="size-4" />
                  </Button>
                )}
              </div>
            </div>
            <Controller
              name="image"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="relative justify-center">
                    Update Image
                    <InputGroupInput
                      type="file"
                      accept="image/*"
                      className="opacity-0 absolute inset-0 cursor-pointer"
                      aria-invalid={fieldState.invalid}
                      onChange={handleImageChange}
                    />
                  </InputGroup>

                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
