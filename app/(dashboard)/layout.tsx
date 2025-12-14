import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbCM } from "@/components/breadcrumb";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultChecked={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col">
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 border-border/40 sticky top-0 z-10 border-b px-6 py-3 shadow-sm backdrop-blur">
          <div className="flex shrink-0 grow items-center gap-3">
            <SidebarTrigger className="hover:bg-muted -ml-1 h-8 w-8 transition-colors" />
            <Separator
              orientation="vertical"
              className="mr-2 h-6 data-[orientation=vertical]:h-6"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbCM />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="from-background to-muted/20 flex-1 overflow-y-auto bg-linear-to-br p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
