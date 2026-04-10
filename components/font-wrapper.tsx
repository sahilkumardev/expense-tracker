import * as React from "react";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-inter",
});

const machine = localFont({
  src: [
    {
      path: "./fonts/machine-light.woff2",
      weight: "300",
    },
    {
      path: "./fonts/machine-regular.woff2",
      weight: "400",
    },
  ],
  variable: "--font-machine",
});

function FontWrapper({ children, className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-inter tracking-wide antialiased font-normal leading-normal",
        inter.variable,
        machine.variable,
        className,
      )}
    >
      {children}
    </div>
  );
}

export { FontWrapper, inter, machine };
