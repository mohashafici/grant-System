import React from "react";

export default function SidebarInset({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col min-h-screen bg-gray-50">{children}</div>;
} 