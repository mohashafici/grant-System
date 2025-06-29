import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfileMenu({ profileHref = "/profile" }: { profileHref?: string }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full bg-gray-200 p-2 hover:bg-gray-300 focus:outline-none">
          <User className="w-6 h-6 text-gray-700" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={profileHref}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 