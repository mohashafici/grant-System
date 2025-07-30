import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { ProfileMenu } from "@/components/profile-menu"
import NotificationBell from "@/components/notification-bell";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarInset from "@/components/ui/sidebar-inset";

export default function AdminLayout({ active, children, title }: { active: string; children: React.ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <AdminSidebar active={active} />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-400 px-6 py-4 flex items-center" style={{ minHeight: '56px' }}>
          <SidebarTrigger className="h-12 w-12 bg-blue-100 border border-blue-400 text-blue-700 shadow-md mr-2 flex items-center justify-center" />
          {title && <h1 className="text-2xl font-bold text-gray-900 ml-4">{title}</h1>}
          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            <ProfileMenu />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 