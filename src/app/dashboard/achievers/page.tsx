"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Award } from "lucide-react";
import CRUDCardGrid from "@/components/ui/CRUDCardGrid";
import CRUDForm from "@/components/ui/CRUDForm";

export default function AchieversPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fields: any[] = [
    { label: "Student Name", name: "name", type: "text", required: true },
    {
      label: "Score / Grade",
      name: "score",
      type: "text",
      required: true,
      placeholder: "e.g. 98.6%",
    },
    {
      label: "Stream / Field",
      name: "stream",
      type: "text",
      required: true,
      placeholder: "e.g. Science, Sports, Art",
    },
    {
      label: "Photo URL",
      name: "image_url",
      type: "url",
      placeholder: "Optional: URL to student photo",
    },
  ];

  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("achievers")
      .select("*")
      .order("id", { ascending: true });
    setData(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem)
      await supabase
        .from("achievers")
        .update(formData)
        .eq("id", editingItem.id);
    else await supabase.from("achievers").insert([formData]);
    await fetch();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: any) {
    if (confirm("Are you sure?")) {
      await supabase.from("achievers").delete().eq("id", id);
      fetch();
    }
  }

  return (
    <div className="!w-full !max-w-none space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Achievers
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
            <Plus className="w-5 h-5 mr-2" /> Add Achiever
          </button>
        )}
      </div>
      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Achiever" : "Create New Achiever"}
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
            <div className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 mb-4 flex-shrink-0 shadow-sm border border-slate-200/50">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Award className="w-8 h-8 text-slate-300 mx-auto mt-6" />
                )}
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-1">
                {item.name}
              </h3>
              <p className="text-sm font-medium text-teal-600 mb-2">
                {item.score}
              </p>
              <div className="mt-auto pt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {item.stream}
                </span>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
