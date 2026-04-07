"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";
import { setDashboardData } from "@/redux/features/dashboard/dashboardSlice";
import { User, Mail, Shield, BadgeCheck, Save, Loader2, Fingerprint } from "lucide-react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user_id);
  const dashboardData = useAppSelector((state) => state.dashboard);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (dashboardData.full_name) setFullName(dashboardData.full_name);
    if (dashboardData.email) setEmail(dashboardData.email);
  }, [dashboardData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setMessage(null);

    try {
      // 1. Update Profile fullname in public.profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", userId);

      if (profileError) throw profileError;

      // 2. Update Auth email if changed
      let emailUpdateMessage = "";
      if (email !== dashboardData.email) {
        const { error: authError } = await supabase.auth.updateUser({ email });
        if (authError) throw authError;
        emailUpdateMessage = " If you changed your email, you may need to verify the new address.";
      }

      // Update Redux state
      dispatch(
        setDashboardData({
          full_name: fullName,
          email: email,
          role: dashboardData.role,
        })
      );

      setMessage({ type: "success", text: "Profile updated successfully!" + emailUpdateMessage });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const roleText = dashboardData.role === "superadmin" ? "Super administrator" : "Administrator";

  return (
    <div className="!w-full !max-w-none space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <User className="w-4 h-4" />
            Account Settings
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage your account details and personal preferences.
          </p>
        </div>
      </div>

      <div className="premium-card max-w-3xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg text-sm font-medium border ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editable Full Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Editable Email */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="your.email@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Read Only Role */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Account Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={roleText}
                  className="input-field pl-10 bg-slate-50 text-slate-500 cursor-not-allowed border-dashed focus:ring-0"
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Read Only User ID */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                User ID (Internal)
              </label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={userId || "Not generated"}
                  className="input-field pl-10 bg-slate-50 text-slate-500 cursor-not-allowed border-dashed focus:ring-0 font-mono text-xs"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
