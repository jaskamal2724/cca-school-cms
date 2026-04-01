"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
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
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Hero slides", href: "/dashboard/heroes", icon: ImageIcon },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Blog posts", href: "/dashboard/blogs", icon: Info },
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

  if (pathname === "/login") return null;

  return (
    <aside className="w-64 shrink-0 flex flex-col sticky top-0 bg-white z-20 m-2 rounded-2xl">
      <div className="p-6 pb-4 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#7888c0]/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#162758] to-[#7888c0] text-sm font-semibold text-white shrink-0 shadow-inner">
            <Image
              src="/CCA_logo.png"
              width={100}
              height={100}
              alt="cca logo"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
              CCA School
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Website CMS</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Content
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-slate-100" : "text-slate-400"}`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        {role === "superadmin" && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Administration
            </p>
            <Link
              href="/dashboard/admin/create"
              className={`nav-item ${pathname === "/dashboard/admin/create" ? "nav-item-active" : ""}`}
            >
              <UserPlus
                className={`w-[18px] h-[18px] shrink-0 ${pathname === "/dashboard/admin/create" ? "text-slate-100" : "text-slate-400"}`}
              />
              <span>Create admin</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
