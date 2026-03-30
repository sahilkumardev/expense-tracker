import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Color } from "@/components/background";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Color />
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  );
}
