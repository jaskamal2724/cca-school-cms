import LeftSidebar from "@/components/LeftSidebar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto m-2 rounded-2xl bg-white shadow-sm border border-slate-100">
        {children}
      </main>
      <LeftSidebar/>
    </>
  );
}
