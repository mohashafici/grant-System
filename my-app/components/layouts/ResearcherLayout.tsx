import ResearcherSidebar from "@/components/sidebar/ResearcherSidebar";
import ProfileMenu from "@/components/profile-menu";

export default function ResearcherLayout({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ResearcherSidebar active={active} />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-end items-center">
          <ProfileMenu profileHref="/researcher/profile" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 