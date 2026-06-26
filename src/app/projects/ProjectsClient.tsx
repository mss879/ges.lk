"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Search,
  ChevronRight,
  X,
  ChevronLeft,
  Folder,
  Image as ImageIcon,
  Home,
  Building2,
} from "lucide-react";
import Image from "next/image";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

interface Project {
  name: string;
  folderName: string;
  images: string[];
  category: "residential" | "commercial";
}

interface ProjectsClientProps {
  projects: Project[];
}

type Filter = "all" | "residential" | "commercial";

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const filterParam = searchParams.get("filter") as Filter;
    if (filterParam === "residential" || filterParam === "commercial") {
      setFilter(filterParam);
    } else {
      setFilter("all");
    }
  }, [searchParams]);

  const handleFilterChange = (key: Filter) => {
    setFilter(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("filter");
    } else {
      params.set("filter", key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const matchesSearch = (p: Project) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.folderName.toLowerCase().includes(searchQuery.toLowerCase());

  const residential = projects.filter((p) => p.category === "residential" && matchesSearch(p));
  const commercial = projects.filter((p) => p.category === "commercial" && matchesSearch(p));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "ArrowRight") setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
      else if (e.key === "ArrowLeft") setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
      else if (e.key === "Escape") setSelectedProject(null);
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

  const ProjectCard = ({ project }: { project: Project }) => (
    <div
      onClick={() => openProject(project)}
      className="group relative flex flex-col justify-start cursor-pointer w-full"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-x-4 bottom-14 top-4 bg-white/10 backdrop-blur-xs border border-white/20 rounded-[28px] transform rotate-3 translate-y-3.5 translate-x-1.5 scale-[0.97] transition-all duration-500 group-hover:rotate-6 group-hover:translate-y-6 group-hover:translate-x-3 shadow-sm z-0" />
      <div className="absolute inset-x-2 bottom-14 top-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-[28px] transform -rotate-2 -translate-y-2.5 -translate-x-1.5 scale-[0.99] transition-all duration-500 group-hover:-rotate-4 group-hover:-translate-y-4 group-hover:-translate-x-3 shadow-md z-10" />

      <div className="relative z-20 flex items-end transform transition-all duration-500 group-hover:-translate-y-3 group-hover:rotate-1">
        <div className="bg-white/40 backdrop-blur-md border-t border-r border-l border-white/30 rounded-t-2xl px-5 py-2.5 w-fit min-w-[130px] font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#00AC4E] flex items-center gap-1.5 shadow-[0_-3px_10px_rgba(0,0,0,0.01)] translate-y-[1px] border-b-2 border-white/40">
          {project.category === "residential" ? <Home className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
          {project.category === "residential" ? "Residential" : "Commercial"}
        </div>
      </div>

      <div className="relative z-20 bg-white/40 backdrop-blur-md border border-white/30 rounded-b-[28px] rounded-tr-[28px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_-12px_rgba(0,172,78,0.22)] hover:border-[#00AC4E]/40 transition-all duration-500 flex flex-col justify-between aspect-[4/3.2] w-full transform group-hover:-translate-y-3 group-hover:rotate-1">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#00AC4E] z-30" />
        <div className="relative w-full h-[62%] overflow-hidden bg-stone-100/50 border-b border-white/20">
          <Image
            src={project.images[0]}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 30vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#00AC4E]" />
            <span>{project.images.length} {project.images.length === 1 ? "Photo" : "Photos"}</span>
          </div>
        </div>
        <div className="p-5 flex flex-col justify-between flex-1 bg-white/20">
          <h3 className="font-display text-[15px] sm:text-[16px] font-black text-stone-900 group-hover:text-[#00AC4E] transition-colors duration-300 leading-snug line-clamp-2">
            {project.name}
          </h3>
          <div className="flex items-center justify-end border-t border-white/20 pt-3.5 mt-2">
            <span className="text-[11px] font-extrabold text-[#00AC4E] flex items-center gap-1.5">
              <span>View Project Images</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, subtitle, icon, items }: { title: string; subtitle: string; icon: React.ReactNode; items: Project[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#00AC4E] flex items-center justify-center text-white shadow-lg shadow-[#00AC4E]/20 shrink-0">{icon}</div>
          <div className="flex flex-col">
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-stone-950 leading-none">{title}</h2>
            <span className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-1.5">{subtitle} · {items.length} {items.length === 1 ? "Project" : "Projects"}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 pt-4">
          {items.map((project) => (
            <ProjectCard key={project.folderName} project={project} />
          ))}
        </div>
      </div>
    );
  };

  const total = residential.length + commercial.length;

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col text-stone-900 font-sans antialiased overflow-x-hidden">
      <SiteNav active="projects" />

      {/* Hero */}
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
            A portfolio of engineering excellence — browse our certified clean-energy installations across residential homes and commercial sites in Sri Lanka.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="w-full py-8 border-b border-stone-200/40 sticky top-[72px] lg:top-[76px] z-40 bg-[#f8f9fa]/90 backdrop-blur-md shrink-0">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap">
            {([
              { k: "all", label: `All (${projects.length})` },
              { k: "residential", label: `Residential (${projects.filter((p) => p.category === "residential").length})` },
              { k: "commercial", label: `Industrial & Commercial (${projects.filter((p) => p.category === "commercial").length})` },
            ] as { k: Filter; label: string }[]).map((t) => (
              <button
                key={t.k}
                onClick={() => handleFilterChange(t.k)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border cursor-pointer ${
                  filter === t.k
                    ? "bg-[#00AC4E] text-white border-[#00AC4E] shadow-md shadow-[#00AC4E]/10 -translate-y-0.5"
                    : "bg-white text-stone-600 border-stone-200/80 hover:border-[#00AC4E]/30 hover:text-[#00AC4E] hover:-translate-y-0.5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

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

      {/* Grid */}
      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12 relative">
        <div className="absolute top-[20%] left-[-8%] w-[350px] h-[350px] bg-[#00AC4E]/[0.025] rounded-full blur-[110px] pointer-events-none -z-10" />
        <div className="absolute bottom-[30%] right-[-8%] w-[400px] h-[400px] bg-[#00AC4E]/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

        {total === 0 ? (
          <div className="w-full text-center py-20 bg-white border border-stone-200/50 rounded-[28px] shadow-sm">
            <Folder className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-stone-800">No projects found</h3>
            <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
              We couldn&rsquo;t find any installation matches for &ldquo;{searchQuery}&rdquo;. Try adjusting your keywords.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setFilter("all"); }}
              className="mt-6 bg-stone-900 hover:bg-[#00AC4E] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pt-4">
            {(filter === "all" || filter === "residential") && (
              <Section title="Residential" subtitle="Homes powered by solar" icon={<Home className="w-6 h-6" />} items={residential} />
            )}
            {(filter === "all" || filter === "commercial") && (
              <Section title="Industrial & Commercial" subtitle="Businesses & institutions" icon={<Building2 className="w-6 h-6" />} items={commercial} />
            )}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {selectedProject && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex flex-col justify-between select-none animate-fade-in" onClick={() => setSelectedProject(null)}>
          <div className="w-full px-6 py-5 flex items-center justify-between border-b border-white/5 relative z-30 bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col text-left">
              <span className="text-[#00AC4E] font-mono text-[10px] font-extrabold uppercase tracking-widest">
                {selectedProject.category === "residential" ? "RESIDENTIAL" : "COMMERCIAL"} · PROJECT GALLERY
              </span>
              <h2 className="text-white text-base sm:text-lg font-black tracking-tight mt-1 leading-tight">{selectedProject.name}</h2>
            </div>
            <button onClick={() => setSelectedProject(null)} className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto px-4 flex items-center justify-between relative z-10 py-6">
            <button onClick={prevImage} className="absolute left-6 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 hover:bg-[#00AC4E] hover:border-[#00AC4E] text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-full h-full max-h-[70vh] relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img src={selectedProject.images[currentImageIndex]} alt={`${selectedProject.name} - ${currentImageIndex + 1}`} className="max-w-full max-h-full object-contain rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/5 animate-fade-in" />
            </div>
            <button onClick={nextImage} className="absolute right-6 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/10 hover:bg-[#00AC4E] hover:border-[#00AC4E] text-white flex items-center justify-center transition-all duration-300 shadow-md active:scale-90 cursor-pointer">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full bg-black/40 border-t border-white/5 backdrop-blur-md p-6 flex flex-col gap-4 relative z-30" onClick={(e) => e.stopPropagation()}>
            <div className="text-white/60 text-xs font-bold font-mono text-center">Image {currentImageIndex + 1} of {selectedProject.images.length}</div>
            <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-1.5 px-4 max-w-4xl mx-auto select-none">
              {selectedProject.images.map((img, idx) => (
                <button key={img} onClick={() => setCurrentImageIndex(idx)} className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-300 cursor-pointer ${currentImageIndex === idx ? "border-[#00AC4E] scale-105 shadow-md shadow-[#00AC4E]/20" : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-90"}`}>
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
