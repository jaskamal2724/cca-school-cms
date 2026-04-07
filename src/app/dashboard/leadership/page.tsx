"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Briefcase } from "lucide-react";
import CRUDCardGrid from "@/components/ui/CRUDCardGrid";
import CRUDForm from "@/components/ui/CRUDForm";

export default function LeadershipPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fields: any[] = [
    { label: "Internal Name", name: "name", type: "text", required: true },
    {
      label: "Role / Designation",
      name: "role",
      type: "text",
      required: true,
      placeholder: "e.g. Chairman, Principal",
    },
    { label: "Photo URL", name: "image_url", type: "url", required: true },
    {
      label: "Message Text",
      name: "message_text",
      type: "textarea",
      required: true,
    },
  ];

  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("leadership_messages")
      .select("*")
      .order("created_at", { ascending: true });
    setData(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem)
      await supabase
        .from("leadership_messages")
        .update(formData)
        .eq("id", editingItem.id);
    else await supabase.from("leadership_messages").insert([formData]);
    await fetch();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: any) {
    if (confirm("Are you sure?")) {
      await supabase.from("leadership_messages").delete().eq("id", id);
      fetch();
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Leadership
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
            <Plus className="w-5 h-5 mr-2" /> Add Message
          </button>
        )}
      </div>
      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Message" : "Create New Message"}
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
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 mb-4 ring-4 ring-slate-50/50 flex-shrink-0 shadow-sm border border-slate-200/50">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mt-7" />
                )}
              </div>
              <h3 className="font-semibold text-slate-900 text-lg mb-0.5">
                {item.name}
              </h3>
              <p className="text-sm font-medium text-teal-600 mb-4">
                {item.role}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                <p className="text-[13px] text-slate-500 leading-relaxed italic line-clamp-4">
                  &quot;{item.message_text}&quot;
                </p>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
