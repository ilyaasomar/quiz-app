import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { SiQuizlet } from "react-icons/si";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SidebarItems from "./sidebar-items";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary mb-8 flex flex-col items-start justify-start px-2">
            <Link
              href="/"
              className="mb-1 flex cursor-pointer items-center gap-2"
            >
              <SiQuizlet className="text-primary h-6 w-6" />
              <p className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Quiz
              </p>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
