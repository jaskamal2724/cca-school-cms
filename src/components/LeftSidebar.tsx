'use client';  // Add this first

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";
import { clearUserId } from "@/redux/features/auth/authSlice";
import { clearDashboardData } from "@/redux/features/dashboard/dashboardSlice";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";  // Fixed import spacing

const LeftSidebar = () => {  // Remove async
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user_id);
  console.log(userId);
  const pathname = usePathname();
  const dashboardData = useAppSelector((state) => state.dashboard);
  const userName = dashboardData.full_name || "";
  const email = dashboardData.email || "";
  const role = dashboardData.role || "";
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // If we ever need to fetch avatar separately, do it here.
    // For now, Name/Email/Role are instantly provided by Redux!
  }, [userId]);

  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUserId());
    dispatch(clearDashboardData());
    
    // Using router.replace ensures Redux Persist has time to flush its state updates
    // before the page completely unloads.
    router.replace("/login");
  };

  if (pathname === "/login") return null;

  const initial = (userName || email || "?").charAt(0).toUpperCase();

  return (
    <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white cursor-pointer">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-600">
              {initial}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{userName || "Account"}</p>
          <p className="text-[10px] text-slate-500 truncate capitalize">{role || "User"}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;