import { Activity, ImageIcon, FileText, MessageSquare, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// This is an array of mock activities since an audit_log is not fully available yet.
export const MOCK_ACTIVITIES = [
  {
    id: 1,
    action: "Blog 'Annual Sports Day 2025' published",
    timestamp: "2 hours ago",
    icon: FileText,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    action: "12 images uploaded to Gallery",
    timestamp: "4 hours ago",
    icon: ImageIcon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 3,
    action: "New testimonial added by John Doe",
    timestamp: "Yesterday",
    icon: MessageSquare,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: 4,
    action: "Event 'Science Fair' created",
    timestamp: "2 days ago",
    icon: PlusCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Activity className="h-5 w-5 text-indigo-500" />
        <h3 className="font-semibold text-slate-900">Recent Activity</h3>
      </div>
      
      <div className="mt-6 flow-root">
        <ul role="list" className="-mb-8">
          {MOCK_ACTIVITIES.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== MOCK_ACTIVITIES.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={cn(
                        activity.iconBg,
                        "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                      )}
                    >
                      <activity.icon
                        className={cn("h-4 w-4", activity.iconColor)}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-slate-600">
                        {activity.action}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-400">
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
