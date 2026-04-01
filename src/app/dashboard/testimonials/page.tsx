"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, MessageSquare } from "lucide-react";
import CRUDCardGrid from "@/components/ui/CRUDCardGrid";
import CRUDForm from "@/components/ui/CRUDForm";

export default function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fields: any[] = [
    { label: "Student Name", name: "name", type: "text", required: true },
    {
      label: "Grade",
      name: "grade",
      type: "text",
      required: true,
      placeholder: "e.g. Class XII - Science",
    },
    {
      label: "Message / Quote",
      name: "message",
      type: "textarea",
      required: true,
    },
    {
      label: "Student Photo URL",
      name: "image_url",
      type: "url",
      required: true,
    },
    {
      label: "Key Achievement",
      name: "achievement",
      type: "text",
      placeholder: "e.g. CBSE Topper - 98.2%",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("student_testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem)
      await supabase
        .from("student_testimonials")
        .update(formData)
        .eq("id", editingItem.id);
    else await supabase.from("student_testimonials").insert([formData]);
    await fetch();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: any) {
    if (confirm("Are you sure?")) {
      await supabase.from("student_testimonials").delete().eq("id", id);
      fetch();
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Testimonials
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
            <Plus className="w-5 h-5 mr-2" /> Add Testimonial
          </button>
        )}
      </div>
      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Testimonial" : "Create New Testimonial"}
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
            <div className="p-6 flex flex-col h-full relative overflow-hidden group">
              <MessageSquare className="absolute -top-4 -right-4 w-24 h-24 text-slate-50/50 rotate-12 -z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="flex-1 mb-6">
                <p className="text-[13px] text-slate-600 leading-relaxed italic line-clamp-4">
                  "{item.message}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 z-10">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span>{item.grade}</span>
                    {item.achievement && (
                      <>
                        <span>•</span>
                        <span className="text-teal-600 font-medium truncate">
                          {item.achievement}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
