import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProfileMenu from "@/components/profile-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarInset from "@/components/ui/sidebar-inset";

export default function AdminLayout({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar active={active} />
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          <ProfileMenu profileHref="/admin/profile" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 