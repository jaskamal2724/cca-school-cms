"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, LogOut, LayoutDashboard, Image as ImageIcon, Users, 
  GalleryVertical, Calendar, Info, MessageSquare, Award, 
  Briefcase, MonitorPlay, UserPlus 
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Hero", href: "/dashboard/heroes", icon: ImageIcon },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Blogs", href: "/dashboard/blogs", icon: Info },
  { name: "Gallery", href: "/dashboard/gallery", icon: GalleryVertical },
  { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
  { name: "Achievers", href: "/dashboard/achievers", icon: Award },
  { name: "Alumni", href: "/dashboard/alumni", icon: Users },
  { name: "Leadership", href: "/dashboard/leadership", icon: Briefcase },
  { name: "Facilities", href: "/dashboard/facilities", icon: MonitorPlay },
];

export default function Navbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? "");
      const meta = user.user_metadata as { avatar_url?: string; full_name?: string } | undefined;
      const metaAvatar = meta?.avatar_url ?? null;

      const { data } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setRole(data.role);
        setUserName(data.full_name || user.email?.split("@")[0] || "");
        setAvatarUrl(data.avatar_url || metaAvatar);
      } else {
        setUserName(user.email?.split("@")[0] || "");
        setAvatarUrl(metaAvatar);
      }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const initial = (userName || email || "?").charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 mt-2 select-none">
      {/* Centered All-in-one Navigation Pill */}
      <div className="flex-1 flex justify-center overflow-x-auto no-scrollbar py-1">
        <nav className="bg-[#e2e2e2] p-1 rounded-full flex items-center gap-0.5 shadow-sm min-w-max">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  isActive 
                    ? "bg-[#e8b6f2] text-[#8e24aa] shadow-sm transform scale-105 z-10" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/40"
                }`}
              >
                {/* Simplified nav for high density */}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div 
        className="relative group shrink-0" 
        onMouseEnter={() => setIsProfileOpen(true)} 
        onMouseLeave={() => setIsProfileOpen(false)}
      >
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-[#7888c0] to-[#c8d0f5] border-2 border-white shadow-sm flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="User" className="h-full w-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
        </button>

        {/* User Card Dropdown */}
        <div 
          className={`absolute right-0 mt-1 w-64 pt-2 transition-all duration-300 origin-top-right z-50 ${
            isProfileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-[#bdc5ed] flex items-center justify-center text-[#162758] font-bold text-lg">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {role?.replace('_', ' ') || 'User'}
                </span>
              </div>
            </div>

            <div className="p-2 space-y-1">
              {role === "superadmin" && (
                <Link
                  href="/dashboard/admin/create"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#162758] rounded-xl transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-[#bdc5ed]/20 group-hover:bg-[#bdc5ed]/40 text-[#7888c0]">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  Add new admin
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
              >
                <div className="p-1.5 rounded-lg bg-red-100/50 group-hover:bg-red-100">
                  <LogOut className="w-4 h-4" />
                </div>
                Logout Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
