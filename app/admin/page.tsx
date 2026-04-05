import { Badge } from "@/components/ui/badge";
import { getServerSession } from "@/lib/get-server-session";

export default async function AdminPage() {
  const { user } = await getServerSession();

  if (!user) {
    return;
  }

  return (
    <div className="text-center h-screen place-content-center place-items-center">
      <h1>Admin Page</h1>
      <p>Welcome, {user.name}!</p>
      <p>
        Your role is <Badge>{user.role}</Badge>
      </p>
    </div>
  );
}
