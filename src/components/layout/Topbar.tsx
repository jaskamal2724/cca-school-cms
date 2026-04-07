"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";
import { clearUserId } from "@/redux/features/auth/authSlice";
import { clearDashboardData } from "@/redux/features/dashboard/dashboardSlice";
import { Bell, Search, Plus, LogOut, ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Topbar({ onOpenCommandMenu }: { onOpenCommandMenu: () => void }) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user_id);
  const dashboardData = useAppSelector((state) => state.dashboard);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = dashboardData.full_name || "";
  const email = dashboardData.email || "";
  const role = dashboardData.role || "";

  // The actual avatarUrl could be fetched or added to dashboardData. 
  // We'll use initial for now
  const initial = (userName || email || "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUserId());
    dispatch(clearDashboardData());
    router.replace("/login");
  };

  const createOptions = [
    { label: "New Blog Post", href: "/dashboard/blogs?create=true" },
    { label: "New Event", href: "/dashboard/events?create=true" },
    { label: "Add Gallery Image", href: "/dashboard/gallery?create=true" },
  ];

  if (!mounted) return null; // Prevent hydration errors

  return (
    <header className="sticky top-0 z-10 flex h-16 !w-full !max-w-none shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        {/* Global Search Trigger */}
        <button
          onClick={onOpenCommandMenu}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors w-64 ring-2 ring-transparent focus-visible:ring-indigo-600 outline-none"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Create Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors ring-2 ring-transparent focus-visible:ring-indigo-300 outline-none">
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="z-50 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              {createOptions.map((opt) => (
                <DropdownMenu.Item key={opt.href} asChild>
                  <Link
                    href={opt.href}
                    className="flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    {opt.label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Notifications */}
        {/* <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative outline-none ring-2 ring-transparent focus-visible:ring-indigo-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button> */}

        {/* User Dropdown */}
        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-slate-50 p-1 pl-2 pr-3 outline-none ring-2 ring-transparent focus-visible:ring-indigo-600 transition-colors">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                {initial}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {userName || "Account"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="z-50 min-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
              <div className="px-2 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-medium text-slate-900 truncate">{userName || "User"}</p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
              </div>
              
              <DropdownMenu.Item asChild>
                <Link
                  href="/dashboard/profile"
                  className="flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile Account
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="my-1 h-[1px] bg-slate-100" />
              
              <DropdownMenu.Item asChild>
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 outline-none transition-colors hover:bg-red-50 focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign out
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
