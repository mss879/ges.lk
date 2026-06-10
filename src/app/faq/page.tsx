"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, BookOpen, ChevronDown, HelpCircle, ArrowUpRight, MessageSquare } from "lucide-react";

const faqs = [
  {
    question: "How does a solar system work?",
    answer: "Solar panels capture sunlight and convert it into DC electricity, which an inverter converts into AC electricity to power your home or business. Excess energy can be stored in batteries or fed back to the grid depending on your system configuration.",
    category: "General"
  },
  {
    question: "What type of system is right for me?",
    answer: "The ideal system depends on your energy consumption patterns, roof space, and local grid stability. Our engineers conduct a feasibility study and recommend either an On-Grid system (best for cost offsets), Off-Grid (complete independence), or a Hybrid system (best for backup power and savings).",
    category: "General"
  },
  {
    question: "What is the warranty period?",
    answer: "We offer premium warranty coverage: a 25-year linear performance warranty on solar PV modules, a 5-to-10-year warranty on smart grid-tied or hybrid inverters, and up to a 10-year warranty on Lithium LFP battery cells. Specific terms vary by product to ensure long-term peace of mind.",
    category: "General"
  },
  {
    question: "How much can I save on electricity?",
    answer: "Savings vary based on your average consumption tariff, roof orientation, and system capacity. With recent tariff adjustments in Sri Lanka, most residential and commercial owners see a reduction of 70% to 100% in their utility bills, turning electricity from an ongoing operational cost into a self-funding asset.",
    category: "Financial"
  },
  {
    question: "What happens on cloudy days?",
    answer: "Solar panels do not require direct hot sunlight and continue to generate electricity using ambient daylight even on overcast or rainy days, though generation efficiency is reduced. In a hybrid or grid-connected system, battery storage or utility power automatically bridges any deficit seamlessly.",
    category: "Technical"
  },
  {
    question: "How do I maintain my solar system?",
    answer: "Solar PV installations require minimal upkeep. We recommend dry cleaning or soft washing with low-TDS water every 3 to 6 months to prevent monsoonal dust or soot buildup from reducing yields. Our operations and maintenance (O&M) packages include regular thermal imaging and string diagnostics.",
    category: "Technical"
  },
  {
    question: "What grid-connection schemes are available in Sri Lanka?",
    answer: "Under the Ceylon Electricity Board (CEB) and LECO 'Soorya Bala Sangramaya' program, three options are available: Net Metering (offset imports; surplus exports carry forward as energy credits), Net Accounting (surplus exports are purchased by the utility at a fixed tariff), and Net Plus (100% of solar generation is exported directly to the grid).",
    category: "Grid Connection"
  },
  {
    question: "Can solar power my home or office during a blackout?",
    answer: "Yes, provided you install a Hybrid or Off-Grid solar system configured with battery storage. Standard On-Grid systems are legally required to shut down during grid outages (anti-islanding protection) to prevent feeding live currents back into dead utility lines, ensuring grid repair technicians are safe.",
    category: "Technical"
  },
  {
    question: "How long does the installation and CEB grid clearance take?",
    answer: "A standard residential installation is completed by our technicians in 2 to 3 days on-site. The grid interconnection approvals—including feasibility study, power purchase agreements (PPA), and bi-directional smart meter installation by the CEB/LECO—typically take between 3 to 6 weeks. Our team manages this entire workflow for you.",
    category: "General"
  },
  {
    question: "What is the typical payback period for a solar installation in Sri Lanka?",
    answer: "With current commercial and domestic utility rates, typical simple payback periods are between 2.5 to 4 years. Given a performance life exceeding 25 years, a solar system represents an extremely secure financial investment, offering an average Internal Rate of Return (IRR) of 20% to 25%.",
    category: "Financial"
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = ["All", "General", "Technical", "Financial", "Grid Connection"];

  // Filter FAQs based on category and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      
      {/* 1. Header (Standalone Responsive Nav) */}
      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between">
          
          {/* Left Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end pr-12">
            <Link href="/" className="text-[15px] font-bold text-stone-600 hover:text-[#00AC4E] transition-colors">
              Home
            </Link>
            <Link href="/#about" className="text-[15px] font-bold text-stone-600 hover:text-[#00AC4E] transition-colors">
              About Us
            </Link>
            <Link href="/#solutions" className="text-[15px] font-bold text-stone-600 hover:text-[#00AC4E] transition-colors">
              Solutions
            </Link>
          </nav>

          {/* Logo Center */}
          <div className="flex justify-center shrink-0">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="GES Logo"
                width={160}
                height={46}
                priority
                className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Right Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-start pl-12">
            <Link href="/blog" className="text-[15px] font-bold text-stone-600 hover:text-[#00AC4E] transition-colors">
              Blogs
            </Link>
            <Link href="/projects" className="text-[15px] font-bold text-stone-600 hover:text-[#00AC4E] transition-colors">
              Projects
            </Link>
            <Link href="/faq" className="text-[15px] font-extrabold text-stone-900 border-b-2 border-[#00AC4E] pb-1">
              FAQ
            </Link>
            <Link href="/#contact" className="ml-4 bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Hamburguer trigger */}
          <div className="flex lg:hidden w-full justify-between items-center">
            <Link href="/">
              <Image
                src="/logo.webp"
                alt="GES Logo"
                width={120}
                height={35}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-[#00AC4E] focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-lg flex flex-col p-6 pt-24 animate-fade-in">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#00AC4E] p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col gap-6 text-center text-white text-xl font-bold font-display mt-8">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00AC4E] transition-colors">Home</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00AC4E] transition-colors">About Us</Link>
            <Link href="/#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00AC4E] transition-colors">Solutions</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00AC4E] transition-colors">Blogs</Link>
            <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00AC4E] transition-colors">Projects</Link>
            <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-[#00AC4E] transition-colors">FAQ</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-[#00AC4E] hover:bg-[#00AC4E]/90 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300">Contact Us</Link>
          </div>
        </div>
      )}

      {/* 2. Hero Header Section */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-stone-50 to-[#f8f9fa] border-b border-stone-200/50 relative overflow-hidden shrink-0">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#00AC4E]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AC4E]/5 border border-[#00AC4E]/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#00AC4E] mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00AC4E] animate-pulse"></span>
            GES Help & Support Center
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 leading-none">
            Frequently Asked <span className="text-[#00AC4E]">Questions</span>
          </h1>
          <p className="mt-6 text-stone-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Find answers to common questions about solar technology, installation workflows, CEB grid connectivity schemes, and commercial ROI metrics.
          </p>
        </div>
      </section>

      {/* 3. Search and Category Filter Panel */}
      <section className="w-full py-8 border-b border-stone-200/40 sticky top-[72px] lg:top-[80px] z-40 bg-[#f8f9fa]/90 backdrop-blur-md shrink-0">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenFaqIndex(null); // Reset accordion on category switch
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#00AC4E] text-white border-[#00AC4E] shadow-md shadow-[#00AC4E]/10 -translate-y-0.5"
                    : "bg-white text-stone-600 border-stone-200/80 hover:border-[#00AC4E]/30 hover:text-[#00AC4E] hover:-translate-y-0.5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs shadow-sm rounded-xl">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenFaqIndex(null); // Reset accordion on search
              }}
              className="w-full bg-white border border-stone-200/80 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold placeholder-stone-400 focus:outline-none focus:border-[#00AC4E] focus:ring-1 focus:ring-[#00AC4E] transition-all duration-300"
            />
          </div>

        </div>
      </section>

      {/* 4. Accordion Grid Section */}
      <main className="flex-1 w-full max-w-[940px] mx-auto px-6 py-12 flex flex-col gap-6 relative">
        <div className="absolute top-[20%] left-[-15%] w-[350px] h-[350px] bg-[#00AC4E]/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

        {filteredFaqs.length === 0 ? (
          <div className="w-full text-center py-20 bg-white border border-stone-200/50 rounded-[28px] shadow-sm">
            <HelpCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-stone-800">No FAQs found</h3>
            <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}" under category "{selectedCategory}". Try resetting your filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`bg-white border transition-all duration-300 rounded-2xl md:rounded-[20px] overflow-hidden ${
                    isOpen 
                      ? "border-[#00AC4E]/40 shadow-[0_12px_24px_rgba(0,172,78,0.04)]" 
                      : "border-stone-200/80 hover:border-[#00AC4E]/20 hover:shadow-[0_8px_16px_rgba(0,0,0,0.01)]"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex gap-4 items-start pr-4">
                      <span className="text-sm font-extrabold text-[#00AC4E] font-mono select-none pt-0.5">
                        Q{(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <h3 className="text-[15px] sm:text-base md:text-[17px] font-bold tracking-tight text-stone-900 leading-snug group-hover:text-[#00AC4E]">
                        {faq.question}
                      </h3>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? "bg-[#00AC4E]/15 border-[#00AC4E]/20 text-[#00AC4E]" 
                        : "bg-stone-50 border-stone-200 text-stone-400 group-hover:text-stone-900"
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Accordion Expansion Container with smooth transition */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] border-t border-stone-100 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="p-5 md:p-6 bg-stone-50/50 flex gap-4 text-left leading-relaxed">
                      <span className="text-xs font-mono font-black text-stone-400 select-none pt-0.5">
                        ANS
                      </span>
                      <div className="flex flex-col gap-3">
                        <p className="text-stone-600 text-[13.5px] sm:text-[14.5px] md:text-sm font-medium">
                          {faq.answer}
                        </p>
                        <span className="self-start text-[10px] font-extrabold uppercase tracking-widest text-[#00AC4E] bg-[#00AC4E]/5 px-2.5 py-1 rounded-md">
                          Category: {faq.category}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 4.5 Consultative CTA section */}
        <div className="mt-12 bg-white border border-stone-200/60 rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-left">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#00AC4E]/10 flex items-center justify-center shrink-0 text-[#00AC4E]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-lg font-black text-stone-950">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Our solar engineers are here to help. Reach out directly for personalized system dimensions and savings details.
              </p>
            </div>
          </div>
          
          <Link 
            href="/#contact"
            className="self-start md:self-auto bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 shrink-0 flex items-center gap-1.5"
          >
            <span>Consult an Engineer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* 5. Footer */}
      <footer 
        className="w-full text-white pt-[160px] sm:pt-[220px] md:pt-[280px] lg:pt-[320px] pb-10 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/5 relative z-10 font-sans"
        style={{
          backgroundImage: 'url("/footer-1.webp")',
          backgroundSize: '100% auto',
          backgroundPosition: 'center -10%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#012716'
        }}
      >
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Column 1: Brand & Newsletter */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <div className="mb-6 flex items-center">
                <Image
                  src="/logo.webp"
                  alt="GES Logo"
                  width={150}
                  height={42}
                  className="h-9 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-white/70 font-medium text-sm leading-relaxed max-w-sm">
                We are a renewable energy engineering company with a mission to empower communities through reliable, clean solar power.
              </p>
              
              <div className="mt-8 flex items-center justify-between bg-transparent border border-white/20 rounded-2xl p-1.5 w-full max-w-md focus-within:border-white/50 transition-all duration-300">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent pl-3 pr-2 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none w-full font-semibold"
                />
                <button className="bg-[#e2ff3a] text-[#012716] hover:bg-[#e2ff3a]/90 transition-all duration-300 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shrink-0 shadow-sm">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="lg:col-span-2 lg:col-start-7 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Links
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><Link href="/" className="hover:text-[#e2ff3a] transition-colors">Home</Link></li>
                <li><Link href="/#about" className="hover:text-[#e2ff3a] transition-colors">About Us</Link></li>
                <li><Link href="/#solutions" className="hover:text-[#e2ff3a] transition-colors">Solutions</Link></li>
                <li><Link href="/projects" className="hover:text-[#e2ff3a] transition-colors">Projects</Link></li>
                <li><Link href="/blog" className="hover:text-[#e2ff3a] transition-colors">Blogs</Link></li>
                <li><Link href="/faq" className="hover:text-[#e2ff3a] transition-colors">FAQ</Link></li>
                <li><Link href="/#contact" className="hover:text-[#e2ff3a] transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Legal
              </h4>
              <ul className="flex flex-col gap-3 font-bold text-sm">
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">Engineering Standards</a></li>
                <li><a href="#" className="hover:text-[#e2ff3a] transition-colors">License Details</a></li>
              </ul>
            </div>

            {/* Column 4: Contact info */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-white/50">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-4 font-bold text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed font-semibold">No. 45, Galle Road, Colombo 03, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@ges.lk" className="hover:text-[#e2ff3a] transition-colors">info@ges.lk</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#e2ff3a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+94112543210" className="hover:text-[#e2ff3a] transition-colors">+94 112 543 210</a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* Copyright bottom bar */}
      <div className="w-full bg-[#012716] text-white/60 py-8 px-6 sm:px-12 md:px-16 lg:px-24 relative z-10 font-sans">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
          
          <div className="text-xs font-bold text-white/50 justify-self-center md:justify-self-start">
            © {new Date().getFullYear()} GES (PVT) LTD. All rights reserved.
          </div>

          <div className="text-white/80 flex items-center justify-center gap-2 text-xs font-bold justify-self-center">
            <span>Built and Designed by</span>
            <a
              href="https://www.arcai.agency"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center transition-all duration-300 hover:scale-105"
              title="ARC AI - AI Automation and Software Company"
            >
              <Image
                src="/arc-logo.webp"
                alt="ARC AI | AI Automation & Software Company"
                width={110}
                height={32}
                className="h-7.5 w-auto object-contain translate-y-[2px]"
              />
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-5 text-white/70 justify-self-center md:justify-self-end">
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="hover:text-[#e2ff3a] transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
