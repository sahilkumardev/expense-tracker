import { TransactionsManager } from "@/components/transactions-manager";
import { getServerSession } from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const { user } = await getServerSession();

  if (!user?.id) {
    return null;
  }

  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const formatted = transactions.map((transaction) => ({
    ...transaction,
    displayAmount: transaction.amount,
    createdAt: transaction.createdAt.toISOString().slice(0, 10),
  }));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-linear-to-r from-primary/10 via-transparent to-primary/5 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Finances
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Transactions
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Add new transactions, manage categories, and review recent activity.
        </p>
      </div>

      <TransactionsManager categories={categories} transactions={formatted} />
    </section>
  );
}
