"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Image as ImageIcon,
  Calendar,
  Info,
  MessageSquare,
  Award,
  Users,
  Briefcase,
  MonitorPlay,
  FileText,
  Upload,
  PlusCircle,
  FolderOpen,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  QuickActions,
  QuickActionItem,
} from "@/components/dashboard/QuickActions";
import { ContentCard } from "@/components/dashboard/ContentCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Icon } from "@iconify/react";

type ContentStat = {
  label: string;
  count: number;
  href: string;
  icon: typeof ImageIcon;
  colorClass: string;
};

const contentRoutes: Omit<ContentStat, "count">[] = [
  {
    label: "Blog Posts",
    href: "/dashboard/blogs",
    icon: Info,
    colorClass: "text-orange-600",
  },
  {
    label: "Events",
    href: "/dashboard/events",
    icon: Calendar,
    colorClass: "text-emerald-600",
  },
  {
    label: "Gallery",
    href: "/dashboard/gallery",
    icon: ImageIcon,
    colorClass: "text-purple-500",
  },
  {
    label: "Testimonials",
    href: "/dashboard/testimonials",
    icon: MessageSquare,
    colorClass: "text-rose-600",
  },
  {
    label: "Achievers",
    href: "/dashboard/achievers",
    icon: Award,
    colorClass: "text-amber-600",
  },
  {
    label: "Alumni",
    href: "/dashboard/alumni",
    icon: Users,
    colorClass: "text-blue-600",
  },
  {
    label: "Leadership",
    href: "/dashboard/leadership",
    icon: Briefcase,
    colorClass: "text-green-600",
  },
  {
    label: "Facilities",
    href: "/dashboard/facilities",
    icon: MonitorPlay,
    colorClass: "text-indigo-600",
  },
  {
    label: "Hero Slides",
    href: "/dashboard/heroes",
    icon: ImageIcon,
    colorClass: "text-indigo-600",
  },
];

const tableByHref: Record<string, string> = {
  "/dashboard/heroes": "hero_slides",
  "/dashboard/events": "events",
  "/dashboard/blogs": "blog_posts",
  "/dashboard/gallery": "gallery",
  "/dashboard/testimonials": "student_testimonials",
  "/dashboard/achievers": "achievers",
  "/dashboard/alumni": "alumni",
  "/dashboard/leadership": "leadership_messages",
  "/dashboard/facilities": "facilities",
};

export default function DashboardHome() {
  const userId = useAppSelector((state) => state.auth.user_id);
  const dashboardData = useAppSelector((state) => state.dashboard);

  const [loading, setLoading] = useState(true);
  const [ stats, setStats] = useState<ContentStat[]>([]);
  const [mounted, setMounted] = useState(false);

  // Computed summary metrics
  const totalContent = stats.reduce((acc, curr) => acc + curr.count, 0);
  const totalBlogs = stats.find((s) => s.label === "Blog Posts")?.count || 0;
  const totalEvents = stats.find((s) => s.label === "Events")?.count || 0;
  const totalMedia =
    (stats.find((s) => s.label === "Gallery")?.count || 0) +
    (stats.find((s) => s.label === "Hero Slides")?.count || 0);

  const loadDashboard = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const countResults = await Promise.all(
        contentRoutes.map(async (r) => {
          const table = tableByHref[r.href];
          if (!table) return { ...r, count: 0 };
          const { count, error } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true });
          return {
            ...r,
            count: error ? 0 : (count ?? 0),
          };
        }),
      );
      setStats(countResults);
    } catch (statsErr) {
      console.error("Failed to load stats:", statsErr);
      setStats(contentRoutes.map((r) => ({ ...r, count: 0 })));
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, [loadDashboard]);

  const quickActions: QuickActionItem[] = [
    {
      label: "Add Blog",
      icon: FileText,
      href: "/dashboard/blogs?create=true",
      bgClass: "bg-orange-50",
      colorClass: "text-orange-600",
    },
    {
      label: "Create Event",
      icon: PlusCircle,
      href: "/dashboard/events?create=true",
      bgClass: "bg-emerald-50",
      colorClass: "text-emerald-600",
    },
    {
      label: "Upload Images",
      icon: Upload,
      href: "/dashboard/gallery?create=true",
      bgClass: "bg-purple-50",
      colorClass: "text-purple-600",
    },
    {
      label: "Add Testimonial",
      icon: MessageSquare,
      href: "/dashboard/testimonials?create=true",
      bgClass: "bg-rose-50",
      colorClass: "text-rose-600",
    },
  ];

  const displayName =
    dashboardData.full_name?.trim() ||
    dashboardData.email?.split("@")[0] ||
    "Admin";

  function greetingForHour(d: Date) {
    const h = d.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  if (!mounted) return null;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 custom-scrollbar">
      {/* Welcome Section */}
      <div className=" mb-10">
        <section className="relative overflow-hidden rounded-3xl p-8 shadow-xl text-white text-center bg-[#fafafa]">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-2 text-indigo-500">
              {greetingForHour(new Date())}, {displayName}{" "}
              <span className="inline-block animate-bounce origin-bottom">
                <Icon icon="lucide:hand" width="24" height="24" />
              </span>
            </h1>
            <p className="text-indigo-500 text-sm sm:text-base">
              Here's a quick overview of your school's content ecosystem.
              Everything looks great today.
            </p>
          </div>

          {/* Subtle decorative background shapes */}
          <div className="absolute -top-24 -right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-40 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        </section>
      </div>

      {/* Quick Actions */}
      <section className="mb-10">
        <QuickActions actions={quickActions} />
      </section>

      {/* Stats Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Total Content"
          value={loading ? "-" : totalContent}
          trend={{ value: "+12% this month", positive: true }}
          icon={FolderOpen}
        />
        <StatsCard
          title="Blog Posts"
          value={loading ? "-" : totalBlogs}
          trend={{ value: "+3 new", positive: true }}
          icon={FileText}
        />
        <StatsCard
          title="Events"
          value={loading ? "-" : totalEvents}
          trend={{ value: "2 upcoming", positive: true }}
          icon={Calendar}
        />
        <StatsCard
          title="Media Items"
          value={loading ? "-" : totalMedia}
          trend={{ value: "Stable", positive: true }}
          icon={ImageIcon}
        />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Grid */}
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Content Modules
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse p-5"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                    <div className="w-8 h-5 bg-slate-200 rounded-full" />
                  </div>
                  <div className="w-2/3 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-1/2 h-4 bg-slate-200 rounded" />
                  <div className="mt-8 flex gap-2">
                    <div className="h-8 flex-1 bg-slate-200 rounded-lg" />
                    <div className="h-8 flex-1 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
              {stats.map((s) => (
                <ContentCard
                  key={s.label}
                  title={s.label}
                  count={s.count}
                  icon={s.icon}
                  href={s.href}
                  colorClass={s.colorClass}
                  lastUpdated="recently"
                />
              ))}
            </div>
          )}
        </section>

        {/* Sidebar content: Activity Feed */}
        <section className="xl:col-span-1 space-y-6">
          <ActivityFeed />
        </section>
      </div>
    </div>
  );
}
