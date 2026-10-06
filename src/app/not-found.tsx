import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/solutions", label: "Solar solutions", desc: "On-grid, hybrid, off-grid and battery storage." },
  { href: "/projects", label: "Our projects", desc: "Installations across Sri Lanka." },
  { href: "/blog", label: "Blog", desc: "Guides on solar, storage and net metering." },
  { href: "/contact", label: "Contact us", desc: "Talk to an engineer about your site." },
];

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col">
      <SiteNav />
      <main className="flex-1 w-full max-w-[960px] mx-auto px-6 py-20 sm:py-28 text-center">
        <p className="font-mono text-xs font-black tracking-[0.3em] text-[#00AC4E] uppercase">Error 404</p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-black tracking-tight text-stone-900">
          This page isn&apos;t generating any power.
        </h1>
        <p className="mt-5 text-stone-500 text-base sm:text-lg font-medium max-w-xl mx-auto">
          The page you were looking for has moved or no longer exists. These are a good place to start instead.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl bg-white border border-stone-200/70 p-5 hover:border-[#00AC4E]/40 hover:-translate-y-0.5 transition-all"
            >
              <span className="flex items-center justify-between font-display text-lg font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors">
                {link.label}
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="mt-1 block text-sm text-stone-500 font-medium">{link.desc}</span>
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#00AC4E] hover:bg-[#019544] text-white text-sm font-bold px-6 py-3.5 transition-colors"
        >
          Back to the homepage
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
