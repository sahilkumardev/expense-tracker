import * as React from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="place-content-center place-items-center w-full sm:bottom-0 sm:absolute">
      <div
        className={cn(
          "h-px w-full bg-size-[var(--height)_var(--width)] dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
          "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        )}
        style={
          {
            "--height": "5px",
            "--width": "1px",
            "--background": "#ffffff",
            "--fade-stop": "90%",
            "--color-dark": "rgba(255, 255, 255, 0.2)",
            WebkitMaskComposite: "exclude",
            maskComposite: "exclude",
          } as React.CSSProperties
        }
      />
      <div className="place-items-center py-4 sm:flex sm:items-center sm:justify-between sm:py-6 px-8 text-sm text-muted-foreground w-full">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-0 w-full sm:justify-between">
          <h1>{new Date().getFullYear()} © All rights reserved.</h1>

          <p>
            Design & develop by ❤️
            <Link
              href="https://sahilkumardev.com"
              target="_blank"
              referrerPolicy="no-referrer"
              className="ml-1.5 hover:text-foreground font-mono tracking-wider text-green-400"
            >
              sahilkumardev
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
