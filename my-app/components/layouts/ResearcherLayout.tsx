import ResearcherSidebar from "@/components/sidebar/ResearcherSidebar";
import ProfileMenu from "@/components/profile-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ResearcherLayout({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ResearcherSidebar active={active} />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-end items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <ProfileMenu profileHref="/researcher/profile" />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
} 