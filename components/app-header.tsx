"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeSwitcher } from "@/components/mode-switcher";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function resolveBreadcrumbName(segment: string) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function AppHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => ({
    label: resolveBreadcrumbName(segment),
    url: `/${segments.slice(0, index + 1).join("/")}`,
  }));

  return (
    <section className="flex items-center justify-between px-4 border-b h-14">
      {breadcrumbs.length > 0 ? (
        <Breadcrumb className="text-muted-foreground">
          <BreadcrumbList>
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

      <ModeSwitcher />
    </section>
  );
}
