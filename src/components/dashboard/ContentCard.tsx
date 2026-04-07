import Link from "next/link";
import { LucideIcon, Edit3, Eye, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContentCard({
  title,
  count,
  lastUpdated,
  previewText,
  icon: Icon,
  href,
  colorClass,
}: {
  title: string;
  count: number;
  lastUpdated?: string;
  previewText?: string;
  icon: LucideIcon;
  href: string;
  colorClass?: string;
}) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-100">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition-colors group-hover:bg-opacity-10",
                colorClass ? colorClass.replace("text-", "bg-").replace("-600", "-50") : ""
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  colorClass || "text-slate-500 group-hover:text-indigo-600"
                )}
              />
            </div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
          </div>
          <div className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/50">
            {count}
          </div>
        </div>

        <div className="mt-4 space-y-1 md:h-[48px]">
          {previewText && (
            <p className="line-clamp-1 text-sm font-medium text-slate-700">
              "{previewText}"
            </p>
          )}
          {lastUpdated && (
            <p className="text-xs text-slate-500">Last updated {lastUpdated}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
        <Link
          href={href}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          <Eye className="h-3.5 w-3.5" />
          View All
        </Link>
        <Link
          href={`${href}?create=true`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add New
        </Link>
      </div>
    </div>
  );
}
