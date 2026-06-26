import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Clean Energy Installations Portfolio | GES Sri Lanka',
  description:
    'Explore our completed solar energy installations across Sri Lanka — categorized into Residential and Industrial & Commercial projects with high-quality photos.',
};

export interface Project {
  name: string;
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

export default async function ProjectsPage() {
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
          let cleanName = folder;

          if (folder.includes('_')) {
            const parts = folder.split('_');
            const client = parts[0].trim();
            const location = parts[1].trim();
            cleanName = location ? `${client} — ${location}` : client;
          } else if (folder.includes(' - ')) {
            const parts = folder.split(' - ');
            const client = parts[0].trim();
            const details = parts
              .slice(1)
              .map((p) => p.trim())
              .filter((p) => !p.toLowerCase().includes('installation'))
              .join(', ');
            cleanName = details ? `${client} (${details})` : client;
          }

          cleanName = cleanName.replace(/\s+/g, ' ').trim();

          projects.push({
            name: cleanName,
            folderName: folder,
            images,
            category: categorize(folder),
          });
        }
      }
    }
  }

  projects.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-bold text-stone-500">Loading Portfolio...</div>}>
      <ProjectsClient projects={projects} />
    </Suspense>
  );
}
