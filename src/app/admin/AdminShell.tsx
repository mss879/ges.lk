"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, KanbanSquare, FolderKanban, ImageIcon, LogOut, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/crm", label: "CRM", icon: KanbanSquare },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content", label: "Homepage & About", icon: ImageIcon },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
              active
                ? "bg-[#00AC4E] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-stone-200 bg-white px-4 py-5">
        <Link href="/" className="px-1.5 mb-7 flex items-center">
          <Image src="/logo.webp" alt="GES" width={140} height={38} className="h-9 w-auto object-contain" />
        </Link>
        {nav}
        <div className="mt-auto pt-5 border-t border-stone-200">
          <p className="px-1.5 text-[11px] font-bold text-stone-400 truncate mb-2">{email}</p>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-950/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-white px-4 py-5 flex flex-col">
            <div className="flex items-center justify-between mb-7">
              <Image src="/logo.webp" alt="GES" width={130} height={36} className="h-8 w-auto object-contain" />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {nav}
            <div className="mt-auto pt-5 border-t border-stone-200">
              <p className="px-1.5 text-[11px] font-bold text-stone-400 truncate mb-2">{email}</p>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
          <Image src="/logo.webp" alt="GES" width={120} height={32} className="h-7 w-auto object-contain" />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>
        <main className="flex-1 min-w-0 p-5 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
