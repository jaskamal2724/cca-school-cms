"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, MonitorPlay } from "lucide-react";
import CRUDTable from "@/components/ui/CRUDTable";
import CRUDForm from "@/components/ui/CRUDForm";

export default function FacilitiesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fields: any[] = [
    { label: "Facility Title", name: "title", type: "text", required: true },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      label: "Icon Emoji/Text",
      name: "icon",
      type: "text",
      placeholder: "e.g. 🖥️, ⚽, 🔬",
    },
    { label: "Image URL", name: "image_url", type: "url", required: true },
    {
      label: "Features (JSON List)",
      name: "features",
      type: "textarea",
      placeholder: 'e.g. ["Feature 1", "Feature 2"]',
    },
  ];

  const columns = [
    {
      header: "Icon",
      accessor: "icon",
      render: (val: string) => <span className="text-xl">{val}</span>,
    },
    { header: "Title", accessor: "title" },
    {
      header: "Features Count",
      accessor: "features",
      render: (val: any) =>
        Array.isArray(val)
          ? val.length
          : typeof val === "string"
            ? JSON.parse(val || "[]").length
            : 0,
    },
  ];

  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("facilities")
      .select("*")
      .order("created_at", { ascending: true });
    setData(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    // Parse features if it's a string
    if (typeof formData.features === "string") {
      try {
        formData.features = JSON.parse(formData.features);
      } catch (e) {
        formData.features = formData.features
          .split(",")
          .map((f: string) => f.trim());
      }
    }

    if (editingItem)
      await supabase
        .from("facilities")
        .update(formData)
        .eq("id", editingItem.id);
    else await supabase.from("facilities").insert([formData]);
    await fetch();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: any) {
    if (confirm("Are you sure?")) {
      await supabase.from("facilities").delete().eq("id", id);
      fetch();
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <MonitorPlay className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Facilities
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
            <Plus className="w-5 h-5 mr-2" /> Add Facility
          </button>
        )}
      </div>
      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Facility" : "Create New Facility"}
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
        <CRUDTable
          columns={columns}
          data={data}
          onEdit={(item) => {
            setEditingItem(item);
            setIsEditing(true);
          }}
          onDelete={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
}
