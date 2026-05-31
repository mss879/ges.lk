"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, ChevronRight, User, CheckCircle } from "lucide-react";
import { blogPosts } from "@/data/blogs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostDetail({ params }: PageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Safely await params inside useEffect for client-side state
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Track page scroll depth for the reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!slug) {
    return (
      <div className="w-full h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Find target blog post
  const post = blogPosts.find((p) => p.slug === slug);

  // Handle case where article doesn't exist
  if (!post) {
    return (
      <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-3xl font-black text-stone-900 mb-4">Article Not Found</h2>
        <p className="text-stone-500 max-w-sm mb-8 font-medium">
          The clean energy insight you are looking for does not exist or has been relocated.
        </p>
        <Link 
          href="/blog"
          className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-md transition-all duration-300"
        >
          Back to Insights
        </Link>
      </div>
    );
  }

  // A performant, ultra-clean custom Markdown-to-JSX parser
  // Allows us to inject premium layouts and styled components with zero dependencies
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let keyIndex = 0;

    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length === 0) return;
      
      const headers = tableRows[0];
      const bodyRows = tableRows.slice(2); // Skip separator row

      elements.push(
        <div key={`table-${keyIndex++}`} className="my-8 overflow-x-auto w-full border border-stone-200/50 rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-stone-200/60 bg-white">
            <thead className="bg-stone-50">
              <tr>
                {headers.map((h, i) => (
                  <th 
                    key={i} 
                    className="px-6 py-4 text-left text-xs sm:text-sm font-extrabold text-stone-800 uppercase tracking-wider"
                  >
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-stone-50/50 transition-colors duration-150">
                  {row.map((cell, cIdx) => (
                    <td 
                      key={cIdx} 
                      className="px-6 py-4 text-xs sm:text-sm font-semibold text-stone-600"
                      dangerouslySetInnerHTML={{ __html: parseInlineStyles(cell.trim()) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      tableRows = [];
      inTable = false;
    };

    const parseInlineStyles = (text: string) => {
      // Parse Bold (**text**)
      let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-stone-900">$1</strong>');
      // Parse Code (`code`)
      parsed = parsed.replace(/`(.*?)`/g, '<code class="bg-stone-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-mono font-bold border border-stone-200/50">$1</code>');
      return parsed;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle Table Rows
      if (line.trim().startsWith("|")) {
        inTable = true;
        const rowData = line.split("|").slice(1, -1); // Extract cells
        tableRows.push(rowData);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Handle Headings
      if (line.startsWith("## ")) {
        elements.push(
          <h2 
            key={keyIndex++} 
            className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950 mt-12 mb-6 border-l-4 border-green-600 pl-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: parseInlineStyles(line.slice(3)) }}
          />
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 
            key={keyIndex++} 
            className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 mt-8 mb-4"
            dangerouslySetInnerHTML={{ __html: parseInlineStyles(line.slice(4)) }}
          />
        );
      } 
      // Handle Horizontal Rules
      else if (line.trim() === "---") {
        elements.push(<hr key={keyIndex++} className="border-stone-200/60 my-10" />);
      }
      // Handle GitHub-style Alerts
      else if (line.startsWith("> [!WARNING]")) {
        // Collect following quote lines
        let warningText = "";
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith("> ")) {
          warningText += " " + lines[j].slice(2);
          j++;
        }
        i = j - 1; // Advance loop index
        elements.push(
          <div key={keyIndex++} className="my-8 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-2xl p-5 sm:p-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="flex gap-3">
              <svg className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-800 leading-none">Engineering Warning</span>
                <p 
                  className="text-stone-700 text-xs sm:text-sm font-semibold leading-relaxed mt-2"
                  dangerouslySetInnerHTML={{ __html: parseInlineStyles(warningText.trim()) }}
                />
              </div>
            </div>
          </div>
        );
      } else if (line.startsWith("> [!TIP]")) {
        let tipText = "";
        let j = i + 1;
        while (j < lines.length && lines[j].startsWith("> ")) {
          tipText += " " + lines[j].slice(2);
          j++;
        }
        i = j - 1;
        elements.push(
          <div key={keyIndex++} className="my-8 bg-green-50/50 border-l-4 border-green-600 rounded-r-2xl p-5 sm:p-6">
            <div className="flex gap-3">
              <svg className="w-5.5 h-5.5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-green-800 leading-none">Professional Tip</span>
                <p 
                  className="text-stone-700 text-xs sm:text-sm font-semibold leading-relaxed mt-2"
                  dangerouslySetInnerHTML={{ __html: parseInlineStyles(tipText.trim()) }}
                />
              </div>
            </div>
          </div>
        );
      } 
      // Handle regular blockquotes
      else if (line.startsWith("> ")) {
        elements.push(
          <blockquote 
            key={keyIndex++} 
            className="border-l-4 border-stone-300 pl-4 py-1.5 my-6 italic text-stone-600 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseInlineStyles(line.slice(2)) }}
          />
        );
      }
      // Handle Unordered Lists
      else if (line.startsWith("- ")) {
        elements.push(
          <div key={keyIndex++} className="flex gap-3 items-start my-3 pl-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2.5 shrink-0" />
            <p 
              className="text-stone-600 text-sm sm:text-base font-semibold leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseInlineStyles(line.slice(2)) }}
            />
          </div>
        );
      }
      // Handle Ordered Lists
      else if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\.\s/)?.[1] || "1";
        const text = line.replace(/^\d+\.\s/, "");
        elements.push(
          <div key={keyIndex++} className="flex gap-3 items-start my-3 pl-2">
            <span className="font-mono text-xs font-black text-green-600 mt-1 shrink-0 w-4 text-right">
              {num}.
            </span>
            <p 
              className="text-stone-600 text-sm sm:text-base font-semibold leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseInlineStyles(text) }}
            />
          </div>
        );
      }
      // Handle standard paragraphs
      else if (line.trim() !== "") {
        elements.push(
          <p 
            key={keyIndex++} 
            className="text-stone-600 text-sm sm:text-base leading-relaxed font-semibold my-5"
            dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }}
          />
        );
      }
    }

    // Flush any trailing table
    if (inTable) flushTable();

    return elements;
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      
      {/* Dynamic Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-green-600 z-[150] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Link 
              href="/blog"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-500 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Insights</span>
            </Link>
          </div>

          {/* Logo Center */}
          <div className="flex justify-center shrink-0 pr-8 sm:pr-12 md:pr-16 lg:pr-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="GES Logo"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Right action */}
          <div className="hidden lg:flex items-center">
            <Link href="/#contact" className="bg-stone-900 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300">
              Consult an Engineer
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Banner Header */}
      <section className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] shrink-0 bg-stone-900 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
        
        {/* Banner content */}
        <div className="absolute inset-x-0 bottom-0 max-w-[840px] mx-auto px-6 pb-8 sm:pb-12 text-white">
          <div className="flex flex-col gap-4">
            
            {/* Category tag */}
            <span className="self-start bg-green-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-tight mt-2">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs font-bold text-stone-300 font-mono tracking-wider pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-green-400" />
                {post.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-stone-500" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-400" />
                {post.readTime}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Main Reading Column */}
      <div className="w-full flex-1 max-w-[840px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main content body */}
          <article className="lg:col-span-12 w-full flex flex-col">
            
            {/* Author Profile card at start */}
            <div className="flex items-center gap-4 bg-white border border-stone-200/50 rounded-2xl p-4 sm:p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-8">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center font-bold text-green-700 text-base shadow-sm">
                {post.author.avatar}
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-none">{post.author.name}</span>
                <span className="text-xs font-bold text-stone-400 tracking-wider mt-1">{post.author.role}</span>
              </div>
            </div>

            {/* Custom parsed body */}
            <div className="prose prose-stone max-w-none">
              {renderMarkdown(post.content)}
            </div>

            {/* Dynamic metrics card deck for credibility */}
            <div className="mt-12 bg-white border border-stone-200/60 rounded-[28px] p-6 sm:p-8 shadow-sm">
              <h4 className="font-display text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Verified Clean Energy Impact Parameters</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {post.metrics.map((m, idx) => (
                  <div key={idx} className="bg-stone-50/80 border border-stone-200/40 rounded-2xl p-4 flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest leading-none">{m.label}</span>
                    <span className="text-xl sm:text-2xl font-black text-green-700 tracking-tight mt-2">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium CTA consultative banner */}
            <div className="mt-12 w-full bg-stone-900 rounded-[32px] p-8 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] group border border-stone-800">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-60"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-[60px] group-hover:scale-110 transition-all duration-700"></div>
              
              <div className="relative z-10 max-w-xl flex flex-col">
                <span className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Consultation Desk</span>
                <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Design Your High-Yield Energy Infrastructure
                </h3>
                <p className="mt-4 text-stone-400 text-xs sm:text-sm font-medium leading-relaxed">
                  Ready to deploy smart microgrids, high-capacity battery walls, or grid-scale solar? Collaborate directly with Dr. Wickramasinghe and our expert engineering team.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <Link 
                    href="/#contact"
                    className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-md"
                  >
                    Schedule Architecture Review
                  </Link>
                  <Link 
                    href="/blog"
                    className="text-stone-300 hover:text-white text-xs font-bold uppercase tracking-widest border-b border-stone-700 hover:border-white py-1 transition-all"
                  >
                    Back to All Insights
                  </Link>
                </div>
              </div>
            </div>

          </article>

        </div>
      </div>

      {/* Shared Footer */}
      <footer 
        className="w-full text-white pt-[160px] sm:pt-[220px] md:pt-[280px] lg:pt-[320px] pb-10 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/5 relative z-10 font-sans"
        style={{
          backgroundImage: 'url("/footer-1.png")',
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
                  src="/logo.png"
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
                <li><Link href="/#projects" className="hover:text-[#e2ff3a] transition-colors">Projects</Link></li>
                <li><Link href="/blog" className="hover:text-[#e2ff3a] transition-colors">Blogs</Link></li>
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
          
          {/* Left: Copyright */}
          <div className="text-xs font-bold text-white/50 justify-self-center md:justify-self-start">
            © {new Date().getFullYear()} GES (PVT) LTD. All rights reserved.
          </div>

          {/* Center: Built and Designed by ARC AI */}
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
                src="/arc-logo.png"
                alt="ARC AI | AI Automation & Software Company"
                width={110}
                height={32}
                className="h-7.5 w-auto object-contain translate-y-[2px]"
              />
            </a>
          </div>

          {/* Right: Social Links */}
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
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
