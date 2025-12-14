"use client";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { SiQuizlet } from "react-icons/si";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SidebarItems from "./sidebar-items";
import { UserButton } from "@daveyplate/better-auth-ui";

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <div className="text-primary mb-8 flex flex-col items-start justify-start px-2">
            <Link
              href="/"
              className="mb-1 flex cursor-pointer items-center gap-2"
            >
              <SiQuizlet className="text-primary h-6 w-6" />
              {state === "expanded" && (
                <p className="from-primary to-primary/70 bg-linear-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                  Quiz
                </p>
              )}
            </Link>
          </div>
          <SidebarGroupContent>
            <SidebarItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-muted/30 border-t p-3">
        <UserButton
          variant="outline"
          className="border-muted-foreground/20 hover:border-primary/50 w-full transition-colors"
          disableDefaultLinks={true}
          additionalLinks={[
            {
              label: "Settings",
              href: "/account/settings",
              icon: <Settings className="h-4 w-4" />,
            },
          ]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
