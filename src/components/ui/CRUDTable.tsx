'use client'

import { Edit, Trash2, Search, Filter, MoreHorizontal } from "lucide-react";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface CRUDTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: any) => void;
  loading?: boolean;
}

export default function CRUDTable({ columns, data, onEdit, onDelete, loading }: CRUDTableProps) {
  return (
    <div className="premium-card !p-0 overflow-hidden">
      <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/30">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {columns.map((col) => (
                <th key={col.header} className="py-3 px-5 font-medium text-slate-500 text-[11px] uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              <th className="py-3 px-5 font-medium text-slate-500 text-[11px] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="py-4 px-6">
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </td>
                  ))}
                  <td className="py-4 px-6 flex justify-end gap-2">
                    <div className="h-4 bg-gray-100 rounded w-8"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-gray-400 italic font-medium">
                  No records found. Click "Add" to create one.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="group hover:bg-slate-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.header} className="py-3 px-5 text-sm text-slate-700">
                      {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                    </td>
                  ))}
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 px-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500">
        <span>{data.length} record{data.length !== 1 ? "s" : ""}</span>
        <div className="flex gap-1">
          <button type="button" className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 text-slate-600" disabled>
            Prev
          </button>
          <button type="button" className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 text-slate-600" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
