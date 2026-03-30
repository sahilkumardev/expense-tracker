import { getServerSession } from "@/lib/get-server-session";

export async function Profile() {
  const { user } = await getServerSession();

  return <div>email = {user?.email}</div>;
}
