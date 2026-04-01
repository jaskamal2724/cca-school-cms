"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import CRUDForm from "@/components/ui/CRUDForm";

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  bg_gradient: string;
  image_url: string;
};

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSlide | null>(null);

  const fields: any[] = [
    {
      label: "Slide Title",
      name: "title",
      type: "text",
      required: true,
      placeholder: "e.g. Shaping Tomorrow's Leaders",
    },
    {
      label: "Subtitle",
      name: "subtitle",
      type: "text",
      required: true,
      placeholder: "e.g. Excellence in Education",
    },
    {
      label: "Background Gradient",
      name: "bg_gradient",
      type: "text",
      required: true,
      placeholder: "e.g. from-[#001F3F] to-[#00BFA5]",
    },
    {
      label: "Image URL",
      name: "image_url",
      type: "url",
      required: true,
      placeholder: "e.g. /cca_school.jpg",
    },
  ];

  useEffect(() => {
    fetchHeroes();
  }, []);

  async function fetchHeroes() {
    setLoading(true);
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .order("created_at", { ascending: true });
    setHeroes(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: any) {
    setLoading(true);
    if (editingItem) {
      await supabase
        .from("hero_slides")
        .update(formData)
        .eq("id", editingItem.id);
    } else {
      await supabase.from("hero_slides").insert([formData]);
    }
    await fetchHeroes();
    setIsEditing(false);
    setEditingItem(null);
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure?")) {
      await supabase.from("hero_slides").delete().eq("id", id);
      fetchHeroes();
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Website content
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Hero slides
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
            Add New Slide
          </button>
        )}
      </div>

      {isEditing ? (
        <CRUDForm
          title={editingItem ? "Edit Slide" : "Create New Slide"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 animate-pulse rounded-3xl"
              />
            ))
          ) : heroes.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400 font-medium italic">
              No slides found.
            </div>
          ) : (
            heroes.map((hero) => (
              <div
                key={hero.id}
                className="premium-card !p-0 overflow-hidden group"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${hero.bg_gradient} relative`}
                >
                  {hero.image_url && (
                    <img
                      src={hero.image_url}
                      alt={hero.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-semibold leading-tight drop-shadow-md">
                      {hero.title}
                    </h3>
                    <p className="text-xs font-medium opacity-90 truncate">
                      {hero.subtitle}
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">
                    {hero.bg_gradient}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingItem(hero);
                        setIsEditing(true);
                      }}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hero.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
