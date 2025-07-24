import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProfileMenu from "@/components/profile-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarInset from "@/components/ui/sidebar-inset";

export default function AdminLayout({ active, children, title }: { active: string; children: React.ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <AdminSidebar active={active} />
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex items-center">
          <SidebarTrigger className="h-8 w-8" />
          {title && <h1 className="text-2xl font-bold text-gray-900 ml-4">{title}</h1>}
          <div className="ml-auto">
            <ProfileMenu profileHref="/admin/profile" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
} 