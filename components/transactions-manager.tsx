"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type TransactionItem = {
  id: string;
  amount: number;
  displayAmount: number;
  description: string | null;
  createdAt: string;
  category: {
    id: string;
    name: string;
  } | null;
};

export function TransactionsManager({
  categories,
  transactions,
}: {
  categories: CategoryOption[];
  transactions: TransactionItem[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const refreshData = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const submitTransaction = async (event: FormEvent) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parsedAmount,
        description: description.trim() || undefined,
        categoryId: categoryId || undefined,
      }),
    });

    if (!res.ok) {
      return;
    }

    setAmount("");
    setDescription("");
    setCategoryId("");
    refreshData();
  };

  const addCategory = async (event: FormEvent) => {
    event.preventDefault();

    if (!newCategory.trim()) {
      return;
    }

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newCategory.trim(),
      }),
    });

    if (!res.ok) {
      return;
    }

    setNewCategory("");
    refreshData();
  };

  const deleteCategory = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return;
    }

    if (categoryId === id) {
      setCategoryId("");
    }

    refreshData();
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
          <CardDescription>
            Track expenses and income with one simple amount field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={submitTransaction}
          >
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Amount</Label>
              <Input
                id="tx-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tx-description">Description</Label>
              <Textarea
                id="tx-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Groceries, salary, transport..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tx-category">Category</Label>
              <select
                id="tx-category"
                className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button disabled={isPending} type="submit" className="w-full">
                Save Transaction
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            Create and clean up custom categories used while adding
            transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="flex gap-2" onSubmit={addCategory}>
            <Input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="e.g. Food, Rent, Freelance"
            />
            <Button disabled={isPending} type="submit">
              Add
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories yet.
              </p>
            )}
            {categories.map((category) => (
              <div
                key={category.id}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-1"
              >
                <Badge variant="outline">{category.name}</Badge>
                <button
                  type="button"
                  aria-label={`Delete ${category.name}`}
                  onClick={() => deleteCategory(category.id)}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            All amounts are stored and shown as entered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2">Date</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-b-0">
                    <td className="py-2">
                      {tx.createdAt}
                    </td>
                    <td className="py-2">{tx.description || "-"}</td>
                    <td className="py-2">{tx.category?.name || "-"}</td>
                    <td className="py-2 text-right font-medium">
                      {tx.displayAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No transactions added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
