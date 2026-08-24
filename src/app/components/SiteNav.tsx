"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";

type ActiveKey =
  | "home"
  | "about"
  | "solutions"
  | "projects"
  | "products"
  | "services"
  | "careers"
  | "faq"
  | "contact"
  | null;

const navLinks: { label: string; href: string; key: ActiveKey }[] = [
  { label: "Home", href: "/", key: "home" },
  { label: "About", href: "/about", key: "about" },
  { label: "Products", href: "/products", key: "products" },
  { label: "Maintenance", href: "/services", key: "services" },
  { label: "Careers", href: "/careers", key: "careers" },
  { label: "FAQ", href: "/faq", key: "faq" },
];

export const solutionsData = [
  {
    category: "Solar",
    id: "solar",
    href: "/solutions/solar",
    subItems: [
      { title: "On-Grid", desc: "Use solar by day, draw from the grid at night.", href: "/solutions/on-grid" },
      { title: "Hybrid", desc: "Grid plus battery for full independence.", href: "/solutions/hybrid" },
      { title: "BESS", desc: "Store excess energy & backup power.", href: "/solutions/bess" },
      { title: "Off-Grid", desc: "Standalone system with battery storage.", href: "/solutions/off-grid" },
    ],
  },
  {
    category: "Power Generation",
    id: "power",
    href: "/solutions/power",
    subItems: [
      { title: "MTG", desc: "MTG micro turbine generators.", href: "/solutions/mtg" },
    ],
  },
  {
    category: "Hydrogen Energy",
    id: "hydrogen",
    href: "/solutions/hydrogen",
    subItems: [
      { title: "Fuel Cell (SFC)", desc: "Clean fuel cell (SFC) power.", href: "/solutions/fuel-cell" },
    ],
  },
  {
    category: "Waste Management",
    id: "waste",
    href: "/solutions/waste",
    subItems: [
      { title: "Composted Machine", desc: "Organic waste to compost.", href: "/solutions/composting" },
    ],
  },
  {
    category: "EV Charging",
    id: "ev",
    href: "/solutions/ev",
    subItems: [
      { title: "Moreday", desc: "Moreday fast & smart chargers.", href: "/solutions/ev-charging" },
    ],
  },
];

export default function SiteNav({ active = null }: { active?: ActiveKey }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Solar");
  const [openSection, setOpenSection] = useState<ActiveKey>(null);

  const closeMobile = () => setIsMobileMenuOpen(false);

  // While the mobile drawer is open, freeze the page behind it and allow Escape to dismiss.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isMobileMenuOpen]);

  /**
   * Mobile menu model. Sections with `children` collapse by default so the
   * drawer stays short and scannable instead of listing every sub-page at once.
   */
  const mobileNav: {
    label: string;
    href: string;
    key: ActiveKey;
    children?: { label: string; items: { title: string; href: string }[] }[];
  }[] = [
    { label: "Home", href: "/", key: "home" },
    { label: "About", href: "/about", key: "about" },
    {
      label: "Solutions",
      href: "/solutions",
      key: "solutions",
      children: solutionsData.map((c) => ({
        label: c.category,
        items: c.subItems.map((sub) => ({ title: sub.title, href: sub.href })),
      })),
    },
    { label: "Products", href: "/products", key: "products" },
    {
      label: "Projects",
      href: "/projects",
      key: "projects",
      children: [
        {
          label: "Portfolio",
          items: [
            { title: "Residential", href: "/projects?filter=residential" },
            { title: "Commercial", href: "/projects?filter=commercial" },
          ],
        },
      ],
    },
    { label: "Maintenance", href: "/services", key: "services" },
    { label: "Careers", href: "/careers", key: "careers" },
    { label: "FAQ", href: "/faq", key: "faq" },
    { label: "Contact", href: "/contact", key: "contact" },
  ];

  const linkClass = (isActive: boolean) =>
    `text-sm lg:text-[15px] xl:text-base font-bold cursor-pointer transition-colors duration-300 ${
      isActive ? "text-stone-950 font-extrabold" : "text-stone-700 hover:text-[#00AC4E]"
    }`;
  const underlineClass = (isActive: boolean) =>
    `absolute bottom-[0px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 ${
      isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
    }`;

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
          {/* Left: Logo */}
          <Link href="/" className="relative z-50 flex items-center shrink-0">
            <Image
              src="/logo.webp"
              alt="GES Logo"
              width={190}
              height={55}
              priority
              className="h-11 xl:h-13 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Center: Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 justify-center whitespace-nowrap">
            {/* Home */}
            <div className="relative py-2 group">
              <Link href="/" className={linkClass(active === "home")}>Home</Link>
              <div className={underlineClass(active === "home")} />
            </div>

            {/* About */}
            <div className="relative py-2 group">
              <Link href="/about" className={linkClass(active === "about")}>About</Link>
              <div className={underlineClass(active === "about")} />
            </div>

            {/* Solutions mega menu */}
            <div
              className="relative py-4 -my-2 group"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <Link href="/solutions" className={`${linkClass(active === "solutions")} inline-flex items-center gap-1`}>
                Solutions
                <svg className="w-3 h-3 text-stone-500 group-hover:text-[#00AC4E] transition-all duration-300 transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div
                className={`absolute bottom-[8px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 ${
                  active === "solutions" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
                }`}
              />

              {solutionsOpen && (
                <div className="absolute top-[52px] left-1/2 -translate-x-1/2 flex w-[680px] bg-white/95 backdrop-blur-3xl border border-stone-200/50 rounded-[28px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.03)] z-[200] animate-[dropdownFade_0.2s_ease]">
                  {/* Left Panel: Categories */}
                  <div className="w-[260px] bg-stone-50/50 p-4 flex flex-col gap-1 border-r border-stone-100 shrink-0">
                    <span className="text-[10px] font-extrabold text-stone-400 tracking-widest font-mono uppercase px-3 mb-2 block">Categories</span>
                    {solutionsData.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        onMouseEnter={() => setActiveCategory(cat.category)}
                        onClick={() => setSolutionsOpen(false)}
                        className={`px-3 py-2.5 rounded-[14px] flex items-center justify-between text-left group/cat transition-all duration-200 ${
                          activeCategory === cat.category
                            ? "bg-white text-[#00AC4E] shadow-[0_4px_12px_rgba(0,0,0,0.04)] font-bold border border-stone-100"
                            : "text-stone-600 hover:text-[#00AC4E] hover:bg-white/50 border border-transparent"
                        }`}
                      >
                        <span className="text-sm font-semibold">{cat.category}</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeCategory === cat.category ? "translate-x-0.5 text-[#00AC4E] opacity-100" : "opacity-0 -translate-x-1 group-hover/cat:opacity-100 group-hover/cat:translate-x-0 text-stone-400"
                        }`} />
                      </Link>
                    ))}
                    <div className="mt-auto pt-4">
                      <Link
                        href="/solutions"
                        onClick={() => setSolutionsOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] bg-stone-950 hover:bg-[#00AC4E] text-white text-[11px] font-bold uppercase tracking-widest transition-colors duration-200"
                      >
                        All Solutions <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Panel: Sub-items */}
                  <div className="flex-1 p-5 bg-white flex flex-col justify-between min-h-[320px]">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-extrabold text-stone-400 tracking-widest font-mono uppercase px-2 mb-1 block">
                        {activeCategory} Options
                      </span>
                      <div className="flex flex-col gap-1">
                        {solutionsData.find(cat => cat.category === activeCategory)?.subItems.map((sub, idx) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={() => setSolutionsOpen(false)}
                            className="p-3 rounded-[16px] hover:bg-stone-50 text-left transition-all duration-200 flex flex-col gap-0.5 group/sub"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold font-mono tracking-wider text-[#00AC4E] opacity-70">0{idx + 1}</span>
                              <span className="text-sm font-bold text-stone-900 group-hover/sub:text-[#00AC4E] transition-colors">{sub.title}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5 transition-all text-[#00AC4E]" />
                            </div>
                            <span className="text-xs text-stone-500 font-medium leading-relaxed pl-4">{sub.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="relative py-2 group">
              <Link href="/products" className={linkClass(active === "products")}>Products</Link>
              <div className={underlineClass(active === "products")} />
            </div>

            {/* Projects dropdown */}
            <div
              className="relative py-4 -my-2 group"
              onMouseEnter={() => setProjectsOpen(true)}
              onMouseLeave={() => setProjectsOpen(false)}
            >
              <Link href="/projects" className={`${linkClass(active === "projects")} inline-flex items-center gap-1`}>
                Projects
                <svg className="w-3 h-3 text-stone-500 group-hover:text-[#00AC4E] transition-all duration-300 transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div
                className={`absolute bottom-[8px] left-0 h-[3px] bg-[#00AC4E] transition-all duration-300 ${
                  active === "projects" ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
                }`}
              />

              {projectsOpen && (
                <div className="absolute top-[52px] left-1/2 -translate-x-1/2 w-[320px] bg-white/95 backdrop-blur-3xl border border-stone-200/50 rounded-[24px] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.03)] z-[200] animate-[dropdownFade_0.2s_ease]">
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/projects?filter=residential"
                      onClick={() => setProjectsOpen(false)}
                      className="p-3.5 rounded-[18px] hover:bg-stone-50 text-left transition-all duration-200 flex flex-col gap-0.5 group/proj"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-stone-900 group-hover/proj:text-[#00AC4E] transition-colors">Residential</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/proj:opacity-100 group-hover/proj:translate-x-0.5 group-hover/proj:-translate-y-0.5 transition-all text-[#00AC4E]" />
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium leading-relaxed">Photos and details of our home solar setups.</span>
                    </Link>
                    <Link
                      href="/projects?filter=commercial"
                      onClick={() => setProjectsOpen(false)}
                      className="p-3.5 rounded-[18px] hover:bg-stone-50 text-left transition-all duration-200 flex flex-col gap-0.5 group/proj"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-stone-900 group-hover/proj:text-[#00AC4E] transition-colors">Commercial</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/proj:opacity-100 group-hover/proj:translate-x-0.5 group-hover/proj:-translate-y-0.5 transition-all text-[#00AC4E]" />
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium leading-relaxed">Photos and details of commercial energy systems.</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Remaining flat links */}
            {navLinks.slice(3).map((l) => (
              <div key={l.href} className="relative py-2 group">
                <Link href={l.href} className={linkClass(active === l.key)}>{l.label}</Link>
                <div className={underlineClass(active === l.key)} />
              </div>
            ))}
          </nav>

          {/* Right: Consultation CTA */}
          <div className="hidden lg:flex items-center justify-end z-50 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3.5 bg-white hover:bg-stone-50 text-stone-900 font-bold rounded-full pl-5 pr-1.5 py-1.5 border border-stone-200 shadow-[0_4px_18px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all duration-300 group"
            >
              <span className="tracking-wide text-[14px]">Get Consultation</span>
              <span className="w-7 h-7 rounded-full bg-stone-950 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex justify-end lg:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-stone-900/10 hover:bg-stone-900/20 active:bg-stone-900/30 border border-stone-900/10 w-11 h-11 rounded-full flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              aria-label="Toggle Menu"
            >
              <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <div className={`w-4.5 h-0.5 bg-stone-950 rounded-full transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[300] flex flex-col animate-[dropdownFade_0.22s_ease]"
          style={{ background: "linear-gradient(160deg, #0b2a1b 0%, #061a10 46%, #030d07 100%)" }}
        >
          {/* ambient brand glow */}
          <div className="pointer-events-none absolute -top-28 -right-20 w-80 h-80 rounded-full bg-[#00AC4E]/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-24 w-72 h-72 rounded-full bg-[#e2ff3a]/[0.07] blur-[110px]" />

          {/* header */}
          <div className="relative z-10 shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-white/10">
            <Link href="/" onClick={closeMobile} className="flex items-center">
              <Image
                src="/logo.webp"
                alt="GES Logo"
                width={140}
                height={38}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <button
              onClick={closeMobile}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 flex items-center justify-center text-white transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* links — top aligned so nothing is ever clipped out of reach */}
          <nav className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 py-1">
            <ul className="flex flex-col">
              {mobileNav.map((item) => {
                const isActive = active === item.key;
                const isOpen = openSection === item.key;
                return (
                  <li key={item.label} className="border-b border-white/[0.07]">
                    <div className="flex items-center gap-2">
                      <Link
                        href={item.href}
                        onClick={closeMobile}
                        className={`flex-1 font-display text-[19px] font-black tracking-tight py-3.5 transition-colors ${
                          isActive ? "text-[#00E676]" : "text-white active:text-[#00E676]"
                        }`}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          onClick={() => setOpenSection(isOpen ? null : item.key)}
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {item.children && isOpen && (
                      <div className="pb-3.5 flex flex-col gap-3.5">
                        {item.children.map((group) => (
                          <div key={group.label} className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#00E676]/70 px-0.5">
                              {group.label}
                            </span>
                            {group.items.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={closeMobile}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] font-bold text-white/85 active:bg-white/10 active:border-[#00AC4E]/40 transition-colors"
                              >
                                <span>{sub.title}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-white/35 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* pinned call to action */}
          <div className="relative z-10 shrink-0 px-5 pt-4 pb-5 border-t border-white/10 bg-black/25 backdrop-blur-sm">
            <Link
              href="/contact"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2 w-full bg-[#00AC4E] active:bg-[#019544] text-white font-bold text-xs uppercase tracking-[0.15em] py-4 rounded-full transition-colors"
            >
              Get Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-center text-[10px] font-mono tracking-wider text-white/35">
              Green Engineering Systems · GES.lk
            </p>
          </div>
        </div>
      )}
    </>
  );
}
