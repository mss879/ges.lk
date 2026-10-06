"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, MessagesSquare, SlidersHorizontal } from "lucide-react";

const TABS = [
  { href: "/admin/ai-agent", label: "Conversations", icon: MessagesSquare },
  { href: "/admin/ai-agent/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/admin/ai-agent/calculator", label: "Calculator", icon: Calculator },
  { href: "/admin/ai-agent/settings", label: "Settings", icon: SlidersHorizontal },
];

export default function AgentTabs() {
  const pathname = usePathname();
  return (
    <nav className="mt-5 flex flex-wrap gap-1.5" aria-label="AI agent sections">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin/ai-agent"
            ? pathname === href || pathname.startsWith("/admin/ai-agent/conversations")
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              active ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
