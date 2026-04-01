"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
  Loader2,
  Pencil,
  Image as ImageIcon,
  Calendar,
  Info,
  MessageSquare,
  Award,
  Users,
  Briefcase,
  MonitorPlay,
  LayoutGrid,
  Mail,
  User,
  Shield,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

type ContentStat = {
  label: string;
  count: number;
  href: string;
  icon: typeof ImageIcon;
  color: string;
};

const contentRoutes: Omit<ContentStat, "count">[] = [
  {
    label: "Hero slides",
    href: "/heroes",
    icon: ImageIcon,
    color: "text-[#4F46E5]",
  },
  { label: "Events", href: "/events", icon: Calendar, color: "text-[#10B981]" },
  { label: "Blog posts", href: "/blogs", icon: Info, color: "text-[#F97316]" },
  {
    label: "Gallery items",
    href: "/gallery",
    icon: ImageIcon,
    color: "text-[#A855F7]",
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    icon: MessageSquare,
    color: "text-[#F43F5E]",
  },
  {
    label: "Achievers",
    href: "/achievers",
    icon: Award,
    color: "text-[#F59E0B]",
  },
  { label: "Alumni", href: "/alumni", icon: Users, color: "text-[#3B82F6]" },
  {
    label: "Leadership",
    href: "/leadership",
    icon: Briefcase,
    color: "text-[#22C55E]",
  },
  {
    label: "Facilities",
    href: "/facilities",
    icon: MonitorPlay,
    color: "text-[#655de9]",
  },
];

const tableByHref: Record<string, string> = {
  "/heroes": "hero_slides",
  "/events": "events",
  "/blogs": "blog_posts",
  "/gallery": "gallery",
  "/testimonials": "student_testimonials",
  "/achievers": "achievers",
  "/alumni": "alumni",
  "/leadership": "leadership_messages",
  "/facilities": "facilities",
};

function greetingForHour(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHome() {
  const userId = useAppSelector((state) => state.auth.user_id);
  const dashboardData = useAppSelector((state) => state.dashboard);
  const dispatch = require("@/lib/hooks").useAppDispatch();
  const {
    setDashboardData,
  } = require("@/redux/features/dashboard/dashboardSlice");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ContentStat[]>([]);
  const [email, setEmail] = useState(dashboardData.email || "");
  const [role, setRole] = useState<string | null>(dashboardData.role || null);
  const [fullName, setFullName] = useState(dashboardData.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/profile/${userId}`);
      
      if (!response.ok) {
        console.error(`Profile API returned ${response.status}`);
        setFullName(dashboardData.full_name || "");
        setEmail(dashboardData.email || "");
        setRole(dashboardData.role || "");
      } else {
        const textData = await response.text();
        try {
          const data = JSON.parse(textData);
          if (data.error) {
            setFormError(data.error);
          } else {
            // handle if the database returns an array [ { profile_data } ] instead of an object
            const profileRow = Array.isArray(data) ? data[0] : data;
            setFullName(profileRow?.full_name || dashboardData.full_name || "");
            setEmail(profileRow?.email || dashboardData.email || "");
            setRole(profileRow?.role || dashboardData.role || "");
            setAvatarUrl(profileRow?.avatar_url || "");
          }
        } catch (e) {
          console.error("Failed to parse profile JSON:", textData);
          setFullName(dashboardData.full_name || "");
          setEmail(dashboardData.email || "");
          setRole(dashboardData.role || "");
        }
      }
    } catch (apiError) {
      console.error("Network error fetching profile:", apiError);
      setFullName(dashboardData.full_name || "");
      setEmail(dashboardData.email || "");
      setRole(dashboardData.role || "");
    }

    try {
      const countResults = await Promise.all(
        contentRoutes.map(async (r) => {
          const table = tableByHref[r.href];
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
      setStats(contentRoutes.map(r => ({ ...r, count: 0 })));
    }
    
    setLoading(false);
  }, [userId, dashboardData]);

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, [loadDashboard]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const trimmedName = fullName.trim();
      const trimmedAvatar = avatarUrl.trim();

      const { error: nameErr } = await supabase
        .from("profiles")
        .update({ full_name: trimmedName || null })
        .eq("id", user.id);
      if (nameErr) throw nameErr;

      await supabase
        .from("profiles")
        .update({ avatar_url: trimmedAvatar || null })
        .eq("id", user.id);

      const { error: metaErr } = await supabase.auth.updateUser({
        data: {
          full_name: trimmedName,
          avatar_url: trimmedAvatar || null,
        },
      });
      if (metaErr) throw metaErr;

      if (editEmail.trim() && editEmail.trim() !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({
          email: editEmail.trim(),
        });
        if (emailErr) throw emailErr;
        setFormSuccess(
          "Profile updated. If you changed your email, check your inbox to confirm the new address.",
        );
      } else {
        setFormSuccess("Profile updated.");
      }

      if (newPassword.length >= 8) {
        const { error: pwErr } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (pwErr) throw pwErr;
        setNewPassword("");
        setFormSuccess((s) =>
          s ? `${s} Password was changed.` : "Password was changed.",
        );
      }

      setEditingProfile(false);

      // Update global context so the sidebar refreshes instantly!
      dispatch(
        setDashboardData({
          full_name: trimmedName || null,
          email: editEmail.trim() ? editEmail.trim() : email,
          role: role,
        }),
      );

      await loadDashboard();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  const displayName = fullName?.trim() || email?.split("@")[0] || "there";
  const initial = displayName.charAt(0).toUpperCase();
  const previewAvatar = avatarUrl?.trim();

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-[#162758] tracking-tight">
            {mounted ? `${greetingForHour(new Date())}` : "Good morning"},{" "}
            {displayName}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Manage public website content for your school. Use the sections
            below to review volume at a glance and open the editor for each
            area.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading overview…</span>
        </div>
      ) : (
        <>
          <section aria-labelledby="content-overview">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <h2
                id="content-overview"
                className="text-sm font-semibold text-slate-900"
              >
                Website content
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="surface-card p-4 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#7888c0] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${s.color} truncate`}
                        >
                          {s.label}
                        </p>
                        <p className="text-xs text-slate-500">Open section</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold tabular-nums text-slate-900 shrink-0">
                      {s.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section
            aria-labelledby="account-heading"
            className="premium-card !p-0 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/40">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <h2
                  id="account-heading"
                  className="text-sm font-semibold text-slate-900"
                >
                  Your account
                </h2>
              </div>
              {!editingProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(true);
                    setFormError(null);
                    setFormSuccess(null);
                    setEditEmail(email);
                  }}
                  className="btn-secondary text-xs py-2"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit profile
                </button>
              )}
            </div>

            <div className="p-6">
              {!editingProfile ? (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-200 ring-2 ring-slate-100">
                      {previewAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewAvatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xl font-medium text-slate-600">
                          {initial}
                        </div>
                      )}
                    </div>
                  </div>
                  <dl className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                        Name
                      </dt>
                      <dd className="text-slate-900 font-medium">{fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                        Email
                      </dt>
                      <dd className="text-slate-900 break-all">
                        {email || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                        Role
                      </dt>
                      <dd className="text-slate-900 capitalize">
                        {role?.replace("_", " ") || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                        User ID
                      </dt>
                      <dd className="text-slate-600 font-mono text-xs break-all">
                        {userId ?? "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 max-w-xl"
                >
                  {formError && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                      {formSuccess}
                    </div>
                  )}

                  <div className="flex gap-4 items-start">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-200 shrink-0 ring-2 ring-slate-100">
                      {previewAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewAvatar}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-lg font-medium text-slate-600">
                          {initial}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 pt-1">
                      Photo URL can point to any HTTPS image (e.g. from your
                      school site or storage). Leave blank to use initials.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Full name
                    </label>
                    <input
                      className="input-field"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <p className="text-xs text-slate-500">
                      Changing email may require confirmation, depending on your
                      project settings.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Profile photo URL
                    </label>
                    <input
                      type="url"
                      className="input-field"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://…"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      New password
                    </label>
                    <input
                      type="password"
                      className="input-field"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      autoComplete="new-password"
                    />
                    <p className="text-xs text-slate-500">
                      At least 8 characters if you set a new one.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={saving}
                      onClick={() => {
                        setEditingProfile(false);
                        setFormError(null);
                        setFormSuccess(null);
                        setNewPassword("");
                        loadDashboard();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
