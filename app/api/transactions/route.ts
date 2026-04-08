import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-server-session";
import { z } from "zod";

const createTransactionSchema = z.object({
  amount: z.number().finite().positive(),
  categoryId: z.string().uuid().optional().nullable(),
  description: z.string().trim().max(500).optional(),
});

export async function GET() {
  try {
    const { user } = await getServerSession();

    if (!user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      data: transactions.map((tx) => ({
        ...tx,
        displayAmount: tx.amount,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = createTransactionSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request body", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { user } = await getServerSession();

    if (!user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, categoryId, description } = parsed.data;

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: user.id,
        },
        select: { id: true },
      });

      if (!category) {
        return Response.json({ error: "Invalid category" }, { status: 400 });
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        categoryId: categoryId ?? null,
        userId: user.id,
        description: description || null,
      },
    });

    return Response.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction", error);
    return Response.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
