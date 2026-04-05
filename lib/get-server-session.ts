import React from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

export const getServerSession = React.cache(async () => {
  // console.log("====================================");
  console.log("Fetching session on the server...");
  // console.log("====================================");

  const Session = await auth.api.getSession({
    headers: await headers(),
  });

  const session = Session?.session;
  const user = Session?.user;

  return {
    Session,
    session,
    user,
  };
});
