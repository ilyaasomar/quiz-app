"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { styles } from "@/app/styles";
import { Routes } from "@/lib/routes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
export type RouteItemProps = {
  id: number;
  title: string;
  url: string;
  icon: any;
  isActive: boolean;
  children?: RouteItemProps[];
};
const SidebarItems = () => {
  // Menu items.
  const routes = Routes();

  return (
    <div>
      <SidebarMenu className="flex gap-2">
        {routes.map((item) => {
          const Icon = item.icon;
          if (item.children?.length) {
            return (
              <Collapsible
                key={item.id}
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "transition-colors",
                        item.isActive &&
                          `${styles.secondaryBgColor} text-white hover:${styles.secondaryBgColor}/90`
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child) => {
                        return (
                          <SidebarMenuSubItem key={child.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={child.isActive}
                            >
                              <Link
                                href={child.url}
                                className={cn(
                                  "transition-all",
                                  item.isActive
                                    ? `${styles.secondaryBgColor} text-white font-sans font-medium hover:${styles.secondaryBgColor} hover:text-white focus:${styles.secondaryBgColor} focus:text-white active:${styles.secondaryBgColor} active:text-white`
                                    : `font-sans font-medium text-gray-700 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700`
                                )}
                              >
                                <span className="font-sans text-[14px] mt-2">
                                  {child.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  item.active
                    ? `${styles.secondaryBgColor} text-white hover:${styles.secondaryBgColor} hover:text-white focus:${styles.secondaryBgColor} focus:text-white active:${styles.secondaryBgColor} active:text-white data-[state=open]:${styles.secondaryBgColor} data-[state=open]:text-white `
                    : `hover:${styles.secondaryBgColor}`
                )}
              >
                <Link
                  key={item.id}
                  href={item.url}
                  className={cn(
                    "transition-all",
                    item.isActive
                      ? `${styles.secondaryBgColor} text-white font-sans font-medium hover:${styles.secondaryBgColor} hover:text-white focus:${styles.secondaryBgColor} focus:text-white active:${styles.secondaryBgColor} active:text-white`
                      : `font-sans font-medium text-gray-700 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700`
                  )}
                >
                  <item.icon className="transition-all" />
                  <span className="font-sans text-[14px]">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
};

export default SidebarItems;
