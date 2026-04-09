import * as React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import chalk from "chalk";

export const getServerSession = React.cache(async () => {
  const headersResponse = await headers();
  const cookie = headersResponse.get("cookie") ?? "";

  const getCachedSession = unstable_cache(
    async () => {
      console.log(chalk.green("Fetching session on the server..."));
      return auth.api.getSession({ headers: headersResponse });
    },
    [cookie],
    {
      revalidate: 60,
      tags: ["server-session"],
    },
  );

  console.log(chalk.yellow("Fetching Session from unstable_cache..."));
  const Session = await getCachedSession();

  return {
    Session,
    session: Session?.session,
    user: Session?.user,
  };
});
