'use client'

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";

interface Field {
  label: string;
  name: string;
  type: "text" | "textarea" | "select" | "number" | "url";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface CRUDFormProps {
  title: string;
  fields: Field[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CRUDForm({ title, fields, initialData, onSubmit, onCancel, loading }: CRUDFormProps) {
  const [formData, setFormData] = useState<any>(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                  className="input-field min-h-[120px] resize-y"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="input-field appearance-none bg-white"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="input-field"
                />
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-wrap gap-2 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 min-w-[140px] py-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary py-3 px-6"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
