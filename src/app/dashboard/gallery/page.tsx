"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Image as ImageIcon } from "lucide-react";
import CRUDCardGrid from "@/components/ui/CRUDCardGrid";
import CRUDForm from "@/components/ui/CRUDForm";

export default function GalleryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fields: any[] = [
    { label: "Image URL", name: "image_url", type: "url", required: true },
    { label: "Alt Text", name: "alt_text", type: "text", required: true },
    {
      label: "Category",
      name: "category",
      type: "text",
      placeholder: "e.g. gallery, sports, event",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem)
      await supabase.from("gallery").update(formData).eq("id", editingItem.id);
    else await supabase.from("gallery").insert([formData]);
    await fetch();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: any) {
    if (confirm("Are you sure?")) {
      await supabase.from("gallery").delete().eq("id", id);
      fetch();
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Gallery
          </h1>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setEditingItem(null);
              setIsEditing(true);
            }}
            className="btn-primary px-5 py-2.5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Image
          </button>
        )}
      </div>
      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Image" : "Create New Image"}
          fields={fields}
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsEditing(false);
            setEditingItem(null);
          }}
          loading={loading}
        />
      ) : (
        <CRUDCardGrid
          data={data}
          onEdit={(item) => {
            setEditingItem(item);
            setIsEditing(true);
          }}
          onDelete={handleDelete}
          loading={loading}
          renderCard={(item: any) => (
            <div className="flex flex-col h-full bg-white relative group">
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img
                  src={item.image_url}
                  alt={item.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.category && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[11px] font-medium bg-white/90 backdrop-blur-sm shadow-sm rounded-md tracking-wide uppercase text-slate-700">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.alt_text}
                </p>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
