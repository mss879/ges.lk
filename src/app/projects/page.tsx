import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import ProjectsClient from './ProjectsClient';
import { createPublicClient } from '@/lib/supabase/public';
import type { ProjectWithImages } from '@/lib/supabase/types';

export const metadata = {
  title: 'Clean Energy Installations Portfolio | GES Sri Lanka',
  description:
    'Explore our completed solar energy installations across Sri Lanka — categorized into Residential and Commercial projects, with location, system capacity and project photographs.',
};

export interface Project {
  name: string;
  location: string | null;
  capacity: string | null;
  folderName: string;
  images: string[];
  category: 'residential' | 'commercial';
}

// Heuristic: personal titles => residential; company/institution markers => commercial.
function categorize(folder: string): 'residential' | 'commercial' {
  const f = folder.toLowerCase();
  const commercialMarkers = [
    'pvt', 'ltd', 'hospital', 'gym', 'motors', 'global', 'cpc', 'agstar',
    'company', 'factory', 'industries', 'industrial', 'plant', 'medical',
    'hotel', 'school', 'college', 'bank', 'mall', 'complex', 'warehouse', 'enterprise',
  ];
  if (commercialMarkers.some((m) => f.includes(m))) return 'commercial';

  const residentialMarkers = ['mr', 'mrs', 'ms', 'dr', 'capt', 'miss'];
  // match a leading personal title (e.g. "Mr.", "Capt.", "Dr ")
  if (residentialMarkers.some((m) => f.startsWith(m + '.') || f.startsWith(m + ' ') || f.startsWith(m + '_'))) {
    return 'residential';
  }
  // default unknown to commercial (named entities without titles tend to be businesses)
  return 'commercial';
}


// Folder names encode "<client>_<location>" or "<client> - <location> - <capacity>".
// Pull the three fields the project cards display out of that.
const CAPACITY_RE = /(\d+(?:\.\d+)?)\s*k\s*w/gi;
const NOT_A_LOCATION = ['installation', 'inverter', 'system', 'micro', 'project'];

function parseFolder(folder: string): { name: string; location: string | null; capacity: string | null } {
  const parts = folder
    .split(/_|\s-\s|-/)
    .map((part) => part.trim())
    .filter(Boolean);

  const name = (parts[0] ?? folder)
    // "Capt.Zayan" -> "Capt. Zayan"
    .replace(/^(Mr|Mrs|Ms|Dr|Capt|Miss)\.(?=[A-Za-z])/, '$1. ')
    .replace(/\s+/g, ' ')
    .trim();

  const capacities: string[] = [];
  const locations: string[] = [];

  for (const part of parts.slice(1)) {
    const matches = [...part.matchAll(CAPACITY_RE)];
    if (matches.length > 0) {
      for (const m of matches) capacities.push(`${m[1]} kW`);
      continue;
    }
    if (NOT_A_LOCATION.some((word) => part.toLowerCase().includes(word))) continue;
    locations.push(part);
  }

  return {
    name,
    location: locations.join(', ') || null,
    capacity: [...new Set(capacities)].join(' + ') || null,
  };
}

/**
 * Fallback source: the folders under public/1. Installations/.
 * Used until the Supabase migrations have been run and the projects table is
 * populated, so the public page never renders empty.
 */
function readProjectsFromDisk(): Project[] {
  const installationsDir = path.join(process.cwd(), 'public/1. Installations');

  const projects: Project[] = [];

  if (fs.existsSync(installationsDir)) {
    const folders = fs.readdirSync(installationsDir);
    for (const folder of folders) {
      const folderPath = path.join(installationsDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath);
        const images = files
          .filter((file) => file.toLowerCase().endsWith('.webp'))
          .map((file) => `/1. Installations/${folder}/${file}`);

        if (images.length > 0) {
          const { name, location, capacity } = parseFolder(folder);

          projects.push({
            name,
            location,
            capacity,
            folderName: folder,
            images,
            category: categorize(folder),
          });
        }
      }
    }
  }

  projects.sort((a, b) => a.name.localeCompare(b.name));
  return projects;
}

/** Primary source: the projects + project_images tables managed from /admin. */
async function readProjectsFromSupabase(): Promise<Project[] | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .eq('is_published', true)
      .order('position')
      .order('position', { referencedTable: 'project_images' });

    if (error || !data || data.length === 0) return null;

    return (data as ProjectWithImages[]).map((row) => ({
      name: row.name,
      location: row.location,
      capacity: row.capacity,
      folderName: row.id,
      images: [...row.project_images]
        .sort((a, b) => a.position - b.position)
        .map((img) => img.url),
      category: row.category,
    }));
  } catch {
    return null;
  }
}

export default async function ProjectsPage() {
  const projects = (await readProjectsFromSupabase()) ?? readProjectsFromDisk();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-bold text-stone-500">Loading Portfolio...</div>}>
      <ProjectsClient projects={projects} />
    </Suspense>
  );
}
