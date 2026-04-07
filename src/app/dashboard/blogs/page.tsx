"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Info } from "lucide-react";
import CRUDTable from "@/components/ui/CRUDTable";
import CRUDForm from "@/components/ui/CRUDForm";

export default function BlogsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fields: any[] = [
    { label: "Post Title", name: "title", type: "text", required: true },
    { label: "Excerpt", name: "excerpt", type: "textarea", required: true },
    {
      label: "Full Content",
      name: "content",
      type: "textarea",
      required: true,
    },
    {
      label: "Category",
      name: "category",
      type: "select",
      options: [
        "Educational",
        "Achievement",
        "Guidance",
        "Sports",
        "International",
        "Alumni",
      ],
      required: true,
    },
    {
      label: "Published Date",
      name: "published_date",
      type: "text",
      required: true,
    },
    { label: "Image URL", name: "image_url", type: "url", required: true },
    { label: "Author", name: "author", type: "text", required: true },
  ];

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Category", accessor: "category" },
    { header: "Date", accessor: "published_date" },
    { header: "Author", accessor: "author" },
  ];

  useEffect(() => {
    fetch();
  }, []);
  async function fetch() {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem)
      await supabase
        .from("blog_posts")
        .update(formData)
        .eq("id", editingItem.id);
    else await supabase.from("blog_posts").insert([formData]);
    await fetch();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: any) {
    if (confirm("Are you sure?")) {
      await supabase.from("blog_posts").delete().eq("id", id);
      fetch();
    }
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Blog posts
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
            <Plus className="w-5 h-5 mr-2" /> Add Post
          </button>
        )}
      </div>
      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Post" : "Create New Post"}
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
