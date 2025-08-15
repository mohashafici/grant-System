"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/search-grants", label: "Search Grants" },
  { href: "/grant-calendar", label: "Grant Calendar" },
  { href: "/application-help", label: "Application Help" },
  { href: "/resources", label: "Resources & Training" },
  { href: "/community", label: "Community & Forums" },
  { href: "/announcements", label: "Announcements" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="border-b border-blue-800/30 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white sticky top-0 z-50 shadow-xl backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logoss.png" alt="Mubarak Grant Portal Logo" className="w-16 h-16 rounded-xl object-cover shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Mubarak Grant Portal</h1>
              <p className="text-sm text-blue-100 font-medium">Find and secure grants for your research</p>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 text-base">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    (isActive
                      ? "text-blue-900 font-bold bg-white rounded-lg px-4 py-2 shadow-md"
                      : "text-blue-100 hover:text-white hover:bg-blue-800/50 rounded-lg px-4 py-2 transition-all duration-200")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/login">
              <Button variant="outline" className="border-blue-200 text-white hover:bg-blue-700 hover:border-blue-300 bg-transparent font-semibold px-6">
                Sign In
              </Button>
            </Link>
          </nav>
          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 hover:bg-blue-800/50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-blue-700/50">
            <nav className="flex flex-col space-y-3 pt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      (isActive
                        ? "text-blue-900 font-bold bg-white rounded-lg px-4 py-2 shadow-md"
                        : "text-blue-100 hover:text-white hover:bg-blue-800/50 rounded-lg px-4 py-2 transition-all duration-200")
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="border-blue-200 text-white hover:bg-blue-700 hover:border-blue-300 bg-transparent w-full mt-2 font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 