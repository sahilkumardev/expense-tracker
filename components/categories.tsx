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
import { Car, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/app/generated/prisma/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/loading-button";
import { z } from "zod";
import { Button } from "./ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "*Category name must be at least 2 characters" })
    .max(20, { message: "*Category name must be at most 20 characters" }),
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
    defaultValues: { name: "" },
    mode: "onChange",
  });

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const addCategory = ({ name }: CategoryValues) => {
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

    startTransition(async () => {
      try {
        const { data } = await axios.post<Category>("/api/categories", {
          name: trimmed,
        });

        setCategories((prev) =>
          [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
        );
        form.reset();
        toast.success(`Category "${data.name}" added`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 409) {
            form.setError("name", {
              type: "manual",
              message: "Category already exists",
            });
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
        <CardTitle>Manage Categories</CardTitle>
        <CardDescription>
          Create and clean up custom categories used while adding transactions.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(addCategory)}>
        <CardContent className="flex">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="categories">
                  Add Categories
                  <span className="ml-1">{fieldState.error?.message}</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <ShoppingBag />
                  </InputGroupAddon>
                  <Separator
                    orientation="vertical"
                    className="ml-2 my-1 data-vertical:w-0.5 rounded-2xl"
                  />
                  <InputGroupInput
                    type="text"
                    id="categories"
                    placeholder="e.g. Food, Rent, Freelance"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    disabled={isPending}
                  />
                </InputGroup>
              </Field>
            )}
          />

          <LoadingButton
            loading={isPending}
            disabled={isPending || !form.formState.isValid}
            type="submit"
            className="w-fit py-4 ml-4 self-end px-10"
            size={"lg"}
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
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          </CardFooter>
        ) : (
          <CardFooter className="flex gap-4 flex-wrap">
            {categories.map((cat) => (
              <ButtonGroup key={cat.id} className="">
                <Badge className="py-1.5 h-8 px-3" variant="outline">
                  <Car />
                  <Separator
                    orientation="vertical"
                    className="mx-1 data-vertical:w-0.5 rounded-2xl"
                  />
                  <span className="capitalize tracking-wider font-medium">
                    {cat.name}
                  </span>
                </Badge>
                <Button
                  aria-label={`Delete ${cat.name}`}
                  onClick={() => deleteCategory(cat.id)}
                  disabled={isPending}
                  size="icon-sm"
                  variant="outline"
                  className="bg-red-500/80 hover:bg-red-500/60"
                >
                  <Trash2 />
                </Button>
              </ButtonGroup>
            ))}
          </CardFooter>
        )}
      </React.Suspense>
    </Card>
  );
}
