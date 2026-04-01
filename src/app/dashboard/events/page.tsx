"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Calendar } from "lucide-react";
import CRUDTable from "@/components/ui/CRUDTable";
import CRUDForm from "@/components/ui/CRUDForm";

type Event = {
  id: number;
  title: string;
  date: string;
  tag: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);

  const fields: any[] = [
    {
      label: "Event Title",
      name: "title",
      type: "text",
      required: true,
      placeholder: "e.g. Annual Athletic Meet",
    },
    {
      label: "Date",
      name: "date",
      type: "text",
      required: true,
      placeholder: "e.g. Dec 15, 2024",
    },
    {
      label: "Category / Tag",
      name: "tag",
      type: "select",
      options: ["Event", "Sports", "Academic", "Alumni"],
      required: true,
    },
  ];

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    {
      header: "Category",
      accessor: "tag",
      render: (val: string) => (
        <span
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
            val === "Sports"
              ? "bg-slate-100 text-slate-700"
              : val === "Academic"
                ? "bg-slate-100 text-slate-700"
                : val === "Alumni"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-50 text-slate-600 border border-slate-200/80"
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    setEvents(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem) {
      await supabase.from("events").update(formData).eq("id", editingItem.id);
    } else {
      await supabase.from("events").insert([formData]);
    }
    await fetchEvents();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure?")) {
      await supabase.from("events").delete().eq("id", id);
      fetchEvents();
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Events
          </h1>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              setEditingItem(null);
              setIsEditing(true);
            }}
            className="btn-primary px-5 py-2.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </button>
        )}
      </div>

      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Event" : "Create New Event"}
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
          data={events}
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
