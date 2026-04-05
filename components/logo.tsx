"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";

const logoVariants = cva(
  "flex items-center-safe w-fit gap-1.5 select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 text-2xl",
  {
    variants: {
      size: {
        default: "[&_svg:not([class*='size-'])]:size-10",
        sm: "[&_svg:not([class*='size-'])]:size-6",
        md: "[&_svg:not([class*='size-'])]:size-8",
        lg: "[&_svg:not([class*='size-'])]:size-12",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

export function Logo({
  className,
  size,
  logoOnly = false,
  ...props
}: React.ComponentProps<"section"> &
  VariantProps<typeof logoVariants> & {
    logoOnly?: boolean;
  }) {
  return (
    <section
      className={cn(logoVariants({ size, className }))}
      onClick={() => redirect("/")}
      {...props}
    >
      <Sparkles className="text-primary aspect-square" />
      <p className={cn("font-medium", logoOnly ? "hidden" : "visible")}>
        Expense Tracker
      </p>
    </section>
  );
}
