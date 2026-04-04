import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, Calendar, Settings2, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { getServerSession } from "@/lib/get-server-session";
import { LogoutButton } from "@/components/auth-ui";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "/dashboard",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "/dashboard",
      icon: MessageCircleQuestion,
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

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
      <Logo />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.isActive}>
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton>
                <Link href={item.url} className="flex items-center gap-2">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarGroup className="p-0">
          <SidebarMenuButton className="py-8 bg-sidebar-accent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user?.image as string} alt={user?.name} />
              <AvatarFallback className="rounded-lg">ET</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
            <Badge>{user?.isPro ? "Pro" : "Free"}</Badge>
          </SidebarMenuButton>

          <LogoutButton />
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
