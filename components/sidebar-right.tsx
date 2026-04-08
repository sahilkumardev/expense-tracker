import type * as React from "react";

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";

const RIGHT_SIDEBAR_WIDTH = "22rem";

export function SidebarRight({
  style,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const rightSidebarStyle = {
    ...(style as React.CSSProperties),
  } as React.CSSProperties & Record<string, string>;

  rightSidebarStyle["--sidebar-width"] = RIGHT_SIDEBAR_WIDTH;

  return (
    <Sidebar
      side="right"
      style={rightSidebarStyle}
      {...props}
    >
      <SidebarHeader className="h-14 border-b border-sidebar-border">
        ai chat box
      </SidebarHeader>
    </Sidebar>
  );
}
