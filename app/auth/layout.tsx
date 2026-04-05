import { AuthContainer } from "@/components/auth-container";
import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { Session } = await getServerSession();

  if (Session) {
    return redirect("/dashboard");
  }

  return (
    <AuthContainer>
      {children}
    </AuthContainer>
  );
}
