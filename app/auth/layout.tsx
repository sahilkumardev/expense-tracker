import { AuthContainer } from "@/components/auth-container";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthContainer>{children}</AuthContainer>;
}
