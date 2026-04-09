import { getServerSession } from "@/lib/get-server-session";
import { prisma } from "@/lib/prisma";
import React from "react";

export const getCategories = React.cache(async () => {
  const { user } = await getServerSession();

  if (!user?.id) {
    return { categories: [] };
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return { categories };
});
