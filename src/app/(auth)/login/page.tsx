"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/hooks";
import { setUserId } from "@/redux/features/auth/authSlice";
import { setDashboardData } from "@/redux/features/dashboard/dashboardSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user_id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && userId) {
      router.replace("/dashboard/");
    }
  }, [mounted, userId, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowLoader(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const dashboardData = {
        full_name: data.fullName,
        role: data.role,
        email: data.email,
      };
      
      dispatch(setUserId(data.userId));
      dispatch(setDashboardData(dashboardData));
      
      router.replace("/dashboard/");
    } catch (error) {
      setError("An error occurred during login");
      setLoading(false);
      setShowLoader(false);
    } 
  };

  return (
    <>
      {showLoader && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/20 backdrop-blur-xl animate-[fade-in_0.5s_ease-out]">
          <div className="relative flex items-center justify-center w-32 h-32">
            {/* Gradient Spinning Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#7888c0] border-r-[#c8d0f5] animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-[#7888c0] border-l-[#c8d0f5] animate-[spin_1.5s_linear_infinite_reverse]"></div>

            {/* Pulsing Logo Container */}
            <div className="relative w-20 h-20 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-inner animate-pulse">
              <Image
                src="/CCA_logo.png"
                alt="Loading"
                width={60}
                height={60}
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <h3 className="text-[#162758] font-bold text-xl tracking-wider animate-bounce">
              Authenticating
            </h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#7888c0] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-[#bdc5ed] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-[#c8d0f5] rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center  p-4 font-sans text-slate-900 border-none">
        <div className="w-full max-w-105 pb-12">
          <form onSubmit={handleLogin} className="relative w-full">
            {/* Main Card */}
            <div className="bg-[#c8d0f5] rounded-4xl relative z-10 pt-20 pb-11.5 px-11.5 shadow-[0_20px_40px_rgba(0,0,50,0.15)] flex flex-col items-center justify-center h-87.5 ">
              {/* Avatar Circle */}
              <div className="absolute -top-13.75 left-1/2 -translate-x-1/2 w-27.5 h-27.5  rounded-full flex items-center justify-center shadow-md">
                <Image
                  src="/CCA_logo.png"
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-25 h-25 rounded-full object-cover"
                  priority
                />
              </div>

              {error && (
                <div className="mb-4 w-full p-3 rounded-lg bg-red-50 text-red-700 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-10 w-full">
                {/* Email Input */}
                <div className="flex h-11.5 shadow-sm bg-[#7888c0] w-full rounded-2xl p-2">
                  <div className="w-11.5 shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {mounted && (
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email ID"
                      className="w-full bg-transparent text-[#162758] placeholder-[#c4cce8] px-4 py-2 focus:outline-none text-[15px] [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#7888c0] [&:-webkit-autofill]:[-webkit-text-fill-color:#162758] rounded-r-xl"
                      required
                    />
                  )}
                </div>

                {/* Password Input */}
                <div className="flex h-11.5 shadow-sm bg-[#7888c0] w-full rounded-2xl p-2">
                  <div className="w-11.5 shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4.5 h-4.5 text-[#162758]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {mounted && (
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-transparent text-[#162758] placeholder-[#c4cce8] px-4 py-2 focus:outline-none text-[15px] [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#7888c0] [&:-webkit-autofill]:[-webkit-text-fill-color:#162758] rounded-r-xl"
                      required
                    />
                  )}
                </div>

                {/* Options */}
                <div className="flex items-center justify-between text-[13px] pt-3 w-full">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-5 h-5 bg-[#000000] rounded-md flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 text-white"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-[#808ecc] font-bold group-hover:text-[#6573aa] transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-[#808ecc] font-bold hover:text-[#6573aa] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-3/4 bg-[#bdc5ed] -mt-12 pt-17 pb-5 rounded-b-4xl relative z-0 text-white text-[16px] font-bold tracking-[0.05em] hover:bg-[#aab4e4] transition-colors focus:outline-none flex justify-center items-center shadow-lg mx-auto"
            >
              {loading ? (
                <Loader2 className="w-2 h-2 animate-spin text-white" />
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
