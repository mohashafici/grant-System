import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, LogoutButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { Award, FileText, Plus, Bell, User, Settings, Home } from "lucide-react";

export default function ResearcherSidebar({ active }: { active: string }) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Grant Portal</h2>
            <p className="text-xs text-muted-foreground">Researcher</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-col h-full justify-between min-h-[60vh]">
          <div>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "dashboard"}>
                      <Link href="/dashboard/researcher">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "grants"}>
                      <Link href="/dashboard/researcher/grants">
                        <Award className="w-4 h-4" />
                        <span>Browse Grants</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "proposals"}>
                      <Link href="/dashboard/researcher/proposals">
                        <FileText className="w-4 h-4" />
                        <span>My Proposals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "submit"}>
                      <Link href="/dashboard/researcher/submit">
                        <Plus className="w-4 h-4" />
                        <span>Submit Proposal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "notifications"}>
                      <Link href="/dashboard/researcher/notifications">
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "profile"}>
                      <Link href="/dashboard/researcher/profile">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "reports"}>
                      <Link href="/dashboard/researcher/reports">
                        <FileText className="w-4 h-4" />
                        <span>Progress Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={active === "settings"}>
                      <Link href="/dashboard/researcher/settings">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
          <div className="mb-4">
            <LogoutButton />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
} 