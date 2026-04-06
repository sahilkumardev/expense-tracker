import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "@/lib/get-server-session";
import { LogoutButton } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { DashboardNavbar, HelpNavbar } from "@/components/app-sidebar-nav";

export async function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = await getServerSession();

  return (
    <Sidebar
      {...props}
      collapsible="none"
      className="border-r sticky top-0 hidden h-svh lg:flex"
    >
      <SidebarHeader className="h-14 border-b border-sidebar-border">
        logo
      </SidebarHeader>

      <DashboardNavbar />
      <SidebarFooter>
        <HelpNavbar />

        <SidebarGroup className="p-0">
          <div className="overflow-hidden rounded-lg px-2.5 py-3 bg-sidebar-accent">
            <div className="flex items-center justify-between gap-1.5">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image as string} alt={user?.name} />
                <AvatarFallback className="rounded-lg">ET</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <Badge>{user?.isPro ? "Pro" : "Free"}</Badge>
            </div>
            {!user?.isPro && (
              <Button
                variant="outline"
                className="w-full border-primary/50 bg-primary/30 mt-3 hover:bg-primary/20 cursor-pointer"
              >
                <Crown size={16} className="mb-0.5" />
                Get pro
              </Button>
            )}
          </div>

          <LogoutButton />
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
