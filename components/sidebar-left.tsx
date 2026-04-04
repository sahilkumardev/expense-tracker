import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, Calendar, Settings2, MessageCircleQuestion } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { getServerSession } from "@/lib/get-server-session";

const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: <Home />,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: <Calendar />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2 />,
    },
    {
      title: "Help",
      url: "#",
      icon: <MessageCircleQuestion />,
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
                <SidebarMenuButton asChild isActive={item.isActive}>
                  <a href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
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
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
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
            <Badge>Pro</Badge>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
