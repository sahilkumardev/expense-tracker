import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-server-session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await getServerSession();

    if (!user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const category = await prisma.category.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });

    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    await prisma.transaction.updateMany({
      where: { categoryId: id, userId: user.id },
      data: { categoryId: null },
    });

    await prisma.category.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category", error);
    return Response.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
