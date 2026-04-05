import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { Session, user } = await getServerSession();

  if (!Session) {
    return redirect("/sign-in");
  }

  if (user?.role !== "admin") {
    return <div>Not authorized to access this page.</div>;
  }

  return (
    <>
      <main>
        {children}
      </main>
    </>
  );
}
