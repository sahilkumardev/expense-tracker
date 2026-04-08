import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-server-session";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
});

export async function GET() {
  try {
    const { user } = await getServerSession();

    if (!user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    return Response.json({ data: categories });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await getServerSession();
    const body = (await req.json()) as unknown;
    const parsed = createCategorySchema.safeParse(body);

    if (!user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request body", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        userId: user.id,
      },
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return Response.json(
        { error: "Category already exists" },
        { status: 409 },
      );
    }

    console.error("Failed to create category", error);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
