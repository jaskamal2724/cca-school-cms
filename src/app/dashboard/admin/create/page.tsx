"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { UserPlus, Mail, Lock, User, Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateAdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: data.user.id, full_name: fullName, role: role }]);

        if (profileError)
          console.error("Profile creation error:", profileError);
      }

      setSuccess(true);
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create admin";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Super admin
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Create administrator
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Add a staff account for the website CMS. New users sign in with the
          email and password you set here.
        </p>
      </div>

      <div className="premium-card">
        <form onSubmit={handleCreateAdmin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-slate-100 text-slate-800 text-sm border border-slate-200">
              Account created. They can sign in with these credentials. In
              production, prefer inviting users from the Supabase dashboard or a
              server action with the service role.
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                placeholder="staff@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Initial password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Role
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === "admin"
                    ? "border-slate-900 bg-teal-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("superadmin")}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === "superadmin"
                    ? "border-slate-900 bg-teal-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                Super admin
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Create account
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push("/")}
            >
              Back to dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
