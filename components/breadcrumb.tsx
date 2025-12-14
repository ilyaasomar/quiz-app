"use client";
import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbCM() {
  const path = usePathname();
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/quiz":
        return "Quiz";
      case "/questions":
        return "Questions";
      case "/options":
        return "Options";
      case "/attempts":
        return "Attempts";
      case "/results":
        return "Results";
      default:
        return "Dashboard";
    }
  };
  return (
    <BreadcrumbPage className="text-foreground text-sm font-medium">
      {getPageTitle(path)}
    </BreadcrumbPage>
  );
}
