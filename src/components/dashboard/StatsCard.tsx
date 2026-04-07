import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatsCard({
  title,
  value,
  trend,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md hover:ring-slate-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend.positive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
    </div>
  );
}
