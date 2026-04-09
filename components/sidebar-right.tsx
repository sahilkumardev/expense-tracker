import * as React from "react";

import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { getServerSession } from "@/lib/get-server-session";
import ChatBox from "@/components/chat-box";
import { User } from "@/lib/auth";

const RIGHT_SIDEBAR_WIDTH = "22rem";

export async function SidebarRight({
  style,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = await getServerSession();

  const rightSidebarStyle = {
    ...(style as React.CSSProperties),
  } as React.CSSProperties & Record<string, string>;

  rightSidebarStyle["--sidebar-width"] = RIGHT_SIDEBAR_WIDTH;

  return (
    <Sidebar side="right" style={rightSidebarStyle} {...props}>
      <SidebarHeader className="h-14 border-b border-sidebar-border flex items-start justify-center pl-6 font-machine text-xl">
        <h2 className="">🤖 AI Assistant</h2>
      </SidebarHeader>
      <ChatBox user={user as User} />
    </Sidebar>
  );
}
