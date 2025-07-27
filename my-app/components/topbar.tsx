import React from "react";
import NotificationBell from "./notification-bell";
import { ProfileMenu } from "./profile-menu";

export function Topbar({ userName, userRole, userEmail }: { userName: string; userRole: string; userEmail: string }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center gap-4">
      <div>
        <div className="font-semibold text-lg text-gray-900">{userName}</div>
        <div className="text-xs text-gray-500">{userRole} &bull; {userEmail}</div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ProfileMenu userName={userName} userRole={userRole} userEmail={userEmail} />
      </div>
    </header>
  );
} 