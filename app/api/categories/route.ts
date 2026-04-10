import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-server-session";
import {
  categoryColorNames,
  categoryIconNames,
  DEFAULT_CATEGORY_COLOR,
} from "@/types/category-types";
import { z } from "zod";
import { NextResponse } from "next/server";

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  icon: z.enum(categoryIconNames).optional(),
  color: z.enum(categoryColorNames).optional(),
});

export async function GET() {
  try {
    const { user } = await getServerSession();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await getServerSession();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as unknown;
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const existingCategories = await prisma.category.findMany({
      where: { userId: user.id },
      select: { icon: true },
    });

    const usedIcons = new Set(existingCategories.map((item) => item.icon));
    const requestedIcon = parsed.data.icon;
    const autoPickedIcon = categoryIconNames.find(
      (iconName) => !usedIcons.has(iconName),
    );
    const iconToUse = requestedIcon ?? autoPickedIcon;
    const colorToUse = parsed.data.color ?? DEFAULT_CATEGORY_COLOR;

    if (!iconToUse) {
      return NextResponse.json(
        { error: "All available icons are already in use" },
        { status: 409 },
      );
    }

    if (usedIcons.has(iconToUse)) {
      return NextResponse.json(
        { error: "Icon is already used by another category" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        icon: iconToUse,
        color: colorToUse,
        userId: user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      const target =
        "meta" in error &&
        error.meta &&
        typeof error.meta === "object" &&
        "target" in error.meta &&
        Array.isArray(error.meta.target)
          ? error.meta.target
          : [];

      if (target.includes("icon")) {
        return NextResponse.json(
          { error: "Icon is already used by another category" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 },
      );
    }

    console.error("Failed to create category", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
