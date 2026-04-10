"use client";

import * as React from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BriefcaseBusiness,
  Car,
  ChartColumnStacked,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Plane,
  ShoppingBag,
  Trash2,
  Tv,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/app/generated/prisma/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/loading-button";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryColorNames,
  type CategoryColorName,
  DEFAULT_CATEGORY_COLOR,
  getCategoryColorClasses,
  categoryIconNames,
  type CategoryIconName,
  DEFAULT_CATEGORY_ICON,
} from "@/types/category-types";
import { cn } from "@/lib/utils";

const iconRegistry: Record<
  CategoryIconName,
  { icon: LucideIcon; label: string }
> = {
  "shopping-bag": { icon: ShoppingBag, label: "Shopping" },
  house: { icon: House, label: "Home" },
  car: { icon: Car, label: "Transport" },
  utensils: { icon: Utensils, label: "Food" },
  briefcase: { icon: BriefcaseBusiness, label: "Work" },
  health: { icon: HeartPulse, label: "Health" },
  entertainment: { icon: Tv, label: "Entertainment" },
  education: { icon: GraduationCap, label: "Education" },
  travel: { icon: Plane, label: "Travel" },
  bills: { icon: Landmark, label: "Bills" },
};

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "*Category name must be at least 2 characters" })
    .max(60, { message: "*Category name must be at most 60 characters" }),
  icon: z.enum(categoryIconNames),
  color: z.enum(categoryColorNames),
});

type CategoryValues = z.infer<typeof categorySchema>;

export function Categories({
  categoriesPromise,
}: {
  categoriesPromise: Promise<{ categories: Category[] }>;
}) {
  const [isPending, startTransition] = React.useTransition();

  const { categories: initialCategories } = React.use(categoriesPromise);
  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);

  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: DEFAULT_CATEGORY_ICON,
      color: DEFAULT_CATEGORY_COLOR,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const addCategory = ({ name, icon, color }: CategoryValues) => {
    const trimmed = name.trim();

    const alreadyExists = categories.some(
      (category) => category.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      form.setError("name", {
        type: "manual",
        message: "Category already exists",
      });
      return;
    }

    const iconTaken = categories.some((category) => category.icon === icon);

    if (iconTaken) {
      form.setError("icon", {
        type: "manual",
        message: "Icon already used by another category",
      });
      return;
    }

    startTransition(async () => {
      try {
        const { data } = await axios.post<Category>("/api/categories", {
          name: trimmed,
          icon,
          color,
        });

        setCategories((prev) =>
          [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
        );
        form.reset({
          name: "",
          icon: DEFAULT_CATEGORY_ICON,
          color: DEFAULT_CATEGORY_COLOR,
        });
        toast.success(`Category "${data.name}" added`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const serverMessage =
            typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : "";

          if (status === 409) {
            if (serverMessage.toLowerCase().includes("icon")) {
              form.setError("icon", {
                type: "manual",
                message: "Icon already used by another category",
              });
            } else {
              form.setError("name", {
                type: "manual",
                message: "Category already exists",
              });
            }
          } else if (status === 400) {
            form.setError("name", {
              type: "manual",
              message: "Category name must be between 2 and 60 characters",
            });
          }
        }
        console.error("Failed to add category", error);
      }
    });
  };

  const deleteCategory = (id: string) => {
    startTransition(async () => {
      try {
        await axios.delete(`/api/categories/${id}`);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        toast.success("Category deleted");
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ChartColumnStacked className="size-5 text-primary" />
          Manage Categories
        </CardTitle>
        <CardDescription>
          Create and clean up custom categories used while adding transactions.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(addCategory)}>
        <CardContent className="flex gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Select Icon
                      <span className="ml-1">{fieldState.error?.message}</span>
                    </FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as CategoryIconName)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {categoryIconNames.map((name) => {
                          const CurrentIcon = iconRegistry[name].icon;
                          const label = iconRegistry[name].label;
                          const isTaken = categories.some(
                            (category) => category.icon === name,
                          );

                          return (
                            <SelectItem
                              key={name}
                              value={name}
                              disabled={isTaken}
                            >
                              <span className="flex items-center gap-2">
                                <CurrentIcon className="size-4" />
                                <Separator
                                  orientation="vertical"
                                  className="mx-1 rounded-2xl data-vertical:w-0.5"
                                />
                                <span className="truncate font-inter">
                                  {label}
                                </span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

            <Controller
              name="color"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Select Color
                      <span className="ml-1">{fieldState.error?.message}</span>
                    </FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as CategoryColorName)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryColorNames.map((name) => {
                          const { swatch } = getCategoryColorClasses(name);

                          return (
                            <SelectItem key={name} value={name}>
                              <span
                                className={cn("size-3 rounded-full", swatch)}
                                aria-hidden="true"
                              />

                              <Separator
                                orientation="vertical"
                                className="mx-1 rounded-2xl data-vertical:w-0.5"
                              />
                              <span className="capitalize font-inter">
                                {name}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="categories" className="text-nowrap">
                      Add Name
                      <span className="ml-1 truncate">
                        {fieldState.error?.message}
                      </span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        id="categories"
                        placeholder="e.g. Food, Rent, freel..."
                        aria-invalid={fieldState.invalid}
                        {...field}
                        disabled={isPending}
                      />
                    </InputGroup>
                  </Field>
                );
              }}
            />
          </div>

          <LoadingButton
            loading={isPending}
            disabled={isPending || !form.formState.isValid}
            type="submit"
            className="w-fit self-end px-10 py-4"
            size="lg"
          >
            {isPending ? "Adding…" : "Add"}
          </LoadingButton>
        </CardContent>
      </form>

      <React.Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
      >
        {categories.length === 0 ? (
          <CardFooter className="grid gap-4">
            <p className="text-sm text-muted-foreground text-center">
              No categories yet.
            </p>
          </CardFooter>
        ) : (
          <CardFooter className="flex flex-wrap gap-4">
            {categories.map((cat) => {
              const iconName =
                (cat.icon as CategoryIconName) ?? DEFAULT_CATEGORY_ICON;
              const Icon =
                iconRegistry[iconName]?.icon ??
                iconRegistry[DEFAULT_CATEGORY_ICON].icon;

              const { swatch } = getCategoryColorClasses(
                cat.color as CategoryColorName,
              );

              return (
                <ButtonGroup key={cat.id}>
                  <Badge className={"h-8 pl-3 py-1.5"} variant="outline">
                    <span
                      className={cn("size-3 rounded-full", swatch)}
                      aria-hidden="true"
                    />

                    <Separator
                      orientation="vertical"
                      className="mx-1 rounded-2xl data-vertical:w-0.5"
                    />
                    <Icon className="size-4" />
                    <Separator
                      orientation="vertical"
                      className="mx-1 rounded-2xl data-vertical:w-0.5"
                    />
                    <span className="font-medium capitalize tracking-wider">
                      {cat.name}
                    </span>
                    <Separator
                      orientation="vertical"
                      className="ml-1 rounded-2xl data-vertical:w-0.5"
                    />
                    <Button
                      aria-label={`Delete ${cat.name}`}
                      onClick={() => deleteCategory(cat.id)}
                      disabled={isPending}
                      size="icon-xs"
                      variant="destructive"
                    >
                      <Trash2 />
                    </Button>
                  </Badge>
                </ButtonGroup>
              );
            })}
          </CardFooter>
        )}
      </React.Suspense>
    </Card>
  );
}
