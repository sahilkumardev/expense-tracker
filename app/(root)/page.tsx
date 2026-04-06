import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { Session } = await getServerSession();

  if (Session) {
    return redirect("/dashboard");
  }

  return <div>Home page</div>;
}
