import React from "react";

export function Topbar({ userName, userRole, userEmail }: { userName: string; userRole: string; userEmail: string }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center gap-4">
      <div>
        <div className="font-semibold text-lg text-gray-900">{userName}</div>
        <div className="text-xs text-gray-500">{userRole} &bull; {userEmail}</div>
      </div>
      {/* Add profile menu or notifications here if needed */}
    </header>
  );
} 