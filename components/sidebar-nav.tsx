"use client";

import * as React from "react";
import {
  BarChart3,
  Home,
  MessageCircleQuestion,
  ReceiptText,
  Settings2,
} from "lucide-react";
import { SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getPathnameState } from "@/lib/pathname";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home;
};

const dashboardItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: ReceiptText,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const helpItems: NavItem[] = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
  },
  {
    title: "Help",
    url: "/dashboard/help",
    icon: MessageCircleQuestion,
  },
];

function NavItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { isExactPath } = React.useMemo(
    () => getPathnameState(pathname),
    [pathname],
  );

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isExactPath(item.url)}>
            <Link href={item.url} className="flex items-center gap-2 w-full">
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

function DashboardNavbar() {
  return (
    <SidebarContent className="mt-2">
      <SidebarGroup>
        <SidebarMenu>
          <NavItems items={dashboardItems} />
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

function HelpNavbar() {
  return (
    <SidebarMenu>
      <NavItems items={helpItems} />
    </SidebarMenu>
  );
}

export { DashboardNavbar, HelpNavbar };
