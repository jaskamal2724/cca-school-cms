import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuickActionItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  colorClass?: string;
  bgClass?: string;
};

export function QuickActions({ actions }: { actions: QuickActionItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {actions.map((action, i) => (
        <Link
          key={i}
          href={action.href}
          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white pr-4 pl-1.5 py-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              action.bgClass || "bg-indigo-50",
              action.colorClass || "text-indigo-600",
              "group-hover:bg-indigo-600 group-hover:text-white"
            )}
          >
            <action.icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium text-slate-700">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
