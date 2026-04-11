"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeSwitcher } from "@/components/mode-switcher";
import { getPathnameState } from "@/lib/pathname";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Home } from "lucide-react";

export function SidebarHeader() {
  const pathname = usePathname();
  const { breadcrumbs } = React.useMemo(
    () => getPathnameState(pathname),
    [pathname],
  );

  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 justify-between px-4 border-b bg-muted/50 backdrop-blur-xl">
      {breadcrumbs.length > 0 ? (
        <Breadcrumb className="text-muted-foreground">
          <BreadcrumbList>
            <Home size={16} />
            <BreadcrumbSeparator />
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return [
                <BreadcrumbItem key={item.url}>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.url}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>,
                !isLast ? (
                  <BreadcrumbSeparator key={`${item.url}-separator`} />
                ) : null,
              ];
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="flex items-center justify-center">
        <ModeSwitcher />
        <Separator
          orientation="vertical"
          className="data-vertical:h-4 data-vertical:self-auto mx-1"
        />
        <SidebarTrigger />
      </div>
    </header>
  );
}
