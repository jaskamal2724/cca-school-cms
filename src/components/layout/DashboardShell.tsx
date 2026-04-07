"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { CommandMenu } from "@/components/CommandMenu";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user_id);

  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    }
  }, [userId, router]);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <Sidebar />
      <div className="!flex-1 !w-full !max-w-none flex flex-col relative min-w-0 overflow-hidden">
        <Topbar onOpenCommandMenu={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-0">
          <div className="!w-full !max-w-none space-y-8 animate-in fade-in duration-500 p-6">
            {children}
          </div>
        </main>
      </div>
      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />
    </div>
  );
}
