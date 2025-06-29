import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProfileMenu from "@/components/profile-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar active={active} />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-end items-center">
            <ProfileMenu profileHref="/admin/profile" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
} 