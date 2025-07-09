import ResearcherSidebar from "@/components/sidebar/ResearcherSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarInset from "@/components/ui/sidebar-inset"; // To be created if not present
import { Topbar } from "@/components/topbar";

export default function ResearcherLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ResearcherSidebar active="dashboard" />
      <SidebarInset>
        <Topbar userName="Dr. Sarah Johnson" userRole="researcher" userEmail="sarah.johnson@university.edu" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 