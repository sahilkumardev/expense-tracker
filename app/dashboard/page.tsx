import { getServerSession } from "@/lib/get-server-session";

export default async function Page() {
  const { user, session } = await getServerSession();

  return (
    <div>
      <h1>Dashboard Page</h1>

      {!session ? (
        <div>Please sign in to view your dashboard.</div>
      ) : (
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>
            This is your personalized dashboard. and logged in as user{" "}
            {user?.email}
          </p>
        </div>
      )}
    </div>
  );
}
