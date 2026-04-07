"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";

export default function RootPage() {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user_id);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Show loader for 2.5 seconds, then redirect
    const timer = setTimeout(() => {
      if (!userId) {
        router.replace("/login");
      } else {
        router.replace("/dashboard/");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [userId, router]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-xl animate-[fade-in_0.5s_ease-out]">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Gradient Spinning Ring - outer */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#7888c0] border-r-[#c8d0f5] animate-spin"></div>
        {/* Inner reverse spinning ring */}
        <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-[#7888c0] border-l-[#c8d0f5] animate-[spin_1.5s_linear_infinite_reverse]"></div>

        {/* Pulsing Logo Container */}
        <div className="relative w-20 h-20 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-inner animate-pulse">
          <Image
            src="/CCA_logo.png"
            alt="School Logo"
            width={60}
            height={60}
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-[#162758] font-bold text-xl tracking-wider animate-bounce">
          Setting up things
        </h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#7888c0] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#bdc5ed] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#c8d0f5] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
