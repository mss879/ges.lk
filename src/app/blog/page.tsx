"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Search, BookOpen, Clock, Calendar, ChevronRight } from "lucide-react";
import { blogPosts } from "@/data/blogs";

export default function BlogListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core categories based on our data
  const categories = ["All", "Grid Technology", "C&I Solar", "Battery Storage", "Solar Yield", "Utility-Scale"];

  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Highlight the first post as the "Featured Article" if no filters are active
  const isDefaultView = searchQuery === "" && selectedCategory === "All";
  const featuredPost = isDefaultView ? blogPosts[0] : null;
  const gridPosts = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      
      {/* 1. Header (Standalone Responsive Nav) */}
      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between">
          
          {/* Left Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end pr-12">
            <Link href="/" className="text-[15px] font-bold text-stone-600 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/#about" className="text-[15px] font-bold text-stone-600 hover:text-green-600 transition-colors">
              About Us
            </Link>
            <Link href="/#solutions" className="text-[15px] font-bold text-stone-600 hover:text-green-600 transition-colors">
              Solutions
            </Link>
          </nav>

          {/* Logo in Center */}
          <div className="flex justify-center shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
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
            <Link href="/blog" className="text-[15px] font-extrabold text-stone-900 border-b-2 border-green-600 pb-1">
              Blogs
            </Link>
            <Link href="/#projects" className="text-[15px] font-bold text-stone-600 hover:text-green-600 transition-colors">
              Projects
            </Link>
            <Link href="/#contact" className="ml-4 bg-stone-900 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Hamburguer trigger */}
          <div className="flex lg:hidden w-full justify-between items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="GES Logo"
                width={120}
                height={35}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-green-600 focus:outline-none"
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
            className="absolute top-6 right-6 text-white hover:text-green-500 p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col gap-6 text-center text-white text-xl font-bold font-display mt-8">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500 transition-colors">Home</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500 transition-colors">About Us</Link>
            <Link href="/#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500 transition-colors">Solutions</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-green-500 transition-colors">Blogs</Link>
            <Link href="/#projects" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-green-500 transition-colors">Projects</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300">Contact Us</Link>
          </div>
        </div>
      )}

      {/* 2. Hero Header Section */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-stone-50 to-[#f8f9fa] border-b border-stone-200/50 relative overflow-hidden shrink-0">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200/50 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-green-700 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            GES Engineering Insights
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 leading-none">
            Knowledge & <span className="text-green-600">Green Tech</span>
          </h1>
          <p className="mt-6 text-stone-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Explore comprehensive analysis, case studies, and strategic engineering frameworks covering solar yields, battery storage, and national grids.
          </p>
        </div>
      </section>

      {/* 3. Main Filter & Search Control Panel */}
      <section className="w-full py-8 border-b border-stone-200/40 sticky top-[72px] lg:top-[80px] z-40 bg-[#f8f9fa]/90 backdrop-blur-md shrink-0">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none whitespace-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/10 -translate-y-0.5"
                    : "bg-white text-stone-600 border-stone-200/80 hover:border-green-600/30 hover:text-green-600 hover:-translate-y-0.5"
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
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200/80 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold placeholder-stone-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
            />
          </div>

        </div>
      </section>

      {/* 4. Article Showcase and Grid */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12 flex flex-col gap-16">
        
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="w-full text-center py-20 bg-white border border-stone-200/50 rounded-[28px] shadow-sm">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-stone-800">No articles found</h3>
            <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}" under {selectedCategory}. Try resetting your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 bg-stone-900 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Featured Article Card */}
        {featuredPost && (
          <div className="w-full bg-white border border-stone-200/60 rounded-[32px] overflow-hidden shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Image Column */}
              <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] lg:h-[460px] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-6 left-6 bg-green-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                  {featuredPost.category}
                </span>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                
                <div className="flex flex-col gap-6">
                  {/* Meta items */}
                  <div className="flex items-center gap-4 text-xs font-bold text-stone-400 font-mono tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>

                  {/* Metric Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredPost.metrics.map((m, i) => (
                      <div key={i} className="bg-stone-50 border border-stone-200/50 px-3 py-1.5 rounded-xl flex flex-col text-left">
                        <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest leading-none">{m.label}</span>
                        <span className="text-xs font-black text-stone-700 tracking-tight mt-1">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Author & Button */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-6 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center font-bold text-green-700 shadow-sm text-sm">
                      {featuredPost.author.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-extrabold text-stone-800 leading-none">{featuredPost.author.name}</span>
                      <span className="text-[10px] font-bold text-stone-400 tracking-wider mt-1">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/blog/${featuredPost.slug}`}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-stone-50 group-hover:bg-green-600 text-stone-600 group-hover:text-white border border-stone-200/60 group-hover:border-green-600 shadow-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {gridPosts.length > 0 && (
          <div className="flex flex-col gap-8">
            {featuredPost && (
              <h3 className="font-display text-xl sm:text-2xl font-black text-stone-900 border-b border-stone-200/50 pb-3 flex items-center gap-2">
                <span>Recent Insight Articles</span>
                <span className="bg-stone-100 text-stone-500 font-bold font-mono text-xs px-2 py-0.5 rounded-md">{gridPosts.length}</span>
              </h3>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gridPosts.map((post) => (
                <article 
                  key={post.slug} 
                  className="bg-white border border-stone-200/60 rounded-[28px] overflow-hidden shadow-[0_10px_25px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.08)] transition-all duration-500 group flex flex-col justify-between"
                >
                  <div className="flex flex-col">
                    
                    {/* Cover Image */}
                    <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 46vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-stone-200/40 text-stone-700 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col gap-4">
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 font-mono tracking-wider leading-none">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-stone-300" />
                        <span>{post.readTime}</span>
                      </div>

                      {/* Title */}
                      <h4 className="font-display text-lg sm:text-xl font-extrabold text-stone-900 group-hover:text-green-600 transition-colors duration-300 leading-snug">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>

                      {/* Excerpt */}
                      <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium line-clamp-3">
                        {post.excerpt}
                      </p>

                    </div>
                  </div>

                  {/* Footer (Author & Read Link) */}
                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center font-bold text-green-700 text-xs">
                        {post.author.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-stone-800 leading-none">{post.author.name}</span>
                        <span className="text-[9px] font-bold text-stone-400 tracking-wider mt-1">{post.author.role.split(",")[0]}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-xs font-bold text-stone-600 group-hover:text-green-600 transition-colors cursor-pointer"
                    >
                      <span>Read Insight</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                  </div>

                </article>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. Match Brand Footer Section */}
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
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-bold text-white/50 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {new Date().getFullYear()} GES (PVT) LTD. All rights reserved.</span>
            <span className="hidden sm:inline text-white/25">•</span>
            <span className="text-white/80">Built and Designed by <span className="text-[#e2ff3a] tracking-wider">ARC AI</span></span>
          </span>
          
          <div className="flex items-center gap-5 text-white/70">
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
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
