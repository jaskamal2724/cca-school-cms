"use client";

import { Edit, Trash2, Search, Filter, MoreHorizontal } from "lucide-react";

interface CRUDCardGridProps {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: any) => void;
  loading?: boolean;
  renderCard: (item: any) => React.ReactNode;
}

export default function CRUDCardGrid({
  data,
  onEdit,
  onDelete,
  loading,
  renderCard,
}: CRUDCardGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            className="input-field pl-9 py-2 text-sm bg-white border-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shadow-sm"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar pr-3 -mr-3 pb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-xl aspect-[4/3] animate-pulse"
            ></div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="premium-card p-12 text-center text-slate-500">
          <p>No records found. Click "Add" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar pr-3 -mr-3 pb-6">
          {data.map((item, index) => (
            <div
              key={item.id || index}
              className="group relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {renderCard(item)}
              
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-slate-200/50 shadow-sm">
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
