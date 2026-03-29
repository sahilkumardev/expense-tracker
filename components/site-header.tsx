import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeSwitcher } from "@/components/mode-switcher";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sm:h-16 fixed top-0 left-0 right-0 px-6 sm:px-0 h-12 bg-background/10 backdrop-blur-md border-b">
      <div className="max-w-6xl flex items-center justify-between mx-auto h-full">
        <Link
          href="/"
          className="[&_svg]:size-6 sm:[&_svg]:size-7.5 [&svg]:shrink-0 flex items-center justify-center gap-x-2 font-machine"
        >
          <svg
            viewBox="0 0 5844 5869"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <g>
              <path d="M0.5,3494.499c0,1241.961 0,1216.732 0,1216.732l1159.469,1152.618l1187.5,3.025l-0.534,-1161.664l-1168.635,2.459l8.366,-1211.875l-1186.167,-1.295Z" />
              <path d="M25.988,2373.297c0,-1241.961 0,-1216.732 0,-1216.732l1159.469,-1152.618l1187.5,-3.025l-0.534,1161.664l-1168.635,-2.459l8.366,1211.875l-1186.167,1.295Z" />
              <path d="M5842.898,2372.875c0,-1241.961 0,-1216.732 0,-1216.732l-1159.469,-1152.618l-1187.5,-3.025l0.534,1161.664l1168.635,-2.459l-8.366,1211.875l1186.167,1.295Z" />
              <path d="M5817.713,3495.953c0,1241.961 0,1216.732 0,1216.732l-1159.469,1152.618l-1187.5,3.025l0.534,-1161.664l1168.635,2.459l-8.366,-1211.875l1186.167,-1.295Z" />
              <path d="M1633.965,2899.463l1291.473,-1288.855l1292.417,1289.715l-1298.735,1301.901l-1285.154,-1302.761Z" />
            </g>
          </svg>
          <p className="flex flex-col justify-center gap-4 pt-1.5">
            <span className="text-lg sm:text-xl leading-0">Expense</span>
            <span className="text-sm leading-0 mt-0.5">
              <span className="mr-0.5">💸</span>Tracker
            </span>
          </p>
        </Link>

        <div className="flex items-center gap-2">
          <ModeSwitcher />

          <Link
            href="https://github.com/sahilkumardev/expense-tracker"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              size="icon"
              variant="secondary"
              className={cn("group/toggle extend-touch-target rounded-md")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
