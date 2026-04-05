import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/sidebar-header";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarLeft } from "@/components/sidebar-left";
import { getServerSession } from "@/lib/get-server-session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { Session } = await getServerSession();

  if (!Session) {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <SidebarHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
