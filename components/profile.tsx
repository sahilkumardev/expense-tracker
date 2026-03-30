"use client";

import { authClient } from "@/lib/auth-client";

export function Profile() {
  const { data: session, isPending } = authClient.useSession();

  return <div>email = {isPending ? "Loading..." : session?.user.email}</div>;
}
