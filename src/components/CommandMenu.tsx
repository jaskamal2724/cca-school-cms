"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { 
  Building, 
  Calendar, 
  Image as ImageIcon, 
  Info, 
  LayoutDashboard, 
  MessageSquare, 
  MonitorPlay, 
  Users,
  Award,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={() => setOpen(false)}
      />
      
      {/* Search Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-200">
        <Command 
          className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200"
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-slate-100 px-3">
            <Command.Input 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50" 
              placeholder="Search anything..." 
              autoFocus
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
            <Command.Empty className="py-6 text-center text-sm text-slate-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-slate-500">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/events"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/blogs"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <Info className="mr-2 h-4 w-4" />
                Blog Posts
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/gallery"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Gallery
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Create" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-slate-500">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/blogs?create=true"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <Info className="mr-2 h-4 w-4" />
                Create Blog Post
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/events?create=true"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Create Event
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Other Sections" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-slate-500">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/achievers"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <Award className="mr-2 h-4 w-4" />
                Achievers
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/alumni"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <Users className="mr-2 h-4 w-4" />
                Alumni
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/dashboard/testimonials"))}
                className="relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm text-slate-700 outline-none data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-700"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Testimonials
              </Command.Item>
            </Command.Group>
            
          </Command.List>
        </Command>
      </div>
    </>
  );
}
