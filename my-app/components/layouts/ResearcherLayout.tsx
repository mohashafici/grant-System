import ResearcherSidebar from "@/components/sidebar/ResearcherSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarInset from "@/components/ui/sidebar-inset";
import ProfileMenu from "@/components/profile-menu";
import NotificationBell from "@/components/notification-bell";

export default function ResearcherLayout({ children, email, firstName, active = "dashboard" }: { children: React.ReactNode, email?: string, firstName?: string, active?: string }) {
  return (
    <SidebarProvider>
      <ResearcherSidebar active={active} />
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-end items-center gap-4">
          <NotificationBell />
          <ProfileMenu profileHref="/researcher/profile" email={email} firstName={firstName} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 