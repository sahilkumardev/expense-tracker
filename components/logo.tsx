"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const logoVariants = cva(
  "flex items-end w-fit gap-1.5 font-mono select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
      size: "default",
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
      className={cn(logoVariants({ size, className }), "font-machine")}
      onClick={() => redirect("/")}
      {...props}
    >
      <Sparkles className="size-4 text-primary-foreground aspect-square"  />
      <p className={cn("flex flex-col", logoOnly ? "hidden" : "visible")}>
        Expense
        <span className="text-xl leading-3.5 font-semibold">Tracker</span>
      </p>
    </section>
  );
}
