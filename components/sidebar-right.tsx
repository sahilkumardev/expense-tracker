import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar side="right" {...props}>
      <SidebarHeader className="h-14 border-b border-sidebar-border">
        ai chat box
      </SidebarHeader>
    </Sidebar>
  );
}
