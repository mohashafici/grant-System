import { SidebarProvider } from "@/components/ui/sidebar";
import ProfileMenu from "@/components/profile-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, User, History, Award } from "lucide-react";
import Link from "next/link";

export default function ReviewerLayout({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center space-x-3 p-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Grant Portal</h2>
                <p className="text-xs text-muted-foreground">Reviewer</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "dashboard"}>
                      <Link href="/dashboard/reviewer">
                        <FileText className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "history"}>
                      <Link href="/dashboard/reviewer/history">
                        <History className="w-4 h-4" />
                        <span>Review History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "profile"}>
                      <Link href="/dashboard/reviewer/profile">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-end items-center">
            <ProfileMenu profileHref="/dashboard/reviewer/profile" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
} 