"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ArrowUpRight, 
  Search, 
  ChevronRight, 
  X, 
  ChevronLeft, 
  Folder, 
  Image as ImageIcon,
  Calendar,
  MapPin,
  ChevronDown
} from "lucide-react";

interface Project {
  name: string;
  folderName: string;
  images: string[];
}

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Lightbox State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter projects by search
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.folderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
      } else if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      
      {/* 1. Header (Standalone Responsive Nav) */}
      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between">
          
          {/* Left Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end pr-12">
            <Link href="/" className="text-[15px] font-bold text-stone-600 hover:text-primary-green transition-colors">
              Home
            </Link>
            <Link href="/#about" className="text-[15px] font-bold text-stone-600 hover:text-primary-green transition-colors">
              About Us
            </Link>
            <Link href="/#solutions" className="text-[15px] font-bold text-stone-600 hover:text-primary-green transition-colors">
              Solutions
            </Link>
          </nav>

          {/* Logo in Center */}
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
            <Link href="/blog" className="text-[15px] font-bold text-stone-600 hover:text-primary-green transition-colors">
              Blogs
            </Link>
            <Link href="/projects" className="text-[15px] font-extrabold text-stone-900 border-b-2 border-primary-green pb-1">
              Projects
            </Link>
            <Link href="/#contact" className="ml-4 bg-stone-900 hover:bg-primary-green text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all duration-300">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Hamburger trigger */}
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
              className="p-2 text-stone-700 hover:text-primary-green focus:outline-none"
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
            className="absolute top-6 right-6 text-white hover:text-primary-green p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col gap-6 text-center text-white text-xl font-bold font-display mt-8">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-green transition-colors">Home</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-green transition-colors">About Us</Link>
            <Link href="/#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-green transition-colors">Solutions</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary-green transition-colors">Blogs</Link>
            <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="text-primary-green transition-colors">Projects</Link>
            <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-primary-green hover:bg-primary-green/90 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300">Contact Us</Link>
          </div>
        </div>
      )}

      {/* 2. Hero Header Section */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-stone-50 to-[#f8f9fa] border-b border-stone-200/50 relative overflow-hidden shrink-0">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#00AC4E]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00AC4E]/5 border border-[#00AC4E]/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#00AC4E] mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00AC4E] animate-pulse"></span>
            GES Project Gallery
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 leading-none">
            Completed <span className="text-[#00AC4E]">Installations</span>
          </h1>
          <p className="mt-6 text-stone-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Browse through our portfolio of engineering excellence. Our certified clean energy configurations deliver reliable solar yields across residential and commercial sectors in Sri Lanka.
          </p>
        </div>
      </section>

      {/* 3. Filter & Search Panel */}
      <section className="w-full py-8 border-b border-stone-200/40 sticky top-[72px] lg:top-[80px] z-40 bg-[#f8f9fa]/90 backdrop-blur-md shrink-0">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-500 font-mono uppercase tracking-widest">
              Total Installations: {projects.length}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs shadow-sm rounded-xl">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client or town..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200/80 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold placeholder-stone-400 focus:outline-none focus:border-[#00AC4E] focus:ring-1 focus:ring-[#00AC4E] transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* 4. Projects Folder Grid */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12 relative">
        {/* Soft background ambient blobs to enhance glassmorphic layout */}
        <div className="absolute top-[20%] left-[-8%] w-[350px] h-[350px] bg-[#00AC4E]/[0.025] rounded-full blur-[110px] pointer-events-none -z-10" />
        <div className="absolute bottom-[30%] right-[-8%] w-[400px] h-[400px] bg-[#00AC4E]/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

        {filteredProjects.length === 0 ? (
          <div className="w-full text-center py-20 bg-white border border-stone-200/50 rounded-[28px] shadow-sm">
            <Folder className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-stone-800">No projects found</h3>
            <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn't find any installation matches for "{searchQuery}". Try adjusting your keywords.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pt-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.folderName}
                onClick={() => openProject(project)}
                className="group relative flex flex-col justify-start cursor-pointer w-full"
                style={{ perspective: "1000px" }}
              >
                
                {/* 3D Paper Stack Background Layer 2 (Bottom-most sheet, rotated right) */}
                <div className="absolute inset-x-4 bottom-14 top-4 bg-white/10 backdrop-blur-xs border border-white/20 rounded-[28px] transform rotate-3 translate-y-3.5 translate-x-1.5 scale-[0.97] transition-all duration-500 group-hover:rotate-6 group-hover:translate-y-6 group-hover:translate-x-3 shadow-sm z-0" />
                
                {/* 3D Paper Stack Background Layer 1 (Middle sheet, rotated left) */}
                <div className="absolute inset-x-2 bottom-14 top-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-[28px] transform -rotate-2 -translate-y-2.5 -translate-x-1.5 scale-[0.99] transition-all duration-500 group-hover:-rotate-4 group-hover:-translate-y-4 group-hover:-translate-x-3 shadow-md z-10" />

                {/* Asymmetric Folder Header Tab */}
                <div className="relative z-20 flex items-end transform transition-all duration-500 group-hover:-translate-y-3 group-hover:rotate-1">
                  <div className="bg-white/40 backdrop-blur-md border-t border-r border-l border-white/30 rounded-t-2xl px-5 py-2.5 w-fit min-w-[130px] font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#00AC4E] flex items-center gap-1.5 shadow-[0_-3px_10px_rgba(0,0,0,0.01)] translate-y-[1px] border-b-2 border-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00AC4E] animate-pulse shrink-0"></span>
                    GES Portfolio
                  </div>
                </div>

                {/* Main Folder Body */}
                <div className="relative z-20 bg-white/40 backdrop-blur-md border border-white/30 rounded-b-[28px] rounded-tr-[28px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_-12px_rgba(0,172,78,0.22)] hover:border-[#00AC4E]/40 transition-all duration-500 group flex flex-col justify-between aspect-[4/3.2] w-full transform group-hover:-translate-y-3 group-hover:rotate-1">
                  
                  {/* Green Accent Line along the top interface */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#00AC4E] z-30" />

                  {/* Folder Preview Cover (Large First Image) */}
                  <div className="relative w-full h-[62%] overflow-hidden bg-stone-100/50 border-b border-white/20">
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 30vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                    
                    {/* Glassy Overlay with Photos Count Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#00AC4E]" />
                      <span>{project.images.length} {project.images.length === 1 ? 'Photo' : 'Photos'}</span>
                    </div>
                  </div>

                  {/* Folder Card Description Bottom Panel */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-white/20">
                    <div className="flex flex-col gap-1">
                      {/* Project Name / Client & Location */}
                      <h3 className="font-display text-[15px] sm:text-[16px] font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors duration-300 leading-snug line-clamp-2">
                        {project.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-end border-t border-white/20 pt-3.5 mt-2">
                      <span className="text-[11px] font-extrabold text-[#00AC4E] flex items-center gap-1.5 transition-all duration-300">
                        <span>View Project Images</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* 5. IMMERSIVE LIGHTBOX GALLERY MODAL */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex flex-col justify-between select-none animate-fade-in"
          onClick={() => setSelectedProject(null)}
        >
          {/* Top Panel: Title & Close */}
          <div className="w-full px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-30 bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col text-left">
              <span className="text-[#00AC4E] font-mono text-[10px] font-extrabold uppercase tracking-widest">
                PROJECT GALLERY
              </span>
              <h2 className="text-white text-base sm:text-lg font-black tracking-tight mt-1 leading-tight">
                {selectedProject.name}
              </h2>
            </div>
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Content: Main Image with Nav Buttons */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 flex items-center justify-between relative z-10 py-6">
            
            {/* Left Navigate Button */}
            <button 
              onClick={prevImage}
              className="absolute left-6 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 hover:bg-[#00AC4E] hover:border-[#00AC4E] text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Active Image Container */}
            <div 
              className="w-full h-full max-h-[70vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedProject.images[currentImageIndex]} 
                alt={`${selectedProject.name} - ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/5 animate-fade-in"
              />
            </div>

            {/* Right Navigate Button */}
            <button 
              onClick={nextImage}
              className="absolute right-6 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 hover:bg-[#00AC4E] hover:border-[#00AC4E] text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Panel: Image Selector Grid & Image counter */}
          <div 
            className="w-full bg-black/40 border-t border-white/5 backdrop-blur-md p-6 flex flex-col gap-4 relative z-30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Slide Index Counter */}
            <div className="text-white/60 text-xs font-bold font-mono text-center">
              Image {currentImageIndex + 1} of {selectedProject.images.length}
            </div>

            {/* Horizontal Thumbnail Strip */}
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-1.5 px-4 max-w-4xl mx-auto scrollbar-thin scrollbar-thumb-white/10 select-none">
              {selectedProject.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer ${
                    currentImageIndex === idx 
                      ? "border-[#00AC4E] scale-105 shadow-md shadow-[#00AC4E]/20" 
                      : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-90"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 6. Footer (Standard Matching) */}
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
            
            {/* Column 1: Brand details & Newsletter Subscription */}
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
