"use client";

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

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function isExactPathMatch(pathname: string, url: string) {
  return normalizePathname(pathname) === normalizePathname(url);
}

function NavItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={isExactPathMatch(pathname, item.url)}
          >
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
  const items = [
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

  return (
    <SidebarContent className="mt-2">
      <SidebarGroup>
        <SidebarMenu>
          <NavItems items={items} />
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

function HelpNavbar() {
  const items = [
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

  return (
    <SidebarMenu>
      <NavItems items={items} />
    </SidebarMenu>
  );
}

export { DashboardNavbar, HelpNavbar };
