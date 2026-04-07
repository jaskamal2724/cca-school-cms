"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Calendar,
  Users,
  Briefcase,
  Award,
  MonitorPlay,
  MessageSquare,
  Info,
  UserPlus,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Hero slides", href: "/dashboard/heroes", icon: ImageIcon },
  { name: "Blog posts", href: "/dashboard/blogs", icon: Info },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Gallery", href: "/dashboard/gallery", icon: ImageIcon },
  { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
  { name: "Achievers", href: "/dashboard/achievers", icon: Award },
  { name: "Alumni", href: "/dashboard/alumni", icon: Users },
  { name: "Leadership", href: "/dashboard/leadership", icon: Briefcase },
  { name: "Facilities", href: "/dashboard/facilities", icon: MonitorPlay },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dashboardData = useAppSelector((state) => state.dashboard);
  const role = dashboardData.role;
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (pathname === "/login") return null;

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out z-20 shrink-0",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className={cn("flex items-center h-16 shrink-0 border-b border-slate-100 px-4 transition-all duration-300", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 overflow-hidden outline-none transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-semibold text-white shrink-0 shadow-inner">
              <Image src="/CCA_logo.png" width={80} height={80} alt="Logo" className="object-cover" />
            </div>
            <span className="text-sm font-semibold text-slate-900 truncate tracking-tight">
              CCA CMS
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5 mx-auto" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-1">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-2">
            Content
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border-l-2 border-indigo-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors",
                  isCollapsed ? "w-5 h-5 mx-auto" : "w-4 h-4",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}

        {role === "superadmin" && (
          <>
            <div className="pt-4 mt-4 mb-2 border-t border-slate-100" />
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Administration
              </p>
            )}
            <Link
              href="/dashboard/admin/create"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/dashboard/admin/create"
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border-l-2 border-indigo-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-2 border-transparent"
              )}
              title={isCollapsed ? "Create admin" : undefined}
            >
              <UserPlus
                className={cn(
                  "shrink-0 transition-colors",
                  isCollapsed ? "w-5 h-5 mx-auto" : "w-4 h-4",
                  pathname === "/dashboard/admin/create" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!isCollapsed && <span>Create admin</span>}
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
