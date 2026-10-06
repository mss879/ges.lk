"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { FAQ_CATEGORIES, faqs } from "@/data/faqs";

/**
 * Interactive part of /faq: category tabs, search and the accordion.
 * Every answer stays in the DOM (collapsed with CSS), so the server-rendered
 * HTML contains all of them for search engines.
 */
export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-clip">
      <SiteNav active="faq" />

      {/* Hero Header Section */}
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

      {/* Search and Category Filter Panel */}
      <section className="w-full py-8 border-b border-stone-200/40 sticky top-[64px] xl:top-[72px] z-40 bg-[#f8f9fa]/90 backdrop-blur-md shrink-0">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none whitespace-nowrap">
            {FAQ_CATEGORIES.map((cat) => (
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
              aria-label="Search FAQs"
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

      {/* Accordion Grid Section */}
      <main className="flex-1 w-full max-w-[940px] mx-auto px-6 py-12 flex flex-col gap-6 relative">
        <div className="absolute top-[20%] left-[-15%] w-[350px] h-[350px] bg-[#00AC4E]/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

        {filteredFaqs.length === 0 ? (
          <div className="w-full text-center py-20 bg-white border border-stone-200/50 rounded-[28px] shadow-sm">
            <HelpCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-stone-800">No FAQs found</h2>
            <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any questions matching &quot;{searchQuery}&quot; under category &quot;{selectedCategory}&quot;. Try resetting your filter.
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
              const panelId = `faq-answer-${idx}`;
              return (
                <div
                  key={faq.question}
                  className={`bg-white border transition-all duration-300 rounded-2xl md:rounded-[20px] overflow-hidden ${
                    isOpen
                      ? "border-[#00AC4E]/40 shadow-[0_12px_24px_rgba(0,172,78,0.04)]"
                      : "border-stone-200/80 hover:border-[#00AC4E]/20 hover:shadow-[0_8px_16px_rgba(0,0,0,0.01)]"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex gap-4 items-start pr-4">
                      <span className="text-sm font-extrabold text-[#00AC4E] font-mono select-none pt-0.5">
                        Q{(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <h2 className="text-[15px] sm:text-base md:text-[17px] font-bold tracking-tight text-stone-900 leading-snug group-hover:text-[#00AC4E]">
                        {faq.question}
                      </h2>
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
                  <div
                    id={panelId}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[500px] border-t border-stone-100 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
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

        {/* Consultative CTA section */}
        <div className="mt-12 bg-white border border-stone-200/60 rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-left">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#00AC4E]/10 flex items-center justify-center shrink-0 text-[#00AC4E]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-lg font-black text-stone-950">
                Still have questions?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Our solar engineers are here to help. Reach out directly for personalized system dimensions and savings details.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="self-start md:self-auto bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 shrink-0 flex items-center gap-1.5"
          >
            <span>Consult an Engineer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
