"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Menu, X } from "lucide-react";
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
    <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Innovation Grant Portal</h1>
              <p className="text-sm text-gray-600">Find and secure grants for your research</p>
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
                      ? "text-blue-700 font-bold underline bg-blue-100 rounded-md px-3 py-2"
                      : "text-gray-600 hover:text-blue-600 transition-colors")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/login">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                Sign In
              </Button>
            </Link>
          </nav>
          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      (isActive
                        ? "text-blue-700 font-bold underline bg-blue-100 rounded-md px-3 py-2"
                        : "text-gray-600 hover:text-blue-600 transition-colors py-2")
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
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent w-full mt-2"
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